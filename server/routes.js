import express from "express";
// controllers
import * as miscCtrls from "./ctrls/misc-ctrls.js";
import * as authCtrls from "./ctrls/auth-ctrls.js";
import * as userCtrls from "./ctrls/user-ctrls.js";
import * as dataCtrls from "./ctrls/data-ctrls.js";

const Router = express.Router();

// misc rouets
Router.get("/", miscCtrls.index);
// Auth Routes
Router.post("/auth/in", authCtrls.signIn);
Router.post("/auth/token", authCtrls.token);
Router.post("/auth/otp-generate", authCtrls.otp_generate);
Router.post("/auth/otp-verify", authCtrls.otp_verify);
// User Routes
Router.patch("/user", userCtrls.editUsers);
// Data Routes
Router.get("/data", dataCtrls.getData);
Router.get("/data/query", dataCtrls.queryData);
Router.get("/data/interaction", dataCtrls.interactionData);
Router.get("/data/recommendation", dataCtrls.recommendationData);

export default Router;
