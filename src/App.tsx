import React from "react";
import * as THREE from "three";

import hearts from "./Hearts.svg";
import spades from "./Spades.svg";
import clubs from "./Clubs.svg";
import diamonds from "./Diamonds.svg";

import font from "./font.json";

class App extends React.Component {
	private canvasContainerRef: HTMLDivElement | null = null;
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

	setCanvasContainerRef = (ref: HTMLDivElement | null) => {
		this.canvasContainerRef = ref;

		if(this.canvasContainerRef) {
			this.lastTime = performance.now();
			this.canvasInit();
			this.canvasLoop();
		}
	}

	private camera: THREE.PerspectiveCamera;
	private scene: THREE.Scene;

	private geometry?: THREE.Geometry;
	private material?: THREE.Material;
	private mesh?: THREE.Mesh;

	private renderer: THREE.Renderer;

	private textureLoader?: THREE.TextureLoader;
	private texture?: THREE.Texture;

	constructor(props: any) {
		super(props);

		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
		this.camera.position.z = 1;
	 
		this.scene = new THREE.Scene();

		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true
		});
		this.renderer.setSize( window.innerWidth, window.innerHeight );
	}

	canvasInit = () => {
		this.canvasContainerRef?.appendChild( this.renderer.domElement );

		this.textureLoader = new THREE.TextureLoader();
		this.textureLoader.load(hearts, (texture: THREE.Texture) => {

			const loadedFont = new THREE.Font(font);

			this.geometry = new THREE.TextGeometry("Hello WOrld!", {
				font: loadedFont
			});
			this.material = new THREE.MeshBasicMaterial({ color: '#ECECEE' });
		 
			this.mesh = new THREE.Mesh( this.geometry, this.material );
			this.scene.add( this.mesh );
		});
	}

	canvasLoop = () => {
		// this.mesh.rotation.x += 0.01;
		// this.mesh.rotation.y += 0.02;
	 
		this.renderer.render( this.scene, this.camera );

		this.canvasAnimationFrame = window.requestAnimationFrame(this.canvasLoop);
	}
}

export default App;
