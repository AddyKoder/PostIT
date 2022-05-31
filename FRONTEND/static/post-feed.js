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

function id(id) {
	return document.getElementById(id);
}

function plot_info() {
	if (username_mail && pwd) {
		id('username-logo').innerText = username_mail;
	}
}

async function place_feed(feeds) {
	let html_content = '';
	id('headline').innerText = 'Your Feed - Loading...';
	for (let i of feeds) {
		let post = await fetch(`../../get-post?id=${i._id}`);
		let post_string = await post.text();
		post = await JSON.parse(post_string);
		html_content += `<div class="post-card" id="${post.title}" >
		<div onclick="document.location.href = '/user/${i.author}'" class="user-info" style="display:flex;align-items:center;margin-bottom:15px;">
			<i class="material-icons" style="font-size:clamp(1.5rem, 15vw, 2rem);">portrait</i>
			${i.author}
		</div> 
	
		<div  class="post-title ${post._id}" style="font-size:clamp(1rem, 10vw, 2rem); margin-bottom: 5px;">${post.title.slice(0, 10)}</div>
		<div class="post-description ${post._id}" style="font-size:clamp(0.5rem, 5vw, 1rem);">${post.content.slice(0, 90) + '...'}</div>
	</div>`;
		document.getElementById('posts').innerHTML = html_content;
	}
	id('headline').innerText = 'Your Feed';

	add_event_listeners(feeds);
}

async function plot_feed() {
	let feeds = await fetch('/all-posts');
	feeds = await feeds.text();
	feeds = await JSON.parse(feeds);
	await place_feed(feeds);
}

document.getElementById('create-post-button').onclick = () => {
	document.location.href = '/add-post';
};

function add_event_listeners(posts) {
	for (let i of posts) {
		for (let x of document.getElementsByClassName(`${i._id}`)) {
			x.onclick = () => {
				document.location.href = `/posts/${i._id}`;
			};
		}
	}
}

plot_info();
plot_feed();
