module.exports = {
	// ##########################
	// #### Define Feedbacks ####
	// ##########################
	setFeedbacks: function () {
		let self = this;
		let feedbacks = {};

		const foregroundColor = self.rgb(255, 255, 255) // White
		const backgroundColorRed = self.rgb(255, 0, 0) // Red
		const backgroundColorGreen = self.rgb(0, 255, 0) // Green
		const backgroundColorOrange = self.rgb(255, 102, 0) // Orange

		feedbacks.playbackState = {
			type: 'boolean',
			label: 'Show Player State On Button',
			description: 'Indicate if Playback is in X Status',
			style: {
				color: foregroundColor,
				bgcolor: backgroundColorRed,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Indicate in X Status',
					id: 'state',
					default: 0,
					choices: [
						{ id: 'Playing', label: 'Playing'},
						{ id: 'Paused', label: 'Paused'},
						{ id: 'Stopped', label: 'Stopped'}
					]
				}
			],
			callback: function (feedback, bank) {
				let opt = feedback.options;

				if (self.STATUS.playbackInfo && self.STATUS.playbackInfo.playerState) {
					if (self.STATUS.playbackInfo.playerState == opt.state) {
						return true;
					}
				}

				return false
			}
		}

		feedbacks.shuffling = {
			type: 'boolean',
			label: 'Show Shuffling State On Button',
			description: 'Indicate if Shuffle is in X Status',
			style: {
				color: foregroundColor,
				bgcolor: backgroundColorRed,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Indicate in X Status',
					id: 'state',
					default: 0,
					choices: [
						{ id: false, label: 'Off'},
						{ id: true, label: 'On'}
					]
				}
			],
			callback: function (feedback, bank) {
				let opt = feedback.options;

				if (self.STATUS.state.isShuffling == opt.state) {
					return true;
				}

				return false
			}
		}

		feedbacks.repeating = {
			type: 'boolean',
			label: 'Show Repeating State On Button',
			description: 'Indicate if Repeat is in X Status',
			style: {
				color: foregroundColor,
				bgcolor: backgroundColorRed,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Indicate in X Status',
					id: 'state',
					default: 0,
					choices: [
						{ id: false, label: 'Off'},
						{ id: true, label: 'On'}
					]
				}
			],
			callback: function (feedback, bank) {
				let opt = feedback.options;

				if (self.STATUS.state.isRepeating == opt.state) {
					return true;
				}

				return false
			}
		}


		return feedbacks
	}
}
