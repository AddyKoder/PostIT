import mongoose from 'mongoose';
const params = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

mongoose.connect('mongodb://localhost:27017/posty', params);

import { user } from './userSchema.js';

export async function createUser(name, mail, username, pwd) {


	let newUser = new user({ name, mail, username, password: pwd });

	await newUser.save().catch(err => {
		throw new Error(err.message);
	});

	return 'User successfully created';
}
