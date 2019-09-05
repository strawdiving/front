<template>
  <div class="innerContainer">
    <div>
      <!-- <span></span>
      <input type="text" v-number-only v-model.lazy="oldNum"/> -->
      <div style="margin-bottom: 40px; font-weight: bold;">{{$t('settings.userCoord')}}</div>
      <el-form :model="userCoord" ref="userCoord" :rules="rules" label-position="left" label-width="90px">
        <el-form-item :label="$t('settings.coordName')" prop="name">
          <el-input type="text" v-model="userCoord.name"/>
        </el-form-item>
        <el-form-item label="X(mm)">
          <el-input type="number" v-model.number="userCoord.params[0]" step="0.1"/>
        </el-form-item>
        <el-form-item label="Y(mm)">
          <el-input type="number" v-model.number="userCoord.params[1]" step="0.1"/>
        </el-form-item>
        <el-form-item label="Z(mm)">
          <el-input type="number" v-model.number="userCoord.params[2]" step="0.1"/>
        </el-form-item>
        <el-form-item label="RX(rad)">
          <el-input type="number" v-model.number="userCoord.params[3]" step="0.1"/>
        </el-form-item>
        <el-form-item label="RY(rad)">
          <el-input type="number" v-model.number="userCoord.params[4]" step="0.1"/>
        </el-form-item>
        <el-form-item label="RZ(rad)">
          <el-input type="number" v-model.number="userCoord.params[5]" step="0.1"/>
        </el-form-item>
        <el-form-item :label="$t('settings.desc')">
          <el-input class="desc" type="textarea" :maxlength="30" v-model="userCoord.desc" :rows="2" :placeholder="$t('settings.descPlaceholder')" resize="none"></el-input>
        </el-form-item>
      </el-form>
      <!--<div v-for="(o, index) in tags" :key="index" class="param-item">-->
        <!--<span class="item-text">{{o}}</span>-->
        <!--</div>-->
      <!--<div class="desc-item">-->
        <!--<span class="desc-tag">备注</span>-->
        <!--<el-input class="desc" type="textarea" :rows="2" placeholder="可输入备注信息" v-model="desc" resize="none"></el-input>-->
      <!--</div>-->

      <div class="button-group">
        <el-button type="success" @click.native="submit">{{$t('button.confirm')}}</el-button>
        <el-button @click="cancel">{{$t('button.cancel')}}</el-button>
        <!-- <el-button @click="addNew">保存</el-button> -->
        <!--<el-button @click="load">加载用户坐标</el-button>-->
      </div>
    </div>

    <!--<el-col :span="12">-->
      <!--<transition name="fade">-->
        <!--<div class="list-area" v-if="showList">-->
          <!--&lt;!&ndash; <h4>使用记录</h4> &ndash;&gt;-->
          <!--<table class="list-table">-->
            <!--<caption>保存的参数</caption>-->
            <!--<tr>-->
              <!--<th>#</th>-->
              <!--<th>参数</th>-->
              <!--<th>备注</th>-->
            <!--</tr>-->
            <!--<tr v-for="(o,index) in userCoordData" :key="index" class="list-item" :class="index===selectIndex?'selected':''" @click="select(index)">-->
              <!--<td class="tag"> {{index + 1}}. </td>-->
              <!--<td> {{o.param}} </td>-->
              <!--<td class="list-desc"> {{o.desc}} </td>-->
            <!--</tr>-->
          <!--</table>-->

          <!--&lt;!&ndash; <div v-for="(o,index) in userCoordData" :key="index" class="list-item">-->
            <!--<span class="tag">{{index + 1}}. </span>-->
            <!--<span>{{o.param}}</span>-->
            <!--<span class="备注">{{o.desc}}</span>-->
          <!--</div> &ndash;&gt;-->
        <!--</div>-->
      <!--</transition>-->
    <!--</el-col>-->
  </div>
</template>

<script>
import {addCoord, updateCoord, deleteCoord} from '@/api/index'
import {setUserCoord} from '@/api/param'

export default {
  props: {
    defaultUserCoord: {
      type: Array
    }
  },
  data(){
    return {
      // showList: true,
      userCoord: {
        name: '',
        type: 'user',
        params: this.defaultUserCoord,
        desc: ''
      },
      rules: {
        name: [
          {validator: this.checkName,trigger: 'blur'}
        ]
      }
      // coords:[],
      // tags: ['X(mm)', 'Y(mm)', 'Z(mm)', 'RX(rad)', 'RY(rad)', 'RZ(rad)'],
      // params: [0,0,0,0,0,0],
      // //备注
      // desc: '',
      // selectIndex: -1,
    }
  },
  computed: {
    userCoords: function () {
      return this.$store.state.config.userCoords
    }
  },
  methods: {
    checkName: function (rule,value,callback){
      if(!value) {
        return callback(new Error('坐标系名称不能为空'))
      }
      if(this.userCoords.some(function (element,index) {
        return element.name === value
      })){
        return callback(new Error('该坐标系名称已被使用'))
      }
      callback()
    },
    // 提交用户坐标
    submit: function() {
      this.$refs['userCoord'].validate((valid)=> {
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
      this.resetCoord()
      this.$emit('cancel-add')
    },
    // 保存坐标系
    addNew() {
      let coordData = {
        name: this.userCoord.name,
        type: 'user',
        params: this.userCoord.params,
        desc: this.userCoord.desc
      }
      console.log(coordData)

      // 判断该坐标系是否已存在（参数相同）
      for (let i = 0; i < this.userCoords.length; i++) {
        if (this._.isEqual(this.userCoords[i].params, coordData.params)) {
            this.$message({
              message: '该坐标系已存在',
              type: 'warning'
            })
          return
        }
      }
      this.$store.dispatch('addCoord', coordData).then((res)=>{

      }).catch((err) => {

      })
      
      this.resetCoord()
    },

    resetCoord() {
      this.userCoord = {
        name: '',
        type: 'user',
        params: this.defaultUserCoord,
        desc: ''
      }
    }

    // select(val) {
    //   this.selectIndex = val
    // },
  },
  mounted() {
  }
}
</script>

<style scoped>
.innerContainer {
  margin: auto;
  background: #fff;
}
.button-group {
   width: 500px;
   text-align: left;
 }
/*.param-item {*/
  /*width: 500px;*/
  /*height: 50px;*/
  /*text-align: left;*/
/*}*/
/*.param-item span {*/
  /*width: 80px;*/
  /*height: 50px;*/
  /*display: inline-block;*/
/*}*/

.item-input {
  /*width: 200px;*/
  /*margin-left: 80px;*/
  /*display: inline-block;*/
}
.desc-item {
  /*width:500px;*/
  /*height: 90px;*/
  /*text-align: left;*/
  /*margin-top: 10px;*/
}
/*.desc-item span {*/
  /*!*width: 80px;*!*/
  /*!*display: inline-block;*!*/
  /*!*vertical-align: top;*!*/
/*}*/
/*.desc {*/
  /*!*width: 200px;*!*/
  /*!*margin-left: 80px;*!*/
/*}*/

/*.list-area {*/
  /*width: 360px;*/
  /*height: 300px;*/
  /*padding: 12px 10px 20px 10px;*/
  /*background-color: white;*/
  /*overflow: auto;*/
/*}*/
/*.list-item {*/
  /*height: 40px;*/
  /*text-align: left;*/
/*}*/
/*.list-item .list-desc {*/
  /*width: 100px;*/
/*}*/
/*.list-item .tag{*/
  /*width: 20px;*/
/*}*/
/*.list-item:hover {*/
  /*background-color: #c0c4cc;*/
  /*cursor: pointer;*/
/*}*/
/*.list-item:active {*/
  /*background-color: #65acf3;*/
/*}*/
/*.selected {*/
  /*background-color: #65acf3;*/
/*}*/
.el-input::-webkit-outer-spin-button,
.el-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.el-input{
  -moz-appearance:none;
}
</style>
