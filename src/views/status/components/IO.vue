<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{title}}</span>
    </div>
    <div>
      <el-table :show-header="false" :data="tableData" stripe style="width: 100%" height="300">
        <el-table-column prop="port" label="端口" width="100" align="center">
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template slot-scope="scope">
            <div :class="scope.row.inStatus?'icon-highlight':'icon-grey'" class="icon"></div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "IO",
  props: {
    title: {
      type: String,
      default: "IO"
    },
    type: {
      type: String
    },
    tableData: {
      type: Array
    }
  },
  data() {
    return {};
  },
  computed: {}
};
</script>

<style scoped>
.icon {
  width: 16px;
  height: 16px;
  border-radius: 8px;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  vertical-align: text-bottom;
  display: inline-block;
}
.icon-highlight {
  background-color: rgb(18, 196, 228);
}
.icon-grey {
  background-color: #888;
}
  .el-table {
    /*font-size: 14px;*/
  }

</style>
<style>
  .el-table__body {
    margin: auto;
  }
  .el-card__body {
    font-size: 15px;
    box-shadow: 0 0 5px #7cb5ec inset;
  }
  .el-card__header {
    font-size: 15px;
    background-color: rgba(124,181,236,0.7);
    padding: 10px 20px;
  }
</style>
