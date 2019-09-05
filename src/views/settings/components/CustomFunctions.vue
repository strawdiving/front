<template>
  <div class="innerContainer">
    <el-row :gutter="40">
      <el-col :span="12">
        <el-button type="primary" @click="createFunction(true)" class="createBtn">{{$t('settings.createFunction')}}</el-button>
        <el-table :data="functionList" class="functionTable" border>
          <el-table-column prop="name" :label="$t('settings.funcName')" align="center"></el-table-column>
          <el-table-column prop="description" :label="$t('settings.funcDesc')" align="center"></el-table-column>
          <el-table-column :label="$t('settings.actions')" width="150" align="center">
            <template slot-scope="scope">
              <!--<el-button @click="editRow(scope.$index, functionList)" size="mini" type="primary">编辑</el-button>-->
              <el-button @click="deleteRow(scope.$index, functionList)" size="mini" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <div v-show="createVisible=== true" class="funcDefArea">
            <div style="margin-bottom: 40px; font-weight: bold;">{{$t('settings.customFunction')}}</div>
           <el-form :model="Function" ref="Function" :rules="rules" label-position="left" label-width="150px"  class="Function">
              <el-form-item :label="$t('settings.funcName')" prop="name">
                <el-input v-model="Function.name" :placeholder="$t('settings.funcName')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('settings.funcDesc')">
                <el-input type="textarea" v-model="Function.description" :placeholder="$t('settings.funcDesc')"></el-input>
              </el-form-item>
              <el-form-item prop="argNumber" :label="$t('settings.argNumber')">
                <el-input-number v-model="Function.argNum" @change="changeArgList" :min="0" :max="10"></el-input-number>
              </el-form-item>
            <el-form-item :label="$t('settings.argList')">
              <div class="args">
                <div v-for="item in Function.argList" :key="item.id">
                  <el-col :span="11" style="padding: 0;">
                    <el-select v-model="item.type" :placeholder="$t('settings.argType')">
                      <el-option v-for="item in argTypes" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="2" style="padding: 0;">-</el-col>
                  <el-col :span="11" style="padding: 0;">
                    <el-input v-model="item.name" :placeholder="$t('settings.argName')"></el-input>
                  </el-col>
                </div>
              </div>
            </el-form-item>
            <el-form-item :label="$t('settings.funcContent')">
              <el-input type="textarea" :rows="5" v-model="Function.content" :placeholder="$t('settings.funcContent')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('settings.funcReturn')">
              <el-input v-model="Function.return" :placeholder="$t('settings.funcReturn')"></el-input>
            </el-form-item>
          </el-form>
            <div class="button-group">
              <el-button @click="cancel">{{$t('button.cancel')}}</el-button>
              <el-button type="primary" @click="submitFunction">{{$t('button.confirm')}}</el-button>
            </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { idReg, keyReg, varReg } from '@/utils/wordReg'
  export default {
    props: {
      functionList: {
        type: Array
      }
    },
    data(){
      let checkName = (rule, value, callback) => {
        if (value.match(idReg)) {
          if (value.match(keyReg) || value.match(varReg)) {
            callback(new Error("不能与关键词或内部函数同名"))
          }
          else if (this.functionList.some(function (element,index) {
            return element.name === value
          }))
          {
            return callback(new Error('该函数名称已被使用'))
          }
          else {
            callback()
          }
        } else {
          callback(new Error("函数名不合法"))
        }
      }
      return {
        createVisible: false,
        Function: {
          name: 'function',
          description: '',
          argNum: 0,
          argList: [],
          content: '',
          return: 0
        },
        rules: {
          name: [
            {required: true, message: '不能为空'},
            {validator: checkName,trigger: 'blur'}
          ]
        },
        argTypes: [
          {value: 1, label: 'int'},
          {value: 2, label: 'string'},
          {value: 3, label: 'float'},
        ]
      }
    },
    computed: {
      // functionList() {
      //   return this.$store.state.setValue.functionList
      // }
    },
    methods:{
      // 显示参数列表
      changeArgList(value) {
        this.Function.argList = []
        for(let i=0;i<value;i++){
          this.Function.argList.push({id:i,type: 'int',name: 'arg'+i})
        }
      },
      // 打开自定义函数模块
      createFunction(show){
        this.createVisible = show
      },
      // 添加自定义函数
      submitFunction(){
        this.$refs['Function'].validate((valid) => {
          if(valid) {
            this.functionList.push(this.Function)
            console.log(this.functionList)
            this.createVisible = false
            this.Function = {
              name: 'function',
              description: '',
              argNum: 0,
              argList: [],
              content: '',
              return: 0
            }
            this.$store.commit('addFunction',this.Function)
          }
        })
      },
      // 取消自定义函数的设置
      cancel() {
        this.Function = {}
      },
      // 编辑函数
      editRow(index,functionList) {
        this.Function = functionList[index]
        this.createVisible = true
        this.updateFunctionList(functionList)
      },
      // 删除函数
      deleteRow(index, functionData) {
        this.$store.commit('deleteFunction',index)
        functionData.splice(index,1)
      }
    }
  }
</script>

<style scoped>
  .innerContainer {
    /*width: 400px;*/
    margin: auto;
  }
  .createBtn {
   margin-bottom: 40px;
  }
  .el-input-number {
    width: 100%;
  }
  .funcDefArea {
    width: 75%;
    padding-left: 50px;
  }
  .select-item {
    width: 120px;
  }
  .button-group {
    margin-left: 60px;
  }
</style>



