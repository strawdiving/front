<template>
  <div class="innerContainer">
    <el-col :span="20">
      <div style="margin-bottom: 40px; font-weight: bold;">{{$t('settings.toolCoord')}}</div>
      <el-form :model="tcpCoord" ref="tcpCoord" :rules="rules" label-position="left" label-width="90px">
        <el-form-item :label="$t('settings.coordName')" prop="name">
          <el-input type="text" v-model="tcpCoord.name"/>
        </el-form-item>
        <el-form-item label="X(mm)">
          <el-input type="number" v-model="tcpCoord.params.bias[0]"/>
        </el-form-item>
        <el-form-item label="Y(mm)">
          <el-input type="number" v-model="tcpCoord.params.bias[1]"/>
        </el-form-item>
        <el-form-item label="Z(mm)">
          <el-input type="number" v-model="tcpCoord.params.bias[2]"/>
        </el-form-item>
        <el-form-item label="RX(rad)">
          <el-input type="number" v-model="tcpCoord.params.bias[3]"/>
        </el-form-item>
        <el-form-item label="RY(rad)">
          <el-input type="number" v-model="tcpCoord.params.bias[4]"/>
        </el-form-item>
        <el-form-item label="RZ(rad)">
          <el-input type="number" v-model="tcpCoord.params.bias[5]"/>
        </el-form-item>
      </el-form>

      <!--<div v-for="(o, index) in tags" :key="index" class="param-item">-->
      <!--<span class="item-text">{{o}}</span>-->
      <!--</div>-->
      <!--<div class="desc-item">-->
      <!--<span class="desc-tag">备注</span>-->
      <!--<el-input class="desc" type="textarea" :rows="2" placeholder="可输入备注信息" v-model="desc" resize="none"></el-input>-->
      <!--</div>-->

      <div class="button-group1">
        <el-button type="primary" plain @click="setLoad">{{$t('settings.setLoad')}}</el-button>
        <!--<el-button @click="caliTcp">TCP标定</el-button>-->
      </div>

      <div v-if="showLoad" class="load-field">
        <el-form :model="tcpCoord.tcpData" label-position="left" label-width="120px">
          <el-form-item :label="$t('settings.pcLoad')">
            <el-input type="number" v-model="tcpCoord.params.load"></el-input>
          </el-form-item>
          <el-form-item :label="$t('settings.pcLoadPos')">
            <el-form :model="tcpCoord.tcpData" label-position="left" label-width="60px">
              <el-form-item label="X(mm)">
                <el-input type="number" v-model="tcpCoord.params.loadPos[0]"></el-input>
              </el-form-item>
              <el-form-item label="Y(mm)">
                <el-input type="number" v-model="tcpCoord.params.loadPos[1]"></el-input>
              </el-form-item>
              <el-form-item label="Z(mm)">
                <el-input type="number" v-model="tcpCoord.params.loadPos[2]"></el-input>
              </el-form-item>
            </el-form>
          </el-form-item>
          <div class="button-group">
            <el-button type="primary" plain @click="readToolLoadPos">读取辨识位置</el-button>
            <el-button type="primary" plain @click="setToolLoadPos">使用此位置</el-button>
          </div>
          <div class="button-group">
            <el-button type="primary" @click="resetToolLoad">复位</el-button>
            <el-button type="primary" @click="startToolLoad">开始辨识</el-button>
            <el-button type="primary">暂停</el-button>
          </div>
        </el-form>
      </div>
      <div class="button-group1">
        <el-button type="success" @click="submit">{{$t('button.confirm')}}</el-button>
        <el-button @click="cancel">{{$t('button.cancel')}}</el-button>
      </div>
    </el-col>
  </div>
</template>

<script>
export default {
  props: {
    defaultTcpData: {
      type: Object,
      default: function() {
        return {
          bias: [0, 0, 0, 0, 0, 0],
          load: 5,
          loadPos: [0, 0, 0]
        }
      }
    }
  },
  data(){
    return {
      tcpCoord:{
        name: '',
        type: 'tcp',
        params: {
          bias: this.defaultTcpData.bias,
          load: this.defaultTcpData.load,
          loadPos: this.defaultTcpData.loadPos,
        },
        desc: ''
      },
      rules:{
        name:[{validator: this.checkName, trigger: 'blur'},]
      },
      showLoad: false
      // biasItems: ['X(mm)', 'Y(mm)', 'Z(mm)', 'RX(rad)', 'RY(rad)', 'RZ(rad)'],
      // loadItems: ['X(mm)', 'Y(mm)', 'Z(mm)'],
      // caliPosItems: ['RX(rad)', 'RY(rad)', 'RZ(rad)'],
      // caliRxyz: [0, 0, 0],
      // tcps:[],
      // showTcps: false,
      // caliType: 4,
      // cali4Step: 0,
      // cali6Step: 0,
      // caliVisible: false
    }
  },
  computed: {
    tcpCoords: function () {
      return this.$store.state.config.tcpCoords
    }

    // 通过taskID 的变化判断是否执行指令
    // taskID: function() {
    //   return this.$store.state.status.fromPLC.taskID
    // },
    // caliFinished: function() {
    //   if (this.caliType == 4 && this.cali4Step == 6) {
    //     return true
    //   }
    //   if (this.caliType == 6 && this.cali6Step == 7) {
    //     return true
    //   }
    //   return false
    // },
    // caliInitStep: function() {
    //   return (this.caliType == 4 && this.cali4Step == 0) || (this.caliType == 6 && this.cali6Step == 0)
    // },
    // cali4Steping: function() {
    //   return this.caliType == 4 && this.cali4Step > 0 && this.cali4Step < 6
    // },
    // cali6Steping: function() {
    //   return this.caliType == 6 && this.cali6Step > 0 && this.cali6Step < 7
    // }
  },
  methods:{
    checkName: function(rule,value,callback) {
      if(!value)
        return callback(new Error('坐标系名称不能为空'))
      if(this.tcpCoords.some(function (element,index) {
        return element.name === value
      })){
        return callback(new Error('该坐标系名称已被使用'))
      }
      callback()
    },
    // 设定工具坐标系
    submit: function(){
      this.$refs["tcpCoord"].validate((valid)=> {
        if (valid) {
          this.addNew()
          this.$emit('confirm-add')
        } else {
          return false
        }
      })
    },
    // 取消
    cancel(){
      // this.resetToolLoad()
      this.$emit('cancel-add')
    },
    addNew() {
      let coordData = {
        name: this.tcpCoord.name,
        type: 'tcp',
        params: this.tcpCoord.params
      }

      // 判断该坐标系是否已存在（参数相同）
      for (let i = 0; i < this.tcpCoords.length; i++) {
        if (_.isEqual(this.tcpCoords[i].params.bias, coordData.params.bias)) {
          this.$message({
            message: '该坐标系已存在',
            type: 'warning'
          })
          return
        }
      }
      this.$store.dispatch('addCoord', coordData)
      .then((res)=>{

      }).catch((err) => {

      })
      this.resetTcpCoord()
    },
    resetTcpCoord() {
      this.tcpCoord = {
        name: '',
        type: 'tcp',
        params: {
          bias: this.defaultTcpData.bias,
          load: this.defaultTcpData.load,
          loadPos: this.defaultTcpData.loadPos
        }
      }
    },
    // 负载参数设置
    setLoad(){
      this.showLoad = !this.showLoad
    },
    //读取辨识位置
    readToolLoadPos: function(){

    },
    //使用此位置
    setToolLoadPos: function(){
      this.$confirm('确定使用此重心位置', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.$store.commit('setTcpLoad', this.tcpCoord.params)
      }).catch(() => {

      })
    },
    //复位
    resetToolLoad: function() {

    },
    //开始辨识
    startToolLoad: function() {
      if (this.tcpCoord.params.load <=0 || this.tcpCoord.params.load > 5) {
        this.$alert('末端负载质量不合理', '提示', {
          confirmButtonText: '确定',
        })
      }
    },

  },
  mounted() {

  },
}
</script>

<style scoped>
.innerContainer {
  /*width: 90%;*/
  margin: auto;
  background: #fff;
  /*height: 100%;*/
}

.button-group {
  margin: 10px auto;
  text-align: left;
}
.button-group1 {
  margin: 20px auto;
  text-align: left;
}
</style>
