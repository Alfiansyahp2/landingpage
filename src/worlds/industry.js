import * as THREE from 'three';
import { addCylinderBetween, addMesh, addWire, createWorld, standard } from '../world-shared.js';

export function createIndustryWorld() {
    const world = createWorld('#70d8cc', 1.75);
    const { root } = world;
    const structure = new THREE.Group();
    root.add(structure);

    const teal = standard('#77e0d2', { roughness: 0.24, metalness: 0.55 });
    const steel = standard('#536b71', { roughness: 0.32, metalness: 0.78 });
    const darkSteel = standard('#142b32', { roughness: 0.48, metalness: 0.62 });
    const signal = new THREE.MeshBasicMaterial({ color: '#b7fff0', transparent: true, opacity: 0.82 });

    addMesh(structure, new THREE.BoxGeometry(2.15, 2.15, 2.15), darkSteel, [0, 0.05, 0]);
    addWire(structure, new THREE.BoxGeometry(2.18, 2.18, 2.18), '#9af2e5', 0.82);
    addMesh(structure, new THREE.BoxGeometry(1.18, 1.18, 1.18), standard('#244951', { roughness: 0.28, metalness: 0.5 }), [0, 0.05, 0]);
    addWire(structure, new THREE.BoxGeometry(1.22, 1.22, 1.22), '#effffb', 0.55);

    const modules = new THREE.Group();
    structure.add(modules);
    const modulePositions = [
        [-1.75, 0.68, -0.62], [1.72, 0.73, 0.58],
        [-1.72, -0.72, 0.58], [1.72, -0.67, -0.62],
        [-0.65, 1.72, 0.46], [0.58, -1.63, -0.42]
    ];
    modulePositions.forEach((position, index) => {
        const material = index % 2 ? teal : steel;
        const size = index < 4 ? 0.38 : 0.34;
        const block = addMesh(modules, new THREE.BoxGeometry(size, size, size), material, position);
        addWire(modules, block.geometry, '#d8fff5', 0.58).position.copy(block.position);
        const beacon = addMesh(modules, new THREE.SphereGeometry(0.075, 16, 12), signal, [position[0] * 0.91, position[1] * 0.91, position[2] * 0.91]);
        beacon.scale.setScalar(index % 2 ? 0.8 : 1.15);
    });

    const pipes = new THREE.Group();
    structure.add(pipes);
    const pipeMaterial = standard('#92afa9', { roughness: 0.2, metalness: 0.84 });
    [
        [[-1.45, 0.3, 0.02], [-0.68, 0.3, 0.02]],
        [[0.68, -0.28, 0.05], [1.43, -0.28, 0.05]],
        [[0.12, 1.32, 0.36], [0.12, 0.7, 0.36]],
        [[-0.18, -1.28, -0.3], [-0.18, -0.67, -0.3]],
        [[-1.36, -0.34, 0.08], [-1.36, -0.34, 1.05]],
        [[1.32, 0.36, -0.06], [1.32, 0.36, -1.05]]
    ].forEach(pair => addCylinderBetween(pipes, pair[0], pair[1], 0.035, pipeMaterial, 12));

    const scanner = new THREE.Group();
    structure.add(scanner);
    const scanRing = addMesh(scanner, new THREE.TorusGeometry(1.8, 0.018, 8, 128), signal, [0, 0.05, 0]);
    scanRing.rotation.x = Math.PI / 2;
    const scanPlane = addMesh(scanner, new THREE.PlaneGeometry(3.15, 2.8), new THREE.MeshBasicMaterial({ color: '#53d9ca', transparent: true, opacity: 0.08, side: THREE.DoubleSide }), [0, 0, 0.02]);

    const actors = { root, structure, modules, pipes, scanner, scanRing, scanPlane };
    const stops = [
        { camera: [0.15, 1.35, 11.2], focus: [0, 0, 0], actors: { root: { scale: [1.02, 1.02, 1.02] }, structure: { rotation: [0, -4, 0], scale: [0.72, 0.72, 0.72] }, modules: { position: [0, -0.72, 0], scale: [0.42, 0.42, 0.42] }, pipes: { rotation: [0, 0, 0], scale: [0.12, 0.12, 0.12] }, scanner: { rotation: [0, -12, 0], scale: [0.18, 0.18, 0.18] } } },
        { camera: [-2.05, 0.6, 8.8], focus: [-0.18, 0.02, 0], actors: { root: { scale: [1.02, 1.02, 1.02] }, structure: { rotation: [0, 24, 0], scale: [0.82, 0.82, 0.82] }, modules: { position: [-0.2, 0.05, 0.22], scale: [0.64, 0.64, 0.64] }, pipes: { rotation: [0, 8, 0], scale: [0.35, 0.35, 0.35] }, scanner: { rotation: [0, 20, 16], scale: [0.4, 0.4, 0.4] } } },
        { camera: [-1.05, 0.32, 7.65], focus: [0.02, 0.05, 0], actors: { root: { scale: [1.02, 1.02, 1.02] }, structure: { rotation: [4, 62, -3], scale: [0.94, 0.94, 0.94] }, modules: { position: [0, 0.04, 0.08], scale: [0.84, 0.84, 0.84] }, pipes: { rotation: [0, -12, 0], scale: [0.82, 0.82, 0.82] }, scanner: { rotation: [4, 86, -14], scale: [0.72, 0.72, 0.72] } } },
        { camera: [1.55, 0.25, 7.35], focus: [0.12, 0.1, 0], actors: { root: { scale: [1.02, 1.02, 1.02] }, structure: { rotation: [8, 118, -4], scale: [0.98, 0.98, 0.98] }, modules: { position: [0, 0.2, 0.05], scale: [1.08, 1.08, 1.08] }, pipes: { rotation: [0, -14, 0], scale: [1, 1, 1] }, scanner: { rotation: [4, 152, -8], scale: [1, 1, 1] } } },
        { camera: [0.1, 1.5, 9.6], focus: [0, -0.02, 0], actors: { root: { scale: [1.02, 1.02, 1.02] }, structure: { rotation: [0, 360, 0], scale: [0.92, 0.92, 0.92] }, modules: { position: [0, 0.02, 0], scale: [1.16, 1.16, 1.16] }, pipes: { rotation: [0, 360, 0], scale: [1, 1, 1] }, scanner: { rotation: [0, 360, 0], scale: [1.04, 1.04, 1.04] } } }
    ];

    return { ...world, actors, stops, accent: '#70d8cc' };
}
