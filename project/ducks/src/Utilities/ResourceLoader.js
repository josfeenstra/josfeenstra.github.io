class ResourceLoader {
	constructor(callbackOnLoaded) {
		this.shaders = {};
		this.shaderCount = 0;
		this.shadersLoaded = 0;
		this.shadersAreLoaded = false;

		this.images = {};
		this.imageCount = 0;
		this.imagesLoaded = 0;
		this.imagesAreLoaded = false;

		this.audio = {};
		this.audioCount = 0;
		this.audioLoaded = 0;
		this.audioIsLoaded = true;

		this.models = {};
		this.modelsCount = 0;
		this.modelsLoaded = 0;
		this.modelsAreLoaded = false;

		this.callbackOnLoaded = callbackOnLoaded;

		this.loadShaders();
		this.loadImages();
		this.loadAudio();
		this.loadModels();
	}


	loadShaders() {
		let promises = [];
		let loader = this;

		this.readJSON("resources/JSON/shaders.json", (response) => {
			let shaderPaths = JSON.parse(response);

			Object.entries(shaderPaths).forEach(([key, path]) => {
				loader.shaderCount++;
			});

			Object.entries(shaderPaths).forEach(([key, path]) => {
				promises.push(new Promise((resolve) => {
					let shaderPath = `resources/shaders/${path}`
					let shader = $.get(shaderPath, null, () => {
						loader.shaders[key] = shader.responseText;
						loader.shadersLoaded++;

						if (loader.shaderCount == loader.shadersLoaded) {
							loader.shadersAreLoaded = true;

							if(loader.imagesAreLoaded && loader.audioIsLoaded && loader.shadersAreLoaded && loader.modelsAreLoaded) loader.callbackOnLoaded();
						}
						resolve();
					});
				}));
			});
		});
	}


	loadImages() {
		let promises = [];
		let loader = this;

		this.readJSON("resources/JSON/images.json", (response) => {
			let imagePaths = JSON.parse(response);

			Object.entries(imagePaths).forEach(([key, path]) => {
				loader.imageCount++;
			});

			Object.entries(imagePaths).forEach(([key, path]) => {
				promises.push(new Promise((resolve) => {
					let img = new Image();

					img.onload = () => {
						loader.images[key] = img;
						loader.imagesLoaded++;

						if(loader.imageCount == loader.imagesLoaded) {
							loader.imagesAreLoaded = true;

							if(loader.imagesAreLoaded && loader.audioIsLoaded && loader.shadersAreLoaded && loader.modelsAreLoaded) loader.callbackOnLoaded();
						}
						resolve();
					}

					img.src = `resources/${path}`;
				}));
			});
		});
	}


	loadAudio() {
		let promises = [];
		let loader = this;

		this.readJSON("resources/JSON/audio.json", (response) => {
			let audioPaths = JSON.parse(response);

			Object.entries(audioPaths).forEach(([key, path]) => {
				loader.audioCount++;
			});

			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			this.audioContext = new AudioContext();

			this.audioPaths = audioPaths;

			audioPaths = Object.values(audioPaths).map(path => `resources/audio/${path}`);

			this.bufferLoader = new BufferLoader(
				this.audioContext,
				audioPaths,
				this.finishedLoadingAudio,
			);

			this.bufferLoader.load();
		});
	}

	async loadModels() {
		let promises = [];
		let loader = this;

		let res = await fetch("resources/JSON/models.json");
		let modelPaths = await res.json();


		for (let [key, path] of Object.entries(modelPaths)) {
			loader.modelsCount++;
		}

		for (let [key, path] of Object.entries(modelPaths)) {		
			let res = await fetch(`resources/models/${path}`);
			let objText = await res.text();
			
			// parse the model
			// let model = 0;
			let model = ObjParsing.parse(objText);
			
			// for now, a model is the same as a mesh
			// a model could be a mesh + materials
			loader.models[key] = model;

			// do some final stuff 
			loader.modelsLoaded++;
			if (loader.modelsCount == loader.modelsLoaded) {
			 	loader.modelsAreLoaded = true;
				if (loader.imagesAreLoaded && loader.audioIsLoaded && loader.shadersAreLoaded && loader.modelsAreLoaded) {
					loader.callbackOnLoaded();
				}
			}
		}
		console.log("done!");
	}


	// callback when the buffer loading is done
	// uses no this. references as this won't work
	finishedLoadingAudio(bufferList) {
		let loader = this;

		for (let index in bufferList) {
			game.resources.audio[Object.keys(game.resources.audioPaths)[index]] = bufferList[index];
		}
		game.resources.audioIsLoaded = true;
		if(loader.imagesAreLoaded && loader.audioIsLoaded && loader.shadersAreLoaded) loader.callbackOnLoaded();
	}


	readJSON(file, callback) {
		let rawFile = new XMLHttpRequest();
		rawFile.overrideMimeType("application/json");

		rawFile.onreadystatechange = function() {
			if (rawFile.readyState == 4 && rawFile.status == "200") {
				callback(rawFile.responseText);
			}
		}

		rawFile.open("GET", file, true);
		rawFile.send(null);
	}

	/**
	 *
	 * @param {HTMLImageElement} image
	 * @returns {ImageData}
	 */
	readImageData(image) {

		// turn it into image data by building a complete canvas and sampling it
		let canvas = document.createElement("canvas");
		canvas.width = image.width;
		canvas.height = image.height;
		let ctx = canvas.getContext("2d");
		ctx.drawImage(image, 0, 0);
		let data = ctx.getImageData(0, 0, image.width, image.height);
		canvas.parentNode?.removeChild(canvas);
		return data;
	}
}
