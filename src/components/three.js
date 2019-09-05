const TWEEN = require("@tweenjs/tween.js");
const THREE = require("three");
const STLLoader = require("three-stl-loader")(THREE);
const OrbitControls = require("three-orbitcontrols");

var loaded = false
var scene
var jointBase, joint1, joint2, joint3, joint4, joint5, joint6, joint7;


function loadScene(callback) {
  scene = new THREE.Scene();

  scene.background = new THREE.Color(0x222233);

  // add spotlight for the shadows
  var light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 1);
  light.intensity = 1.5;
  scene.add(light);
  var light = new THREE.DirectionalLight(0xffffff);
  light.position.set(-1, -1, -1);
  scene.add(light);
  var light = new THREE.AmbientLight(0x303030);
  scene.add(light);

  // add grid ground
  var gridHelper = new THREE.GridHelper(1500, 10, 0x808080, 0x808080);
  scene.add(gridHelper);

  if (jointBase) {
    scene.add(jointBase)
    callback()
  } else {
    loadModel(() => {
      scene.add(jointBase)
      callback()
    })
  }
}

function loadModel(callback) {
  // load robot 3d model
  if (loaded) {
    callback()
    return
  }

  var loader = new STLLoader();
  // var self = this;
  buildJointBase()
    .then(function () {
      return buildJoint1();
    })
    .then(function () {
      return buildJoint2();
    })
    .then(function () {
      return buildJoint3();
    })
    .then(function () {
      return buildJoint4();
    })
    .then(function () {
      return buildJoint5();
    })
    .then(function () {
      return buildJoint6();
    })
    .then(function () {
      return buildJoint7();
    })
    .then(function () {
      
      // scene.add(jointBase);
      // self.targetModel = jointBase.clone()
      // var o = self.targetModel
      // o.material = baseMaterial
      // while (o.children && o.children.length > 0) {
      //   o = o.children[0]
      //   o.material = baseMaterial
      // }

      // assignJoint()
      // self.loaded = true;
      // self.addToolCoord({ x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0 });
      // self.addUserCoord({ x: 100, y: 200, z: 50, rx: 0, ry: 0, rz: 0 });
      // self.addBaseCoord();
      // self.initPos();
      loaded = true
      callback()
    });

  // this.scene = scene
  // this.camera = camera
  // this.renderer = renderer
  // this.controls = controls

  // 提示模型的material
  var baseMaterial = new THREE.MeshBasicMaterial({
    color: 0xb5c1c8,
    transparent: true,
    opacity: 0.5,
  })

  // this.createWall('v', 300, -Math.PI/2)
  // this.createWall('h', -500)

  function buildJointBase() {
    return new Promise(function (resolve, reject) {
      loader.load("/static/meshes3/base_link.STL", function (geometry) {
        var material = new THREE.MeshPhongMaterial({
          color: 0x8997bf,
          specular: 0x111111,
          shininess: 100
        });
        jointBase = new THREE.Mesh(geometry, material);
        jointBase.rotation.set(-Math.PI / 2, 0, 0);

        resolve();
      });
    });
  }

  function buildJoint1() {
    return new Promise(function (resolve, reject) {
      loader.load("/static/meshes3/link_1.STL", function (geometry) {
        var material = new THREE.MeshPhongMaterial({
          color: 0x3478bf,
          specular: 0x111111,
          shininess: 100
        });
        joint1 = new THREE.Mesh(geometry, material);

        jointBase.add(joint1);
        var tran = new THREE.Matrix4().makeTranslation(0, 0, 172);
        var rot = new THREE.Matrix4().makeRotationX(0);
        var mat = rot.multiply(tran);

        joint1.applyMatrix(mat);
        resolve();
      });
    });
  }

  function buildJoint2() {
    return new Promise(function (resolve, reject) {
      loader.load("/static/meshes3/link_2.STL", function (geometry) {
        var material = new THREE.MeshPhongMaterial({
          color: 0x8997bf,
          specular: 0x111111,
          shininess: 200
        });
        joint2 = new THREE.Mesh(geometry, material);

        joint1.add(joint2);
        var tran = new THREE.Matrix4().makeTranslation(-138, 0, 59);
        var rot = new THREE.Matrix4().makeRotationY(Math.PI / 2);
        var mat = rot.multiply(tran);

        joint2.applyMatrix(mat);
        resolve();
      });
    });
  }

  function buildJoint3() {
    return new Promise(function (resolve, reject) {
      loader.load("/static/meshes3/link_3.STL", function (geometry) {
        var material = new THREE.MeshPhongMaterial({
          color: 0x3478bf,
          specular: 0x111111,
          shininess: 200
        });
        joint3 = new THREE.Mesh(geometry, material);

        joint2.add(joint3);
        var tran = new THREE.Matrix4().makeTranslation(-59, 0, 269.5);
        var rot = new THREE.Matrix4().makeRotationY(-Math.PI / 2);
        var mat = rot.multiply(tran);

        joint3.applyMatrix(mat);
        resolve();
      });
    });
  }

  function buildJoint4() {
    return new Promise(function (resolve, reject) {
      loader.load("/static/meshes3/link_4.STL", function (geometry) {
        var material = new THREE.MeshPhongMaterial({
          color: 0x8997bf,
          specular: 0x111111,
          shininess: 200
        });
        joint4 = new THREE.Mesh(geometry, material);
        joint3.add(joint4);

        var tran = new THREE.Matrix4().makeTranslation(-130.5, 0, 60.5);
        var rot = new THREE.Matrix4().makeRotationY(Math.PI / 2);
        var mat = rot.multiply(tran);
        joint4.applyMatrix(mat);
        resolve();
      });
    });
  }

  function buildJoint5() {
    return new Promise(function (resolve, reject) {
      loader.load("/static/meshes3/link_5.STL", function (geometry) {
        var material = new THREE.MeshPhongMaterial({
          color: 0x3478bf,
          specular: 0x111111,
          shininess: 200
        });
        joint5 = new THREE.Mesh(geometry, material);

        joint4.add(joint5);
        var tran = new THREE.Matrix4().makeTranslation(60.5, 0, 272.5);
        var rotY = new THREE.Matrix4().makeRotationY(-Math.PI / 2);
        var rotZ = new THREE.Matrix4().makeRotationZ(Math.PI);
        var mat = rotY.multiply(rotZ).multiply(tran);

        joint5.applyMatrix(mat);
        resolve();
      });
    });
  }

  function buildJoint6() {
    return new Promise(function (resolve, reject) {
      loader.load("/static/meshes3/link_6.STL", function (geometry) {
        var material = new THREE.MeshPhongMaterial({
          color: 0x8997bf,
          specular: 0x111111,
          shininess: 200
        });
        joint6 = new THREE.Mesh(geometry, material);

        joint5.add(joint6);
        var tran = new THREE.Matrix4().makeTranslation(-127.5, 0, -89.8);
        var rotY = new THREE.Matrix4().makeRotationY(Math.PI / 2);
        var mat = rotY.multiply(tran);

        joint6.applyMatrix(mat);
        resolve();
      });
    });
  }

  function buildJoint7() {
    return new Promise(function (resolve, reject) {
      loader.load("/static/meshes3/link_7.STL", function (geometry) {
        var material = new THREE.MeshPhongMaterial({
          color: 0xbb3333,
          specular: 0x111111,
          shininess: 200
        });
        joint7 = new THREE.Mesh(geometry, material);

        joint6.add(joint7);
        var tran = new THREE.Matrix4().makeTranslation(89.8, 0, 175);
        var rotY = new THREE.Matrix4().makeRotationY(-Math.PI / 2);
        var mat = rotY.multiply(tran);

        joint7.applyMatrix(mat);
        resolve();
      });
    });
  }

  // window.addEventListener("resize", onResize, false);

  // function onResize() {
  //   camera.aspect = box.clientWidth / box.clientHeight;
  //   camera.updateProjectionMatrix();
  //   renderer.setSize(box.clientWidth, box.clientHeight);
  // }
}

function updateMPos(pos) {
  joint1.rotation.z = pos[0];
  joint2.rotation.x = pos[1];
  joint3.rotation.z = pos[2];
  joint4.rotation.x = pos[3];
  joint5.rotation.z = pos[4];
  joint6.rotation.x = -pos[5];
  joint7.rotation.z = pos[6];
}

function getScene() {
  if (scene) return scene
}

export {
  loadScene,
  getScene,
  updateMPos,
}