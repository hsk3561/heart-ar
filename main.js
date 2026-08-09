import * as THREE from 'three';

import { ARButton } from
'three/addons/webxr/ARButton.js';

import { GLTFLoader } from
'three/addons/loaders/GLTFLoader.js';


let camera;
let scene;
let renderer;

let controller;
let reticle;

let hitTestSource = null;
let hitTestSourceRequested = false;

let heartModel = null;
let mixer = null;

const clock = new THREE.Clock();


init();


function init() {

    // -----------------------------
    // SCENE
    // -----------------------------

    scene = new THREE.Scene();


    // -----------------------------
    // CAMERA
    // -----------------------------

    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        20
    );


    // -----------------------------
    // LIGHT
    // -----------------------------

    const hemisphereLight =
        new THREE.HemisphereLight(
            0xffffff,
            0xbbbbff,
            3
        );

    scene.add(hemisphereLight);


    // -----------------------------
    // RENDERER
    // -----------------------------

    renderer =
        new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

    renderer.setPixelRatio(
        window.devicePixelRatio
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.xr.enabled = true;

    document.body.appendChild(
        renderer.domElement
    );


    // -----------------------------
    // AR BUTTON
    // -----------------------------

    const arButton =
        ARButton.createButton(
            renderer,
            {
                requiredFeatures: [
                    'hit-test'
                ]
            }
        );

    document.body.appendChild(arButton);


    // -----------------------------
    // LOAD HEART
    // -----------------------------

    loadHeart();


    // -----------------------------
    // RETICLE
    // -----------------------------

    const geometry =
        new THREE.RingGeometry(
            0.08,
            0.10,
            32
        );

    geometry.rotateX(
        -Math.PI / 2
    );

    const material =
        new THREE.MeshBasicMaterial();

    reticle =
        new THREE.Mesh(
            geometry,
            material
        );

    reticle.matrixAutoUpdate = false;

    reticle.visible = false;

    scene.add(reticle);


    // -----------------------------
    // CONTROLLER
    // -----------------------------

    controller =
        renderer.xr.getController(0);

    controller.addEventListener(
        'select',
        placeHeart
    );

    scene.add(controller);


    // -----------------------------
    // RESIZE
    // -----------------------------

    window.addEventListener(
        'resize',
        onWindowResize
    );


    renderer.setAnimationLoop(render);
}
function loadHeart() {

    const loader =
        new GLTFLoader();


    loader.load(

        './models/heart.glb',

        function (gltf) {

            heartModel =
                gltf.scene;


            // الحجم المبدئي
            heartModel.scale.set(
                0.15,
                0.15,
                0.15
            );


            // القلب مخفي حتى يحدد الطفل مكانه
            heartModel.visible = false;

            scene.add(heartModel);


            // -------------------------
            // ANIMATION
            // -------------------------

            if (
                gltf.animations &&
                gltf.animations.length > 0
            ) {

                mixer =
                    new THREE.AnimationMixer(
                        heartModel
                    );


                gltf.animations.forEach(
                    (clip) => {

                        mixer
                            .clipAction(clip)
                            .play();

                    }
                );

            }


            console.log(
                'Heart loaded successfully'
            );

            console.log(
                'Animations:',
                gltf.animations
            );

        },

        undefined,

        function (error) {

            console.error(
                'Error loading heart:',
                error
            );

        }

    );

}
function render(
    timestamp,
    frame
) {

    const delta =
        clock.getDelta();


    // تشغيل نبض القلب
    if (mixer) {

        mixer.update(delta);

    }


    if (frame) {

        const referenceSpace =
            renderer.xr.getReferenceSpace();

        const session =
            renderer.xr.getSession();


        if (
            hitTestSourceRequested === false
        ) {

            session.requestReferenceSpace(
                'viewer'
            )
            .then(
                function(referenceSpace) {

                    session
                    .requestHitTestSource({
                        space:
                            referenceSpace
                    })
                    .then(
                        function(source) {

                            hitTestSource =
                                source;

                        }
                    );

                }
            );


            session.addEventListener(
                'end',
                function() {

                    hitTestSourceRequested =
                        false;

                    hitTestSource =
                        null;

                }
            );


            hitTestSourceRequested = true;

        }


        if (hitTestSource) {

            const hitTestResults =
                frame.getHitTestResults(
                    hitTestSource
                );


            if (
                hitTestResults.length
            ) {

                const hit =
                    hitTestResults[0];


                reticle.visible =
                    true;


                reticle.matrix.fromArray(

                    hit
                    .getPose(
                        referenceSpace
                    )
                    .transform
                    .matrix

                );

            }

            else {

                reticle.visible =
                    false;

            }

        }

    }


    renderer.render(
        scene,
        camera
    );

}
function onWindowResize() {

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

}