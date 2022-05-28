function getCookie(cname) {
	let name = cname + '=';
	let ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return '';
}
let username_mail = getCookie('username_mail');
let pwd = getCookie('pwd');
async function verify_login(info, pwd) {
	let response = await fetch(`/verify_login?info=${info}&pwd=${pwd}`);
	if ((await response.text()) == 'true') {
		return true;
	} else {
		return false;
	}
}

async function check_logins() {
	if (username_mail == '' || pwd == '') window.location.href = '/login';
	else if (!(await verify_login(username_mail, pwd))) window.location.href = '/login';
}

async function add_event_listeners() {
	document.getElementById('publish-button').onclick = async () => {
		let title = document.getElementById('title').value;
		let content = document.getElementById('content').value;
		if (title != '' && content != '') {
			let response = await fetch('/add-post', {
				method: 'POST',
				body: JSON.stringify({
					username_mail,
					pwd,
					title,
					content,
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				},
			});

			if ((await response.text()) == 'ok') {
				document.location.href = '/profile';
			}
		}
		console.log('some error occurred');
	};
}

check_logins();
add_event_listeners();
