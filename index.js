import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import routes from "./routes/index.js";
import { connectToDB } from "./db/config.js";
import { startWorker } from "./utils/email/messageWorker.js";

dotenv.config();

const app = express();

app.use(
	cors({
		credentials: true,
	})
);

app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const server = http.createServer(app);

app.use("/api", routes);

app.get("/", async (req, res) => {
	res.send("hello world");
});

server.listen(process.env.PORT, async () => {
	await connectToDB();
	console.log(`Server running on http://localhost:${server.address().port}`);
	await startWorker();
});
