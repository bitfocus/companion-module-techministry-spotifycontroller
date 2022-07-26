function convertHMS(value) {
	const sec = parseInt(value, 10); // convert value to number if it's string
	let hours   = Math.floor(sec / 3600); // get hours
	let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
	let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
	// add 0 if value < 10; Example: 2 => 02
	if (hours   < 10) {hours   = "0"+hours;}
	if (minutes < 10) {minutes = "0"+minutes;}
	if (seconds < 10) {seconds = "0"+seconds;}
	return hours+':'+minutes+':'+seconds; // Return is HH : MM : SS
}

module.exports = {
	// ##########################
	// #### Define Variables ####
	// ##########################
	setVariables: function () {
		let self = this;
		let variables = [];

		variables.push({ name: 'information', 		label: 'Information' });
		variables.push({ name: 'version', 			label: 'spotify-controller Version' });
		variables.push({ name: 'name',	 			label: 'Track Name'});
		variables.push({ name: 'artist', 			label: 'Artist'});
		variables.push({ name: 'album', 			label: 'Album'});
		variables.push({ name: 'duration_hms', 		label: 'Track Duration (HMS)'});
		variables.push({ name: 'position_hms', 		label: 'Playback Position (HMS)'});
		variables.push({ name: 'trackid', 			label: 'Track ID'});
		variables.push({ name: 'player_state',		label: 'Player State'});
		variables.push({ name: 'volume', 			label: 'Current Volume Level'});
		variables.push({ name: 'control_status',	label: 'Control Status'});

		return variables
	},

	// #########################
	// #### Check Variables ####
	// #########################
	checkVariables: function () {
		let self = this;

		try {
			self.setVariable('information', 	self.STATUS.information);
			self.setVariable('version', 		self.STATUS.version);
			self.setVariable('name', 			self.STATUS.playbackInfo.name);
			self.setVariable('artist', 			self.STATUS.playbackInfo.artist);
			self.setVariable('album', 			self.STATUS.playbackInfo.album);

			let duration_seconds = Math.round(self.STATUS.playbackInfo.duration / 1000);
			self.setVariable('duration_hms', 	convertHMS(duration_seconds));

			let position_seconds = Math.round(self.STATUS.playbackInfo.playbackPosition);
			self.setVariable('position_hms', 	convertHMS(position_seconds));

			self.setVariable('trackid', 		self.STATUS.playbackInfo.trackId);
			self.setVariable('player_state',	self.STATUS.playbackInfo.playerState);			
			self.setVariable('volume', 			self.STATUS.state.volume);
			self.setVariable('control_status', 	self.STATUS.controlStatus ? 'Enabled' : 'Disabled');
		}
		catch(error) {
			self.log('error', 'Error setting Variables: ' + String(error));
		}
	}
}