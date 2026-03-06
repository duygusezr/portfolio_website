import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';

// Scene, Camera, Renderer setup
const scene = new THREE.Scene();
const container = document.getElementById('vrm-container');

if (container) {
    const camera = new THREE.PerspectiveCamera(25.0, container.clientWidth / container.clientHeight, 0.1, 20.0);
    // Adjusted initial camera position to frame the upper body of the anime character
    camera.position.set(0.0, 1.35, 3.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.domElement.style.outline = "none";
    container.appendChild(renderer.domElement);

    // Orbit controls (optional, allows rotating character but let's restrict it so user doesn't mess it up completely)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.screenSpacePanning = true;
    controls.target.set(0.0, 1.35, 0.0);
    controls.enableZoom = false;
    controls.enablePan = false;
    // Limit rotation so the user cannot see the back of the character or spin it crazily
    controls.minAzimuthAngle = -Math.PI / 4; // -45 degrees
    controls.maxAzimuthAngle = Math.PI / 4;  // +45 degrees
    controls.minPolarAngle = Math.PI / 2.5;
    controls.maxPolarAngle = Math.PI / 1.8;
    controls.update();

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, Math.PI);
    light.position.set(1.0, 1.0, 1.0).normalize();
    scene.add(light);
    const light2 = new THREE.DirectionalLight(0xffffff, Math.PI * 0.5);
    light2.position.set(-1.0, 0.5, -1.0).normalize();
    scene.add(light2);
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    let currentVrm = undefined;
    const loader = new GLTFLoader();

    // Register VRM loader plugin
    loader.register((parser) => {
        return new VRMLoaderPlugin(parser);
    });

    loader.load(
        'models/character.vrm', // the path to your character model
        (gltf) => {
            const vrm = gltf.userData.vrm;

            // Remove unused data from VRM to optimize
            VRMUtils.removeUnnecessaryVertices(gltf.scene);
            VRMUtils.removeUnnecessaryJoints(gltf.scene);

            vrm.scene.rotation.y = Math.PI; // Rotate to face the camera
            scene.add(vrm.scene);

            currentVrm = vrm;

            // Simple "t-pose to idle pose" fix for anime VRMs
            vrm.humanoid.getNormalizedBoneNode('leftUpperArm').rotation.z = Math.PI / 2.5;
            vrm.humanoid.getNormalizedBoneNode('rightUpperArm').rotation.z = -Math.PI / 2.5;

            // Disable frustrating culling
            vrm.scene.traverse((obj) => {
                obj.frustumCulled = false;
            });

            // Welcome blink animation
            setTimeout(() => {
                vrm.expressionManager.setValue('blink', 1.0);
                setTimeout(() => {
                    vrm.expressionManager.setValue('blink', 0.0);
                }, 150);
            }, 1000);
        },
        (progress) => {
            // Optional: You can handle loading bar here if needed
        },
        (error) => console.error(error)
    );

    // Track mouse to make the character look at cursor
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        // Mouse coordinates relative to the VRM container center
        mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Clamp values in case cursor is outside container to prevent extreme neck breaking
        mouseX = Math.max(-1.5, Math.min(1.5, mouseX));
        mouseY = Math.max(-1.5, Math.min(1.5, mouseY));
    });

    const clock = new THREE.Clock();
    let blinkTimer = 0;

    function animate() {
        requestAnimationFrame(animate);

        const deltaTime = clock.getDelta();

        if (currentVrm) {
            currentVrm.update(deltaTime);

            if (currentVrm.lookAt) {
                // Adjust target vector according to mouse position
                const targetX = mouseX * 2.5;
                const targetY = 1.35 + mouseY * 1.5;
                const targetZ = camera.position.z;

                currentVrm.lookAt.lookAt(new THREE.Vector3(targetX, targetY, targetZ));
            }

            // Simple Idle Breathing Animation
            const time = clock.elapsedTime;
            const spine = currentVrm.humanoid.getNormalizedBoneNode('spine');
            if (spine) {
                spine.rotation.x = Math.sin(time * 2.0) * 0.02; // Very subtle breathing effect
            }

            // Random Blinking
            blinkTimer -= deltaTime;
            if (blinkTimer < 0) {
                currentVrm.expressionManager.setValue('blink', 1.0);
                setTimeout(() => {
                    if (currentVrm) currentVrm.expressionManager.setValue('blink', 0.0);
                }, 150);
                blinkTimer = 3 + Math.random() * 4; // next blink in 3-7 seconds
            }
        }

        renderer.render(scene, camera);
    }

    animate();

    // Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}
