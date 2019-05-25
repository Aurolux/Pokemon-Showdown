'use strict';

/** @type {typeof import('../../lib/fs').FS} */
const FS = require(/** @type {any} */('../../.lib-dist/fs')).FS;

const path = require('path');
const fs = require('fs');

/* eslint no-restricted-modules: [0] */
const AVATAR_PATH = 'config/avatars/';

// The file extensions allowed.
const VALID_EXTENSIONS = ['.png'];

const https = require('https');

function downloadImage(image_url, name, extension) {
	let req = https.get(image_url, res => {
		 res.setEncoding('binary');
		 res.on('response', response => {
			 if (response.statusCode !== 200) return;
			 let type = response.headers['content-type'].split('/');
			 if (type[0] !== 'image') return;

			response.pipe(FS(AVATAR_PATH + name).createWriteStream());
		 });
	});
	req.on('error', e => {
		// not sure what to do for request errors
		console.error(e);
	});
	req.end();
}

const http = require('http');

function downloadImage(image_url, name, extension) {
	let req = http.get(image_url, res => {
		 res.setEncoding('binary');
		 res.on('response', response => {
			 if (response.statusCode !== 200) return;
			 let type = response.headers['content-type'].split('/');
			 if (type[0] !== 'image') return;

			response.pipe(FS(AVATAR_PATH + name).createWriteStream());
		 });
	});
	req.on('error', e => {
		// not sure what to do for request errors
		console.error(e);
	});
	req.end();
}
function loadCustomAvatars() {
	fs.readdir(AVATAR_PATH, (err, files) => {
		if (err) console.log("Error loading custom avatars: " + err);
		if (!files) files = [];
		files
			.filter(file => VALID_EXTENSIONS.includes(path.extname(file)))
			.forEach(file => {
				let name = path.basename(path.extname(file));
				Config.customavatars[name] = file;
			});
	});
}

loadCustomAvatars();

exports.commands = {
	customavatar: {
		add(target, room, user) {
			if (!this.can('avatar')) return false;
			let parts = target.split(',').map(param => param.trim());
			if (parts.length < 2) return this.parse('/help customavatar');

			let name = toID(parts[0]);
			let avatarUrl = parts[1];
			if (!/^https?:\/\//i.test(avatarUrl)) avatarUrl = 'http://' + avatarUrl;
			let ext = path.extname(avatarUrl);

			if (!VALID_EXTENSIONS.includes(ext)) {
				return this.errorReply("Image url must end in a .png extension.");
			}

			Config.customavatars[name] = name + ext;

			downloadImage(avatarUrl, name, ext);
			this.sendReply("|raw|" + name + "'s avatar was successfully set. Avatar:<br /><img src='" + avatarUrl + "' width='80' height='80'>");
			Monitor.adminlog(name + "'s avatar was successfully set by " + user.name + ".");
			if (Users(name)) Users(name).popup("|html|" + (user.name, 'Upper staff') + " have set your custom avatar.<br /><center><img src='" + avatarUrl + "' width='80' height='80'></center><br /> Refresh your page if you don't see it.");
		},

		remove(target, room, user) {
			if (!this.can('avatar')) return false;

			let userid = toID(target);
			let image = Config.customavatars[userid];

			if (!image) return this.errorReply(target + " does not have a custom avatar.");

			delete Config.customavatars[userid];
			fs.unlink(AVATAR_PATH + image, err => {
				if (err && err.code === 'ENOENT') {
					this.errorReply(target + "'s avatar does not exist.");
				} else if (err) {
					console.error(err);
				}

				if (Users(userid)) Users(userid).popup("|html|" + (user.name, 'Upper staff') + " have removed your custom avatar.");
				this.sendReply(target + "'s avatar has been successfully removed.");
				Monitor.adminlog(target + "'s avatar has been successfully removed by " + user.name + ".");
			});
		},

		customavatarhelp: 'help',
		help(target, room, user) {
			this.parse('/help customavatar');
		},
	},

	customavatarhelp: [
		"Commands for /customavatar are:",
		"/customavatar add [username], [image link] - Set a user's custom avatar. Requires: & ~",
		"/customavatar remove [username] - Delete a user's custom avatar. Requires: & ~"],
};
