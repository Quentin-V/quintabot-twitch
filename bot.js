const tmi = require('tmi.js');
const { Control } = require('magic-home');
const options = require('./vars');

const fs = require('fs');

var commandsLeds = require('./commandsLeds.js');
var commands = require('./commands.js')

var reload = require('require-reload')(require)

let leds = new Control("192.168.0.70");
//leds.startEffectMode();

// Define configuration options
const opts = {
	identity: {
		username: options.username,
		password: options.password
	},
	channels: [
		'quintaaa_'
	]
};
// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
	if (self) { return; } // Ignore messages from the bot
	// Remove whitespace from chat message
	const message = msg.trim();

	if( message.startsWith('!') ) {
		let parts = message.split(' ');
		let name = parts[0].substring(1);
		if( typeof commandsLeds[name] === 'function' ) {
			commandsLeds[name](client, target, context, msg, leds);
		}else if ( typeof commands[name] === 'function' ) {
			commands[name](client, target, context, msg, leds);
		}
	}

	if( message === "!reload" ) {
		commandsLeds = reload('./commandsLeds.js');
		commands = reload('./commands.js');
	}

}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
	console.log(`* Connected to ${addr}:${port}`);
}

function isLedOn() {
	return leds.queryState.on;
}
