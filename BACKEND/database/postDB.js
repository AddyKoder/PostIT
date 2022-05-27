import { userSchema } from './userDB.js';

// Initializing the mongoDB 
import mongoose from 'mongoose';
const params = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

mongoose.connect('mongodb://localhost:27017/posty', params);


export const postSchema = mongoose.Schema({
	title: { type: String, required: true },
	tags: { type: [String], required: true },
	content: { type: String, required: true },
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'userSchema', required: true },
});	

let post = mongoose.model('posts', postSchema);

