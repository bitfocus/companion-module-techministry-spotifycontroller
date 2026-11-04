const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const path = require('node:path')
const { createRequire } = require('node:module')
const { Server } = require('socket.io')

const root = process.env.MODULE_SOURCE || path.resolve(__dirname, '..')
const sourceRequire = createRequire(path.join(root, 'index.js'))
const sdk = sourceRequire('@companion-module/base')
let ModuleInstance
class HostBoundary {
	log() {}
	updateStatus(status) {
		this.status = status
	}
	checkFeedbacks() {}
	setActionDefinitions(actions) {
		this.actions = actions
	}
	setFeedbackDefinitions(feedbacks) {
		this.feedbacks = feedbacks
	}
	setVariableDefinitions() {}
	setPresetDefinitions() {}
	setVariableValues(values) {
		this.values = values
	}
	async parseVariablesInString(value) {
		return value.replace('$(test:track)', 'spotify:track:123')
	}
}
vm.runInNewContext(fs.readFileSync(path.join(root, 'index.js'), 'utf8'), {
	require: (id) =>
		id === '@companion-module/base'
			? {
					...sdk,
					InstanceBase: HostBoundary,
					runEntrypoint: (instance) => {
						ModuleInstance = instance
					},
				}
			: sourceRequire(id),
	setInterval,
	clearInterval,
})
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
async function until(predicate) {
	for (let i = 0; i < 200; i++) {
		if (predicate()) return
		await delay(10)
	}
	assert.fail('Timed out waiting for protocol event')
}

test('real Socket.IO transport, actions, state feedbacks, polling and reconnect', async (t) => {
	const server = new Server(0, { serveClient: false })
	const received = []
	let peer
	server.on('connection', (socket) => {
		peer = socket
		socket.onAny((...args) => received.push(args))
		socket.on('version', () => socket.emit('version', 'test-controller'))
	})
	const instance = new ModuleInstance()
	t.after(async () => {
		instance.socket?.disconnect()
		await instance.destroy()
		await new Promise((resolve) => server.close(resolve))
	})
	await instance.init({
		host: '127.0.0.1',
		port: server.httpServer.address().port,
		polling: true,
		pollingrate: 30,
	})
	await until(
		() => instance.values.version === 'test-controller' && received.filter(([cmd]) => cmd === 'state').length >= 2,
	)
	for (const cmd of [
		'play',
		'pause',
		'playToggle',
		'next',
		'previous',
		'volumeUp',
		'volumeDown',
		'mute',
		'unmute',
		'repeatOn',
		'repeatOff',
		'shuffleOn',
		'shuffleOff',
	]) {
		await instance.actions[cmd].callback({ options: {} })
		await until(() => received.some((args) => args.length === 1 && args[0] === cmd))
	}
	for (const [action, options, expected] of [
		['playTrack', { track: '$(test:track)' }, ['playtrack', 'spotify:track:123']],
		[
			'playTrackInContext',
			{ track: '$(test:track)', context: 'spotify:album:456' },
			['playtrackincontext', 'spotify:track:123', 'spotify:album:456'],
		],
		['setVolume', { volume: 0 }, ['setVolume', 0]],
		['movePlayerPosition', { seconds: -10 }, ['movePlayerPosition', -10]],
		['setPlayerPosition', { seconds: 0 }, ['setPlayerPosition', 0]],
		['rampVolume', { volume: '50', changePercent: '5', rampTime: '10' }, ['rampVolume', 50, 5, 10]],
	]) {
		await instance.actions[action].callback({ options })
		await until(() => received.some((args) => JSON.stringify(args) === JSON.stringify(expected)))
	}
	peer.emit('state_change', {
		playbackInfo: {
			name: 'Song',
			artist: 'Artist',
			album: 'Album',
			duration: 125000,
			playbackPosition: 65,
			trackId: '123',
			playerState: 'Playing',
		},
		state: { volume: 42, isShuffling: true, isRepeating: false },
	})
	peer.emit('ramping_state', true)
	peer.emit('control_status', false)
	await until(() => instance.values.name === 'Song' && instance.values.control_status === 'False')
	assert.equal(instance.values.duration_hms, '00:02:05')
	assert.equal(instance.values.position_hms, '00:01:05')
	assert.equal(instance.values.rampingState, 'Currently Ramping')
	assert.equal(
		await instance.feedbacks.playbackState.callback({
			options: { state: 'Playing' },
		}),
		true,
	)
	assert.equal(await instance.feedbacks.shuffling.callback({ options: { state: true } }), true)
	assert.equal(await instance.feedbacks.repeating.callback({ options: { state: true } }), false)
	const polling = instance.getConfigFields().find((field) => field.id === 'pollingrate')
	assert.equal(polling.isVisible({ polling: true }), true)
	assert.equal(polling.isVisible({ polling: false }), false)
	peer.conn.close()
	await until(() => instance.POLLING_INTERVAL === null)
	await until(() => instance.socket.connected && instance.POLLING_INTERVAL !== null)
	peer.emit('control_status', true)
	await until(() => instance.values.control_status === 'True')
})
