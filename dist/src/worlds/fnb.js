import * as THREE from 'three';
import { addMesh, createWorld, standard } from '../world-shared.js';

export function createFnbWorld() {
    const world = createWorld('#bc6544', 1.7);
    const { root } = world;

    const plate = new THREE.Group();
    root.add(plate);
    const porcelain = standard('#f2e8d6', { roughness: 0.22, metalness: 0.04 });
    const shadowCeramic = standard('#c8b89e', { roughness: 0.28 });
    const rimMaterial = standard('#b66b43', { roughness: 0.3, metalness: 0.15 });
    addMesh(plate, new THREE.CylinderGeometry(2.05, 1.92, 0.17, 72), shadowCeramic, [0, -0.54, 0]);
    addMesh(plate, new THREE.CylinderGeometry(1.91, 1.79, 0.12, 72), porcelain, [0, -0.42, 0]);
    const lip = addMesh(plate, new THREE.TorusGeometry(1.72, 0.045, 12, 96), rimMaterial, [0, -0.32, 0]);
    lip.rotation.x = Math.PI / 2;
    const innerLip = addMesh(plate, new THREE.TorusGeometry(1.38, 0.018, 8, 96), standard('#b8a789', { roughness: 0.25 }), [0, -0.34, 0]);
    innerLip.rotation.x = Math.PI / 2;

    const food = new THREE.Group();
    plate.add(food);
    const tomato = standard('#c95637', { roughness: 0.3 });
    const herb = standard('#65834e', { roughness: 0.48 });
    const golden = standard('#dcaa5b', { roughness: 0.34 });
    addMesh(food, new THREE.SphereGeometry(0.46, 32, 24), tomato, [-0.48, -0.11, 0.05], [1.18, 0.32, 0.85]);
    addMesh(food, new THREE.SphereGeometry(0.35, 28, 20), golden, [0.28, -0.08, -0.28], [1.2, 0.28, 0.76]);
    addMesh(food, new THREE.SphereGeometry(0.26, 24, 18), herb, [0.55, -0.02, 0.42], [0.45, 0.11, 1.35]);
    addMesh(food, new THREE.SphereGeometry(0.2, 20, 16), herb, [-0.9, -0.04, -0.42], [0.42, 0.1, 1.4]);
    for (let index = 0; index < 9; index += 1) {
        const angle = index / 9 * Math.PI * 2;
        const seed = addMesh(food, new THREE.SphereGeometry(0.07, 12, 10), golden, [Math.cos(angle) * 0.82, -0.04, Math.sin(angle) * 0.82], [1, 0.55, 0.75]);
        seed.rotation.y = angle;
    }

    const orbit = new THREE.Group();
    root.add(orbit);
    const orbitRing = addMesh(orbit, new THREE.TorusGeometry(2.56, 0.012, 8, 128), standard('#b76542', { roughness: 0.42, transparent: true, opacity: 0.45 }));
    orbitRing.rotation.set(1.34, 0, -0.08);
    const berry = addMesh(orbit, new THREE.SphereGeometry(0.12, 20, 16), tomato, [2.55, 0.62, 0]);
    addMesh(orbit, new THREE.SphereGeometry(0.09, 18, 14), herb, [-2.32, -0.62, 0.22], [0.56, 0.22, 1.65]);

    const steam = new THREE.Group();
    root.add(steam);
    const steamMaterial = new THREE.MeshBasicMaterial({ color: '#d2a46d', transparent: true, opacity: 0.24 });
    [[-0.48, 0.05], [0.03, -0.18], [0.48, 0.13]].forEach(([x, offset]) => {
        const points = [
            new THREE.Vector3(x, -0.18, offset),
            new THREE.Vector3(x - 0.12, 0.25, offset),
            new THREE.Vector3(x + 0.12, 0.7, offset),
            new THREE.Vector3(x - 0.1, 1.18, offset)
        ];
        const curve = new THREE.CatmullRomCurve3(points);
        steam.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 36, 0.018, 6, false), steamMaterial));
    });

    const actors = { root, plate, food, orbit, berry, steam };
    const stops = [
        { camera: [0.1, 2.1, 11.4], focus: [0.05, 0.05, 0], actors: { root: { scale: [1.2, 1.2, 1.2] }, plate: { rotation: [-58, -12, 4], scale: [0.84, 0.84, 0.84] }, food: { scale: [0.02, 0.02, 0.02] }, orbit: { rotation: [-10, 0, 0], scale: [0.82, 0.82, 0.82] }, steam: { position: [0, -1.3, 0], scale: [0.02, 0.02, 0.02] } } },
        { camera: [-2.05, 3.5, 9.1], focus: [-0.25, 0.2, 0], actors: { root: { scale: [1.2, 1.2, 1.2] }, plate: { rotation: [-68, 32, -5], scale: [0.88, 0.88, 0.88] }, food: { position: [-0.3, 0.1, -0.2], scale: [0.03, 0.03, 0.03] }, orbit: { rotation: [7, 58, -9], scale: [1.05, 1.05, 1.05] }, berry: { position: [-2.12, 0.95, 0.1] }, steam: { position: [0, -1.3, 0], scale: [0.03, 0.03, 0.03] } } },
        { camera: [-0.85, 2.9, 8.2], focus: [0.05, 0.08, 0], actors: { root: { scale: [1.2, 1.2, 1.2] }, plate: { rotation: [-49, 70, 7], scale: [0.96, 0.96, 0.96] }, food: { position: [0, 0, 0], rotation: [0, -18, 0], scale: [0.42, 0.42, 0.42] }, orbit: { rotation: [16, 122, 8], scale: [1.12, 1.12, 1.12] }, berry: { position: [2.42, 0.52, 0.18] }, steam: { position: [0, 0, 0], scale: [0.45, 0.45, 0.45] } } },
        { camera: [1.05, 1.25, 7.05], focus: [0.18, 0.02, 0], actors: { root: { scale: [1.2, 1.2, 1.2] }, plate: { rotation: [-46, 134, 1], scale: [1.08, 1.08, 1.08] }, food: { position: [0, 0, 0], rotation: [0, 18, 0], scale: [1.04, 1.04, 1.04] }, orbit: { rotation: [15, 205, 6], scale: [1.12, 1.12, 1.12] }, berry: { position: [2.45, 0.36, 0.1] }, steam: { position: [0, 0.12, 0], scale: [1.05, 1.05, 1.05] } } },
        { camera: [0.25, 2.15, 9.1], focus: [0.08, -0.08, 0], actors: { root: { scale: [1.2, 1.2, 1.2] }, plate: { rotation: [-56, 208, 0], scale: [1.02, 1.02, 1.02] }, food: { position: [0.05, 0.02, 0], rotation: [0, 34, 0], scale: [0.98, 0.98, 0.98] }, orbit: { rotation: [-7, 282, 13], scale: [1.05, 1.05, 1.05] }, berry: { position: [2.28, 0.34, 0.12] }, steam: { position: [0, 0.06, 0], scale: [0.74, 0.74, 0.74] } } }
    ];

    return { ...world, actors, stops, accent: '#bc6544' };
}
