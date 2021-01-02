import * as THREE from '/build/three.module.js';
import { OrbitControls } from '/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from './GLTFLoader.js';
let scene, camera,camera2,renderer , texture, loader
let car
let raycast = new THREE.Raycaster()
let mouse = new THREE.Vector2()
const meshes = []
const groupcar = new THREE.Group();
let controls ;
window.addEventListener('resize', onWindowResize, false)

function Object() {
    //Floor
    Floor()
    //Street Lights
    Poles()
    //Building---------------------------------------------
    rightBuilding()
    leftBuilding()
    
    //Text
    Text()
    
    //Car

    loader = new GLTFLoader();
    loader.load( 'model/model.glb', function ( gltf ) {
        car = gltf.scene;
        car.scale.set(5,5,5)
        car.position.x = 7
        car.position.y = 1
        groupcar.add( gltf.scene );
    });
    
    
    //Car Light
    const targetLeft = new THREE.Object3D();
    targetLeft.position.set(4,4,90)
    groupcar.add(targetLeft)

    let lightcarleft
    lightcarleft = new THREE.SpotLight(0xFFFFFF, 5, 80, THREE.Math.degToRad(10), 0.4, 1)
    lightcarleft.position.set(4,4,-4)
    lightcarleft.target = targetLeft
    lightcarleft.power = 150
    groupcar.add(lightcarleft)

    const targetRight = new THREE.Object3D();
    targetRight.position.set(10,4,90)
    groupcar.add(targetRight)

    let lightcarright
    lightcarright = new THREE.SpotLight(0xFFFFFF, 5, 80, THREE.Math.degToRad(10), 0.4, 1)
    lightcarright.position.set(10,4,-4)
    lightcarright.target = targetRight
    lightcarright.power = 100
    groupcar.add(lightcarright)

    scene.add(groupcar)
    groupcar.position.set(0,0,0)
}


function init() {
    //Camera & Scene
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(-40, 25, 200);
    renderer = new THREE.WebGLRenderer({
        antialias : true 
    })
    controls = new OrbitControls(camera, renderer.domElement)
    controls.target.copy(car.position);
    controls.enableDamping = true;
    // controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    controls.minAzimuthAngle = - Math.PI-0.09; 
    controls.maxAzimuthAngle = Math.PI+0.09; 
    controls.minPolarAngle = -Math.PI; 
    controls.maxPolarAngle = 1.5; 
    controls.update();
    renderer.setSize(window.innerWidth, window.innerHeight) 
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    document.body.appendChild(renderer.domElement)
    Object()
    Lighting()
    createSkybox()
    
    function animate() {
        renderer.render(scene,camera)
        controls.update();
        controls.target.copy(car.position);
        requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
}

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

let addListener = () => {
    document.addEventListener("keydown", keyListener);
}

let keyListener = event => {
    let code = event.keyCode;
    if(code == 87){
        groupcar.position.z += 3;
    }
    else
    if(code == 83){
        groupcar.position.z -= 3;
    }
    controls.target = groupcar.position;
}

window.onkeydown = (evt)=>{
    keyListener(evt.code);
}

// let handleMouse = () => {
//     if
// }



//Objects

//Lighting
function Lighting(){
    let light
    
    light = new THREE.PointLight(0xF4F1C9)
    light.distance = 1000
    light.decay = 1.5
    light.position.x = 0
    light.position.y = 500
    light.position.z = 250
    scene.add(light)
}


//Skybox
function createSkybox(){
    const skygeo = new THREE.BoxGeometry(500,500,500)
    const skyloader = new THREE.TextureLoader()

    const skytex = [
        skyloader.load('./cubemap/px.png'),
        skyloader.load('./cubemap/nx.png'),
        skyloader.load('./cubemap/py.png'),
        skyloader.load('./cubemap/ny.png'),
        skyloader.load('./cubemap/pz.png'),
        skyloader.load('./cubemap/nz.png')
    ]

    const skymat = skytex.map(texture => {
        return new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide,
            color: 0x777777
        })
    })
    const skymesh = new THREE.Mesh(skygeo, skymat)
    skymesh.position.set(0, -70, 0)
    scene.add(skymesh)
}

function Floor(){
    let geometry,material,mesh;
    //Asphalt---------------------------------------------
    geometry = new THREE.PlaneGeometry(500,500)
    loader = new THREE.TextureLoader()
    texture = loader.load('./asphalt.jpg')
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(20,20)
    material = new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        map : texture
    })
    mesh = new THREE.Mesh(geometry,material)
    mesh.position.set(0, 0, 0); 
    mesh.rotation.x = Math.PI/2;
    scene.add(mesh)
    meshes.push(mesh)
    //Road---------------------------------------------
    geometry = new THREE.PlaneGeometry(30,500)
    loader = new THREE.TextureLoader()
    texture = loader.load('./road.jpg')
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1,8)
    material = new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        map : texture,
        
    })
    mesh = new THREE.Mesh(geometry,material)
    mesh.position.set(0, 1, 0);
    mesh.rotation.x = Math.PI/2;

    scene.add(mesh)
    meshes.push(mesh)
}

function leftBuilding(){
    let mesh,mesh0,mesh9,mesh8,mesh7,mesh6,mesh5,mesh4,mesh3,mesh2,geometry,material
    var height = [60,90,120]
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1,height[result]/30)
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh = new THREE.Mesh(geometry,material)
    mesh.position.set(40, height[result]/2+1, 12.5);
    mesh.receiveShadow = true;
    scene.add(mesh)
    meshes.push(mesh)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh2 = new THREE.Mesh(geometry,material)
    mesh2.position.set(40, height[result]/2+1, 37.5);
    mesh2.receiveShadow = true
    scene.add(mesh2)
    meshes.push(mesh2)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh3 = new THREE.Mesh(geometry,material)
    mesh3.position.set(40, height[result]/2+1, 62.5);
    mesh3.receiveShadow = true
    scene.add(mesh3)
    meshes.push(mesh3)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh4 = new THREE.Mesh(geometry,material)
    mesh4.position.set(40, height[result]/2+1, 87.5);
    mesh4.receiveShadow = true
    scene.add(mesh4)
    meshes.push(mesh4)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh5 = new THREE.Mesh(geometry,material)
    mesh5.position.set(40, height[result]/2+1, 112.5);
    mesh5.receiveShadow = true
    scene.add(mesh5)
    meshes.push(mesh5)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh6 = new THREE.Mesh(geometry,material)
    mesh6.position.set(40, height[result]/2+1, 137.5);
    mesh6.receiveShadow = true
    scene.add(mesh6)
    meshes.push(mesh6)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh7 = new THREE.Mesh(geometry,material)
    mesh7.position.set(40, height[result]/2+1, 162.5);
    mesh7.receiveShadow = true
    scene.add(mesh7)
    meshes.push(mesh7)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh8 = new THREE.Mesh(geometry,material)
    mesh8.position.set(40, height[result]/2+1, 187.5);
    mesh8.receiveShadow = true
    scene.add(mesh8)
    meshes.push(mesh8)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh9 = new THREE.Mesh(geometry,material)
    mesh9.position.set(40, height[result]/2+1, 212.5);
    mesh9.receiveShadow = true
    scene.add(mesh9)
    meshes.push(mesh9)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh0 = new THREE.Mesh(geometry,material)
    mesh0.position.set(40, height[result]/2+1,237.5);
    mesh0.receiveShadow = true
    scene.add(mesh0)
    meshes.push(mesh0)
    var height = [40,90,120]    
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh0 = new THREE.Mesh(geometry,material)
    mesh0.position.set(40, height[result]/2+1,-237.5);
    mesh0.receiveShadow = true
    scene.add(mesh0)
    meshes.push(mesh0)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh0 = new THREE.Mesh(geometry,material)
    mesh0.position.set(40, height[result]/2+1,-212.5);
    mesh0.receiveShadow = true
    scene.add(mesh0)
    meshes.push(mesh0)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh0 = new THREE.Mesh(geometry,material)
    mesh0.position.set(40, height[result]/2+1,-187.5);
    mesh0.receiveShadow = true
    scene.add(mesh0)
    meshes.push(mesh0)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh0 = new THREE.Mesh(geometry,material)
    mesh0.position.set(40, height[result]/2+1,-162.5);
    mesh0.receiveShadow = true
    scene.add(mesh0)
    meshes.push(mesh0)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh0 = new THREE.Mesh(geometry,material)
    mesh0.position.set(40, height[result]/2+1,-137.5);
    mesh0.receiveShadow = true
    scene.add(mesh0)
    meshes.push(mesh0)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh0 = new THREE.Mesh(geometry,material)
    mesh0.position.set(40, height[result]/2+1,-112.5);
    mesh0.receiveShadow = true
    scene.add(mesh0)
    meshes.push(mesh0)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh0 = new THREE.Mesh(geometry,material)
    mesh0.position.set(40, height[result]/2+1,-87.5);
    mesh0.receiveShadow = true
    scene.add(mesh0)
    meshes.push(mesh0)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh0 = new THREE.Mesh(geometry,material)
    mesh0.position.set(40, height[result]/2+1,-62.5);
    mesh0.receiveShadow = true
    scene.add(mesh0)
    meshes.push(mesh0)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh0 = new THREE.Mesh(geometry,material)
    mesh0.position.set(40, height[result]/2+1,-37.5);
    mesh0.receiveShadow = true
    scene.add(mesh0)
    meshes.push(mesh0)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh0 = new THREE.Mesh(geometry,material)
    mesh0.position.set(40, height[result]/2+1,-12.5);
    mesh0.receiveShadow = true
    scene.add(mesh0)
    meshes.push(mesh0)
}

function rightBuilding(){
    let mesh,mesh0,mesh9,mesh8,mesh7,mesh6,mesh5,mesh4,mesh3,mesh2,geometry,material
    var height = [60,90,120]
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1,height[result]/30)
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh = new THREE.Mesh(geometry,material)
    mesh.position.set(-40, height[result]/2+1, 12.5);
    mesh.receiveShadow = true;
    scene.add(mesh)
    meshes.push(mesh)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh2 = new THREE.Mesh(geometry,material)
    mesh2.position.set(-40, height[result]/2+1, 37.5);
    mesh2.receiveShadow = true
    scene.add(mesh2)
    meshes.push(mesh2)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh3 = new THREE.Mesh(geometry,material)
    mesh3.position.set(-40, height[result]/2+1, 62.5);
    mesh3.receiveShadow = true
    scene.add(mesh3)
    meshes.push(mesh3)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh4 = new THREE.Mesh(geometry,material)
    mesh4.position.set(-40, height[result]/2+1, 87.5);
    mesh4.receiveShadow = true
    scene.add(mesh4)
    meshes.push(mesh4)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh5 = new THREE.Mesh(geometry,material)
    mesh5.position.set(-40, height[result]/2+1, 112.5);
    mesh5.receiveShadow = true
    scene.add(mesh5)
    meshes.push(mesh5)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh6 = new THREE.Mesh(geometry,material)
    mesh6.position.set(-40, height[result]/2+1, 137.5);
    mesh6.receiveShadow = true
    scene.add(mesh6)
    meshes.push(mesh6)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh7 = new THREE.Mesh(geometry,material)
    mesh7.position.set(-40, height[result]/2+1, 162.5);
    mesh7.receiveShadow = true
    scene.add(mesh7)
    meshes.push(mesh7)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh8 = new THREE.Mesh(geometry,material)
    mesh8.position.set(-40, height[result]/2+1, 187.5);
    mesh8.receiveShadow = true
    scene.add(mesh8)
    meshes.push(mesh8)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh9 = new THREE.Mesh(geometry,material)
    mesh9.position.set(-40, height[result]/2+1, 212.5);
    mesh9.receiveShadow = true
    scene.add(mesh9)
    meshes.push(mesh9)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh0 = new THREE.Mesh(geometry,material)
    mesh0.position.set(-40, height[result]/2+1,237.5);
    mesh0.receiveShadow = true
    scene.add(mesh0)
    meshes.push(mesh0)
    var height = [40,90,120]    
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh0 = new THREE.Mesh(geometry,material)
    mesh0.position.set(-40, height[result]/2+1,-237.5);
    mesh0.receiveShadow = true
    scene.add(mesh0)
    meshes.push(mesh0)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh0 = new THREE.Mesh(geometry,material)
    mesh0.position.set(-40, height[result]/2+1,-212.5);
    mesh0.receiveShadow = true
    scene.add(mesh0)
    meshes.push(mesh0)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh0 = new THREE.Mesh(geometry,material)
    mesh0.position.set(-40, height[result]/2+1,-187.5);
    mesh0.receiveShadow = true
    scene.add(mesh0)
    meshes.push(mesh0)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh0 = new THREE.Mesh(geometry,material)
    mesh0.position.set(-40, height[result]/2+1,-162.5);
    mesh0.receiveShadow = true
    scene.add(mesh0)
    meshes.push(mesh0)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh0 = new THREE.Mesh(geometry,material)
    mesh0.position.set(-40, height[result]/2+1,-137.5);
    mesh0.receiveShadow = true
    scene.add(mesh0)
    meshes.push(mesh0)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh0 = new THREE.Mesh(geometry,material)
    mesh0.position.set(-40, height[result]/2+1,-112.5);
    mesh0.receiveShadow = true
    scene.add(mesh0)
    meshes.push(mesh0)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh0 = new THREE.Mesh(geometry,material)
    mesh0.position.set(-40, height[result]/2+1,-87.5);
    mesh0.receiveShadow = true
    scene.add(mesh0)
    meshes.push(mesh0)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh0 = new THREE.Mesh(geometry,material)
    mesh0.position.set(-40, height[result]/2+1,-62.5);
    mesh0.receiveShadow = true
    scene.add(mesh0)
    meshes.push(mesh0)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh0 = new THREE.Mesh(geometry,material)
    mesh0.position.set(-40, height[result]/2+1,-37.5);
    mesh0.receiveShadow = true
    scene.add(mesh0)
    meshes.push(mesh0)
    var result = Math.floor(Math.random() * 3); 
    geometry = new THREE.BoxGeometry(25,height[result],25)
    loader = new THREE.TextureLoader()
    texture = loader.load('./building.jpg')
    texture.repeat.set(1,height[result]/30)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshStandardMaterial({
        map : texture,
        metalness: 0.65,
        roughness: 0.67
    })
    mesh0 = new THREE.Mesh(geometry,material)
    mesh0.position.set(-40, height[result]/2+1,-12.5);
    mesh0.receiveShadow = true
    scene.add(mesh0)
    meshes.push(mesh0)
}

function Poles(){
    let geometry, material, mesh
    //Street light
        //Pole---------------------------------------------
        geometry = new THREE.CylinderGeometry(1,1,30)
        material = new THREE.MeshStandardMaterial({
            color: 0x43464B,
            roughness: 0.1,
            metalness: 0.6,
        })
        let mesh7 = new THREE.Mesh(geometry,material)
        mesh7.position.set(20, 15, -120);
        mesh7.castShadow = true
        scene.add(mesh7)
        meshes.push(mesh7)
        let mesh3 = new THREE.Mesh(geometry,material)
        mesh3.castShadow = true
        mesh3.position.set(-20, 15, -120);
        scene.add(mesh3)
        meshes.push(mesh3)
        let mesh8 = new THREE.Mesh(geometry,material)
        mesh8.castShadow = true
        mesh8.position.set(20, 15, -240);
        scene.add(mesh8)
        meshes.push(mesh8)
        let mesh4 = new THREE.Mesh(geometry,material)
        mesh4.castShadow = true
        mesh4.position.set(-20, 15, -240);
        scene.add(mesh4)
        meshes.push(mesh4)
        let mesh2 = new THREE.Mesh(geometry,material)
        mesh2.castShadow = true
        mesh2.position.set(-20, 15, 240);
        scene.add(mesh2)
        meshes.push(mesh2)
        let mesh6 = new THREE.Mesh(geometry,material)
        mesh6.castShadow = true
        mesh6.position.set(20, 15, 240);
        scene.add(mesh6)
        meshes.push(mesh6)
        let mesh5 = new THREE.Mesh(geometry,material)
        mesh5.castShadow = true
        mesh5.position.set(20, 15, 120);
        scene.add(mesh5)
        meshes.push(mesh5)
        mesh = new THREE.Mesh(geometry,material)
        mesh.castShadow = true
        mesh.position.set(-20, 15, 120);
        scene.add(mesh)
        meshes.push(mesh)
        //Lamp Container---------------------------------------------
        geometry = new THREE.CylinderGeometry(2,1,2,4)
        material = new THREE.MeshPhongMaterial({
            color: 0x43464B,
            wireframe: true
        })
        mesh = new THREE.Mesh(geometry,material)
        mesh.position.set(-20, 31, 120);
        mesh.castShadow = true
        scene.add(mesh)
        meshes.push(mesh)
        mesh2 = new THREE.Mesh(geometry,material)
        mesh2.castShadow = true
        mesh2.position.set(-20, 31, 240);
        scene.add(mesh2)
        meshes.push(mesh2)
        mesh3 = new THREE.Mesh(geometry,material)
        mesh3.castShadow = true
        mesh3.position.set(-20, 31, -240);
        scene.add(mesh3)
        meshes.push(mesh3)
        mesh4 = new THREE.Mesh(geometry,material)
        mesh4.castShadow = true
        mesh4.position.set(-20, 31, -120);
        scene.add(mesh4)
        meshes.push(mesh4)
        mesh5 = new THREE.Mesh(geometry,material)
        mesh5.castShadow = true
        mesh5.position.set(20, 31, 240);
        scene.add(mesh5)
        meshes.push(mesh5)
        mesh6 = new THREE.Mesh(geometry,material)
        mesh6.castShadow = true
        mesh6.position.set(20, 31, 120);
        scene.add(mesh6)
        meshes.push(mesh6)
        mesh7 = new THREE.Mesh(geometry,material)
        mesh7.castShadow = true
        mesh7.position.set(20, 31, -240);
        scene.add(mesh7)
        meshes.push(mesh7)
        mesh8 = new THREE.Mesh(geometry,material)
        mesh8.castShadow = true
        mesh8.position.set(20, 31, -120);
        scene.add(mesh8)
        meshes.push(mesh8)
        //Lid---------------------------------------------
        geometry = new THREE.CylinderGeometry(0,2,1,4,1)
        material = new THREE.MeshPhongMaterial({
            color: 0x43464B,
            wireframe: true
        })
        mesh = new THREE.Mesh(geometry,material)
        mesh.position.set(-20, 32.5, 240);
        mesh.castShadow = true
        scene.add(mesh)
        meshes.push(mesh)
        mesh2 = new THREE.Mesh(geometry,material)
        mesh2.position.set(-20, 32.5, 120);
        mesh2.castShadow = true
        scene.add(mesh2)
        meshes.push(mesh2)
        mesh3 = new THREE.Mesh(geometry,material)
        mesh3.position.set(-20, 32.5, -240);
        mesh3.castShadow = true
        scene.add(mesh3)
        meshes.push(mesh3)
        mesh4 = new THREE.Mesh(geometry,material)
        mesh4.castShadow = true
        mesh4.position.set(-20, 32.5, -120);
        scene.add(mesh4)
        meshes.push(mesh4)
        mesh5 = new THREE.Mesh(geometry,material)
        mesh5.castShadow = true
        mesh5.position.set(20, 32.5, 240);
        scene.add(mesh5)
        meshes.push(mesh5)
        mesh6 = new THREE.Mesh(geometry,material)
        mesh6.castShadow = true
        mesh6.position.set(20, 32.5, 120);
        scene.add(mesh6)
        meshes.push(mesh6)
        mesh7 = new THREE.Mesh(geometry,material)
        mesh7.castShadow = true
        mesh7.position.set(20, 32.5, -240);
        scene.add(mesh7)
        meshes.push(mesh7)
        mesh8 = new THREE.Mesh(geometry,material)
        mesh8.castShadow = true
        mesh8.position.set(20, 32.5, -120);
        scene.add(mesh8)
        meshes.push(mesh8)
        //Bulb---------------------------------------------
        geometry = new THREE.SphereGeometry(0.7)
        material = new THREE.MeshPhongMaterial({
            side:THREE.BackSide
        })
        mesh = new THREE.Mesh(geometry,material)
        mesh.position.set(-20, 31, 240);
        scene.add(mesh)
        meshes.push(mesh)
        mesh2 = new THREE.Mesh(geometry,material)
        mesh2.castShadow = true
        mesh2.position.set(-20, 31, 120);
        scene.add(mesh2)
        meshes.push(mesh2)
        mesh3 = new THREE.Mesh(geometry,material)
        mesh3.castShadow = true
        mesh3.position.set(-20, 31, -240);
        scene.add(mesh3)
        meshes.push(mesh3)
        mesh4 = new THREE.Mesh(geometry,material)
        mesh4.castShadow = true
        mesh4.position.set(-20, 31, -120);
        scene.add(mesh4)
        meshes.push(mesh4)
        mesh5 = new THREE.Mesh(geometry,material)
        mesh5.castShadow = true
        mesh5.position.set(20, 31, 240);
        scene.add(mesh5)
        meshes.push(mesh5)
        mesh6 = new THREE.Mesh(geometry,material)
        mesh6.castShadow = true
        mesh6.position.set(20, 31, 120);
        scene.add(mesh6)
        meshes.push(mesh6)
        mesh7 = new THREE.Mesh(geometry,material)
        mesh7.castShadow = true
        mesh7.position.set(20, 31, -240);
        scene.add(mesh7)
        meshes.push(mesh7)
        mesh8 = new THREE.Mesh(geometry,material)
        mesh8.castShadow = true
        mesh8.position.set(20, 31, -120);
        scene.add(mesh8)
        meshes.push(mesh8)
        //Light---------------------------------------------
        let lightbulb,lightbulb2,lightbulb3,lightbulb4,lightbulb5,lightbulb6,lightbulb7,lightbulb8
        lightbulb = new THREE.PointLight(0xFFFFFF,1)
        lightbulb.castShadow = true
        lightbulb.position.x = -20
        lightbulb.position.y = 30.5
        lightbulb.position.z = 240
        scene.add(lightbulb)
        lightbulb2 = new THREE.PointLight(0xFFFFFF,1)
        lightbulb2.castShadow = true
        lightbulb2.position.x = -20
        lightbulb2.position.y = 30.5
        lightbulb2.position.z = 120
        scene.add(lightbulb2)
        lightbulb3 = new THREE.PointLight(0xFFFFFF,1)
        lightbulb3.castShadow = true
        lightbulb3.position.x = -20
        lightbulb3.position.y = 30.5
        lightbulb3.position.z = -240
        scene.add(lightbulb3)
        lightbulb4 = new THREE.PointLight(0xFFFFFF,1)
        lightbulb4.castShadow = true
        lightbulb4.position.x = -20
        lightbulb4.position.y = 30.5
        lightbulb4.position.z = -120
        scene.add(lightbulb4)
        lightbulb5 = new THREE.PointLight(0xFFFFFF,1)
        lightbulb5.castShadow = true
        lightbulb5.position.x = 20
        lightbulb5.position.y = 30.5
        lightbulb5.position.z = 240
        scene.add(lightbulb5)
        lightbulb6 = new THREE.PointLight(0xFFFFFF,1)
        lightbulb6.castShadow = true
        lightbulb6.position.x = 20
        lightbulb6.position.y = 30.5
        lightbulb6.position.z = 120
        scene.add(lightbulb6)
        lightbulb7 = new THREE.PointLight(0xFFFFFF,1)
        lightbulb7.castShadow = true
        lightbulb7.position.x = 20
        lightbulb7.position.y = 30.5
        lightbulb7.position.z = -240
        scene.add(lightbulb7)
        lightbulb8 = new THREE.PointLight(0xFFFFFF,1)
        lightbulb8.castShadow = true
        lightbulb8.position.x = 20
        lightbulb8.position.y = 30.5
        lightbulb8.position.z = -120
        scene.add(lightbulb8)
}

function Text(){
    let geometry,material,mesh
    loader = new THREE.FontLoader();
    loader.load('./helvetiker_regular.typeface.json', function (font){
        geometry = new THREE.TextGeometry('      ST.\n ASHCRE',{
            font:font,
            height: 1,
            size: 8
        })
        material = new THREE.MeshStandardMaterial()
         
        mesh = new THREE.Mesh(geometry,material)
        mesh.position.set(25,15,60);
        mesh.rotation.y = 267
        mesh.textAlign = 'center'
        mesh.textBaseline = 'middle';
        scene.add(mesh)
    })
}

init()
addListener()