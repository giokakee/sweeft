/** @format */

const multer = require('multer');
const path = require('path');

const publicPath = path.resolve(__dirname, '../../public');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, publicPath);
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		const fileExtension = path.extname(file.originalname);
		cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
	},
});

const fileFilter = (req, file, cb) => {
	const allowedFileTypes = ['.csv', '.xls', '.xlsx'];
	const fileExtension = path.extname(file.originalname).toLowerCase();
	if (allowedFileTypes.includes(fileExtension)) {
		cb(null, true); // Accept the file
	} else {
		cb(new Error('Only CSV, XLS, and XLSX files are allowed!'), false); // Reject the file
	}
};

exports.upload = multer({ storage, fileFilter });
