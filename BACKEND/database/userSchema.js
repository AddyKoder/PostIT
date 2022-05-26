import mongoose from 'mongoose';
import {postSchema} from './postSchema.js';

export const userSchema = mongoose.Schema({
	name: {type: String, required: true},
	mail: {type: String, required: true},
	username: {type: String, required: true},
	password: {type: String, required: true},
	notes: [{type:mongoose.Schema.Types.ObjectId, ref: 'userSchema', default:[]}]

});

export let user= mongoose.model('users', userSchema);
