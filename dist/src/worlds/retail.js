import * as THREE from 'three';
import { addMesh, createWorld, standard } from '../world-shared.js';

export function createRetailWorld() {
    const world = createWorld('#8e8f68', 1.7);
    const { root } = world;
    const stage = new THREE.Group();
    root.add(stage);

    const plinthDark = standard('#66664f', { roughness: 0.3, metalness: 0.18 });
    const ceramic = standard('#d1cec2', { roughness: 0.7 });
    const heroFinish = standard('#d4c6ac', { roughness: 0.22, metalness: 0.03 });
    const glass = new THREE.MeshPhysicalMaterial({ color: '#a7b49d', roughness: 0.18, metalness: 0.06, transparent: true, opacity: 0.82, clearcoat: 0.8 });
    const timber = standard('#a9794f', { roughness: 0.46 });
    const accent = standard('#e6d8bd', { roughness: 0.25, metalness: 0.12 });

    addMesh(stage, new THREE.CylinderGeometry(1.88, 1.94, 0.22, 64), ceramic, [0, -1.42, 0]);
    addMesh(stage, new THREE.CylinderGeometry(1.3, 1.42, 0.18, 64), plinthDark, [0, -1.22, 0]);
    const plinthBand = addMesh(stage, new THREE.TorusGeometry(1.26, 0.035, 12, 80), accent, [0, -1.12, 0]);
    plinthBand.rotation.x = Math.PI / 2;

    const profile = [
        new THREE.Vector2(0.0, -0.85), new THREE.Vector2(0.48, -0.83),
        new THREE.Vector2(0.62, -0.54), new THREE.Vector2(0.42, -0.1),
        new THREE.Vector2(0.35, 0.32), new THREE.Vector2(0.48, 0.71),
        new THREE.Vector2(0.42, 0.85), new THREE.Vector2(0.27, 0.9),
        new THREE.Vector2(0.24, 0.69), new THREE.Vector2(0.26, 0.16),
        new THREE.Vector2(0.36, -0.37), new THREE.Vector2(0.27, -0.65),
        new THREE.Vector2(0.0, -0.67)
    ];
    const heroProduct = new THREE.Group();
    stage.add(heroProduct);
    const vessel = addMesh(heroProduct, new THREE.LatheGeometry(profile, 72), heroFinish, [0, 0.25, 0]);
    vessel.scale.set(1.06, 1.08, 1.06);
    const vesselLip = addMesh(heroProduct, new THREE.TorusGeometry(0.265, 0.028, 12, 48), accent, [0, 1.13, 0]);
    vesselLip.rotation.x = Math.PI / 2;
    addMesh(heroProduct, new THREE.CylinderGeometry(0.085, 0.09, 0.09, 32), standard('#6c725d', { roughness: 0.3 }), [0, 1.18, 0]);

    const orbit = new THREE.Group();
    stage.add(orbit);
    const orbitRing = addMesh(orbit, new THREE.TorusGeometry(2.2, 0.014, 8, 120), standard('#6c725d', { roughness: 0.4, transparent: true, opacity: 0.5 }));
    orbitRing.rotation.set(1.04, 0.24, -0.34);
    addMesh(orbit, new THREE.SphereGeometry(0.11, 18, 14), standard('#c78360', { roughness: 0.28 }), [2.18, 0.48, 0]);

    const collection = new THREE.Group();
    root.add(collection);
    const miniProfile = [new THREE.Vector2(0, -0.45), new THREE.Vector2(0.23, -0.42), new THREE.Vector2(0.31, -0.12), new THREE.Vector2(0.18, 0.32), new THREE.Vector2(0.2, 0.44), new THREE.Vector2(0, 0.45)];
    const miniVase = new THREE.LatheGeometry(miniProfile, 36);
    addMesh(collection, miniVase, glass, [-1.5, 0.0, 0.35]);
    addMesh(collection, new THREE.BoxGeometry(0.58, 0.68, 0.58), timber, [0, 0.0, -0.2]);
    addMesh(collection, new THREE.CylinderGeometry(0.47, 0.6, 0.12, 48), ceramic, [1.35, -0.24, 0.35]);
    addMesh(collection, new THREE.CylinderGeometry(0.16, 0.2, 0.58, 32), timber, [1.35, -0.59, 0.35]);

    const finishColors = { chalk: '#d4c6ac', moss: '#849377', clay: '#c78360' };
    function setFinish(finish) {
        const color = finishColors[finish];
        if (!color) return false;
        heroFinish.color.set(color);
        heroFinish.roughness = finish === 'clay' ? 0.36 : 0.22;
        return true;
    }

    const actors = { root, stage, heroProduct, orbit, collection };
    const stops = [
        { camera: [0.1, 1.75, 8.6], focus: [0, -0.05, 0], actors: { stage: { rotation: [0, -12, 0] }, heroProduct: { rotation: [0, -15, 0], scale: [0.88, 0.88, 0.88] }, orbit: { rotation: [4, 0, 12] }, collection: { position: [0.45, -0.12, -1.2], scale: [0.68, 0.68, 0.68] } } },
        { camera: [-1.55, 2.6, 7.4], focus: [-0.15, 0, 0], actors: { stage: { rotation: [3, 18, -2] }, heroProduct: { rotation: [0, 56, 0], scale: [1.03, 1.03, 1.03] }, orbit: { rotation: [-22, 72, 13] }, collection: { position: [0.1, 0.1, -0.65], scale: [0.8, 0.8, 0.8] } } },
        { camera: [1.35, 1.85, 7.2], focus: [0.1, 0.08, 0], actors: { stage: { rotation: [-3, 76, 1] }, heroProduct: { rotation: [8, 145, -4], scale: [0.92, 0.92, 0.92] }, orbit: { rotation: [16, 152, -9] }, collection: { position: [0, 0.2, 0.25], scale: [0.96, 0.96, 0.96] } } },
        { camera: [0.1, 2.45, 9.5], focus: [0, -0.08, 0], actors: { stage: { rotation: [0, 198, 0] }, heroProduct: { rotation: [0, 210, 0], scale: [0.78, 0.78, 0.78] }, orbit: { rotation: [0, 232, 0] }, collection: { position: [0, -0.03, 0.8], scale: [1.05, 1.05, 1.05] } } }
    ];

    return { ...world, actors, stops, accent: '#8e8f68', setFinish };
}
