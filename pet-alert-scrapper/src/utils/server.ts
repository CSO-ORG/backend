import http from 'http';

/**
 * Send a response to the requester
 * @param res The response object
 * @param code The response code
 * @param message The response message
 */
export const sendResponseToRequest = (res: http.ServerResponse, code: number, message: string): void => {
	res.writeHead(code, { 'Content-Type': 'text/plain' });
	res.write(message);
	res.end();
};
