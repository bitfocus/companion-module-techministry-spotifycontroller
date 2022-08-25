// techministry-spotifycontroller

var instance_skel = require('../../../instance_skel');

var io = require('socket.io-client');

var actions = require('./actions.js');
var feedbacks = require('./feedbacks.js');
var variables = require('./variables.js');
var presets = require('./presets.js');

var debug;
var log;

function instance(system, id, config) {
	let self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	return self;
}

instance.prototype.socket = null;

instance.prototype.POLLING_INTERVAL = null;

instance.prototype.STATUS = {
	information: '',
	version: '',
	playbackInfo: {
		name: '',
		artist: '',
		album: '',
		duration: '',
		playbackPosition: '',
		trackId: '',
		playerState: ''
	},
	state: {
		volume: ''
	},
	controlStatus: false
};

instance.prototype.init = function() {
	let self = this;

	debug = self.debug;
	log = self.log;

	if (self.config.verbose) {
		self.log('info', 'Verbose mode enabled. Log entries will contain detailed information.');
	}

	self.status(self.STATUS_WARNING, 'Connecting');

	self.init_connection();

	self.init_actions();
	self.init_feedbacks();
	self.init_variables();
	self.init_presets();

	self.checkFeedbacks();
	self.checkVariables();
}

instance.prototype.updateConfig = function(config) {
	let self = this;

	self.config = config;

	if (self.config.verbose) {
		self.log('info', 'Verbose mode enabled. Log entries will contain detailed information.');
	}

	self.status(self.STATUS_WARNING, 'Connecting');

	self.init_connection();

	self.init_actions();
	self.init_feedbacks();
	self.init_variables();
	self.init_presets();

	self.checkFeedbacks();
	self.checkVariables();
}

// Return config fields for web config
instance.prototype.config_fields = function () {
	let self = this;

	return [
		{
			type: 'text',
			id: 'info',
			label: 'Information',
			width: 12,
			value: `
				<div class="alert alert-warning">
					<div>
						<strong>Please read and understand the following before using this module:</strong>
						<br>
						This module connects to a free program called "spotify-controller" which will run on the Mac that uses Spotify you wish to control. 
						<br>
						"spotify-controller" is a MacOS only program, so this module can only control Spotify on MacOS. If you wish to control Spotify on other operating systems, consider using a different module or approach.
						<br><br>
						<strong>Install Instructions:</strong>
						<br><br>
						<ul>
							<li><a href="https://github.com/josephdadams/spotify-controller" target="_new" class="btn btn-warning mr-1">Download spotify-controller here</a></li>
							<li>Install the application on your Mac and run it.</li>
							<li>It uses Port 8801 by default. If this port is already in use in your system, you will need to change it.</li>
							<li>Configure this module with the Host IP Address and Port in use. The IP Address should be the IP of the Mac running spotify-controller.</li>
							<li>If it is the same computer that is running Companion, you can use IP "127.0.0.1".</li>
						</ul>
					</div>
				</div>
			`
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Mac IP Address',
			width: 3,
			default: '127.0.0.1',
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Port',
			width: 3,
			default: 8801,
			regex: self.REGEX_PORT
		},
		{
			type: 'text',
			id: 'dummy1',
			width: 12,
			label: ' ',
			value: ' ',
		},
		{
			type: 'text',
			id: 'info2',
			label: 'Polling',
			width: 12,
			value: `
				<div class="alert alert-danger">
					<strong>Please read:</strong>
					<br>
					Enabling polling unlocks these features:
					<br><br>
					<ul>
						<li>Current Volume Level/Feedbacks</li>
						<li>Current Playback Position/Duration</li>
					</ul>
					Enabling polling will tell spotify-controller to continuously execute an AppleScript to request the current playback state of Spotify.
					<br>
					<strong>This could have an undesired performance effect on your machine, depending on the polling rate.</strong>
					<br>
				</div>
			`
		},
		{
			type: 'checkbox',
			id: 'polling',
			label: 'Enable Polling (experimental)',
			default: false,
			width: 3
		},
		{
			type: 'textinput',
			id: 'pollingrate',
			label: 'Polling Rate (in ms)',
			default: 1000,
			width: 3,
			isVisible: (configValues) => configValues.polling === true,
		},
		{
			type: 'text',
			id: 'dummy1',
			width: 12,
			label: ' ',
			value: ' ',
		},
		{
			type: 'text',
			id: 'info3',
			label: 'Verbose Logging',
			width: 12,
			value: `
				<div class="alert alert-info">
					Enabling this option will put more detail in the log, which can be useful for troubleshooting purposes.
				</div>
			`
		},
		{
			type: 'checkbox',
			id: 'verbose',
			label: 'Enable Verbose Logging',
			default: false
		},
		
	]
};

// When module gets deleted
instance.prototype.destroy = function() {
	let self = this;

	clearInterval(self.POLLING_INTERVAL);
	self.POLLING_INTERVAL = null;

	debug('destroy', self.id);
}

instance.prototype.init_connection = function() {
	let self = this;

	if (self.config.host) {
		self.log('info', `Opening connection to spotify-controller: ${self.config.host}:${self.config.port}`);

		self.socket = io.connect('http://' + self.config.host + ':' + self.config.port, {reconnection: true});
		self.log('info', 'Connecting to spotify-controller...');
		self.STATUS.information = 'Connecting to spotify-controller';
		self.checkVariables();

		// Add listeners
		self.socket.on('connect', function() { 
			self.socket.emit('version');
			self.status(self.STATUS_OK);
			self.log('info', 'Connected to spotify-controller. Retrieving data.');
			self.STATUS.information = 'Connected';
			self.checkVariables();
			self.getState();
			self.init_polling(); //init polling, if enabled
		});

		self.socket.on('disconnect', function() { 
			self.status(self.STATUS_ERROR);
			self.log('error', 'Disconnected from spotify-controller.');
			self.STATUS.information = 'Disconnected';
			self.checkVariables();

			clearInterval(self.POLLING_INTERVAL);
			self.POLLING_INTERVAL = null;
		});

		self.socket.on('version', function(version) {
			self.STATUS.version = version;
			self.checkVariables();
		});
		
		self.socket.on('state_change', function(data) {
			if (data.playbackInfo) {
				self.STATUS.playbackInfo = data.playbackInfo;
			}

			if (data.state) {
				self.STATUS.state = data.state;
			}

			self.checkVariables();
			self.checkFeedbacks();
		});

		self.socket.on('control_status', function(status) {
			self.STATUS.controlStatus = status;
			if (status == false) {
				self.status(self.STATUS_WARNING);
				self.STATUS.information = 'Control has been disabled via spotify-controller.';
				self.log('warning', 'Control has been disabled via spotify-controller.');
			}
			else {
				self.status(self.STATUS_OK);
				self.STATUS.information = 'Control has been enabled via spotify-controller.';
				self.log('info', 'Control has been enabled via spotify-controller.');
			}
			self.checkVariables();
			self.checkFeedbacks();
		});

		self.socket.on('error', function(error) {
			self.status(self.STATUS_ERROR);
			self.log('error', 'Error from spotify-controller: ' + error);
		});
	}
};

instance.prototype.init_polling = function() {
	let self = this;

	if (self.config.polling) {
		if (self.config.verbose) {
			self.log('info', 'Starting Polling: Every ' + self.config.pollingrate + ' ms');
		}
		self.POLLING_INTERVAL = setInterval(self.getState.bind(this), parseInt(self.config.pollingrate));
	}
	else {
		clearInterval(self.POLLING_INTERVAL);
		self.POLLING_INTERVAL = null;
	}
};

instance.prototype.getState = function() {
	let self = this;

	self.sendCommand('state');
};

// ##########################
// #### Instance Actions ####
// ##########################
instance.prototype.init_actions = function (system) {
	this.setActions(actions.setActions.bind(this)());
};

// ############################
// #### Instance Feedbacks ####
// ############################
instance.prototype.init_feedbacks = function (system) {
	this.setFeedbackDefinitions(feedbacks.setFeedbacks.bind(this)());
};

// ############################
// #### Instance Variables ####
// ############################
instance.prototype.init_variables = function () {
	this.setVariableDefinitions(variables.setVariables.bind(this)());
};

// Setup Initial Values
instance.prototype.checkVariables = function () {
	variables.checkVariables.bind(this)();
};

// ##########################
// #### Instance Presets ####
// ##########################
instance.prototype.init_presets = function () {
	this.setPresetDefinitions(presets.setPresets.bind(this)());
};

instance.prototype.sendCommand = function(cmd, arg1 = null, arg2 = null) {
	let self = this;

	debug('Sending:');
	debug(cmd);

	if (self.socket !== undefined) {
		if (self.config.verbose) {
			self.log('info', 'Sending: ' + cmd);
		}

		if (arg1 !== null) {
			if (arg2 !== null) {
				self.socket.emit(cmd, arg1, arg2);
			}
			else {
				self.socket.emit(cmd, arg1);
			}
		}
		else {
			self.socket.emit(cmd);
		}
	}
	else {
		debug('Unable to send: Not connected to spotify-controller.');

		if (self.config.verbose) {
			self.log('warn', 'Unable to send: Not connected to spotify-controller.');
		}
	}
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;