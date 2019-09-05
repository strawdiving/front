<template>
  <div class="container">
    <div class="title-field">
      <div>
        <div class="title">Variables</div>
      </div>
      <el-button type="primary" @click="create">新建</el-button>
    </div>
    <div>
      <ul class="var-list">
        <div class="title">
          <div class="name">变量名</div>
          <div class="type">类型</div>
          <div class="value">初始值</div>
          <div class="desc">说明</div>
          <div class="operate">操作</div>
        </div>
        <li v-for="(o, index) in vars" :key="index"
          @click="selectVar(index)" class="item"
          :class="index==selectedIndex?'selected-item':''">
          <div class="name">{{o.name}}</div>
          <div class="type">{{o.type}}</div>
          <div class="value">
            <div v-if="o.type=='array'">
              <span v-if="o.value.default">Array({{o.value.len}},{{o.value.typ}},{{o.value.default}})</span>
              <span v-else>Array({{o.value.len}},{{o.value.typ}})</span>
            </div>
            <div v-else>{{o.value}}</div>
          </div>
          <div class="comment">{{o.comment}}</div>
          <div class="operate">
            <i class="el-icon-edit" @click="editVar(index)"></i>
            <i class="el-icon-delete" @click="deleteVar(index)"></i>
          </div>
        </li>
      </ul>
    </div>

    <el-dialog :title="varTitle" :visible.sync="addVisible" width="40%" 
      class="add-var">
      <el-form :model="varAdd" :rules="rule" ref="form" label-width="60px">
        <el-form-item label="名称" prop="name" class="name">
          <el-input v-model="varAdd.name"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type" class="type">
          <el-select v-model="varAdd.type" @change="typeChange">
            <el-option
              v-for="(item, index) in typeOptions"
              :key="index"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="初值" prop="default" class="default">
          <div v-if="arrayType">
            <span class="array-len">
              长度
              <el-input-number v-model="arrayVar.len" :min="1" size="small"></el-input-number>
            </span>
            <span class="array-type">
              类型
              <el-select v-model="arrayVar.typ" size="small">
                <el-option
                  v-for="(item, index) in arrayItemType"
                  :label="item.label"
                  :key="index"
                  :value="item.value">
                </el-option>
              </el-select>
            </span>
            <div class="array-val">
              值
              <el-input type="text" v-model="arrayVar.default" size="small"/>
            </div>
            
          </div>
          <input v-else type="text" v-model="varAdd.value"/>
        </el-form-item>
        <el-form-item label="注释" prop="comment" class="comment">
          <el-input type="textarea" v-model="varAdd.comment"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    
  </div>
</template>

<script>
import { idReg, keyReg, varReg } from '@/utils/wordReg'
export default {
  data() {
    return {
      dialogMode: 'add',
      typeOptions: ['int', 'float', 'string', 'pose', 'array'],
      arrayItemType: [{
        label: 'int',
        value: 'INT'
      },{
        label: 'float',
        value: 'FLO'
      }],
      selectedIndex: -1,
      addVisible: false,
      varAdd: {
        name: '',
        type: '',
        value: '',
        comment: ''
      },
      rule: {
        name: [
          {required: true, message: '不能为空'},
          {validator: this.checkName, trigger: 'blur'}
        ],
        type: [
          {required: true, message: '不能为空'},
        ]
      },
      arrayType: false,
      arrayVar: {
        len: 1,
        typ: 'INT',
        default: null,
      }
    /* pose 变量
     * default: [0,0,0,0,0,0]
       
       数组类型
       default: {len, typ, []}
     */
    }
  },
  computed: {
    vars: function () {
      return this.$store.state.prog.vars
    },
    varTitle: function() {
      if (this.dialogMode == 'edit') {
        return '编辑变量'
      } else if (this.dialogMode == 'add') {
        return '新建变量'
      }
    },

  },
  methods: {
    checkName: function(rule, value, callback){
      if (value.match(idReg)) {
        if (value.match(keyReg)) {
          callback(new Error("不能与关键词或内部函数同名"))
        } else {
          if (value.match(varReg)) {
            callback(new Error(`${value}为内部变量`))     
          } else {

            // 重复变量名，注意edit和add模式下的不同
            var names = this.vars.map((o)=>{ return o.name })
            if (this.dialogMode == 'add') {
              if (names.includes(value)) {
                callback(new Error("变量名重复"))
              } else {
                callback()
              }

            } else if (this.dialogMode == 'edit') {
              if (names[this.selectedIndex] == value) {
                callback()
              } else {
                if (names.includes(value)) {
                  callback(new Error("变量名重复"))
                } else {
                  callback()
                }
              }
            }

          }
        }
      } else {
        callback(new Error("变量名不合法"))
      }
    },
    create: function() {
      this.dialogMode = 'add'
      this.addVisible = true
    },
    selectVar: function(index) {
      this.selectedIndex = index
    },
    editVar: function(index) {
      this.dialogMode = 'edit'
      this.addVisible = true

      this.varAdd = this._.cloneDeep(this.vars[index])
    },
    deleteVar: function(index) {
      this.$confirm('确定删除该变量？','提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.$store.commit('deleteVar', {index: index})
      }).catch(() => {

      }) 
    },
    resetVarAdd: function() {
      this.varAdd.name = null
      this.varAdd.type = null
      this.varAdd.value = null
      this.varAdd.comment = null
      this.arrayType =false
    },
    cancel: function () {
      this.addVisible = false
      this.resetVarAdd()
    },

    confirm: function () {
      this.$refs['form'].validate((valid)=>{
        if (valid) {
          this.addVisible = false
          if (this.varAdd.type=='array') {
            this.varAdd.value = this._.cloneDeep(this.arrayVar)
          }
          if (this.dialogMode == 'add') {
            this.$store.commit('createVar', this.varAdd)
          } else if(this.dialogMode == 'edit') {
            var tar = Object.assign({}, this.varAdd,{index: this.selectedIndex})
            this.$store.commit('updateVar', tar)
          }

          this.resetVarAdd()
        } else {
          return false
        }
      })
    },
    typeChange: function(type) {
      if (type == 'pose') {
        this.arrayType = false
        this.varAdd.value = '[0, 0, 0, 0, 0, 0]'
      } else if (type == 'array') {
        this.arrayType = true
        this.varAdd.value = this.arrayVar
      } else if (type == 'int' || type == 'float') {
        this.arrayType = false
        this.varAdd.value = 0
      } else if (type == 'string') {
        this.arrayType = false
        this.varAdd.value = ''
      } else {
        this.varAdd.value = ''
      }
    },
  }
}
</script>

<style scoped>
.container {
  padding: 0 10px;
}
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
li {
  display: list-item;
}
.title-field {
  text-align: left;
  padding: 0 10px 0 10px;
  height: 60px;
}
.title-field .title {
  font-size: 24px;
}
.title-field .el-button {
  float: right;
}
.var-list {
  margin: 10px;
  text-align: left;
  font-size: 14px;
  color: #666;
}
.var-list .title {
  height: 30px;
  border-bottom: 1px solid #aaa;
  color: #999;
  font-weight: 600;
}
.var-list .title .name {
  display: inline-block;
  width: 100px;
}
.var-list .title .type {
  display: inline-block;
  width: 80px;
}
.var-list .title .value {
  display: inline-block;
  width: 180px;
}
.var-list .title .desc {
  display: inline-block;
  width: 120px;
}
.var-list .title .operate {
  display: inline-block;
  width: 100px;
}
.var-list .item {
  padding: 5px 0 5px 0;
  vertical-align: middle;
}
.var-list .selected-item {
  background-color: #e3e5e7;
}
.var-list .item .name {
  display: inline-block;
  width: 100px;
}
.var-list .item .type {
  display: inline-block;
  width: 80px;
}
.var-list .item .value {
  display: inline-block;
  width: 180px;
}
.var-list .item .comment {
  display: inline-block;
  width: 120px;
}
.var-list .item .operate {
  display: inline-block;
  width: 100px;
}
.var-list .item .operate i{
  font-size: 16px;
  width: 30px;
}
.add-var {
}
.add-var .name {
  text-align: left;
}
.add-var .name .el-input {
  width: 170px;
}
.add-var .type {
  text-align: left;
}
.add-var .type .el-select {
  width: 170px;
}
.add-var .default {
  text-align: left;
}
.add-var .comment {
  
}
.array-len .el-input-number {
  width: 100px;
}
.array-type .el-select {
  width: 100px;
}
.array-type {
  margin-left: 20px;
}
.array-val {
  margin-left: 14px;
}
.array-val .el-input{
  width: 150px;
}
</style>
