import p from 'path';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import express from 'express';
export const router = express.Router();
import * as user from './database/userDB.js';
import * as post from './database/postDB.js';

const urlencoded = express.urlencoded({ extended: true });

// static pages serving
router.get('/', (req, res) => {
	res.header('Content-Type', 'text/html');
	res.sendFile(p.join(__dirname, '../FRONTEND/home.html'));
});

router.get('/signup', (req, res) => {
	res.header('Content-Type', 'text/html');
	res.sendFile(p.join(__dirname, '../FRONTEND/signup.html'));
});

// endpoints for the backend
router.post('/signup', urlencoded, (req, res) => {
	if (
		!req.body.name ||
		!req.body.mail ||
		!req.body.username ||
		!req.body.password ||
		!req.body.confirm_password ||
		!req.body.password == req.body.confirm_password
	) {
		res.render('error', {
			title: 'Incorrect Information',
			description:
				'Due to a client side error the server is projected with falsy information. \n Try again, if problem continues, then contact our help team at help@posty.com',
		});
		return;
	}

	if (user.createUser(req.body.name, req.body.mail, req.body.username, req.body.password)) {
		res.send('created successfully');
	}
});
