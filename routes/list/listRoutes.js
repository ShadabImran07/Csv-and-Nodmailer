/**
 * index.js
 * @description :: list file of community.
 */

import express from "express";
import { createList } from "../../controller/list/listController.js";

const router = express.Router();

router.route("/create-list").post(createList);

export default router;
