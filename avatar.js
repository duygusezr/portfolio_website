import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';

// Scene, Camera, Renderer setup
const scene = new THREE.Scene();
const container = document.getElementById('vrm-container');

if (container) {
    const camera = new THREE.PerspectiveCamera(30.0, container.clientWidth / container.clientHeight, 0.1, 100.0);
    // Adjusted camera position to frame the avatar more symmetrically
    camera.position.set(0.0, 1.0, 1.45);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.outputColorSpace = THREE.SRGBColorSpace; // Fix textures/colors
    renderer.domElement.style.outline = "none";
    container.appendChild(renderer.domElement);

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.screenSpacePanning = true;
    controls.target.set(0.0, 1.0, 0.0);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minAzimuthAngle = -Math.PI / 4;
    controls.maxAzimuthAngle = Math.PI / 4;
    controls.minPolarAngle = Math.PI / 2.5;
    controls.maxPolarAngle = Math.PI / 1.8;
    controls.update();

    // Lighting (Match reference main.js for realistic shading)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
    directionalLight.position.set(1.0, 1.0, 1.0).normalize();
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
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
            scene.add(vrm.scene);

            currentVrm = vrm;
            vrm.scene.rotation.y = 0; // Fix rotation to face forward natively

            // T-pose to idle pose fix for anime VRMs (relaxing arms downwards)
            // Values matched exactly with reference main.js
            const leftUpperArm = vrm.humanoid.getNormalizedBoneNode('leftUpperArm');
            const rightUpperArm = vrm.humanoid.getNormalizedBoneNode('rightUpperArm');
            if (leftUpperArm) leftUpperArm.rotation.z = -1.2;
            if (rightUpperArm) rightUpperArm.rotation.z = 1.2;

            // Bring shoulders slightly inward
            const leftShoulder = vrm.humanoid.getNormalizedBoneNode('leftShoulder');
            const rightShoulder = vrm.humanoid.getNormalizedBoneNode('rightShoulder');
            if (leftShoulder) leftShoulder.rotation.z = -0.1;
            if (rightShoulder) rightShoulder.rotation.z = 0.1;

            // Disable frustrating culling
            vrm.scene.traverse((obj) => {
                obj.frustumCulled = false;
            });

            // lookAt özelliğini yumuşak takip için manuel kontrol edebiliriz
            if (vrm.lookAt) vrm.lookAt.autoUpdate = false;

            // Welcome blink animation
            setTimeout(() => {
                vrm.expressionManager.setValue('blink', 1.0);
                setTimeout(() => {
                    vrm.expressionManager.setValue('blink', 0.0);
                }, 150);
            }, 1000);
        },
        (progress) => {
            // Optional: loading progress
        },
        (error) => console.error(error)
    );

    // Track mouse to make the character look at cursor smoothly
    let mouseX = 0;
    let mouseY = 0;
    let eyeCurrent = { yaw: 0, pitch: 0 };

    window.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        // Mouse coordinates relative to the VRM container center
        mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Clamp values
        mouseX = Math.max(-1.5, Math.min(1.5, mouseX));
        mouseY = Math.max(-1.5, Math.min(1.5, mouseY));
    });

    const clock = new THREE.Clock();
    let blinkTimer = 0;

    // Wave / Smile Animation State
    let waveTimer = 10.0;
    let isWaving = false;
    let waveStartTime = 0;

    function animate() {
        requestAnimationFrame(animate);

        const deltaTime = clock.getDelta();
        const elapsed = clock.getElapsedTime();

        if (currentVrm) {
            currentVrm.update(deltaTime);

            if (currentVrm.lookAt) {
                // Determine target yaw and pitch based on mouse position
                const eyeTargetYaw = -mouseX * 0.4; // Reverse direction and limit multiplier
                const eyeTargetPitch = mouseY * 0.3;

                // Smooth eye movement
                const es = Math.min(1.5 * deltaTime, 1.0);
                eyeCurrent.yaw += (eyeTargetYaw - eyeCurrent.yaw) * es;
                eyeCurrent.pitch += (eyeTargetPitch - eyeCurrent.pitch) * es;

                try {
                    if (typeof currentVrm.lookAt.yaw !== 'undefined') {
                        currentVrm.lookAt.yaw = eyeCurrent.yaw;
                        currentVrm.lookAt.pitch = eyeCurrent.pitch;
                    } else if (currentVrm.lookAt.applier) {
                        currentVrm.lookAt.applier.applyYawPitch(eyeCurrent.yaw, eyeCurrent.pitch);
                    }
                } catch (e) { }
            }

            // Simple Idle Breathing Animation & Waving (matching main.js)
            if (currentVrm.humanoid) {
                const breathNorm = (Math.sin(elapsed * 0.35) + 1) / 2;

                const leftShoulder = currentVrm.humanoid.getNormalizedBoneNode('leftShoulder');
                const rightShoulder = currentVrm.humanoid.getNormalizedBoneNode('rightShoulder');
                if (leftShoulder) leftShoulder.rotation.x = -breathNorm * 0.12;
                if (rightShoulder) rightShoulder.rotation.x = -breathNorm * 0.12;

                const leftUpperArm = currentVrm.humanoid.getNormalizedBoneNode('leftUpperArm');
                const rightUpperArm = currentVrm.humanoid.getNormalizedBoneNode('rightUpperArm');
                if (leftUpperArm) leftUpperArm.rotation.z = -1.2 - breathNorm * 0.06;
                const defaultRightZ = 1.2 + breathNorm * 0.06;

                const neck = currentVrm.humanoid.getNormalizedBoneNode('neck');
                if (neck) neck.rotation.x = -breathNorm * 0.03;

                // --- Wave Logic ---
                if (!isWaving) {
                    waveTimer -= deltaTime;
                    if (waveTimer <= 0) {
                        isWaving = true;
                        waveStartTime = elapsed;
                    }
                }

                const rightLowerArm = currentVrm.humanoid.getNormalizedBoneNode('rightLowerArm');
                const rightHand = currentVrm.humanoid.getNormalizedBoneNode('rightHand');

                if (isWaving && rightUpperArm && rightLowerArm) {
                    const waveProgress = elapsed - waveStartTime;

                    if (waveProgress > 3.0) {
                        // End of wave
                        isWaving = false;
                        waveTimer = 10.0;
                        rightUpperArm.rotation.z = defaultRightZ;
                        rightUpperArm.rotation.x = 0;
                        rightUpperArm.rotation.y = 0;
                        rightLowerArm.rotation.z = 0;
                        rightLowerArm.rotation.x = 0;
                        if (rightHand) rightHand.rotation.z = 0;

                        currentVrm.expressionManager.setValue('happy', 0.0);
                        currentVrm.expressionManager.setValue('joy', 0.0);
                    } else {
                        // Transition weights for smooth start/end
                        const transitionIn = Math.min(waveProgress * 3.0, 1.0);
                        const transitionOut = Math.max(0, Math.min((3.0 - waveProgress) * 3.0, 1.0));
                        const weight = Math.min(transitionIn, transitionOut);

                        // Smile bright
                        currentVrm.expressionManager.setValue('happy', Math.min(1.0, weight * 1.5));
                        currentVrm.expressionManager.setValue('joy', Math.min(1.0, weight * 1.5));

                        // Wave arm pose - Natural "hand by the head" position
                        const targetUpperX = -0.5; // Lift forward
                        const targetUpperZ = 0.6;  // Lift side slightly

                        rightUpperArm.rotation.x = targetUpperX * weight;
                        rightUpperArm.rotation.z = (defaultRightZ * (1.0 - weight)) + (targetUpperZ * weight);
                        rightUpperArm.rotation.y = -0.2 * weight;

                        if (rightLowerArm) {
                            // Bend elbow significantly to bring hand up
                            const targetLowerX = -1.6;
                            const waveMotion = Math.sin(elapsed * 12.0) * 0.4; // The actual side-to-side waving

                            rightLowerArm.rotation.x = targetLowerX * weight;
                            rightLowerArm.rotation.y = waveMotion * weight; // Wave from the elbow/forearm
                        }
                    }
                } else {
                    // Normal idle
                    if (rightUpperArm) {
                        rightUpperArm.rotation.z = defaultRightZ;
                        rightUpperArm.rotation.x = 0;
                        rightUpperArm.rotation.y = 0;
                    }
                }
            }

            // Random Blinking
            blinkTimer -= deltaTime;
            if (blinkTimer < 0) {
                currentVrm.expressionManager.setValue('blink', 1.0);
                setTimeout(() => {
                    if (currentVrm) currentVrm.expressionManager.setValue('blink', 0.0);
                }, 150);
                blinkTimer = 2 + Math.random() * 4; // next blink in 2-6 seconds
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
