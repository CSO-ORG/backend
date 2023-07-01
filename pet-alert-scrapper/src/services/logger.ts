import pino from 'pino';

const transport = pino.transport({
	targets: [
		{
			level: 'info',
			target: 'pino/file',
			options: {
				ignore: 'pid,hostname',
				destination: './logs/info.log',
			},
		},
		{
			level: 'error',
			target: 'pino/file',
			options: {
				ignore: 'pid,hostname',
				destination: './logs/error.log',
			},
		},
		{
			level: 'trace',
			target: 'pino-pretty',
			options: {
				colorize: true,
				ignore: 'pid,hostname',
			},
		},
	],
});

export const logger = pino(
	{
		level: 'trace',
		timestamp: () => `,"time":"${new Date().toLocaleString()}"`,
	},
	transport,
);
