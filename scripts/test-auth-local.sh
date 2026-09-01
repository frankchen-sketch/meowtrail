#!/bin/bash
# 安全回归测试：本地 dev server (localhost:8788) 必须已启动
set -e
cd ~/workspace/meowtrail
SECRET=$(grep OAUTH_STATE_SECRET .dev.vars | cut -d= -f2)
UID_TEST=$(uuidgen | tr 'A-Z' 'a-z')
EXP=$(( $(date +%s) + 86400 ))
EXPIRED=$(( $(date +%s) - 100 ))
mk_sig() { node -e "const c=require('crypto');console.log(c.createHmac('sha256','$SECRET').update('uid:'+'$1'+':$2').digest('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''))"; }
SIG=$(mk_sig "$UID_TEST" "$EXP")
OLDSIG=$(mk_sig "$UID_TEST" "$EXPIRED")
COOKIE="mt_session=$UID_TEST.$EXP.$SIG"

npx wrangler d1 execute meowtrail-users --local --command "INSERT OR REPLACE INTO users (id, google_sub, email, name, picture, created_at) VALUES ('$UID_TEST','t-$$','t@e.com','Test Cat','',1);" >/dev/null 2>&1

echo "1) valid cookie -> expect Test Cat:"
curl -s --noproxy '*' -b "$COOKIE" http://localhost:8788/api/auth/me; echo
echo "2) expired cookie -> expect user:null:"
curl -s --noproxy '*' -b "mt_session=$UID_TEST.$EXPIRED.$OLDSIG" http://localhost:8788/api/auth/me; echo
echo "3) forged sig -> expect user:null:"
curl -s --noproxy '*' -b "mt_session=$UID_TEST.$EXP.deadbeef" http://localhost:8788/api/auth/me; echo
echo "4) future date streak=99 -> date should be null:"
curl -s --noproxy '*' -b "$COOKIE" -X POST http://localhost:8788/api/progress -H 'content-type: application/json' -d '{"date":"9999-12-31","streak":99,"bestStreak":99}'; echo
echo "5) normal date -> adopted:"
curl -s --noproxy '*' -b "$COOKIE" -X POST http://localhost:8788/api/progress -H 'content-type: application/json' -d '{"date":"2026-08-30","streak":5,"bestStreak":9,"bestTime":120000}'; echo
echo "6) fake calendar date 2026-02-31 -> date null, streak adopted but date null:"
curl -s --noproxy '*' -b "$COOKIE" -X POST http://localhost:8788/api/progress -H 'content-type: application/json' -d '{"date":"2026-02-31","streak":7,"bestStreak":7}'; echo
echo "7) leaderboard write + read:"
curl -s --noproxy '*' -b "$COOKIE" -X POST http://localhost:8788/api/leaderboard -H 'content-type: application/json' -d '{"date":"2026-09-01","timeMs":45000}'; echo
curl -s --noproxy '*' "http://localhost:8788/api/leaderboard?date=2026-09-01"; echo
echo "ALL DONE"
