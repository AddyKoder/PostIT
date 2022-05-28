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
	if (await post.findOne({ title: userpost.title }) == null) {		
		let newpost = new post({ title: userpost.title, content: userpost.content, author: userID });
		await newpost.save().catch(err => { console.log('err'); return 0; });
		return newpost.id;
	}
	return 0;
}
