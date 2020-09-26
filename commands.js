const commands = {

	cooldown: false,

	nartax: function(client, target, context, msg, leds) {
		client.say(target, "echo toto");
	},

	banme: function(client, target, context, msg, leds) {
		if(!ismod(context)) {
			client.say(target, `/ban ${context['display-name']}`);
		}else {
			client.say(target, `${context['display-name']}, je peux pas te ban débile`);
		}
	},


	debug: function(client, target, context, msg, leds) {
		console.log("Context : \n" + JSON.stringify(context, null, 4));
		console.log("Target : \n" + JSON.stringify(target, null, 4));
	}


}


function modcommand(context, target, client) {
	client.say(target, `${context.display_name}, tu dois être modérateur pour executer cette commande`);
}

function ismod(context) {
	let hasbadges = context.badges !== null;
	return context.mod || hasbadges && context.badges.hasOwnProperty("broadcaster");
}

function testCooldown(client, target, context) {
	if(this.cooldown && !this.cooldownCooldown) {
		this.cooldownCooldown = true;
		client.say(target, `${context.display_name}, les leds sont déjà en cours d'utilisation, attend un peu :)`);
		setTimeout(() => {
			this.cooldownCooldown = false;
		}, 40000);
	}else if(this.cooldownCooldown) {
		return true;
	}else {
		return false;
	}
}

function setCooldown(time) {
	this.cooldown = true;
	setTimeout(() => {
		this.cooldown = false;
	}, time * 1000);
}

module.exports = commands;
