module.exports = {
	apps: [
		{
			name: "mathongo",
			script: "./index.js",
			exp_backoff_restart_delay: 100,
			max_memory_restart: "1G",
			max_restarts: 10,
			min_uptime: 2000,
			watch: true,
			env: {
				COMMON_VARIABLE: "true",
				RABBITMQ_URL: process.env.RABBITMQ_URL || "amqp://rabbitmq:5672",
				MONGO_URL:
					process.env.MONGO_URL ||
					"mongodb://admin:secret@mongo:27017/mydatabase?authSource=admin",
			},
			env_production: {
				NODE_ENV: "production",
			},
		},
	],
};

module.exports = {
	apps: [
		{
			name: "node-app",
			script: "index.js",
		},
	],
};
