import { onRequestGet as __api_auth_callback_ts_onRequestGet } from "/Users/frankchen/workspace/meowtrail/functions/api/auth/callback.ts"
import { onRequestGet as __api_auth_login_ts_onRequestGet } from "/Users/frankchen/workspace/meowtrail/functions/api/auth/login.ts"
import { onRequestGet as __api_auth_logout_ts_onRequestGet } from "/Users/frankchen/workspace/meowtrail/functions/api/auth/logout.ts"
import { onRequestGet as __api_auth_me_ts_onRequestGet } from "/Users/frankchen/workspace/meowtrail/functions/api/auth/me.ts"
import { onRequestGet as __api_leaderboard_ts_onRequestGet } from "/Users/frankchen/workspace/meowtrail/functions/api/leaderboard.ts"
import { onRequestPost as __api_leaderboard_ts_onRequestPost } from "/Users/frankchen/workspace/meowtrail/functions/api/leaderboard.ts"
import { onRequestGet as __api_progress_ts_onRequestGet } from "/Users/frankchen/workspace/meowtrail/functions/api/progress.ts"
import { onRequestPost as __api_progress_ts_onRequestPost } from "/Users/frankchen/workspace/meowtrail/functions/api/progress.ts"

export const routes = [
    {
      routePath: "/api/auth/callback",
      mountPath: "/api/auth",
      method: "GET",
      middlewares: [],
      modules: [__api_auth_callback_ts_onRequestGet],
    },
  {
      routePath: "/api/auth/login",
      mountPath: "/api/auth",
      method: "GET",
      middlewares: [],
      modules: [__api_auth_login_ts_onRequestGet],
    },
  {
      routePath: "/api/auth/logout",
      mountPath: "/api/auth",
      method: "GET",
      middlewares: [],
      modules: [__api_auth_logout_ts_onRequestGet],
    },
  {
      routePath: "/api/auth/me",
      mountPath: "/api/auth",
      method: "GET",
      middlewares: [],
      modules: [__api_auth_me_ts_onRequestGet],
    },
  {
      routePath: "/api/leaderboard",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_leaderboard_ts_onRequestGet],
    },
  {
      routePath: "/api/leaderboard",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_leaderboard_ts_onRequestPost],
    },
  {
      routePath: "/api/progress",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_progress_ts_onRequestGet],
    },
  {
      routePath: "/api/progress",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_progress_ts_onRequestPost],
    },
  ]