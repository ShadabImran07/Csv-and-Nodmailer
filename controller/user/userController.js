import List from "../../model/list.js";
import User from "../../model/user.js";
import fs from "fs";
import csv from "csv-parser";
import { sendWelcomeEmail } from "../../utils/email/messageProducer.js";

export const addUser = async (req, res) => {
	try {
		const { listId } = req.params;
		const file = req.file;

		if (!file) {
			return res.status(400).send({ error: "CSV file is required" });
		}

		const list = await List.findById(listId);
		if (!list) {
			return res.status(404).send({ error: "List not found" });
		}
		const results = [];
		const errors = [];
		const customPropertiesMap = list.customProperties.reduce((acc, prop) => {
			acc[prop.title] = prop.fallbackValue;
			return acc;
		}, {});
		const processCsvRow = (row) => {
			const { name, email, ...properties } = row;
			const userProperties = {};

			for (const key in customPropertiesMap) {
				userProperties[key] = properties[key] || customPropertiesMap[key];
			}

			if (!name || !email) {
				errors.push({ row, error: "Missing required fields: name or email" });
			} else {
				results.push({ name, email, properties: userProperties });
			}
		};
		const processCsvFile = (filePath) => {
			return new Promise((resolve, reject) => {
				fs.createReadStream(filePath)
					.pipe(csv())
					.on("data", processCsvRow)
					.on("end", resolve)
					.on("error", reject);
			});
		};
		await processCsvFile(file.path);

		const addedUsers = [];
		const failedUsers = [];

		for (const user of results) {
			try {
				const newUser = new User({ ...user, listId });
				await newUser.save();
				addedUsers.push(newUser);
			} catch (error) {
				failedUsers.push({ user, error: error.message });
			}
		}
		fs.unlinkSync(file.path);
		res.send({
			addedCount: addedUsers.length,
			failedCount: failedUsers.length,
			totalUsersInList: await User.countDocuments({ listId }),
			errors: failedUsers,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const sendEmailToAllUsers = async (req, res) => {
	try {
		const allUsers = await User.find({ subscribed: true });
		if (!allUsers) res.status(404).json({ message: "users not found" });
		for (let user of allUsers) {
			await sendWelcomeEmail(user.name, user.email, user.properties.city);
		}

		return res.status(200).json({ message: "email sent to all users" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const unsubscribeEmail = async (req, res) => {
	try {
		const { email } = req.query;
		const userFind = await User.findOne({ email: email });
		if (!userFind) {
			res.status(404).json({ message: "no user found" });
		}
		userFind.subscribed = false;
		userFind.save();
		return res.send(`
		<!DOCTYPE html>
		<html>
		  <head>
			<title>Thanks You!</title>
		  </head>
		  <body>
			<h1>Thank you for using our API!</h1>
		  </body>
		</html>
	  `);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};
