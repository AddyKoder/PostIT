import p from 'path';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));


import { router as routes } from './BACKEND/routes.js';
import express from 'express';

const app = express();

function error(req, res, next) {
	res.render('error', {
		title: 'page not found',
		description: 'The page you requestes was not available or was removed',
	});
}
app.set('view engine', 'pug');
app.set('views', p.join(__dirname, './FRONTEND/'));

app.use(routes);
app.use('/', express.static(p.join(__dirname, './FRONTEND/static')));

app.use(error);

app.listen(process.env.PORT || 80, () => {
	console.log('app started');
});
