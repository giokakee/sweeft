/** @format */

const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();

const emailSEnder = process.env.EMAIL_SENDER;

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: emailSEnder,
		pass: process.env.EMAIL_SENDER_PASS,
	},
});

module.exports.sendEmail = (to, subject, text) => {
	const mailOptions = {
		from: emailSEnder,
		to,
		subject,
		text,
	};

	return new Promise((resolve, reject) => {
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.error('Error sending email:', error);
				reject(error);
			} else {
				console.log('Email sent:', info.response);
				resolve(info);
			}
		});
	});
};
