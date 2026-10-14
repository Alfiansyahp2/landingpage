import * as THREE from 'three';

export function createWorld(accent = '#bd6548', desktopOffset = 1.55) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 80);
    camera.position.set(0, 2.6, 10.5);

    const focus = new THREE.Vector3(0, 0, 0);
    const root = new THREE.Group();
    root.position.x = desktopOffset;
    scene.add(root);

    scene.add(new THREE.AmbientLight(0xffffff, 2.1));

    const keyLight = new THREE.DirectionalLight(0xfff4e6, 3.4);
    keyLight.position.set(-3.5, 6, 7);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(new THREE.Color(accent), 26, 24, 2);
    rimLight.position.set(3.2, 2.8, -1.5);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xffffff, 14, 25, 2);
    fillLight.position.set(-3, -1, 5);
    scene.add(fillLight);

    return { scene, camera, focus, root, desktopOffset };
}

export function standard(color, options = {}) {
    return new THREE.MeshStandardMaterial({
        color,
        roughness: options.roughness ?? 0.38,
        metalness: options.metalness ?? 0.12,
        transparent: options.transparent ?? false,
        opacity: options.opacity ?? 1,
        wireframe: options.wireframe ?? false,
        side: options.doubleSided ? THREE.DoubleSide : THREE.FrontSide
    });
}

export function addMesh(parent, geometry, material, position = [0, 0, 0], scale = [1, 1, 1]) {
    const object = new THREE.Mesh(geometry, material);
    object.position.set(...position);
    object.scale.set(...scale);
    object.castShadow = false;
    object.receiveShadow = false;
    parent.add(object);
    return object;
}

export function addWire(parent, geometry, color = '#ffffff', opacity = 0.42) {
    const wireGeometry = new THREE.EdgesGeometry(geometry);
    const wireMaterial = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
    const lines = new THREE.LineSegments(wireGeometry, wireMaterial);
    parent.add(lines);
    return lines;
}

export function addCylinderBetween(parent, start, end, radius, material, radialSegments = 10) {
    const from = new THREE.Vector3(...start);
    const to = new THREE.Vector3(...end);
    const direction = new THREE.Vector3().subVectors(to, from);
    const geometry = new THREE.CylinderGeometry(radius, radius, direction.length(), radialSegments);
    const object = addMesh(parent, geometry, material, [0, 0, 0]);
    object.position.copy(from).add(to).multiplyScalar(0.5);
    object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    return object;
}

export function createTracks(timeline, world, stops, actors, segmentDuration = 1000) {
    const addVector = (target, value, time) => {
        timeline.add(target, { x: value[0], y: value[1], z: value[2] }, time);
    };

    stops.forEach((stop, index) => {
        const at = index * segmentDuration;
        addVector(world.camera.position, stop.camera, at);
        addVector(world.focus, stop.focus, at);

        for (const [name, pose] of Object.entries(stop.actors || {})) {
            const actor = actors[name];
            if (!actor) continue;
            if (pose.position) addVector(actor.position, pose.position, at);
            if (pose.rotation) {
                timeline.add(actor, {
                    rotateX: pose.rotation[0],
                    rotateY: pose.rotation[1],
                    rotateZ: pose.rotation[2]
                }, at);
            }
            if (pose.scale) addVector(actor.scale, pose.scale, at);
        }
    });

    return segmentDuration * stops.length;
}
