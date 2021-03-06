import * as THREE from 'three';

window.THREE = THREE;

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { TextureLoader } from "three";

import TWEEN from '@tweenjs/tween.js';

import PhoneModel from './assets/models/phone3d.glb';
import TexturePhone from './assets/texture/phoneImage4.jpg';

var camera, scene, renderer;
var geometry, material, mesh;

var mouseX = 0, mouseY = 0;
// var mouseX = 350, mouseY = 400;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera( 26, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 18800;

    var scaleCamera = camera.position;
    const tweenScale = new TWEEN.Tween(scaleCamera)
      .delay(1000)
      .to({ z: 1800 }, 1000)
      .easing(TWEEN.Easing.Quadratic.Out)

    tweenScale.start()

    scene = new THREE.Scene();
    window.scene = scene;

    var light = new THREE.DirectionalLight( 0xffffff, 1.2 );
    light.position.set( .1, 0, 1 );
    scene.add(light);

    var geometryPlane = new THREE.PlaneGeometry( 18, 4, 32 );
    // var geometryPlane = new THREE.PlaneGeometry( 80, 10, 32 );
    var materialplane = new THREE.MeshBasicMaterial( {color: 0x494949, side: THREE.DoubleSide} );
    var planePhone = new THREE.Mesh( geometryPlane, materialplane );
    planePhone.name = 'planePhone'

    var geometryPlaneSide = new THREE.PlaneGeometry( 18, 18, 32 );
    var planePhoneSide = new THREE.Mesh( geometryPlaneSide, materialplane );
    planePhoneSide.name = 'planePhone'

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();

    dracoLoader.setDecoderPath('./draco/');

    loader.setDRACOLoader(dracoLoader);

    loader.load(PhoneModel, function (gltfModel ) {
        const model1 = gltfModel.scene;
        var newMaterial = new THREE.MeshStandardMaterial({color: 0x494949});

        model1.traverse((o) => {
            if(o.name === 'Iphone001') {
                o.material = newMaterial;
            }

            if(o.name === 'header_footer') {
                var textureHeaderFooter = new THREE.TextureLoader().load( TexturePhone );
                var materialTextureHeaderFooter = new THREE.MeshBasicMaterial( { map: textureHeaderFooter } );
                o.material = materialTextureHeaderFooter;
                o.material.map.offset.x = 0;
                o.material.map.offset.y = 0;
            }

            if(o.name === 'Ecran001') {
                var textureBody = new THREE.TextureLoader().load( TexturePhone );
                var materialTextureBody = new THREE.MeshBasicMaterial( { map: textureBody } );
                o.material = materialTextureBody;
                o.material.map.offset.x = 0;
                o.material.map.offset.y = 0.286;
            }

        });

        const model2 = model1.clone();

        model2.traverse((o) => {
            if(o.name === 'Ecran001') {
                var textureBody = new THREE.TextureLoader().load( TexturePhone );
                var materialTextureBody = new THREE.MeshBasicMaterial( { map: textureBody } );
                o.material = materialTextureBody;
                o.material.map.offset.x = 0;
                o.material.map.offset.y = 0.286;

                var xy = o.material.map.offset;
                const tween1 = new TWEEN.Tween(xy)
                  .delay(4000)
                  .to({ x: 0.241 }, 2000)
                  .easing(TWEEN.Easing.Quadratic.Out)

                const tween2 = new TWEEN.Tween(xy)
                  .delay(4000)
                  .to({ x: 0.485 }, 2000)
                  .easing(TWEEN.Easing.Quadratic.Out)

                const tween3 = new TWEEN.Tween(xy)
                  .delay(4000)
                  .to({ x: 0.241 }, 2000)
                  .easing(TWEEN.Easing.Quadratic.Out)

                const tween4 = new TWEEN.Tween(xy)
                  .delay(4000)
                  .to({ x: 0 }, 2000)
                  .easing(TWEEN.Easing.Quadratic.Out)

                tween1.chain(tween2)
                tween2.chain(tween3)
                tween3.chain(tween4)
                tween4.chain(tween1)

                tween1.start();
            }
        });

        model1.scale.set(1.8, 1.8, 1.8);
        model1.rotation.set(0, .7, 0);
        model1.position.set(-100, -30, 0);

        model2.scale.set(2.1, 2.1, 2.1);
        model2.rotation.set(0, -.5, 0);
        model2.position.set(50, 60, 50);

        planePhone.scale.set(2, 2, 2);
        planePhone.position.set(5, 102, 0);
        const planePhone2 = planePhone.clone();

        planePhoneSide.scale.set(2.1, 2.1, 2.1);
        planePhoneSide.position.set(35.5, 5, 1);

        const planePhoneSide2 = planePhoneSide.clone();
        const planePhoneSide3 = planePhoneSide.clone();

        planePhoneSide2.position.set(35.5, 5, -2.6);

        planePhoneSide3.position.set(-49, 77, -1);
        planePhoneSide3.scale.set(.65, .65, .65);

        model1.add(planePhone);
        model2.add(planePhone2);
        model2.add(planePhoneSide);
        model2.add(planePhoneSide2);
        model1.add(planePhoneSide3);

        scene.add( model1 );
        scene.add( model2 );
    }, undefined, function ( error ) {
        console.log('q2')
        console.error( error );
    } );

    renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.querySelector('#canvas').appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    window.addEventListener( 'resize', onWindowResize, false );
}

function onDocumentMouseMove( event ) {
    mouseX = ( - event.clientX + windowHalfX );
    mouseY = ( - event.clientY + windowHalfY );
}
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    TWEEN.update();
    requestAnimationFrame( animate );

    camera.position.x += ( mouseX - camera.position.x ) * 0.01;
    camera.position.y += ( - mouseY - camera.position.y ) * 0.01;
    camera.lookAt( scene.position );

    renderer.render( scene, camera );
}