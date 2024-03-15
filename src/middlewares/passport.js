/** @format */

const dotenv = require('dotenv');
const passport = require('passport');
const passportJWT = require('passport-jwt');

dotenv.config();

const JWTStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

exports.loadPassport = app => {
	const jwtOptions = {
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: process.env.SECRET_TOKEN,
	};

	const strategy = new JWTStrategy(jwtOptions, (jwtPayload, done) => {
		done(null, jwtPayload);
	});

	passport.use(strategy);
	app.use(passport.initialize());
};
