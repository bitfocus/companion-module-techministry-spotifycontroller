const { Regex } = require('@companion-module/base')

module.exports = {
	getConfigFields() {
		return [
			{
				type: 'static-text',
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
				`,
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Mac IP Address',
				width: 3,
				default: '127.0.0.1',
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Port',
				width: 3,
				default: 8801,
				regex: Regex.Port,
			},
			{
				type: 'static-text',
				id: 'dummy1',
				width: 12,
				label: ' ',
				value: ' ',
			},
			{
				type: 'static-text',
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
				`,
			},
			{
				type: 'checkbox',
				id: 'polling',
				label: 'Enable Polling (experimental)',
				default: false,
				width: 3,
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
				type: 'static-text',
				id: 'dummy1',
				width: 12,
				label: ' ',
				value: ' ',
			},
			{
				type: 'static-text',
				id: 'info3',
				label: 'Verbose Logging',
				width: 12,
				value: `
					<div class="alert alert-info">
						Enabling this option will put more detail in the log, which can be useful for troubleshooting purposes.
					</div>
				`,
			},
			{
				type: 'checkbox',
				id: 'verbose',
				label: 'Enable Verbose Logging',
				default: false,
			},
		]
	},
}
