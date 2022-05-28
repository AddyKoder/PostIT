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
let info = username_mail;
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

async function plot_info() {

	let response = await fetch(`/get_user_info?info=${info}&pwd=${pwd}`);
	let user_data = JSON.parse(await response.text());

	document.getElementById('username').innerText = user_data.username;
	document.getElementById('usermail').innerText = user_data.mail;
	document.getElementById('nameofuser').innerText = user_data.name;
	document.getElementById('username-logo').innerText = user_data.username;

}

function add_event_listeners() {
	document.getElementById('create-post-button').onclick = () => {
		document.location.href = '/add-post';
	};
} 


check_logins();
plot_info();
add_event_listeners()