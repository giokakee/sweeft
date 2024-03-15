/** @format */

// module.exports = {
// 	up: async ({ context }) => {
// 		const q = context.getQueryInterface();
// 		//   const hashedPassword = await bcrypt.hash('zimbabue', 10);
// 		const hashedPassword = 'testhashing';

// 		await q.bulkInsert('users', [
// 			{
// 				first_name: 'admin',
// 				last_name: 'admin',
// 				image: 'adminImage',
// 				title: 'some title',
// 				summary: 'admin summary',
// 				role: 'admin',
// 				email: 'zimbabue@gmail.com',
// 				password: hashedPassword,
// 			},
// 		]);
// 	},

// 	down: async ({ context }) => {
// 		const q = context.getQueryInterface();

// 		await q.bulkDelete('users', {
// 			email: 'zimbabue@gmail.com',
// 		});
// 	},
// };
