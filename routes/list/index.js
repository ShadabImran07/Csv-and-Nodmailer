/**
 * index.js
 * @description :: index file of list.
 */

import express from "express";
import listRoutes from "./listRoutes.js";
const router = express.Router();

router.use("/list", listRoutes);

export default router;
