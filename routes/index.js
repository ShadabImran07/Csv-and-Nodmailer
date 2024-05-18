import express from "express";
import rateLimit from "express-rate-limit";

import userRoutes from "./user/index.js";
import listRoutes from "./list/index.js";

const rateLimiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 1000,
	message: "Rate limit exceeded, please try again after 1 minutes",
});

const router = express.Router();

router.use(rateLimiter, userRoutes);
router.use(rateLimiter, listRoutes);

export default router;
