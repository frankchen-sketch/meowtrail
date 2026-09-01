import {
  Env,
  verifyState,
  makeSessionValue,
  sessionCookie,
  getCookie,
  json,
  safeNext,
} from '../_lib';

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const stateCookieVal = getCookie(request, 'mt_oauth_state');

  if (!code || !state || !stateCookieVal) {
    return json({ error: 'missing_code_or_state' }, 400);
  }

  // state 校验 + 取出回跳路径（再次过同源白名单，纵深防御）
  const sep = stateCookieVal.indexOf('|');
  if (sep < 0) return json({ error: 'bad_state_cookie' }, 400);
  const savedState = stateCookieVal.slice(0, sep);
  const next = safeNext(url.origin, stateCookieVal.slice(sep + 1));
  if (savedState !== state || !(await verifyState(env.OAUTH_STATE_SECRET, state))) {
    return json({ error: 'state_mismatch' }, 400);
  }

  // 交换 code → token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${url.origin}/api/auth/callback`,
      grant_type: 'authorization_code',
    }),
  });
  if (!tokenRes.ok) {
    // 不泄露上游错误详情，只返回固定错误码
    return json({ error: 'token_exchange_failed' }, 502);
  }
  const { access_token } = (await tokenRes.json()) as { access_token: string };

  // 拉 userinfo
  const uiRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!uiRes.ok) return json({ error: 'userinfo_failed' }, 502);
  const ui = (await uiRes.json()) as {
    sub: string;
    email?: string;
    name?: string;
    picture?: string;
  };

  // upsert 用户
  const db = env.meowtrail_users;
  const existing = await db
    .prepare('SELECT id FROM users WHERE google_sub = ?')
    .bind(ui.sub)
    .first<{ id: string }>();

  let uid: string;
  if (existing) {
    uid = existing.id;
    await db
      .prepare('UPDATE users SET email = ?, name = ?, picture = ? WHERE id = ?')
      .bind(ui.email ?? null, ui.name ?? null, ui.picture ?? null, uid)
      .run();
  } else {
    uid = crypto.randomUUID();
    await db
      .prepare('INSERT INTO users (id, google_sub, email, name, picture, created_at) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(uid, ui.sub, ui.email ?? null, ui.name ?? null, ui.picture ?? null, Date.now())
      .run();
  }

  const sessionVal = await makeSessionValue(env.OAUTH_STATE_SECRET, uid);
  const headers = new Headers({ Location: next, 'cache-control': 'no-store' });
  headers.append('Set-Cookie', sessionCookie(sessionVal));
  // 清掉一次性 state cookie
  headers.append('Set-Cookie', 'mt_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
  return new Response(null, { status: 302, headers });
};
