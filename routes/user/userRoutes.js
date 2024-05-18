/**
 * index.js
 * @description :: user file of community.
 */

import express from "express";
import {
	addUser,
	sendEmailToAllUsers,
	unsubscribeEmail,
} from "../../controller/user/userController.js";
import { upload } from "../../middlewere/multerMiddlewere.js";

const router = express.Router();

router.route("/:listId/add-User").post(upload.single("file"), addUser);
router.route("/sentEmail").post(sendEmailToAllUsers);
router.route("/unsubscribe").get(unsubscribeEmail);

export default router;
