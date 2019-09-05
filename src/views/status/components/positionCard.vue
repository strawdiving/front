<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{title}}</span>
    </div>
    <div>
      <el-table :show-header="false" :data="tableData" stripe style="width: 100%" height="300">
        <el-table-column v-if="this.posType===1" prop="jointNumber" label="Joint Position" width="100" align="center">
        </el-table-column>
        <el-table-column v-if="this.posType===2" prop="cartesianTag" label="Cartesian Position" width="100" align="center">
        </el-table-column>
        <el-table-column prop="position" label="Position" width="100" align="center">
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
    export default {
      name: "positionCard",
      props: {
        title: {
          type: String,
          default: "Position"
        },
        posType: {
          type: Number //1-joint,2-cartesian
        },
        tableData: {
          type: Array
        }
      }
    }
</script>

<style scoped>

</style>
<style>
  .el-table__body {
    margin: auto;
  }
</style>
