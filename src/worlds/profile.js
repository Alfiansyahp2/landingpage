import * as THREE from 'three';
import { addMesh, createWorld, standard } from '../world-shared.js';

export function createProfileWorld() {
    const world = createWorld('#d1a4ff', 1.62);
    const { root } = world;
    const gallery = new THREE.Group();
    root.add(gallery);

    const lilac = standard('#b998ee', { roughness: 0.25, metalness: 0.28 });
    const rose = standard('#e991ad', { roughness: 0.3, metalness: 0.14 });
    const cream = standard('#eee8dc', { roughness: 0.48, metalness: 0.04 });
    const ink = standard('#302343', { roughness: 0.3, metalness: 0.4 });

    const makeFrame = (parent, size, material, position, rotation) => {
        const frame = new THREE.Group();
        frame.position.set(...position);
        frame.rotation.set(...rotation);
        parent.add(frame);
        addMesh(frame, new THREE.BoxGeometry(size[0], size[1], 0.12), material, [0, 0, 0]);
        const inset = addMesh(frame, new THREE.PlaneGeometry(size[0] * 0.83, size[1] * 0.79), cream, [0, 0, 0.068]);
        inset.material = material;
        const barMaterial = new THREE.MeshBasicMaterial({ color: '#f8f1ff', transparent: true, opacity: 0.72 });
        addMesh(frame, new THREE.BoxGeometry(size[0] * 0.52, 0.025, 0.025), barMaterial, [-size[0] * 0.1, -size[1] * 0.18, 0.14]);
        addMesh(frame, new THREE.BoxGeometry(size[0] * 0.29, 0.025, 0.025), barMaterial, [-size[0] * 0.22, -size[1] * 0.26, 0.14]);
        addMesh(frame, new THREE.SphereGeometry(size[0] * 0.17, 24, 18), material, [size[0] * 0.14, size[1] * 0.13, 0.19], [1, 1, 0.3]);
        return frame;
    };

    const identityFrame = makeFrame(gallery, [1.65, 2.15], lilac, [-1.42, 0.05, -0.48], [0.02, -0.18, -0.07]);
    const workFrame = makeFrame(gallery, [1.86, 2.42], rose, [0.32, 0.02, 0.42], [-0.04, 0.1, 0.03]);
    const noteFrame = makeFrame(gallery, [1.25, 1.7], ink, [1.9, -0.08, -0.64], [0.08, -0.31, 0.08]);

    const orbit = new THREE.Group();
    gallery.add(orbit);
    const orbitMaterial = standard('#ead7ff', { roughness: 0.22, metalness: 0.62 });
    const ellipse = addMesh(orbit, new THREE.TorusGeometry(2.6, 0.013, 8, 128), orbitMaterial, [0, 0.08, -0.2]);
    ellipse.rotation.set(0.22, -0.14, 0.68);
    addMesh(orbit, new THREE.OctahedronGeometry(0.16, 1), rose, [2.52, 0.1, -0.2]);
    addMesh(orbit, new THREE.IcosahedronGeometry(0.13, 1), lilac, [-2.45, 0.18, 0.1]);

    const actors = { root, gallery, identityFrame, workFrame, noteFrame, orbit };
    const stops = [
        { camera: [0.1, 0.55, 8.2], focus: [0, 0, 0], actors: { gallery: { rotation: [0, -9, 0] }, identityFrame: { position: [-1.5, 0, -0.15], rotation: [0, -13, -4] }, workFrame: { position: [0.25, 0, 0.62], rotation: [-3, 7, 2] }, noteFrame: { position: [1.85, 0, -0.45], rotation: [0, -20, 6] }, orbit: { rotation: [0, 0, -10] } } },
        { camera: [-1.18, 0.4, 7.3], focus: [-0.2, 0, 0], actors: { gallery: { rotation: [0, 18, 0] }, identityFrame: { position: [-0.95, 0.14, 0.1], rotation: [-4, 10, -2] }, workFrame: { position: [0.55, -0.05, 0.7], rotation: [2, -6, -3] }, noteFrame: { position: [1.8, -0.12, -0.42], rotation: [0, -12, 4] }, orbit: { rotation: [8, 0, 42] } } },
        { camera: [1.22, -0.05, 7], focus: [0.2, 0.04, 0], actors: { gallery: { rotation: [0, 88, 0] }, identityFrame: { position: [-1.85, -0.08, -0.7], rotation: [4, -23, 2] }, workFrame: { position: [0.1, 0, 0.8], rotation: [-4, 6, 0] }, noteFrame: { position: [1.75, 0.1, -0.2], rotation: [2, -5, -3] }, orbit: { rotation: [-7, 0, 92] } } },
        { camera: [0.1, 0.42, 7.7], focus: [0.15, 0.02, 0.18], actors: { gallery: { rotation: [0, 12, 0] }, identityFrame: { position: [-1.9, 0, -0.58], rotation: [0, -17, -3] }, workFrame: { position: [0.15, -0.02, 0.82], rotation: [0, 0, 0], scale: [1.18, 1.18, 1.18] }, noteFrame: { position: [1.85, 0.05, -0.5], rotation: [0, 16, 3] }, orbit: { rotation: [0, 0, 188] } } }
    ];

    return { ...world, actors, stops, accent: '#d1a4ff' };
}
