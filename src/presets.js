module.exports = {
	setPresets: function () {
		let self = this;
		let presets = [];

		const foregroundColor = self.rgb(255, 255, 255) // White
		const foregroundColorBlack = self.rgb(0, 0, 0) // Black
		const backgroundColorRed = self.rgb(255, 0, 0) // Red
		const backgroundColorWhite = self.rgb(255, 255, 255) // White

		presets.push({
			category: 'Playback',
			label: 'Play',
			bank: {
					style: 'png',
					text: '',
					png64: self.ICON_PLAY_INACTIVE,
					pngalignment: 'center:center',
					size: '18',
					color: '16777215',
					bgcolor: self.rgb(0, 0, 0),
			},
			actions: [
				{
					action: 'play'
				}
			],
			feedbacks: [
				{
					type: 'playbackState',
					options: {
						state: 'Playing'
					},
					style: {
						color: foregroundColor,
						bgcolor: backgroundColorRed
					}
				}
			]
		});

		presets.push({
			category: 'Playback',
			label: 'Pause',
			bank: {
				style: 'png',
				text: '',
				png64: self.ICON_PAUSE_INACTIVE,
				pngalignment: 'center:center',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 0),
		},
			actions: [
				{
					action: 'pause'
				}
			],
			feedbacks: [
				{
					type: 'playbackState',
					options: {
						state: 'Paused'
					},
					style: {
						color: foregroundColor,
						bgcolor: backgroundColorRed
					}
				}
			]
		});

		presets.push({
			category: 'Playback',
			label: 'Playback Position',
			bank: {
				style: 'text',
				text: '$(spotify-controller:position_hms)',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 0)
			}
		});

		/*presets.push({
			category: 'Playback',
			label: 'Stop',
			bank: {
				style: 'png',
				text: '',
				png64: self.ICON_STOP_INACTIVE,
				pngalignment: 'center:center',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 0),
		},
			actions: [
				{
					action: 'stop'
				}
			],
			feedbacks: [
				{
					type: 'playbackState',
					options: {
						state: 'Stopped'
					},
					style: {
						color: foregroundColor,
						bgcolor: backgroundColorRed
					}
				}
			]
		});

		presets.push({
			category: 'Playback',
			label: 'Toggle',
			bank: {
				style: 'text',
				text: 'TOGGLE',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 0),
			},
			actions: [
				{
					action: 'playToggle'
				}
			]
		});*/

		presets.push({
			category: 'Volume',
			label: 'Volume Up',
			bank: {
				style: 'text',
				text: 'VOL +',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 0),
			},
			actions: [
				{
					action: 'volumeUp'
				}
			]
		});

		presets.push({
			category: 'Volume',
			label: 'Volume Down',
			bank: {
				style: 'text',
				text: 'VOL -',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 0),
			},
			actions: [
				{
					action: 'volumeDown'
				}
			]
		});

		presets.push({
			category: 'Volume',
			label: 'Volume 50%',
			bank: {
				style: 'text',
				text: 'VOL 50%',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 0),
			},
			actions: [
				{
					action: 'setVolume',
					options: {
						volume: 50
					}
				}
			]
		});

		presets.push({
			category: 'Volume',
			label: 'Volume 100%',
			bank: {
				style: 'text',
				text: 'VOL 100%',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 0),
			},
			actions: [
				{
					action: 'setVolume',
					options: {
						volume: 100
					}
				}
			]
		});

		presets.push({
			category: 'Volume',
			label: 'Volume Level',
			bank: {
				style: 'text',
				text: 'VOL:\\n$(spotify-controller:volume)',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 0),
			}
		});

		presets.push({
			category: 'Track',
			label: 'Track Name',
			bank: {
				style: 'text',
				text: 'TRACK:\\n$(spotify-controller:track)',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 0),
			}
		});
	
		return presets;
	}
}
