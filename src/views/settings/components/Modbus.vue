<template>
  <div class="modbusContainer">
    <el-table stripe :data="modbusList" style="width: 80%">
      <el-table-column type="index" label="id"></el-table-column>
      <el-table-column prop="name" :label="$t('settings.modbusName')"></el-table-column>
      <el-table-column prop="ip" label="IP"></el-table-column>
      <el-table-column prop="slave" label="Slave"></el-table-column>
      <el-table-column prop="addr" label="Addr"></el-table-column>
      <el-table-column :label="$t('settings.modbusType')">
        <template slot-scope="scope">
          <span>{{ typeShow(scope.row.type)}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('settings.actions')">
        <template slot-scope="scope">
          <!--<el-button @click.native.prevent="editRow(scope.$index)" type="text" size="small">{{$t('button.edit')}}</el-button>-->
          <el-button @click.native.prevent="deleteRow(scope.$index)" type="text" size="small">{{$t('button.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="$t('settings.addModbus')" width="30%" :visible.sync="dialogVisible">
      <el-form ref="addForm" :model="ModbusInfo" label-position="left" label-width="50px"  class="ModbusInfo"
        :rules="rules">
        <el-form-item label="IP" prop="ip">
          <el-input v-model="ModbusInfo.ip" placeholder="192.168.0.1"></el-input>
        </el-form-item>
        <el-form-item label="Slave" prop="slave">
          <el-input-number v-model="ModbusInfo.slave" placeholder="1" :min="0" size="small"></el-input-number>
        </el-form-item>
        <el-form-item label="Addr" prop="addr">
          <el-input-number v-model="ModbusInfo.addr" placeholder="偏移地址" :min="0" size="small"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('settings.modbusType')">
          <el-select v-model="ModbusInfo.type" :placeholder="$t('settings.modbusType')">
            <el-option v-for="item in types" :key="item.value" :label="generateLabel(item.label)" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('settings.modbusName')" prop="name">
          <el-input v-model="ModbusInfo.name" placeholder="Modbus1"></el-input>
        </el-form-item>
      </el-form>
      <div class="button-group">
        <el-button @click="showDialog(false)">{{$t('button.cancel')}}</el-button>
        <el-button type="primary" @click="confirmAdd">{{$t('button.confirm')}}</el-button>
      </div>
    </el-dialog>
    <div class="addButton">
      <el-button type="primary" icon="el-icon-plus" @click="showDialog(true)"></el-button>
    </div>
  </div>
</template>

<script>
import { idReg, keyReg, varReg } from '@/utils/wordReg'
export default {
  data(){
   return {
      dialogVisible: false,
      ModbusInfo: {
        ip: '192.168.0.1',
        slave: 1,
        addr: 0,
        type: 0,
        name: 'Modbus1'
      },
      prefixName: 'Modbus',
      // 与modbus_add_signal()对应
      types: [
        {label: 'digitalIn', value: 0},
        {label: 'digitalOut', value: 1},
        {label: 'registerIn', value: 2},
        {label: 'registerOut', value: 3},
      ],
      rules: {
        ip: [{validator: this.checkIp, trigger: 'blur'}],
        name: [{validator: this.checkName, trigger: 'blur'}]
      }
    }
  },
  computed: {
    modbusList: function() {
      return this.$store.state.config.modbusList
    },
    modbusNames: function() {
      return this.modbusList.map((x)=>{ return x.name })
    }
  },
  methods:{
    typeShow: function(type) {
      if (type == 0) {
        return this.$t('settings.digitalIn')
      } else if ( type == 1) {
        return this.$t('settings.digitalOut')
      } else if (type == 2) {
        return this.$t('settings.registerIn')
      } else if (type == 3) {
        return this.$t('settings.registerOut')
      }
    },
    checkIp: function(rule, value, callback) {
      if(!value)
        return callback(new Error('ip不能为空'))
      callback()
      // var re =/((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)/
      // if (value.match(re)) {
      //   callback()
      // } else {
      //   callback(new Error('不合法'))
      // }
    },
    checkName: function(rule, value, callback) {
      if (!value)
        return callback(new Error('不能为空'))
      if (this.modbusNames.includes(value)) {
        return callback(new Error('节点名重复'))
      }
      callback()
      // if(value.match(idReg)) {
      //   // if (value.match(keyReg) || value.match(varReg)) {
      //   //   callback(new Error("不能与关键词或内部函数同名"))
      //   // } else {
      //   //   callback()
      //   // }
      //   callback()
      // } else {
      //   callback(new Error("名字不合法"))
      // }
    },
    showDialog(show){
      this.dialogVisible = show
      var id = this.modbusList.length
      this.ModbusInfo.name = this.prefixName + id
      // this.ModbusInfo.name = this.ModbusInfo.name.slice(0,this.ModbusInfo.name.length-1).concat(index)
      console.log(this.ModbusInfo.name)
    },

    confirmAdd() {
      this.$refs['addForm'].validate((valid)=> {
        if (valid) {
          if (this.isSamePort()) {
            this.$message({
              message: '该Modbus节点已存在',
              type: 'warning'
            })
            return false
          }
          this.dialogVisible = false
          this.addDevice()
        } else {
          return false
        }
      })
    },
    // 判断是否为同一个节点
    isSamePort() {
      var ip = this.ModbusInfo.ip
      var slave = this.ModbusInfo.slave
      var addr = this.ModbusInfo.addr
      var type = this.ModbusInfo.type

      for (let i = 0; i < this.modbusList.length; i++) {
        var o = this.modbusList[i]
        if (o.ip == ip && o.slave == slave && o.addr == addr && o.type == type) {
          return true
        }
      }
      return false
    },
    addDevice(){
      let o = this._.cloneDeep(this.ModbusInfo)
      this.$store.dispatch('addModbus', o)
    },
    deleteRow(index) {
      this.$store.dispatch('deleteModbus', {index: index})
    },
    editRow(index) {

    },
    generateLabel(label) {
      const hasKey = this.$te('settings.'+label)
      const translatedTitle = this.$t('settings.'+label)
      if(hasKey) {
        return translatedTitle
      }
      return label
    }
  },
}
</script>

<style scoped>
.item {
  height: 40px;
  display: -webkit-box;
  -webkit-box-pack: start;
  -webkit-box-align: center;
}
.el-table {
  margin: auto;
  text-align: start;
}
.ModbusInfo {
  padding: 20px;
}
.modbusContainer {
  clear: both;
}
.addButton {
  float: right;
  margin-right: 16%;
  margin-top: 20px;
}
</style>
