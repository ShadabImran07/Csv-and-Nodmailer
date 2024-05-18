import amqp from "amqplib";

// let connection;
// let channel;

// async function connectRabbitMQ() {
// 	try {
// 		connection = await amqp.connect(process.env.RABBITMQ_URL);
// 		channel = await connection.createChannel();
// 		const queue = "emails";
// 		await channel.assertQueue(queue, { durable: true });
// 		console.log("Connected to RabbitMQ and queue asserted");
// 	} catch (err) {
// 		console.error("Failed to connect to RabbitMQ", err);
// 		setTimeout(connectRabbitMQ, 5000); // Retry after 5 seconds if connection fails
// 	}
// }

// export async function sendToQueue(emailData) {
// 	try {
// 		if (!connection || !channel) {
// 			await connectRabbitMQ();
// 		}
// 		const queue = "emails";
// 		channel.sendToQueue(queue, Buffer.from(JSON.stringify(emailData)), {
// 			persistent: true,
// 		});
// 		console.log("Email request sent to queue");
// 	} catch (err) {
// 		console.warn("Failed to send message to queue", err);
// 	}
// }

// // Connect to RabbitMQ when the module is loaded
// connectRabbitMQ();

// Ensure graceful shutdown
// process.on("SIGINT", async () => {
// 	try {
// 		if (channel) await channel.close();
// 		if (connection) await connection.close();
// 	} catch (err) {
// 		console.error("Error during shutdown", err);
// 	} finally {
// 		process.exit(0);
// 	}
// });

// process.on("SIGTERM", async () => {
// 	try {
// 		if (channel) await channel.close();
// 		if (connection) await connection.close();
// 	} catch (err) {
// 		console.error("Error during shutdown", err);
// 	} finally {
// 		process.exit(0);
// 	}
// });

export async function sendToQueue(emailData) {
	const conn = await amqp.connect(process.env.RABBITMQ_URL); // Connect to RabbitMQ server
	const channel = await conn.createChannel(); // Create a channel
	const queue = "emails"; // Name of the queue

	await channel.assertQueue(queue, { durable: true }); // Ensure the queue exists and is durable
	channel.sendToQueue(queue, Buffer.from(JSON.stringify(emailData)), {
		persistent: true,
	}); // Send email data to the queue

	console.log("Email request sent to queue");
	setTimeout(() => {
		channel.close();
		conn.close();
	}, 500);
}
export async function sendWelcomeEmail(name, email, city) {
	// Email options
	let mailOptions = {
		from: '"MathonGo" <no-reply@mathongo.com>',
		to: email,
		subject: "Welcome to MathonGo",
		html: `
		<!DOCTYPE html>
		<html>
		<head>
		  <meta charset="UTF-8">
		  <title>Welcome to MathonGo</title>
		  <style>
			body {
			  font-family: Arial, sans-serif;
			  line-height: 1.6;
			  color: #333;
			}
			.container {
			  max-width: 600px;
			  margin: 0 auto;
			  padding: 20px;
			  border: 1px solid #ddd;
			  border-radius: 5px;
			}
			.header {
			  background-color: #f8f8f8;
			  padding: 10px;
			  text-align: center;
			  border-bottom: 1px solid #ddd;
			}
			.content {
			  padding: 20px;
			}
			.footer {
			  background-color: #f8f8f8;
			  padding: 10px;
			  text-align: center;
			  border-top: 1px solid #ddd;
			}
			.footer a {
			  color: #0066cc;
			  text-decoration: none;
			}
			.footer a:hover {
			  text-decoration: underline;
			}
		  </style>
		</head>
		<body>
		  <div class="container">
			<div class="header">
			  <h1>Welcome to MathonGo</h1>
			</div>
			<div class="content">
			  <p>Hey ${name},</p>
			  <p>Thank you for signing up with your email <strong>${email}</strong>. We have received your city as <strong>${city}</strong>.</p>
			</div>
			<div class="footer">
			  <p>Team MathonGo</p>
			  <p><a href="https://mathongo-assignment-n3wf.onrender.com/api/user/unsubscribe?email=${email}">Unsubscribe</a></p>
			</div>
		  </div>
		</body>
		</html>
		`,
	};

	sendToQueue(mailOptions);
}
