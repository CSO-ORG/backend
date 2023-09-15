import { sendResponseToRequest } from './server';
import http from 'http';
import { describe, expect, it, vi } from 'vitest';

describe('server', () => {
	describe('sendResponseToRequest', () => {
		const resEndSpy = vi.spyOn(http.ServerResponse.prototype, 'end').mockReturnThis();
		const resWriteHeadSpy = vi.spyOn(http.ServerResponse.prototype, 'writeHead').mockReturnThis();
		const resWriteSpy = vi.spyOn(http.ServerResponse.prototype, 'write').mockReturnThis();

		it('should send request to the requester', () => {
			const res = http.ServerResponse.prototype;
			sendResponseToRequest(res, 200, 'OK');

			expect(resWriteHeadSpy).toHaveBeenCalledWith(200, { 'Content-Type': 'text/plain' });
			expect(resWriteSpy).toHaveBeenCalledWith('OK');
			expect(resEndSpy).toHaveBeenCalledOnce();
		});
	});
});
