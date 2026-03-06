import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';

const scene = new THREE.Scene();
const container = document.getElementById('vrm-container');

if (container) {
    // Mobil için kamera ve görünüm ayarları
    const isMobile = window.innerWidth <= 768;
    const initialFov = isMobile ? 40.0 : 30.0; // Mobil ekranında biraz daha geniş açı
    const initialZ = isMobile ? 2.2 : 1.8;      // Mobilde biraz daha geriden bak ki sığsın

    const camera = new THREE.PerspectiveCamera(initialFov, (container.clientWidth || window.innerWidth) / (container.clientHeight || 500), 0.1, 100.0);
    camera.position.set(0.0, 1.05, initialZ);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || 500);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Performans için 2 ile sınırla
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.outline = "none";
    container.appendChild(renderer.domElement);

    // İlk açılışta mobilde boyut hatasını önlemek için tetikle
    setTimeout(() => window.dispatchEvent(new Event('resize')), 100);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.screenSpacePanning = true;
    controls.target.set(0.0, 1.05, 0.0);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minAzimuthAngle = -Math.PI / 4;
    controls.maxAzimuthAngle = Math.PI / 4;
    controls.minPolarAngle = Math.PI / 2.5;
    controls.maxPolarAngle = Math.PI / 1.8;
    controls.update();

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
    directionalLight.position.set(1.0, 1.0, 1.0).normalize();
    scene.add(directionalLight);
    scene.add(new THREE.AmbientLight(0xffffff, 1.0));

    let currentVrm = undefined;
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    loader.load(
        'models/character.vrm',
        (gltf) => {
            const vrm = gltf.userData.vrm;
            VRMUtils.removeUnnecessaryVertices(gltf.scene);
            VRMUtils.removeUnnecessaryJoints(gltf.scene);
            scene.add(vrm.scene);
            currentVrm = vrm;
            vrm.scene.rotation.y = 0;

            const leftUpperArm = vrm.humanoid.getNormalizedBoneNode('leftUpperArm');
            const rightUpperArm = vrm.humanoid.getNormalizedBoneNode('rightUpperArm');
            if (leftUpperArm) leftUpperArm.rotation.z = -1.2;
            if (rightUpperArm) rightUpperArm.rotation.z = 1.2;

            const leftShoulder = vrm.humanoid.getNormalizedBoneNode('leftShoulder');
            const rightShoulder = vrm.humanoid.getNormalizedBoneNode('rightShoulder');
            if (leftShoulder) leftShoulder.rotation.z = -0.1;
            if (rightShoulder) rightShoulder.rotation.z = 0.1;

            vrm.scene.traverse((obj) => { obj.frustumCulled = false; });
            if (vrm.lookAt) vrm.lookAt.autoUpdate = false;

            setTimeout(() => {
                vrm.expressionManager.setValue('blink', 1.0);
                setTimeout(() => { vrm.expressionManager.setValue('blink', 0.0); }, 150);
            }, 1000);
        },
        undefined,
        (error) => console.error(error)
    );

    let mouseX = 0, mouseY = 0;
    let eyeCurrent = { yaw: 0, pitch: 0 };

    window.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        mouseX = Math.max(-1.5, Math.min(1.5, ((event.clientX - rect.left) / rect.width) * 2 - 1));
        mouseY = Math.max(-1.5, Math.min(1.5, -((event.clientY - rect.top) / rect.height) * 2 + 1));
    });

    const clock = new THREE.Clock();
    let blinkTimer = 0;
    let waveTimer = 5.0;
    let isWaving = false;
    let waveStartTime = 0;

    function animate() {
        requestAnimationFrame(animate);
        const deltaTime = clock.getDelta();
        const elapsed = clock.getElapsedTime();

        if (currentVrm) {
            currentVrm.update(deltaTime);

            if (currentVrm.lookAt) {
                const es = Math.min(1.5 * deltaTime, 1.0);
                eyeCurrent.yaw += (-mouseX * 0.4 - eyeCurrent.yaw) * es;
                eyeCurrent.pitch += (mouseY * 0.3 - eyeCurrent.pitch) * es;
                try {
                    if (typeof currentVrm.lookAt.yaw !== 'undefined') {
                        currentVrm.lookAt.yaw = eyeCurrent.yaw;
                        currentVrm.lookAt.pitch = eyeCurrent.pitch;
                    } else if (currentVrm.lookAt.applier) {
                        currentVrm.lookAt.applier.applyYawPitch(eyeCurrent.yaw, eyeCurrent.pitch);
                    }
                } catch (e) { }
            }

            if (currentVrm.humanoid) {
                const breathNorm = (Math.sin(elapsed * 0.35) + 1) / 2;

                const leftShoulder = currentVrm.humanoid.getNormalizedBoneNode('leftShoulder');
                const rightShoulder = currentVrm.humanoid.getNormalizedBoneNode('rightShoulder');
                if (leftShoulder) leftShoulder.rotation.x = -breathNorm * 0.12;
                if (rightShoulder) rightShoulder.rotation.x = -breathNorm * 0.12;

                const leftUpperArm = currentVrm.humanoid.getNormalizedBoneNode('leftUpperArm');
                const rightUpperArm = currentVrm.humanoid.getNormalizedBoneNode('rightUpperArm');
                if (leftUpperArm) leftUpperArm.rotation.z = -1.2 - breathNorm * 0.06;

                const idleRightZ = 1.2 + breathNorm * 0.06;

                const neck = currentVrm.humanoid.getNormalizedBoneNode('neck');
                if (neck) neck.rotation.x = -breathNorm * 0.03;

                if (!isWaving) {
                    waveTimer -= deltaTime;
                    if (waveTimer <= 0) { isWaving = true; waveStartTime = elapsed; }
                }

                const rightLowerArm = currentVrm.humanoid.getNormalizedBoneNode('rightLowerArm');
                const rightHand = currentVrm.humanoid.getNormalizedBoneNode('rightHand');

                if (isWaving && rightUpperArm) {
                    const waveProgress = elapsed - waveStartTime;

                    if (waveProgress > 3.0) {
                        isWaving = false;
                        waveTimer = 5.0;
                        rightUpperArm.rotation.x = 0; rightUpperArm.rotation.y = 0; rightUpperArm.rotation.z = idleRightZ;
                        if (rightLowerArm) { rightLowerArm.rotation.x = 0; rightLowerArm.rotation.y = 0; rightLowerArm.rotation.z = 0; }
                        if (rightHand) { rightHand.rotation.x = 0; rightHand.rotation.y = 0; rightHand.rotation.z = 0; }
                        currentVrm.expressionManager.setValue('happy', 0.0);
                        currentVrm.expressionManager.setValue('joy', 0.0);

                    } else {
                        const transIn = Math.min(waveProgress * 3.0, 1.0);
                        const transOut = Math.max(0, Math.min((3.0 - waveProgress) * 3.0, 1.0));
                        const weight = Math.min(transIn, transOut);

                        currentVrm.expressionManager.setValue('happy', Math.min(1.0, weight * 1.5));
                        currentVrm.expressionManager.setValue('joy', Math.min(1.0, weight * 1.5));

                        const waveFlap = Math.sin(elapsed * 10.0) * 0.2;

                        // ÜST KOL: Y ekseninde sallanma
                        rightUpperArm.rotation.z = idleRightZ * (1 - weight) + (-0.6) * weight;
                        rightUpperArm.rotation.x = -0.3 * weight;
                        rightUpperArm.rotation.y = waveFlap * weight;

                        // ALT KOL: Y ekseninde sallanma
                        if (rightLowerArm) {
                            rightLowerArm.rotation.z = -Math.PI / 2 * weight;
                            rightLowerArm.rotation.y = 0;
                            rightLowerArm.rotation.x = 0.5 * weight;
                        }

                        if (rightHand) {
                            rightHand.rotation.x = -Math.PI / 1.5 * weight;
                            rightHand.rotation.y = waveFlap * weight; // Sağ el de y ekseninde sallansın
                            rightHand.rotation.z = 0;
                        }
                    }

                } else {
                    if (rightUpperArm) { rightUpperArm.rotation.z = idleRightZ; rightUpperArm.rotation.x = 0; rightUpperArm.rotation.y = 0; }
                    if (rightLowerArm) { rightLowerArm.rotation.x = 0; rightLowerArm.rotation.y = 0; rightLowerArm.rotation.z = 0; }
                    if (rightHand) { rightHand.rotation.x = 0; rightHand.rotation.y = 0; rightHand.rotation.z = 0; }
                }
            }

            blinkTimer -= deltaTime;
            if (blinkTimer < 0) {
                currentVrm.expressionManager.setValue('blink', 1.0);
                setTimeout(() => { if (currentVrm) currentVrm.expressionManager.setValue('blink', 0.0); }, 150);
                blinkTimer = 2 + Math.random() * 4;
            }
        }

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || 500;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
}