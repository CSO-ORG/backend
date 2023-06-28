import axios from 'axios';
import { readFileSync, readdirSync, rmSync, writeFileSync } from 'fs';

export const mergeFiles = () => {
	const dptFolders = readdirSync('./data').filter((e) => e !== '.keep');
	for (const dptFolder of dptFolders) {
		const files = readdirSync(`./data/${dptFolder}`).filter(
			(e) => e !== 'merge.json',
		);

		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		const output = files.reduce((acc: any[], file) => {
			const fileContent = JSON.parse(
				readFileSync(`./data/${dptFolder}/${file}`, 'utf8'),
			);

			return [...acc, ...fileContent];
		}, []);

		writeFileSync(`./data/${dptFolder}/merge.json`, JSON.stringify(output));
	}
};

export const sendFilesToGateway = () => {
	const dptFolders = readdirSync('./data').filter((e) => e !== '.keep');
	for (const dptFolder of dptFolders) {
		const fileContent = JSON.parse(
			readFileSync(`./data/${dptFolder}/merge.json`, 'utf8'),
		);

		while (fileContent.length > 0) {
			const chunk = fileContent.splice(0, 500);
			axios
				.post(
					`https:gergre.free.beeceptor.com/alerts?dpt=${dptFolder}`,
					JSON.stringify(chunk),
				)
				.catch((e: unknown) => {
					console.log(e);
				});
		}
	}
	deleteFiles();
};

const deleteFiles = () => {
	const dptFolders = readdirSync('./data').filter((e) => e !== '.keep');
	dptFolders.forEach((dir) => rmSync(dir, { recursive: true, force: true }));
};
