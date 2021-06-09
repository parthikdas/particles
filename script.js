import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import {OrbitControls} from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js'
//setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#webgl'),
    //alpha:true
});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(new THREE.Color('#21282a'),1);
camera.position.set(0, 0 ,2);
renderer.render(scene, camera);
//controls
const controls = new OrbitControls( camera, renderer.domElement );
//window resizing
window.addEventListener('resize',() => {//if window is resized this will take care
    // Update camera
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});
//Lighting
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);
//Objects
const sphere = new THREE.Points(
    new THREE.TorusGeometry( .7, .2, 16, 100 ),
    new THREE.PointsMaterial( { 
        color: 0xffffff,
        size: 0.005
    } )
);
scene.add(sphere);
const particlesGeometry = new THREE.BufferGeometry;
const particleCount = 5000;
const posArray = new Float32Array(particleCount * 3);//xyz xyz xyz xyz....5000
for(let i=0;i<particleCount*3;i++){
    posArray[i] = (Math.random() - 0.5) * 5;//-.5 to move in middle of screen and *5 to make distances far away from each other and cover screen
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particalMaterial = new THREE.PointsMaterial({
    size : 0.003,
    //map : new THREE.TextureLoader().load('star.png'),
    //transparent: true,//bcz of this it became star
})
const particleMesh = new THREE.Points(particlesGeometry, particalMaterial);
scene.add(particleMesh);
//Mouse
document.addEventListener('mousemove', animateParticles);
let mouseX=0, mouseY=0;
function animateParticles(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}
//Animation
const clock = new THREE.Clock();
const animate = function () {
    requestAnimationFrame( animate );//a mechanism that tells the browser u want to perform an animation
    const elapsedTime = clock.getElapsedTime();
    sphere.rotation.y = .5 * elapsedTime;
    particleMesh.rotation.y = -.1 * elapsedTime;
    if(mouseX > 0){
        particleMesh.rotation.x = -mouseY* (elapsedTime*0.00008);//0.00008 is to make it slower 
        particleMesh.rotation.y = mouseX* (elapsedTime*0.00008); 
    }
    controls.update();
    renderer.render( scene, camera );
};
animate();