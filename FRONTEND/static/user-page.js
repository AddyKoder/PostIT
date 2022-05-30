let username = document.getElementById('to_find_username').innerText;

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

function id(id) {
	return document.getElementById(id);
}

async function check_logins() {
	if (username_mail == '' || pwd == '') window.location.href = '/login';
	else if (!(await verify_login(username_mail, pwd))) username_mail = pwd = null;
}

async function plot_info() {
	let user_data = await fetch(`../../get_user_info?info=${username}`);
	let data = await user_data.text();
	data = JSON.parse(data);

	if (username_mail && pwd) {
		id('username-logo').innerText = username_mail;
	}

	if (data == 'false') return;

	id('username').innerText = data.username;
	id('usermail').innerText = data.mail;
	id('nameofuser').innerText = data.name;
	let html_content = '';
	for (let i of data.posts) {
		let post = await fetch(`../../get-post?id=${i}`);
		let post_string = await post.text();
		post = await JSON.parse(post_string);
		html_content += `<div class="post-card" id="${post._id}">
		<div class="user-info" style="display:flex;align-items:center;margin-bottom:15px;">
			<i class="material-icons" style="font-size:clamp(1.5rem, 15vw, 2rem);">portrait</i>
		</div>
	
		<div class="post-title" style="font-size:clamp(1rem, 10vw, 2rem); margin-bottom: 5px;">${post.title.slice(0,10)}</div>
		<div class="post-description" style="font-size:clamp(0.5rem, 5vw, 1rem);">${post.content.slice(0, 90) + '...'}</div>
	</div>`;
	}
	document.getElementById('posts').innerHTML = html_content;
	add_event_listeners(data.posts)
}
function add_event_listeners(posts) {
	for (let i of posts) {
		document.getElementById(`${i}`).onclick = () => {document.location.href = `/posts/${i}`;};
	}
}
// check_logins();
plot_info();
