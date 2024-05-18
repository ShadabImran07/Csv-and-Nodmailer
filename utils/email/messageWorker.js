import amqp from "amqplib";
import nodemailer from "nodemailer";

// export async function startWorker() {
// 	console.log("Starting");
// 	try {
// 		const conn = await amqp.connect(process.env.RABBITMQ_URL);
// 		const channel = await conn.createChannel();
// 		const queue = "emails";
// 		await channel.assertQueue(queue, { durable: true });
// 		console.log("Waiting for messages in %s. To exit press CTRL+C", queue);
// 		channel.consume(queue, async (msg) => {
// 			if (msg !== null) {
// 				const emailData = JSON.parse(msg.content.toString());
// 				try {
// 					await sendEmail(emailData);
// 					channel.ack(msg);
// 					console.log("Email sent to:", emailData.to);
// 				} catch (error) {
// 					console.error("Error sending email:", error);
// 				}
// 			}
// 		});
// 	} catch (error) {
// 		console.error("Error starting worker:", error);
// 	}
// }

export async function startWorker() {
	try {
		const conn = await amqp.connect(process.env.RABBITMQ_URL);
		const channel = await conn.createChannel();
		const queue = "emails";

		await channel.assertQueue(queue, { durable: true });
		console.log("Waiting for messages in %s. To exit press CTRL+C", queue);

		channel.consume(queue, async (msg) => {
			if (msg !== null) {
				const emailData = JSON.parse(msg.content.toString());
				await sendEmail(emailData);
				channel.ack(msg);
			}
		});
	} catch (error) {
		console.error("Error starting worker:", error);
	}
}

async function sendEmail(emailData) {
	let transporter = nodemailer.createTransport({
		service: "gmail", // or your email service
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	try {
		let info = await transporter.sendMail(emailData);
		console.log("Email Sent: %s", info.messageId);
	} catch (error) {
		console.error("Error sending email:", error);
	}
}
