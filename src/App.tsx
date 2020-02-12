import React from "react";
import * as THREE from "three";
import * as Matter from "matter-js";

import hearts from "./Hearts.png";
import spades from "./Spades.png";
import clubs from "./Clubs.png";
import diamonds from "./Diamonds.png";

class App extends React.Component {
	private canvasContainerRef: HTMLElement | null = null;
	private canvasAnimationFrame: number | null = null;
	private lastTime: number = 0;

	componentDidMount() {
		window.addEventListener("resize", () => {
			this.forceUpdate();
		});
	}

	componentWillUnmount() {
		if (this.canvasAnimationFrame) {
			window.cancelAnimationFrame(this.canvasAnimationFrame);
		}
	}

	render() {
		return (
			<div
				ref={this.setCanvasContainerRef}
			>
				
			</div>
		)
	}

	setCanvasContainerRef = (ref: HTMLElement | null) => {
		this.canvasContainerRef = ref;

		if(this.canvasContainerRef) {
			this.lastTime = performance.now();
			this.canvasInit();
			this.canvasLoop();
		}
	}

	private camera: THREE.PerspectiveCamera;
	private scene: THREE.Scene;
	private renderer: THREE.Renderer;
	private textureLoader: THREE.TextureLoader;

	private particles: Array<Particle> = new Array<Particle>();
	private particleBody?: Matter.Body;

	private matterEngine?: Matter.Engine;
	private matterRender?: Matter.Render;
	private matterWorld?: Matter.World;
	private matterBodies?: Matter.Bodies;

	constructor(props: any) {
		super(props);

		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 100 );
		this.camera.position.z = 100;
	 
		this.scene = new THREE.Scene();

		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true
		});
		this.renderer.setSize( window.innerWidth, window.innerHeight );

		this.textureLoader = new THREE.TextureLoader();
	}

	canvasInit = () => {
		this.canvasContainerRef?.appendChild( this.renderer.domElement );

		// Matterjs
		this.matterEngine = Matter.Engine.create({
			positionIterations: 20,
			velocityIterations: 20,
			constraintIterations: 20,
		});
		this.matterRender = Matter.Render.create({
			element: this.canvasContainerRef as HTMLElement,
			engine: this.matterEngine
		});

		this.particles.push(new Particle(this.scene, this.textureLoader));
		this.particleBody = Matter.Bodies.rectangle(0, 0, 1, 1);

		Matter.World.add(this.matterEngine.world, [
			this.particleBody,
			Matter.Bodies.rectangle(0, 20, 1, 1, { isStatic: true })
		]);
		Matter.Engine.run(this.matterEngine);
		Matter.Render.run(this.matterRender);
	}

	canvasLoop = () => {
		if(this.particleBody?.position) {
			this.particles[0].setPosition(this.particleBody.position.x, this.particleBody.position.y);
		}
		
		this.renderer.render( this.scene, this.camera );

		this.canvasAnimationFrame = window.requestAnimationFrame(this.canvasLoop);
	}
}

class Particle {
	private geometry: THREE.Geometry;
	private material: THREE.Material;
	private mesh: THREE.Mesh;

	private scene: THREE.Scene;
	private textureLoader: THREE.TextureLoader;

	constructor(scene: THREE.Scene, textureLoader: THREE.TextureLoader) {
		this.textureLoader = textureLoader;
		this.scene = scene;

		this.geometry = new THREE.PlaneGeometry(1, 1);
		this.material = new THREE.MeshBasicMaterial({
			color: 'white'
		});
		this.mesh = new THREE.Mesh( this.geometry, this.material );

		this.textureLoader.load(hearts, (texture: THREE.Texture) => {
			this.geometry = new THREE.PlaneGeometry(1, 1);
			this.material = new THREE.MeshBasicMaterial({
				map: texture,
				color: 'white'
			});
		 
			this.mesh = new THREE.Mesh( this.geometry, this.material );
			this.scene.add( this.mesh );
		});
	}

	setPosition = (x: number, y: number) => {
		this.mesh.position.x = x;
		this.mesh.position.y = y;
	}

	addPosition = (x: number, y: number) => {
		this.mesh.position.x += x;
		this.mesh.position.y += y;
	}

	getPosition = (): THREE.Vector3 => {
		return this.mesh.position;
	}
}

export default App;
