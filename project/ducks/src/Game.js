// Game.js - Overarching game class
// Bamimoth Productions
"use strict";

const GameState = {
	Menu: 0,
	Playing: 1,
	Won: 2,
	Lost: 3,
	Starting: 4,
}

class Game {
	constructor(canvas) {
		this.canvas = canvas;

		this.camera = new Camera(this);
		// prep camera for menu

		this.renderer = new Renderer(this);
		this.inputHandler = new InputHandler(this);

		this.resources = new ResourceLoader(e => {
			//console.log('done loading resources. Initializing...');
			this.initialize();
		});

		this.soundManager = new SoundManager(this);

		this.tick = 0;
		this.oldTimestamp = performance.now();

		this.state = GameState.Menu;

		this.isPaused = false;
		this.isInitialized = false;

		this.music = null;
		this.muting = false;

		// Game logic
		this.world = null;
		this.entities = [];
	}

	initialize() {
		this.seed = Math.round(Math.random() * 256);
		Math.random = mulberry32(this.seed);

		this.isInitialized = true;

		this.addFocusListeners();
		this.initializeControls();
		
		const game = this;
		
		// Initialize game logic
		this.world = new World(this);
		
		this.renderer.initialize();
		
		this.duck = new Duck(this);
		this.entities = [this.duck, new Duckling(this), new Heron(this)];
		this.handleModels();

		this.camera.center();
		this.camera.pos.x = 840;
		this.camera.pos.z = 150;

		requestAnimationFrame(timestamp => {
			this.gameLoop(timestamp);
		});
	}


	restart() {
		// Initialize game logic
		// this.world = new World(this);
		this.duck = new Duck(this);
		this.entities = [this.duck, new Duckling(this), new Heron(this)];

		this.world.generateMeshes();
		this.renderer.hasBufferedWorld = false;

		this.camera.rot.y = Math.PI/2;
		this.camera.pos.x = 840;
		this.camera.pos.z = 150;
		this.camera.center();
		
		this.state = GameState.Menu;
	}


	togglePause() {
        if (this.pauseDelay > 0) return;

        this.isPaused = !this.isPaused;
        this.pauseDelay = 250;
    }


	initializeControls() {
		// Add the key listeners
		this.inputHandler.listenTo('KeyR', () => this.initialize());
        this.inputHandler.listenTo('KeyP', () => this.togglePause());

		this.inputHandler.listenTo("KeyW", function(e) { });
		this.inputHandler.listenTo("KeyS", function(e) { });
		this.inputHandler.listenTo("KeyA", function(e) { });
		this.inputHandler.listenTo("KeyD", function(e) { });

		this.inputHandler.listenTo("KeyLeft", function(e) { });
		this.inputHandler.listenTo("KeyRight", function(e) { });
	}


	addFocusListeners() {
		window.addEventListener('blur', (event) => {
			this.isPaused = true;
			this.soundManager.mute();
		});
		window.addEventListener('focus', (event) => {
			this.isPaused = false;
			this.soundManager.unmute();
		});
	}


	handleModels() {
		// Duck
		let verts = game.resources.models["duck"].verts;
		verts.transformVectors((v)=> {
			v = v.scale(50)
			let store = v.x; 
			v.x = v.y - 2.5;
			v.y = store;
			
			v.z *= -1
			return v;
		});;

		// Duckling
		verts = game.resources.models["duckling"].verts;
		verts.transformVectors((v)=> {
			v = v.scale(50)
			let store = v.x; 
			v.x = v.y - 2.5;
			v.y = store;
			
			v.z *= -1
			return v;
		});

		// Duck
		verts = game.resources.models["heron-body"].verts;
		verts.transformVectors((v)=> {
			v = v.scale(50)
			let store = v.x; 
			v.x = v.y - 2.5;
			v.y = store;
			
			v.z *= -1
			return v;
		});

		// Tree
		verts = game.resources.models["tree"].verts;
		verts.transformVectors((v)=> {
			v = v.scale(12.5)
			let store = v.x; 
			v.x = v.y;
			v.y = store;
			
			v.z *= -1
			return v;
		});

		// Timber
		verts = game.resources.models["timber"].verts;
		verts.transformVectors((v)=> {
			v = v.scale(2.5)
			let store = v.x; 
			v.x = v.y;
			v.y = store;
			
			v.z *= -1
			return v;
		});
	}


	setScore(score) {
		document.getElementById('score').innerText = 'Ducklings: '+score;
	}


	handleControls(dt) {
		if (this.inputHandler.isPressed('KeyA')) this.duck.dir = this.duck.rotateDirectionOnLocalPlane(DUCK_ROTATION_VELOCITY * (dt / 1000));
		if (this.inputHandler.isPressed('KeyD')) this.duck.dir = this.duck.rotateDirectionOnLocalPlane(-DUCK_ROTATION_VELOCITY * (dt / 1000));

		if (this.inputHandler.isPressed('KeyLeft')) this.duck.dir = this.duck.rotateDirectionOnLocalPlane(DUCK_ROTATION_VELOCITY * (dt / 1000));
		if (this.inputHandler.isPressed('KeyRight')) this.duck.dir = this.duck.rotateDirectionOnLocalPlane(-DUCK_ROTATION_VELOCITY * (dt / 1000));
	}


	update(dt) {
		switch (this.state) {
			case GameState.Menu:
				// show start button and text
				document.getElementById('score').hidden = true;
				document.getElementById('controls').hidden = true;
				document.getElementById('controls2').hidden = true;
				document.getElementById('losetitle').hidden = true;
				document.getElementById('losebrief').hidden = true;
				document.getElementById('losebrief2').hidden = true;
				document.getElementById('replay').hidden = true;


				document.getElementById('title').hidden = false;
				document.getElementById('brief').hidden = false;
				document.getElementById('brief2').hidden = false;
				const button = document.getElementById('play');

				button.hidden = false;
				button.onclick = () => {
					document.getElementById('score').hidden = false;
					document.getElementById('controls').hidden = false;
					document.getElementById('controls2').hidden = false;
	
					document.getElementById('title').hidden = true;
					document.getElementById('brief').hidden = true;
					document.getElementById('brief2').hidden = true;
					button.hidden = true;

					this.state = GameState.Starting;
					this.camera.transition(new Vector(640.0, 360.0, -300.0), 1000);
				}
				
				break;
			case GameState.Starting:
				// transition the camera
				this.camera.update(dt);

				if (this.camera.pos.x == 640 && this.camera.pos.z == -300) this.state = GameState.Playing;
				break;
			default:
			case GameState.Playing:
				this.camera.center();
				this.setScore(this.duck.followers.length);
				this.handleControls(dt);
				for (let entity of this.entities) entity.update(dt);
				break;
			case GameState.Lost:
				document.getElementById('score').hidden = true;
				document.getElementById('controls').hidden = true;
				document.getElementById('controls2').hidden = true;

				document.getElementById('losetitle').hidden = false;
				document.getElementById('losebrief').hidden = false;
				document.getElementById('losebrief2').hidden = false;
				document.getElementById('replay').hidden = false;
				document.getElementById('replay').onclick = () => { 
					this.restart();
				}

				this.camera.update(dt);
				break;
			case GameState.Won:
				break;
		}
	}


	render(dt) {
		this.renderer.render(dt);

		this.renderHeightMap();
	}


	gameLoop(timestamp) {
		let dt = timestamp - this.oldTimestamp;
		this.oldTimestamp = timestamp;

		if (!this.isPaused) {
			this.update(dt);
			this.render(dt);
		}

		this.tick += dt;

		requestAnimationFrame(timestamp => {
			this.gameLoop(timestamp);
		});
	}


	// TEMPORARY
	renderHeightMap() {
		const canvas = document.getElementById('heightMapCanvas');
		const ctx = canvas.getContext('2d');

		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect(0, 0, 1024, 512);

		ctx.putImageData(this.world.heightMap, 0, 0);

		// Determine position on polar map
		let [theta, phi] = this.duck.pos.polarAngles();
		phi = phi + Math.PI;
        const mapPos = new Vector(phi * this.world.heightMap.width / (2 * Math.PI), (theta + Math.PI / 2) * this.world.heightMap.height / Math.PI).floor();

		ctx.fillStyle = '#FF0000';
		ctx.fillRect(mapPos.x - 2, mapPos.y - 2, 4, 4);
	}
}
