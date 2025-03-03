import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.136.0/build/three.module.min.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.136.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';


// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Light blue sky
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 2;
controls.maxDistance = 20;
controls.maxPolarAngle = Math.PI / 2;

// World Name
const worldName = "Zanytown Adventures";

// Ground Plane
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x88cc88 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Start Menu
const startMenu = document.createElement('div');
startMenu.style.position = 'absolute';
startMenu.style.top = '0';
startMenu.style.left = '0';
startMenu.style.width = '100%';
startMenu.style.height = '100%';
startMenu.style.background = 'rgba(0, 0, 0, 0.8)';
startMenu.style.display = 'flex';
startMenu.style.flexDirection = 'column';
startMenu.style.alignItems = 'center';
startMenu.style.justifyContent = 'center';
startMenu.style.color = 'white';
startMenu.style.fontFamily = 'Comic Sans MS, cursive';
startMenu.innerHTML = `<h1 style="font-size: 3em; text-align: center;">Oh, the Places You’ll Explore!</h1>` +
    `<p style="font-size: 1.5em; text-align: center;">Welcome to ${worldName}! Click below to begin your journey!</p>`;
const startButton = document.createElement('button');
startButton.innerText = 'Start Adventure';
startButton.style.fontSize = '1.5em';
startButton.style.padding = '10px 20px';
startButton.style.marginTop = '20px';
startButton.style.cursor = 'pointer';
startButton.onclick = function() {
    document.body.removeChild(startMenu);
    spawnCharacter();
};
startMenu.appendChild(startButton);
document.body.appendChild(startMenu);

// Character movement controls
let character;
const speed = 0.2;
const jumpSpeed = 0.3;
const gravity = 0.01;
let velocityY = 0;
let isJumping = false;
const keys = {};

window.addEventListener('keydown', (event) => { keys[event.key] = true; });
window.addEventListener('keyup', (event) => { keys[event.key] = false; });

function moveCharacter() {
    if (!character) return;
    if (keys['ArrowUp']) character.position.z -= speed;
    if (keys['ArrowDown']) character.position.z += speed;
    if (keys['ArrowLeft']) character.position.x -= speed;
    if (keys['ArrowRight']) character.position.x += speed;
    if (keys[' '] && !isJumping) {
        velocityY = jumpSpeed;
        isJumping = true;
    }
    
    // Apply gravity
    character.position.y += velocityY;
    velocityY -= gravity;
    if (character.position.y <= 0) {
        character.position.y = 0;
        isJumping = false;
    }
}

// Camera follows character
function updateCamera() {
    if (character) {
        camera.position.x = character.position.x;
        camera.position.z = character.position.z + 5;
        camera.lookAt(character.position);
    }
}

// Spawn Character
function spawnCharacter() {
    character = new THREE.Group();
    const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc00 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    character.add(body);
    
    const headGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ color: '#FFD700' });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1;
    character.add(head);
    
    const hairGeometry = new THREE.ConeGeometry(0.3, 0.5, 8);
    const hairMaterial = new THREE.MeshStandardMaterial({ color: 0xff5733 });
    const hair = new THREE.Mesh(hairGeometry, hairMaterial);
    hair.position.y = 1.5;
    character.add(hair);
    
    character.position.set(0, 1, 0);
    scene.add(character);
}

// Animate scene
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    moveCharacter();
    updateCamera();
    renderer.render(scene, camera);
}
animate();
