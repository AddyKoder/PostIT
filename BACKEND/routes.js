import p from 'path';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import express from 'express';
export const router = express();

import * as user from './database/userDB.js';

const urlencoded = express.urlencoded({ extended: true });
let jsonparser = express.json();
import cparser from 'cookie-parser';
router.use(cparser());

// static pages serving

router.get('/', (req, res) => {
	res.redirect('/login');
});

router.get('/login', urlencoded, async (req, res) => {
	if ((req.cookies.username_mail, req.cookies.pwd)) {
		let username_mail = req.cookies.username_mail;
		let password = req.cookies.pwd;

		if (await user.verify_login(username_mail, password)) {
			res.cookie('username_mail', username_mail, {
				maxAge: 1000 * 60 * 60 * 24,
			});
			res.cookie('pwd', password, {
				maxAge: 1000 * 60 * 60 * 24,
			});
			res.redirect('/profile');
		} else {
			res.cookie('pwd', '');
			res.cookie('username_mail', '');
			res.redirect('/login');
		}
	} else {
		res.header('Content-Type', 'text/html');
		res.sendFile(p.join(__dirname, '../FRONTEND/home.html'));
	}
});

router.get('/signup', (req, res) => {
	res.header('Content-Type', 'text/html');
	res.sendFile(p.join(__dirname, '../FRONTEND/signup.html'));
});

router.get('/profile', (req, res) => {
	res.header('Content-Type', 'text/html');
	res.sendFile(p.join(__dirname, '../FRONTEND/user-profile.html'));
});

router.get('/add-post', (req, res) => {
	res.header('Content-Type', 'text/html');
	res.sendFile(p.join(__dirname, '../FRONTEND/add-post.html'));
});

// endpoints for the backend
router.post('/signup', urlencoded, async (req, res) => {
	if (
		!(await user.verify_user_data(
			req.body.name,
			req.body.mail,
			req.body.uername,
			req.body.password,
			req.body.confirm_password
		))
	) {
		res.render('error', {
			title: 'Incorrect Information',
			description:
				'Due to a client side error the server is projected with falsy information. \n Try again, if problem continues, then contact our help team at help@posty.com',
		});
		return false;
	}

	if (user.createUser(req.body.name, req.body.mail, req.body.username, req.body.password)) {
		res.redirect('/');
	}
});

router.post('/login', urlencoded, async (req, res) => {
	let password = req.body.password;
	let username_mail = req.body.username_email;

	if (await user.verify_login(username_mail, password)) {
		res.cookie('username_mail', username_mail, {
			maxAge: 1000 * 60 * 60 * 24,
		});
		res.cookie('pwd', password, {
			maxAge: 1000 * 60 * 60 * 24,
		});
		res.redirect('/profile');
	} else res.redirect('/login');
});

router.get('/verify_login', async (req, res) => {
	let info = req.query.info;
	let pwd = req.query.pwd;
	if (info && pwd) {
		if (await user.verify_login(info, pwd)) {
			res.send('true');
		} else res.send('false');
	} else res.send('false');
});

router.get('/get_user_info', async (req, res) => {
	let info = req.query.info;
	let pwd = req.query.pwd;
	if (info && pwd) {
		if (await user.verify_login(info, pwd)) {
			res.send(JSON.stringify(await user.get_user_info(info)));
		}
	}
});

router.post('/add-post',jsonparser, async (req, res) => {
	
	let data = req.body;
	let info = data.username_mail;
	let pwd = data.pwd;
	let title = data.title;
	let content = data.content;

	if (info && pwd) {
		if (await user.verify_login(info, pwd)) {
			if (await user.add_post(info, { title, content })) {
				res.send('ok');
				return;
			}
		}
	}
	res.send('error');
});
