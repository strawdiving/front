<template>
<div id="container" @mouseover="enableControl" @mouseout="disableControl">
  <div id="box" ref="box">
  </div>
  <div class="info">
    <div class="pos">
      <div v-for="(o, index) in 7" :key="o">
        <span>J{{o}}: </span>
        <span>{{jointPos[index]}}°</span>
      </div>
    </div>
    <div class="pos2">
      <div v-for="(o, index) in posTag" :key="o">
        <span class="pos-tag">{{o}}: </span>
        <span class="pos-value">{{cordPos[index]}}</span>
      </div>
    </div>
    <!-- <div class="button zoomIn" @click="zoomIn"></div>
    <div class="button zoomOut" @click="zoomOut"></div> -->
    <button class="homeBtn" @click="resetHome">Home</button>
  </div>
</div>
</template>

<script>
const TWEEN = require("@tweenjs/tween.js");
const THREE = require("three");
const STLLoader = require("three-stl-loader")(THREE);
const OrbitControls = require("three-orbitcontrols");
import {loadScene, getScene, updateMPos} from './three.js'
export default {
  props: ['jointRad', 'targetPos'],
  name: 'threeD',
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      controls: null,

      targetModel: null,
      safetyWalls: {
        h1: null,
        h2: null,
        v1: null,
        v2: null,
        v3: null,
        v4: null
      },
      userCoord: null,
      toolBase: null,
      posTag: ["X(mm)", "Y(mm)", "Z(mm)", "RX(°)", "RY(°)", "RZ(°)"],
      tween: null,
      loaded: false,
      wallChecked: false,
      collision: false,
      animationId: null,
      mutationListener: null,
      box: null,
    };
  },
  computed: {
    jointPos() {
      var pos = [];
      for (let i = 0; i < 7; i++) {
        let v = this.$store.state.status.fromPLC.jointInfo[i].actualPos;
        pos.push(Math.round(v * 100) / 100);
      }
      return pos;
    },
    cordPos() {
      let pos = this.$store.state.status.fromPLC.cartesianInfo.actPos;
      return pos.map(x => Math.round(x * 100) / 100);
    },
    wall() {
      return this.$store.state.other.wall;
    }
  },
  watch: {
    jointRad: function(newPos, oldPos) {
      var isEqual = true;
      for (let i = 0; i < newPos.length; i++) {
        if (newPos[i] !== oldPos[i]) {
          isEqual = false;
        }
      }
      if (!isEqual) {
        this.updatePos(newPos, oldPos);
        if (this.wallChecked) {
          if (this.checkWallCollision(0)) {
            if (!this.collision) {
              this.collision = true;
              this.$emit("collision-wall", true);
            }
          } else {
            if (this.collision) {
              this.collision = false;
              this.$emit("collision-wall", false);
            }
          }
        }
      }
    }
  },
  methods: {
    enableControl: function() {
      this.controls.enabled = true;
    },
    disableControl: function() {
      this.controls.enabled = false;
    },
    zoomIn: function() {},
    zoomOut: function() {},
    resetHome: function() {
      this.controls.reset();
    },
    showTarget: function() {
      this.scene.add(this.targetModel)
      
      let pos = this.targetPos

      var o = this.targetModel.children[0]
      o.rotation.z = pos[0]

      o = o.children[0]
      o.rotation.x = pos[1]

      o = o.children[0]
      o.rotation.z = pos[2]

      o = o.children[0]
      o.rotation.x = pos[3]

      o = o.children[0]
      o.rotation.z = pos[4]

      o = o.children[0]
      o.rotation.x = -pos[5]

      o = o.children[0]
      o.rotation.z = pos[6]
    },
    // 更新为当前位置
    initPos: function() {
      // if (!this.loaded) {
      //   return;
      // }
      let pos = this.jointRad;
      // this.joint1.rotation.z = pos[0];
      // this.joint2.rotation.x = pos[1];
      // this.joint3.rotation.z = pos[2];
      // this.joint4.rotation.x = pos[3];
      // this.joint5.rotation.z = pos[4];
      // this.joint6.rotation.x = -pos[5];
      // this.joint7.rotation.z = pos[6];
      updateMPos(pos)
    },
    updatePos: function(newPos, oldPos) {
      // if (!this.loaded) {
      //   return;
      // }
      var pos = oldPos;
      var that = this
      this.tween = new TWEEN.Tween(pos)
        .to(newPos, 500)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function() {
          // console.log('update')
          // that.joint1.rotation.z = pos[0];
          // that.joint2.rotation.x = pos[1];
          // that.joint3.rotation.z = pos[2];
          // that.joint4.rotation.x = pos[3];
          // that.joint5.rotation.z = pos[4];
          // that.joint6.rotation.x = -pos[5];
          // that.joint7.rotation.z = pos[6];
  
          updateMPos(pos)
        });
      this.tween.start();
    },

    init: function() {
      var camera, renderer;
      var controls;
      this.box = this.$refs['box']

      // create a camera, which defines where we are looking at.
      camera = new THREE.PerspectiveCamera(
        45,
        this.box.clientWidth / this.box.clientHeight,
        1,
        10000
      );
      // // create a render and set the size
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setClearColor(new THREE.Color(0xaaaaff, 1.0));
      // renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setSize(this.box.clientWidth, this.box.clientHeight);
      // renderer.setViewport(0, 120, box.clientWidth, box.clientHeight)
      renderer.shadowMapEnabled = true;

      // position and point the camera to the center of the scene
      camera.position.set(0, 600, 2000);

      // add the output of the renderer to the html element
      this.box.appendChild(renderer.domElement);

      // loadScene(()=>{
      //   this.scene = scene
      //   camera.lookAt(this.scene.position);
      // })
      this.scene = getScene()
      camera.lookAt(this.scene.position);
      // add orbitcontrols
      controls = new OrbitControls(camera);

      controls.minDistance = 1000;
      controls.maxDistance = 4000;
      controls.enablePan = false;
      controls.target.set(0, 600, 0);
      controls.saveState();

      controls.enabled = false

      THREE.Cache.enabled = true

      // window.addEventListener("resize", this.onResize, false);

      this.controls = controls
      // this.scene = scene
      this.camera = camera
      this.renderer = renderer

    },
    onResize() {
      this.camera.aspect = this.box.clientWidth / this.box.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.box.clientWidth, this.box.clientHeight);
    },

    // 添加工具坐标系
    addToolCoord: function(para) {
      if (!this.loaded) {
        return;
      }
      var toolBase = this.toolBase

      if (toolBase != null) {
        this.joint7.remove(toolBase);
      }

      toolBase = new THREE.Group();

      var tran = new THREE.Matrix4().makeTranslation(para.y, para.x, para.z);
      var rotX = new THREE.Matrix4().makeRotationX(-para.ry);
      var rotY = new THREE.Matrix4().makeRotationY(para.rx);
      var rotZ = new THREE.Matrix4().makeRotationZ(para.rz);

      var mat = rotX
        .multiply(rotY)
        .multiply(rotZ)
        .multiply(tran);
      toolBase.applyMatrix(mat);

      var orgin = new THREE.Vector3(0, 0, 0);
      var length = 80;

      var dirX = new THREE.Vector3(0, 1, 0);
      dirX.normalize();
      var arrowHelperX = new THREE.ArrowHelper(dirX, orgin, length, 0xff0000);
      toolBase.add(arrowHelperX);

      var dirY = new THREE.Vector3(-1, 0, 0);
      dirY.normalize();
      var arrowHelperY = new THREE.ArrowHelper(dirY, orgin, length, 0x00ff00);
      toolBase.add(arrowHelperY);

      var dirZ = new THREE.Vector3(0, 0, 1);
      dirZ.normalize();
      var arrowHelperZ = new THREE.ArrowHelper(dirZ, orgin, length, 0x0000ff);
      toolBase.add(arrowHelperZ);

      // X Y axis tag
      var loader = new THREE.FontLoader();
      loader.load("/static/fonts/helvetiker_bold.typeface.json", function(
        font
      ) {
        var xGeometry = new THREE.TextGeometry("X", {
          font: font,
          size: 24,
          height: 2
        });
        var xTag = new THREE.Mesh(
          xGeometry,
          new THREE.MeshBasicMaterial({ color: 0xffffff, overdraw: 0.5 })
        );
        xTag.position.set(-20, 60, 10);
        xTag.rotation.set(-Math.PI / 2, 0, 0);
        arrowHelperX.add(xTag);

        var yGeometry = new THREE.TextGeometry("Y", {
          font: font,
          size: 24,
          height: 2
        });
        var yTag = new THREE.Mesh(
          yGeometry,
          new THREE.MeshBasicMaterial({ color: 0xeeeeee, overdraw: 0.5 })
        );
        yTag.position.set(-20, 60, 0);
        yTag.rotation.set(0, Math.PI / 2, Math.PI / 2);
        arrowHelperY.add(yTag);
      });

      this.joint7.add(toolBase);
    },

    // 添加用户坐标系
    addUserCoord: function(para) {
      if (!this.loaded) {
        return;
      }
      var userCoord = this.userCoord

      if (userCoord != null) {
        this.jointBase.remove(userCoord);
      }
      userCoord = new THREE.Group();

      var tran = new THREE.Matrix4().makeTranslation(para.y, -para.x, para.z);
      var rotX = new THREE.Matrix4().makeRotationX(para.rx);
      var rotY = new THREE.Matrix4().makeRotationY(para.ry);
      var rotZ = new THREE.Matrix4().makeRotationZ(para.rz);

      var mat = rotX
        .multiply(rotY)
        .multiply(rotZ)
        .multiply(tran);
      userCoord.applyMatrix(mat);

      var orgin = new THREE.Vector3(0, 0, 0);
      var length = 150;

      var dirX = new THREE.Vector3(0, -1, 0);
      dirX.normalize();
      var arrowHelperX = new THREE.ArrowHelper(dirX, orgin, length, 0xff0000);
      userCoord.add(arrowHelperX);

      var dirY = new THREE.Vector3(1, 0, 0);
      dirY.normalize();
      var arrowHelperY = new THREE.ArrowHelper(dirY, orgin, length, 0x00ff00);
      userCoord.add(arrowHelperY);

      var dirZ = new THREE.Vector3(0, 0, 1);
      dirZ.normalize();
      var arrowHelperZ = new THREE.ArrowHelper(dirZ, orgin, length, 0x0000ff);
      userCoord.add(arrowHelperZ);

      // X Y axis tag
      var loader = new THREE.FontLoader();
      loader.load("/static/fonts/helvetiker_bold.typeface.json", function(
        font
      ) {
        var xGeometry = new THREE.TextGeometry("X", {
          font: font,
          size: 28,
          height: 2
        });
        var xTag = new THREE.Mesh(
          xGeometry,
          new THREE.MeshBasicMaterial({ color: 0xffffff, overdraw: 0.5 })
        );
        xTag.position.set(-20, 130, 10);
        xTag.rotation.set(-Math.PI / 2, 0, 0);
        arrowHelperX.add(xTag);

        var yGeometry = new THREE.TextGeometry("Y", {
          font: font,
          size: 28,
          height: 2
        });
        var yTag = new THREE.Mesh(
          yGeometry,
          new THREE.MeshBasicMaterial({ color: 0xeeeeee, overdraw: 0.5 })
        );
        yTag.position.set(-20, 130, 0);
        yTag.rotation.set(0, Math.PI / 2, Math.PI / 2);
        arrowHelperY.add(yTag);
      });

      this.jointBase.add(userCoord);
    },

    // 添加基坐标系
    addBaseCoord: function() {
      var orgin = new THREE.Vector3(0, 0, 0);
      var length = 200;

      // x axis
      var dirX = new THREE.Vector3(0, -1, 0);
      dirX.normalize();
      var arrowHelperX = new THREE.ArrowHelper(dirX, orgin, length, 0xff0000);
      this.jointBase.add(arrowHelperX);

      // Y axis
      var dirY = new THREE.Vector3(1, 0, 0);
      dirY.normalize();
      var arrowHelperY = new THREE.ArrowHelper(dirY, orgin, length, 0x00ff00);
      this.jointBase.add(arrowHelperY);

      // X Y axis tag
      var loader = new THREE.FontLoader();
      loader.load("/static/fonts/helvetiker_bold.typeface.json", function(
        font
      ) {
        var xGeometry = new THREE.TextGeometry("X", {
          font: font,
          size: 30,
          height: 2
        });
        var xTag = new THREE.Mesh(
          xGeometry,
          new THREE.MeshBasicMaterial({ color: 0xffffff, overdraw: 0.5 })
        );
        xTag.position.set(10, 180, -10);
        xTag.rotation.set(-Math.PI / 2, 0, 0);
        arrowHelperX.add(xTag);

        var yGeometry = new THREE.TextGeometry("Y", {
          font: font,
          size: 30,
          height: 2
        });
        var yTag = new THREE.Mesh(
          yGeometry,
          new THREE.MeshBasicMaterial({ color: 0xeeeeee, overdraw: 0.5 })
        );
        yTag.position.set(10, 180, 0);
        yTag.rotation.set(0, Math.PI / 2, Math.PI / 2);
        arrowHelperY.add(yTag);
      });
    },
    // cancel user coordinate
    clearUserCoord: function() {
      if (!this.loaded) {
        return;
      }
      if (this.userCoord != null) {
        this.jointBase.remove(this.userCoord);
      }
    },
    // cancel tool coordinate
    resetTool: function() {
      this.addToolCoord({ x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0 });
    },

    // check collsion with safety walls
    checkWallCollision: function(threshold) {
      // 余量
      var margin = parseInt(threshold);

      var endModel;
      if (this.toolBase) {
        endModel = this.toolBase;
      } else {
        endModel = this.joint7;
      }

      var w = this.wall;
      if (w.h1.enable) {
        if (checkHorizontal(w.h1)) return true;
      }

      if (w.h2.enable) {
        if (checkHorizontal(w.h2)) return true;
      }

      if (w.v1.enable) {
        if (checkVer(w.v1)) return true;
      }

      if (w.v2.enable) {
        if (checkVer(w.v2)) return true;
      }

      if (w.v3.enable) {
        if (checkVer(w.v3)) return true;
      }

      if (w.v4.enable) {
        if (checkVer(w.v4)) return true;
      }
      return false;

      // 检查与水平面碰撞
      function checkHorizontal(h) {
        if (Number(h.dist) >= 400) {
          if (joint4.getWorldPosition().y >= Number(h.dist) + margin - 100)
            return true;
          if (joint6.getWorldPosition().y >= Number(h.dist) + margin - 100)
            return true;
          if (endModel.getWorldPosition().y >= Number(h.dist) + margin)
            return true;
        }

        if (Number(h.dist) <= 220) {
          if (joint4.getWorldPosition().y <= Number(h.dist) - margin + 100)
            return true;
          if (joint6.getWorldPosition().y <= Number(h.dist) - margin + 100)
            return true;
          if (endModel.getWorldPosition().y <= Number(h.dist) - margin)
            return true;
        }
        return false;
      }

      // 检查与竖直面的碰撞
      function checkVer(v) {
        if (
          dist2Ver(
            Number(v.dist) + margin - 100,
            v.angle,
            joint4.getWorldPosition().z,
            joint4.getWorldPosition().x
          ) < 0
        )
          return true;
        if (
          dist2Ver(
            Number(v.dist) + margin - 100,
            v.angle,
            joint6.getWorldPosition().z,
            joint6.getWorldPosition().x
          ) < 0
        )
          return true;
        if (
          dist2Ver(
            Number(v.dist) + margin,
            v.angle,
            endModel.getWorldPosition().z,
            endModel.getWorldPosition().x
          ) < 0
        )
          return true;
        return false;
      }
      // 距离竖直面距离
      function dist2Ver(l, theta, x, y) {
        return (
          l -
          (x * Math.cos(theta * Math.PI / 180) +
            y * Math.sin(theta * Math.PI / 180))
        );
      }
    },

    render: function () {
      if (this.scene) {
        this.renderer.render(this.scene, this.camera);
      }
    },
    animate: function () {
      this.animationId = requestAnimationFrame(this.animate);
      this.controls.update();
      TWEEN.update();
      this.render();
    }
  },
  created() {},
  mounted() {
    this.init();
    this.$nextTick(()=>{
      this.animate();
    })
    // this.configWall();
  },
  activated() {
    console.log('threejs actived')
    // this.animate();
    window.addEventListener("resize", this.onResize, false)
  },
  deactivated() {
    console.log('threejs deactived')
    // cancelAnimationFrame(this.animationId)
    window.removeEventListener("resize", this.onResize, false)
  },
  beforeDestroy() {
    // 释放controls, 否则会出现input不能获取焦点的bug
    this.controls.dispose()
    cancelAnimationFrame(this.animationId)
    this.renderer = null
    this.scene = null
    this.targetModel = null
    this.camera = null
    // console.log('threejs destory')
  }
};
</script>

<style scoped>
#container {
  position: relative;
  width: 100%;
  height: 100%;
}
#box {
  width: 100%;
  height: 100%;
}
.info {
  position: absolute;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 100;
}
.pos {
  position: absolute;
  bottom: 10px;
  left: 10px;
  font-size: 12px;
  color: #888;
  opacity: 0.6;
  text-align: left;
}
.pos2 {
  position: absolute;
  bottom: 180px;
  left: 10px;
  font-size: 12px;
  color: #888;
  opacity: 0.6;
  text-align: left;
}
.pos-tag {
  display: inline-block;
  width: 40px;
}
.pos-value {
  display: inline-block;
}
.button {
  position: absolute;
  width: 30px;
  height: 30px;
  box-shadow: 1px 2px #222;
  cursor: pointer;
  right: 5px;
  background-color: #333;
}
.zoomIn {
  top: 30px;
}
.zoomOut {
  top: 70px;
}
.homeBtn {
  position: absolute;
  right: 5px;
  bottom: 10px;
  border: none;
  padding: 8px 15px;
  background-color: #333;
  cursor: pointer;
  color: #aaa;
  text-align: center;
  box-shadow: 1px 2px #222;
}
.homeBtn:hover {
  color: #eee;
}
.homeBtn:active {
  background: #222;
  box-shadow: 1px 2px #333;
}
</style>

