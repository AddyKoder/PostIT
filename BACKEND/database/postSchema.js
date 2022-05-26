import mongoose from 'mongoose';
import { userSchema } from './userSchema.js';

export const postSchema = mongoose.Schema({
	title: { type: String, required: true },
	tags: { type: [String], required: true },
	content: { type: String, required: true },
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'userSchema', required: true }
});

export let post = mongoose.model('posts', postSchema);
