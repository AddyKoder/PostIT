import { postSchema } from './postDB.js';
import mongoose from 'mongoose';
import * as post from './postDB.js';
const params = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

mongoose.connect('mongodb://localhost:27017/posty', params);

export const userSchema = mongoose.Schema({
	name: { type: String, required: true },
	mail: { type: String, required: true },
	username: { type: String, required: true },
	password: { type: String, required: true },
	posts: { type: [String], default: [] },
});
let user = mongoose.model('users', userSchema);

export async function createUser(name, mail, username, pwd) {
	let newUser = new user({ name, mail, username, password: pwd });

	await newUser.save().catch(err => {
		throw new Error(err.message);
	});

	return 'User successfully created';
}

export async function userExists(mail, username) {
	if ((await user.findOne({ mail })) != null) return true;
	if ((await user.findOne({ username })) != null) return true;
	return false;
}

export async function verify_user_data(name, mail, username, pwd, confirm_pwd) {
	if (name == '' || mail == '' || username == '' || pwd == '') return false;
	if (pwd !== confirm_pwd) return false;
	if (await userExists(mail, username)) return false;
	return true;
}

export async function verify_login(info, pwd, name = true) {
	let with_mail;
	if (name) with_mail = await user.findOne({ mail: info });
	let with_username = await user.findOne({ username: info });

	if (with_mail != null && with_mail != undefined) {
		if (with_mail.password === pwd) return true;
	}
	else if (with_username != null) {
		if (with_username.password === pwd) return true;
	}
	return false;
}

export async function get_user_info(info, pwd='false') {
	let with_mail = await user.findOne({ mail: info });
	let with_username = await user.findOne({ username: info });

	if (with_mail != null) {
		if (!pwd) with_mail.password = null;
		return with_mail;
	} else if (with_username != null) {
		if (!pwd) with_username.password = null;
		return with_username;
	} else return false;
}

export async function add_post(info, userpost) {
	let user_data = await get_user_info(info, true);
	let postID = await post.add_post(userpost, user_data.id);

	if (postID) {
		user_data.posts.push(postID);
		await user_data.save();
		return 'ok';
	}
	return 0;
}

export async function get_user(userID) {
	let data = await user.findOne({ _id: userID });
	if (data) return data;
	return 0;
}
