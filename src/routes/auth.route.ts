import express from "express";
import { AuthSignIn, AuthSignUp } from "../controller/auth.controller";

const authRouter = express();

authRouter.route("/signup").post(AuthSignUp);
authRouter.route("/signin").post(AuthSignIn);

export default authRouter;
