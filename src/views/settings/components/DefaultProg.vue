<template>
  <div class="innerContainer">
    <el-row :gutter="40">
      <el-col :span="12">
        <div class="row">
          <el-button @click="showDialog">{{$t('settings.loadDefaultProg')}}</el-button>
          <span style="margin-left: 40px;">{{runAuto.defaultProgName+".spf"}}</span>
        </div>

        <el-dialog class="run-dialog" title="选择脚本程序" :visible.sync="selectListVisible" :close-on-click-modal="false" center >
          <el-table :data="scriptList" height="250" highlight-current-row @current-change="handleSelect" :default-sort="{prop: 'name', order:'ascending'}">
            <el-table-column prop="name" label="名称" width="180" sortable></el-table-column>
            <el-table-column prop="mtime" label="修改日期" width="200" sortable></el-table-column>
            <el-table-column prop="size" label="大小" width="100"></el-table-column>
          </el-table>

          <el-upload ref="upload1" action="http://localhost:3000/scripts/upload" class="upload-demo" name="scriptFile" accept=".spf" :on-success="uploadSuccess">
            <el-button type="text">从本地导入...</el-button>
          </el-upload>

          <div class="button-group">
            <el-button @click="cancelItem">{{$t('button.cancel')}}</el-button>
            <el-button type="primary" @click="confirmItem">{{$t('button.confirm')}}</el-button>
          </div>
        </el-dialog>

        <div class="row">
          {{$t('settings.trigger')}}
          <el-select v-model="runAuto.triggerDigitalIn" placeholder="请选择" class="select-item">
            <el-option v-for="item in inputOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          {{$t('settings.is')}}
          <el-select v-model="runAuto.triggerDigitalStatus" placeholder="请选择" class="select-item">
            <el-option v-for="item in triggers" :key="item.value" :label="generateLabel(item.label)" :value="item.value" ></el-option>
          </el-select>
        </div>
        <div class="button-group row">
          <el-button type="primary"  @click="loadProg">{{$t('button.confirm')}}</el-button>
          <el-button>{{$t('button.cancel')}}</el-button>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import {getScripts} from '@/api/index'
export default {
  props: {
    runAuto: {
      type: Object,
      default: function () {
        return {
          defaultProgName: '',
          triggerDigitalIn: 0,
          triggerDigitalStatus: false
        }
      }
    }
  },
  data(){
    return {
      // scriptName: '',
      selectName: '',
      scriptList: [],
      listLoading: false,
      selectListVisible: false,
      inputOption: [
        {label: 'DI 1', value: 0},
        {label: 'DI 2', value: 1},
        {label: 'DI 3', value: 2},
        {label: 'DI 4', value: 3},
        {label: 'DI 5', value: 4},
        {label: 'DI 6', value: 5}
        ],
      // input: '',
      triggers: [
        {label: 'high',value: true},
        {label: 'low',value: false}
        ],
      // triggerValue: '',
    }
  },
  methods: {
    // 获取脚本文件列表
    requireList() {
      this.listLoading = true
      getScripts().then((res) => {
        this.scriptList = res.data.data
        this.listLoading = false
      }).catch((err) => {
        console.log(err)
      })
    },
    //显示脚本选择对话框
    showDialog(){
      this.selectListVisible = true
      this.requireList()
      this.$refs.upload1.clearFiles()
    },
    handleSelect(val){
      this.selectName = val.name
    },
    cancelItem(){
      this.selectName = ''
      this.selectListVisible = false
    },
    confirmItem(){
      this.selectListVisible = false
      this.runAuto.defaultProgName = this.selectName
    },
    uploadSuccess(res, file, fileList){
      this.selectName = file.name
    },
    //确认设定默认程序
    loadProg(){
      if (this.runAuto.defaultProgName === '') {
        this.$message('未选择默认程序')
        return
      }

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
  mounted(){
  }
}
</script>

<style scoped>
.innerContainer {
  width: 80%;
  margin: auto;
}
.row {
  height: 80px;
  display: -webkit-box;
  -webkit-box-pack: start;
  -webkit-box-align: center;
}
.select-item {
  width: 120px;
}
.button-group {
  margin-left: 60px;
}
</style>

