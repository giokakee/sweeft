/** @format */

const { makeAuthCompanyRouter } = require('../routes/auth.company');
const { makeAuthEmployeeRouter } = require('../routes/auth.employee');
const { makeSubscriptionRouter } = require('../routes/subscribe');

exports.loadRoutes = (app, context) => {
	app.use('/api/auth/company', makeAuthCompanyRouter(context));
	app.use('/api/auth/employee', makeAuthEmployeeRouter(context));
	app.use('/api/auth/subscribe', makeSubscriptionRouter(context));
};
