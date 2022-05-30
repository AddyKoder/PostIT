import { userSchema } from './userDB.js';
import * as user from './userDB.js';
// Initializing the mongoDB
import mongoose from 'mongoose';
const params = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

mongoose.connect('mongodb://localhost:27017/posty', params);

export const postSchema = mongoose.Schema({
	title: { type: String, required: true },
	content: { type: String, required: true },
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'userSchema', required: true },
});

let post = mongoose.model('posts', postSchema);

export async function add_post(userpost, userID) {
	if ((await post.findOne({ title: userpost.title })) == null) {
		let newpost = new post({ title: userpost.title, content: userpost.content, author: userID });
		await newpost.save().catch(err => {
			console.log(err);
			return 0;
		});
		return newpost.id;
	}
	return 0;
}

export async function get_post(postID) {
	let data = await post.findOne({ _id: postID });
	if (data) return data;
	return 0;
}

export async function get_all_post_ids() {
	let posts = await post.find({}).select('author');
	let posts_data = [];
	let user_data;
	for (let i of posts) {
		user_data = await user.get_user(i.author);
		posts_data.push({_id:i._id, author:user_data.username});
	}

	return posts_data;
}
