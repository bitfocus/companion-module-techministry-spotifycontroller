module.exports = {
	// ##########################
	// #### Instance Actions ####
	// ##########################
	initActions: function () {
		let self = this;
		let actions = {};

		actions.play = {
			name: 'Play',
			options: [],
			callback: async (event) => {
				self.sendCommand('play');
			}
		};

		actions.pause = {
			name: 'Pause',
			options: [],
			callback: async (event) => {
				self.sendCommand('pause');
			}
		};

		actions.playToggle = {
			name: 'Play/Pause Toggle',
			options: [],
			callback: async (event) => {
				self.sendCommand('playToggle');
			}
		};

		actions.movePlayerPosition = {
			name: 'Move Player Position',
			options:
			[
				{
					type: 'number',
					label: 'Seconds',
					id: 'seconds',
					tooltip: 'Number of seconds to move forward or backward (use negative number)',
					default: 10,
					required: true,
					range: false
				}
			],
			callback: async (event) => {
				self.sendCommand('movePlayerPosition', action.options.seconds);
			}
		};

		actions.setPlayerPosition = {
			name: 'Set Player Position',
			options:
			[
				{
					type: 'number',
					label: 'Seconds',
					id: 'seconds',
					tooltip: 'Set Player Position to this position (in seconds)',
					default: 10,
					required: true,
					range: false
				}
			],
			callback: async (event) => {
				self.sendCommand('setPlayerPosition', action.options.seconds);
			}
		};

		actions.playTrack = {
			name: 'Play Track By ID',
			options: [
				{
					type: 'textinput',
					id: 'track',
					label: 'Track ID',
					default: 'spotify:track:'

				}
			],
			callback: async (event) => {
				let track = action.options.track;
				self.sendCommand('playtrack', track);
			}
		};

		actions.playTrackInContext = {
			name: 'Play Track In Context By ID',
			options: [
				{
					type: 'textinput',
					id: 'track',
					label: 'Track ID',
					default: 'spotify:track:'

				},
				{
					type: 'textinput',
					id: 'context',
					label: 'Context ID',
					default: 'spotify:album:'

				}
			],
			callback: async (event) => {
				let track = action.options.track;
				let context = action.options.context;
				self.sendCommand('playtrackincontext', track, context);
			}
		};

		actions.next = {
			name: 'Next Track',
			options: [],
			callback: async (event) => {
				self.sendCommand('next');
			}
		};

		actions.previous = {
			name: 'Previous Track',
			options: [],
			callback: async (event) => {
				self.sendCommand('previous');
			}
		};

		actions.volumeUp = {
			name: 'Volume Up',
			options: [],
			callback: async (event) => {
				self.sendCommand('volumeUp');
			}
		};

		actions.volumeDown = {
			name: 'Volume Down',
			options: [],
			callback: async (event) => {
				self.sendCommand('volumeDown');
			}
		};

		actions.setVolume = {
			name: 'Set Volume',
			options: [
				{
					type: 'number',
					label: 'Volume',
					id: 'volume',
					tooltip: 'Sets the volume level by percent (0-100)',
					min: 0,
					max: 100,
					default: 50,
					step: 1,
					required: true,
					range: false
				}
			],
			callback: async (event) => {
				let volume = action.options.volume;
				self.sendCommand('setVolume', volume);
			}
		};

		actions.rampVolume = {
			name: 'Ramp Volume',
			options: [
				{
					type: 'number',
					label: 'Volume',
					id: 'volume',
					tooltip: 'Ramp the volume level to this percent (0-100)',
					min: 0,
					max: 100,
					default: 50,
					step: 1,
					required: true,
					range: false
				},
			],
			callback: async (event) => {
				let volume = action.options.volume;
				self.sendCommand('rampVolume', volume);
			}
		};

		actions.mute = {
			name: 'Volume Mute',
			options: [],
			callback: async (event) => {
				self.sendCommand('mute');
			}
		};

		actions.unmute = {
			name: 'Volume Unmute',
			options: [],
			callback: async (event) => {
				self.sendCommand('unmute');
			}
		};

		actions.repeatOn = {
			name: 'Repeat On',
			options: [],
			callback: async (event) => {
				self.sendCommand('repeatOn');
			}
		};

		actions.repeatOff = {
			name: 'Repeat Off',
			options: [],
			callback: async (event) => {
				self.sendCommand('repeatOff');
			}
		};

		actions.shuffleOn = {
			name: 'Shuffle On',
			options: [],
			callback: async (event) => {
				self.sendCommand('shuffleOn');
			}
		};

		actions.shuffleOff = {
			name: 'Shuffle Off',
			options: [],
			callback: async (event) => {
				self.sendCommand('shuffleOff');
			}
		};

		this.setActionDefinitions(actions);
	}
}