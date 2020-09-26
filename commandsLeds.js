 // paramètres : client, target, context, msg, leds
const commands = {

	cooldown: false,

	color: function(client, target, context, msg, leds) {
		testCooldown(client, target, context).then(cooldowned => {
		if (cooldowned) return; setCooldown(15);
			let args = msg.split(' ');
			try {
				var r = parseInt(args[1]);
				var g = parseInt(args[3]);
				var b = parseInt(args[2]);
				if(r > 255) r = 255;
				if(g > 255) g = 255;
				if(b > 255) b = 255;
				if(b < 0  ) r = 255;
				if(b < 0  ) g = 255;
				if(b < 0  ) b = 255;
				if(isNaN(r) || isNaN(g) || isNaN(b)) throw 'Wrong usage of the command';
				leds.setColor(r, g, b).catch(() => {});
			}catch(err) {
				client.say(target, `${context['display-name']}, pour utiliser la commande, fais !color [rouge] [vert] [bleu], avec des valeur comprises entre 0 et 255.`);
				console.log(err);
			}
		});
	},

	// STROBE AND FADE
	strobe: function(client, target, context, msg, leds) {
		testCooldown(client, target, context).then(cooldowned => {
			if (cooldowned) return; setCooldown(60);
			getColor(leds, target).then((color) => {
				leds.setPattern("white_strobe_flash", 100).catch(() => {});
				setTimeout(() => {
					leds.setColor(color.red, color.green, color.blue).catch(() => {});
				}, 10000);
			});
		});
	},
	fade: function(client, target, context, msg, leds) {
		testCooldown(client, target, context).then(cooldowned => {
			if (cooldowned) return; setCooldown(45);
			getColor(leds, target).then((color) => {
				leds.setPattern("seven_color_cross_fade", 85).catch(() => {});
				setTimeout(() => {
					leds.setColor(color.red, color.green, color.blue).catch(() => {});
				}, 20000);
			});
		});

	},

	// BASIC COLORS
	rouge: function(client, target, context, msg, leds) {
		testCooldown(client, target, context).then((cooldowned) => {
			if(cooldowned) return; setCooldown(10);
			leds.setColor(255, 0 , 0).catch((err) => {});
		});
	},
	vert: function(client, target, context, msg, leds) {
		testCooldown(client, target, context).then((cooldowned) => {
			if(cooldowned) return; setCooldown(10);
			leds.setColor(0, 0 , 255).catch(() => {});
		});
	},
	bleu: function(client, target, context, msg, leds) {
		testCooldown(client, target, context).then((cooldowned) => {
			if(cooldowned) return; setCooldown(10);
			leds.setColor(0, 255 , 0).catch(() => {});
		});
	},

	//
	ledson: function(client, target, context, msg, leds) {
		isLedOn(leds).then(on => {
			if( !on && ismod(context) ) {
				leds.turnOn();
			}else if( !ismod(context) ) {
				modcommand(context, target, client);
			}else {
				client.say(target, `${context['display-name']}, les leds sont déjà allumées`);
			}
		});
	},
	ledsoff: function(client, target, context, msg, leds) {
		isLedOn(leds).then(on => {
			if( on && ismod(context) ) {
				leds.turnOff();
			}else if( !ismod(context) ) {
				modcommand(context, target, client);
			}else {
				client.say(target, `${context['display-name']}, les leds ne sont pas allumées`);
			}
		});
	},
	randompattern: function(client, target, context, msg, leds) {
		testCooldown(client, target, context).then((cooldowned) => {
			if(cooldowned) return;
			setCooldown(80);
			let patterns = ["seven_color_cross_fade",
						"red_gradual_change",
						"green_gradual_change",
						"blue_gradual_change",
						"yellow_gradual_change",
						"cyan_gradual_change",
						"purple_gradual_change",
						"white_gradual_change",
						"red_green_cross_fade",
						"red_blue_cross_fade",
						"green_blue_cross_fade",
						"seven_color_strobe_flash",
						"red_strobe_flash",
						"green_strobe_flash",
						"blue_strobe_flash",
						"yellow_strobe_flash",
						"cyan_strobe_flash",
						"purple_strobe_flash",
						"white_strobe_flash",
						"seven_color_jumping"]
			leds.setPattern(patterns[Math.floor(Math.random() * patterns.length)], Math.floor(Math.random() * 40) + 60).catch(() => {});
			getColor(leds, target).then((color) => {
				setTimeout(() => {
					leds.setColor(color.red, color.green, color.blue).catch(() => {});
				}, 60000);
			});
		});
	},

	leds: function(client, target, context, msg, leds) {
		client.say(target, "Tu peux controler les leds derrière moi avec des commandes: !rouge, !vert et !bleu ou !color [rouge] [vert] [bleu], avec des valeurs entre 0 et 255, pour voir toutes les commandes !ledscommands");
	},

	ledscommands: function(client, target, context, msg, leds) {
		client.say(target, "!color [rouge] [vert] [bleu], !rouge, !vert, !bleu, !strobe, !fade, !randompattern");
	}
}


function modcommand(context, target, client) {
	client.say(target, `${context['display-name']}, tu dois être modérateur pour executer cette commande`);
}

function ismod(context) {
	let hasbadges = context.badges !== null;
	return context.mod || context.badges.hasOwnProperty("broadcaster");
}

function getState(leds) {
	return new Promise( (resolve, reject) => {
		leds.queryState().then(state => {
			resolve(state);
		}).catch(() => {});
	});
}

function isLedOn(leds) {
	return new Promise( (resolve, reject) => {
		leds.queryState().then(state => {
			resolve(state.on);
		}).catch((err) => {console.log(err)});
	});
}

function getColor(leds) {
	return new Promise( (resolve, reject) => {
		leds.queryState().then(state => {
			resolve(state.color);
		}).catch(() => {});
	});
}

function testCooldown(client, target, context) {
	return new Promise((resolve, reject) => {
		if(this.cooldown && !this.cooldownCooldown) {
			this.cooldownCooldown = true;
			client.say(target, `${context['display-name']}, les leds sont déjà en cours d'utilisation, attend un peu :)`);
			setTimeout(() => {
				this.cooldownCooldown = false;
			}, 40000);
			resolve(true);
		}else if(this.cooldown && this.cooldownCooldown) {
			resolve(true);
		}else {
			resolve(false);
		}
	});
}

function setCooldown(time) {
	this.cooldown = true;
	setTimeout(() => {
		this.cooldown = false;
	}, time * 1000);
}

module.exports = commands;
