// Renderer.js - Handles all the rendering calls for the game
// Bamimoth Productions


class Renderer {
	constructor(game) {
		this.game = game;
		this.camera = this.game.camera;

		this.gl = this.game.canvas.getContext("webgl", {
			alpha: true,
			depth: true,
			stencil: false,
			antialias: true,
			premultipliedAlpha: true,
			preserveDrawingBuffer: false,
			powerPreference: "default",
			failIfMajorPerformanceCaveat: false,
			desynchronized: false,
		});

		if (!this.gl) console.log("WebGL is not supported by this browser!");

		this.viewport = new Rectangle(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	}


	// Initialize the webgl renderer
	initialize() {
		const shaders = this.game.resources.shaders;

		// Initialize the shaders
		this.terrainVertexShader = new Shader(this.gl, shaders.terrainVertexShader, shaders.terrainFragmentShader);
		this.terrainVertexShader.registerAttributes({"a_position": 3, "a_normal": 3});
		this.terrainVertexShader.registerUniforms({"u_camera": "m4", "u_lightDirection": 3});
		
		this.waterVertexShader = new Shader(this.gl, shaders.waterVertexShader, shaders.waterFragmentShader);
		this.waterVertexShader.registerAttributes({"a_position": 3});
		this.waterVertexShader.registerUniforms({"u_camera": "m4", "u_lightDirection": 3, "u_period": 1});
		
		this.terrainDetailVertexShader = new Shader(this.gl, shaders.meshVertexShader, shaders.meshFragmentShader);
		this.terrainDetailVertexShader.registerAttributes({"a_position": 3, "a_color": 3, "a_normal": 3});
		this.terrainDetailVertexShader.registerUniforms({"u_camera": "m4", "u_lightDirection": 3});
		this.hasBufferedWorld = false;

		this.entityVertexShader = new Shader(this.gl, shaders.meshVertexShader, shaders.meshFragmentShader);
		this.entityVertexShader.registerAttributes({"a_position": 3, "a_color": 3, "a_normal": 3});
		this.entityVertexShader.registerUniforms({"u_camera": "m4", "u_lightDirection": 3});

		this.backgroundShader = new Shader(this.gl, shaders.imageVertexShader, shaders.imageFragmentShader);
		this.backgroundShader.registerAttributes({"a_vertex": 2, "a_textureCoordinate": 2});
		this.backgroundShader.registerUniforms({"u_resolution": 2});
		this.backgroundShader.addTexture(this.game.resources.images["background"]);

		// Enable blending
		const gl = this.gl;
		gl.enable(gl.BLEND);
		gl.enable(gl.CULL_FACE);
		gl.enable(gl.DEPTH_TEST);
		
		gl.cullFace(gl.BACK);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		// Clear the screen
		gl.clearColor(0.0, 0.0, 0.0, 0.0);
	}


	// Buffer the shaders
	buffer() {
		this.bufferBackground();
		this.bufferWorld();
		this.bufferEntities();
	}


	// Buffer the images
	bufferBackground() {
		const vertices = [];
		const textureCoordinates = [];

		BufferHelper.addImage(vertices, textureCoordinates, 0.5 * this.viewport.width, 0.5 * this.viewport.height, this.viewport.width, this.viewport.height, 0, 0, 1280, 720, this.game.resources.images["background"]);
	
		this.backgroundShader.buffer({"a_vertex": vertices, "a_textureCoordinate": textureCoordinates});
	}


	// Buffer meshes to the vertex shader
	bufferWorld() {
		if (this.hasBufferedWorld) return;

		const world = this.game.world;

		const worldVertexBuffer = [];
		const worldNormalBuffer = [];

		// Add the faces of the terrain mesh
		for (let faceIndex = 0; faceIndex < world.terrainMesh.getFaceCount(); faceIndex++) {
			const vertices = world.terrainMesh.getVerticesOfFace(faceIndex);
			BufferHelper.addPolygon(worldVertexBuffer, vertices, [], [], worldNormalBuffer);
		}		

		// Add the faces of the water mesh
		const waterVertexBuffer = [];

		for (let faceIndex = 0; faceIndex < world.waterMesh.getFaceCount(); faceIndex++) {
			const vertices = world.waterMesh.getVerticesOfFace(faceIndex);
			BufferHelper.addPolygon(waterVertexBuffer, vertices);
		}

		// Add the faces of the terrain detail meshes
		const terrainDetailVertexBuffer = [];
		const terrainDetailColorBuffer = [];
		const terrainDetailNormalBuffer = [];

		for (let detail of world.details) {
			const mesh = detail.mesh;

			const [theta, phi] = detail.pos.polarAngles();

			const meshOffset = new Vector(WORLD_RADIUS, 0.0, 0.0);
			const meshRotation = new Vector(detail.angle, phi, theta);

			for (let faceIndex = 0; faceIndex < mesh.getFaceCount(); faceIndex++) {
				const vertices = mesh.getVerticesOfFace(faceIndex);
				BufferHelper.addPolygon(terrainDetailVertexBuffer, vertices, terrainDetailColorBuffer, detail.color, terrainDetailNormalBuffer, meshOffset, meshRotation, detail.scale);
			}
		}

		// Buffer the vertices
		this.terrainVertexShader.buffer({"a_position": worldVertexBuffer, "a_normal": worldNormalBuffer});
		this.terrainDetailVertexShader.buffer({"a_position": terrainDetailVertexBuffer, "a_color": terrainDetailColorBuffer, "a_normal": terrainDetailNormalBuffer});
		this.waterVertexShader.buffer({"a_position": waterVertexBuffer});

		this.hasBufferedWorld = true;
	}


	// Buffer entities to the vertex shader
	bufferEntities() {
		const vertexBuffer = [];
		const colorBuffer = [];
		const normalBuffer = [];

		const offsetBuffer = [];
		const rotationBuffer = [];
		const scaleBuffer = [];

		for (let entity of this.game.entities) {
			const mesh = entity.mesh;

			const [theta, phi] = entity.pos.polarAngles();

			const meshOffset = new Vector(WORLD_RADIUS, 0.0, 0.0);
			const meshRotation = new Vector(entity.angle, phi, theta);

			for (let faceIndex = 0; faceIndex < mesh.getFaceCount(); faceIndex++) {
				const vertices = mesh.getVerticesOfFace(faceIndex);
				// BufferHelper.addPolygon(vertexBuffer, vertices, colorBuffer, entity.color, normalBuffer, offsetBuffer, meshOffset, rotationBuffer, meshRotation, scaleBuffer, entity.scale);
				BufferHelper.addPolygon(vertexBuffer, vertices, colorBuffer, entity.color, normalBuffer, meshOffset, meshRotation, entity.scale);
			}
		}

		this.entityVertexShader.buffer({"a_position": vertexBuffer, "a_color": colorBuffer, "a_normal": normalBuffer}); 
	}


	// Clear the viewport
	clear() {
		this.gl.viewport(0, 0, this.viewport.width, this.viewport.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}


	// Draw
	render(dt) {
		this.clear();

		this.buffer();

		const cameraProject = this.camera.project();
		const lightDirection = this.camera.lightDirection();		
		
		// Background shader
		this.backgroundShader.setUniforms({"u_resolution": [this.viewport.width, this.viewport.height]});
		this.backgroundShader.render();

		// Terrain shader
		this.terrainVertexShader.setUniforms({"u_camera": cameraProject, "u_lightDirection": lightDirection});
		this.terrainVertexShader.render();

		// Terrain detail shader
		this.terrainDetailVertexShader.setUniforms({"u_camera": cameraProject, "u_lightDirection": lightDirection});
		this.terrainDetailVertexShader.render();

		// Water shader
		const period = (game.tick % WATER_WAVE_PERIOD) / WATER_WAVE_PERIOD;
		this.waterVertexShader.setUniforms({"u_camera": cameraProject, "u_lightDirection": lightDirection, "u_period": period})
		this.waterVertexShader.render();

		// Entity shader
		this.entityVertexShader.setUniforms({"u_camera": cameraProject, "u_lightDirection": lightDirection});
		this.entityVertexShader.render();
	}
}
