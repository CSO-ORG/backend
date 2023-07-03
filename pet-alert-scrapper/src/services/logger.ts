import pino from 'pino';

const transport = pino.transport({
	targets: [
		{
			level: 'trace',
			target: 'pino/file',
			options: {
				ignore: 'pid,hostname',
				destination: './logs/trace.log',
			},
		},
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
			level: 'info',
			target: 'pino-pretty',
			options: {
				ignore: 'pid,hostname',
			},
		},
	],

	dedupe: true,
});

export const logger = pino(
	{
		level: 'trace',
		timestamp: () => `,"time":"${new Date().toISOString()}"`,
	},
	transport,
);
