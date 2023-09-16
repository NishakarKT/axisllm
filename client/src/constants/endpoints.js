const BASE = "http://localhost:8001";
// const BASE = "https://axisllm.onrender.com";
// auth endpoints
export const AUTH_IN_ENDPOINT = BASE + "/auth/in";
export const AUTH_TOKEN_ENDPOINT = BASE + "/auth/token";
export const AUTH_OTP_GENERATE_ENDPOINT = BASE + "/auth/otp-generate";
export const AUTH_OTP_VERIFY_ENDPOINT = BASE + "/auth/otp-verify";
// user endpoints
export const USER_ENDPOINT = BASE + "/user";
// data endpoints
export const DATA_ENDPOINT = BASE + "/data";
export const DATA_QUERY_ENDPOINT = BASE + "/data/query";
export const DATA_INTERACTION_ENDPOINT = BASE + "/data/interaction";
export const DATA_RECOMMENDATION_ENDPOINT = BASE + "/data/recommendation";
