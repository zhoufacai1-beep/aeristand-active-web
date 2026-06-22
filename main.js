import * as THREE from 'three';

class App {
    constructor() {
        this.canvas = document.querySelector('#Stage');
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        this.clock = new THREE.Clock();
        this.scrollProgress = 0;
        this.targetScrollProgress = 0;
        this.totalProjects = 3;

        this.initVideo();
        this.initMesh();
        this.addEventListeners();
        this.render();
    }

    async initVideo() {
        this.video = document.createElement('video');
        this.video.src = 'https://assets.mixkit.co/videos/preview/mixkit-star-motion-background-at-night-11357-large.mp4';
        this.video.muted = true;
        this.video.loop = true;
        this.video.playsInline = true;
        this.video.crossOrigin = 'anonymous';
        this.video.play();

        this.videoTexture = new THREE.VideoTexture(this.video);
        this.videoTexture.minFilter = THREE.LinearFilter;
        this.videoTexture.magFilter = THREE.LinearFilter;
        if (this.material) this.material.uniforms.tDiffuse.value = this.videoTexture;
    }

    async initMesh() {
        const shaderResponse = await fetch('fragment.glsl');
        const fragmentShaderText = await shaderResponse.text();

        const geometry = new THREE.PlaneGeometry(2, 2);
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                uTime: { value: 0 },
                uNoiseIntensity: { value: 0.03 }
            },
            vertexShader: \`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            \`,
            fragmentShader: fragmentShaderText
        });

        const mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(mesh);
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        window.addEventListener('scroll', () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            this.targetScrollProgress = window.scrollY / maxScroll;
        });
    }

    lerp(a, b, t) {
        return a * (1 - t) + b * t;
    }

    fract(x) {
        return x - Math.floor(x);
    }

    updateVideoTime() {
        if (!this.video || isNaN(this.video.duration)) return;
        const time = this.fract(this.scrollProgress * this.totalProjects) * this.video.duration;
        this.video.currentTime = time;
    }

    render() {
        const delta = this.clock.getDelta();
        const time = this.clock.getElapsedTime();

        this.scrollProgress = this.lerp(this.scrollProgress, this.targetScrollProgress, 0.05);
        this.updateVideoTime();

        if (this.material) {
            this.material.uniforms.uTime.value = time;
        }

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.render());
    }
}

new App();
