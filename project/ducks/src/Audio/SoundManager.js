// SoundManager.js - Manages all the sounds and music the game has to offer

class SoundManager {
	constructor(game) {
		this.game = game;

		this.audio = null;

		this.soundscape = [];

		this.muted = false;
	}


	initialize() {
		this.audio = this.game.resources.audio;
	}


	clear() {
		this.soundscape.filter(e => e.name !== 'ocean').forEach(s => this.stopSound(s));

		this.soundscape = this.soundscape.filter(e => e.name === 'ocean');
	}


	update(dt) {
		let middlePos = new Vector();

		if (this.muted) {
			for (let sound of this.soundscape) {
				sound.setVolume(0.0);
			}
		} else {
			for (let sound of this.soundscape) {
				sound.setVolume(0.3);
			}
		}
	}

	// Adds the requested sound to the soundscape
	playSound(name, pos, loop = false) {
		let sound = new Sound(this.game, name, pos, loop);
		sound.play();
		this.soundscape.push(sound);

		// return a reference to this sound
		return sound;
	}

	// Removes the requested sound from the soundscape
	stopSound(sound) {
		if (!sound) return;

		sound.stop();

		// remove the sound
		let index = this.soundscape.indexOf(sound);
		if (index === -1) return;

		this.soundscape.splice(index, 1);
	}

	mute() {
		this.muted = true;
		this.update(0);
	}

	unmute() {
		this.muted = false;
		this.update(0);
	}
}


class Sound {
	constructor(game, name, pos, loop) {
		this.name = name;
		this.pos = pos;

		// get the audio buffer and audio context
		this.buffer = game.resources.audio[name];
		this.ctx = game.resources.audioContext;

		this.source = this.ctx.createBufferSource();
		this.gainNode = this.ctx.createGain();
		this.panNode = this.ctx.createStereoPanner();
		this.source.buffer = game.resources.audio[name];
		this.source.loop = loop;
		this.source.startedAt = this.ctx.currentTime;

		if (!loop) {
			this.source.addEventListener('ended', () => {
				// remove from soundscape
				game.soundManager.stopSound(this);
			});
		}

		this.gainNode.gain.setValueAtTime(AUDIO_VOLUME, this.ctx.currentTime);
		this.source.connect(this.gainNode);
		this.gainNode.connect(this.panNode);
		this.panNode.connect(this.ctx.destination);
	}

	setVolume(volume) {
		let clampedVolume = Math.min(Math.max(AUDIO_VOLUME * volume, 0.0), 1.0);
		this.gainNode.gain.setValueAtTime(clampedVolume, this.ctx.currentTime);
	}

	setPan(pan) {
		let clampedPan = Math.min(Math.max(pan, -1.0), 1.0);
		this.panNode.pan.setValueAtTime(clampedPan, this.ctx.currentTime);
	}

	play() {
		this.source.start(0, this.ctx.baseLatency);
	}

	stop() {
		this.source.disconnect();
		this.source.stop();
	}
}
