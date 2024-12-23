import { Router } from "express";
import {upload} from "../middlewares/multter.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteattendee, login, logout, registerUser, submitTask } from "../controllers/user.controller.js";
const router =Router()

router.route("/register").post(
    upload.fields( [
        {
            name: "coverImage",
            maxCount: 1
        }]),
    registerUser)

router.route("/login").post(login)
router.route("/logout").get(verifyJWT,logout)
router.route("/delete").post(verifyJWT,deleteattendee)
router.route("/submittask").post(
    upload.fields([
        {
            name: "proof",
            maxCount: 1
        }
    ]),submitTask)

    export default router