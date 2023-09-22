import pino from 'pino';

/**
 * Logger instance (pino)
 */
export const logger = pino({
	level: 'trace',
	timestamp: () => `,"time":"${new Date().toISOString()}"`,
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
			ignore: 'pid,hostname',
		},
	},
});
