/** @format */

const { loadApp } = require('./src/loaders/app');

(async () => {
	try {
		const app = await loadApp();
		app.listen(3001, () =>
			process.stdout.write('Application is running on http://localhost:3001\n')
		);
	} catch (error) {
		console.log(error);
	}
})();
