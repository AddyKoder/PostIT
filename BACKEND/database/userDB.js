import {postSchema} from './postDB.js';
import mongoose from 'mongoose';
const params = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

mongoose.connect('mongodb://localhost:27017/posty', params);


export const userSchema = mongoose.Schema({
	name: {type: String, required: true},
	mail: {type: String, required: true},
	username: {type: String, required: true},
	password: {type: String, required: true},
	notes: [{type:mongoose.Schema.Types.ObjectId, ref: 'userSchema', default:[]}]

});
let user= mongoose.model('users', userSchema);


export async function createUser(name, mail, username, pwd) {


	let newUser = new user({ name, mail, username, password: pwd });

	await newUser.save().catch(err => {
		throw new Error(err.message);
	});

	return 'User successfully created';
}
