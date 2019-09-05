<template>
  <div class="container">
    <el-radio-group v-model="openRadio" size="medium" @change="radioChange">
      <el-radio-button label="1">{{$t('program.graph')}}</el-radio-button>
      <el-radio-button label="2">{{$t('program.text')}}</el-radio-button>
    </el-radio-group>
    <el-table :data="progList" height="250" highlight-current-row @current-change="handleSelect" :default-sort="{prop: 'name', order:'ascending'}">
      <el-table-column prop="name" :label="$t('program.name')" width="180" sortable></el-table-column>
      <el-table-column prop="mtime" :label="$t('program.mtime')" width="220" sortable></el-table-column>
      <!-- <el-table-column prop="size" label="大小" width="100"></el-table-column> -->
      <el-table-column v-if="enCtrl"
        :label="$t('program.operation')"
        width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="deleteRow(scope.row)">{{$t('button.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-upload ref="upload" action="http://localhost:3000/scripts/upload" class="upload" name="scriptFile" accept=".spf,.gpf" 
      :before-upload="beforeUpload"
      :on-success="uploadSuccess">
      <el-button type="text">{{$t('program.importLocal')}}...</el-button>
    </el-upload>
  </div>
</template>
<script>
export default {
  props: {
    enCtrl: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      openRadio: '1',
      progList: null,
    }
  },
  computed: {
    scriptList: function() {
      return this.$store.state.script.scriptList
    },
    graphList: function() {
      return this.$store.state.script.graphList
    }
  },
  methods: {
    radioChange: function(value) {
      if (value == '1') {
        this.progList = this.graphList
      } else if (value == '2') {
        this.progList = this.scriptList
      }
    },
    handleSelect: function(val) {
      if (val) {
        this.$emit('select', { name: val.name, type: this.openRadio })
      }
    },
    deleteRow: function(row) {
      this.$confirm(this.$t('program.deleteHint'), this.$t('program.warn'), {
        confirmButtonText: this.$t('button.confirm'),
        cancelButtonText: this.$t('button.cancel'),
      }).then(()=>{
        var name = row.name
        var suffix = this.getFileSuffix(name)

        if (suffix == 'spf') {
          this.$store.dispatch('delScript', {name: name})
        } else if (suffix == 'gpf') {
          this.$store.dispatch('delGraph', {name: name})
        }
      }).catch(()=>{

      })
    },
    uploadSuccess: function(res, file, list) {
      var name = file.name
      var suffix = this.getFileSuffix(name)
      if (suffix == 'spf') {
        this.$store.dispatch('getScriptList')
      } else if (suffix == 'gpf') {
        this.$store.dispatch('getProgList')
      }
    },
    beforeUpload: function(file) {
      console.log(file)
      var name = file.name

      var suffix = this.getFileSuffix(name)
      if (suffix == 'spf') {
        if (this.scriptList.map(x=>{ return x.name }).includes(name)) {
          this.$message({
            message: this.$t('program.nameRepeatHint'),
            type: 'warning'
          })
          return false
        }
      } else if (suffix == 'gpf') {
        if (this.graphList.map(x=>{ return x.name }).includes(name)) {
          this.$message({
            message: this.$t('program.nameRepeatHint'),
            type: 'warning'
          })
          return false
        }
      } else {
        return false
      }
    },
    getFileSuffix: function(name) {
      var w = name.split('.')
      var suffix = w[w.length - 1]
      return suffix
    }
  },
  mounted() {
    console.log('mount list')
    this.progList = this.graphList
    this.$store.dispatch('getScriptList')
    this.$store.dispatch('getProgList')
  },
}
</script>
<style scoped>
.container {
  text-align: left;
}
.upload {
  text-align: left;
}
</style>
