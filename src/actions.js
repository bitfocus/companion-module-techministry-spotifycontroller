module.exports = {
	// ##########################
	// #### Instance Actions ####
	// ##########################
	setActions: function () {
		let self = this;
		let actions = {};

		actions.play = {
			label: 'Play',
			callback: function(action, bank) {
				self.sendCommand('play');
			}
		};

		actions.pause = {
			label: 'Pause',
			callback: function(action, bank) {
				self.sendCommand('pause');
			}
		};

		actions.playToggle = {
			label: 'Play/Pause Toggle',
			callback: function(action, bank) {
				self.sendCommand('playToggle');
			}
		};

		actions.playTrack = {
			label: 'Play Track By ID',
			options: [
				{
					type: 'textinput',
					id: 'track',
					label: 'Track ID',
					default: 'spotify:track:'

				}
			],
			callback: function(action, bank) {
				self.sendCommand('playTrack', track);
			}
		};

		actions.playTrackInContext = {
			label: 'Play Track In Context By ID',
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
			callback: function(action, bank) {
				self.sendCommand('playTrackInContext', track, context);
			}
		};

		actions.next = {
			label: 'Next Track',
			callback: function(action, bank) {
				self.sendCommand('next');
			}
		};

		actions.previous = {
			label: 'Previous Track',
			callback: function(action, bank) {
				self.sendCommand('previous');
			}
		};

		actions.volumeUp = {
			label: 'Volume Up',
			callback: function(action, bank) {
				self.sendCommand('volumeUp');
			}
		};

		actions.volumeDown = {
			label: 'Volume Down',
			callback: function(action, bank) {
				self.sendCommand('volumeDown');
			}
		};

		actions.setVolume = {
			label: 'Set Volume',
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
			callback: function(action, bank) {
				self.sendCommand('setVolume', volume);
			}
		};

		actions.mute = {
			label: 'Volume Mute',
			callback: function(action, bank) {
				self.sendCommand('mute');
			}
		};

		actions.unmute = {
			label: 'Volume Unmute',
			callback: function(action, bank) {
				self.sendCommand('unmute');
			}
		};

		actions.repeatOn = {
			label: 'Repeat On',
			callback: function(action, bank) {
				self.sendCommand('repeatOn');
			}
		};

		actions.repeatOff = {
			label: 'Repeat Off',
			callback: function(action, bank) {
				self.sendCommand('repeatOff');
			}
		};

		actions.shuffleOn = {
			label: 'Shuffle On',
			callback: function(action, bank) {
				self.sendCommand('shuffleOn');
			}
		};

		actions.shuffleOff = {
			label: 'Shuffle Off',
			callback: function(action, bank) {
				self.sendCommand('shuffleOff');
			}
		};

		return actions
	}
}