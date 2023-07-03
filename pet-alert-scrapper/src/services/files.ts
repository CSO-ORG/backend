import axios from 'axios';
import { readFileSync, readdirSync, rmSync, writeFileSync } from 'fs';

const rootDataFolder = './data';
const subsFolders = ['chien', 'chat'];

export const mergeFiles = () => {
	subsFolders.forEach((subfolder) => {
		const dptFolders = readdirSync(`${rootDataFolder}/${subfolder}`).filter(
			(e) => e !== '.keep',
		);
		for (const dptFolder of dptFolders) {
			const files = readdirSync(
				`${rootDataFolder}/${subfolder}/${dptFolder}`,
			).filter((e) => e !== 'merge.json');

			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
			const output = files.reduce((acc: any[], file) => {
				const fileContent = JSON.parse(
					readFileSync(
						`${rootDataFolder}/${subfolder}/${dptFolder}/${file}`,
						'utf8',
					),
				);

				return [...acc, ...fileContent];
			}, []);

			writeFileSync(
				`${rootDataFolder}/${subfolder}/${dptFolder}/merge.json`,
				JSON.stringify(output),
			);
		}
	});
};

export const sendFilesToGateway = () => {
	subsFolders.forEach((subfolder) => {
		const dptFolders = readdirSync(`${rootDataFolder}/${subfolder}`).filter(
			(e) => e !== '.keep',
		);
		for (const dptFolder of dptFolders) {
			const fileContent = JSON.parse(
				readFileSync(
					`${rootDataFolder}/${subfolder}/${dptFolder}/merge.json`,
					'utf8',
				),
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
	});
};

const deleteFiles = () => {
	const folders = readdirSync(rootDataFolder).filter((e) => e !== '.keep');
	folders.forEach((dir) => rmSync(dir, { recursive: true, force: true }));
};
