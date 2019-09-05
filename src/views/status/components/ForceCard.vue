<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{title}}</span>
    </div>
    <div>
      <el-table :show-header="false" :data="tableData" stripe style="width: 100%" height="300">
        <el-table-column prop="cartesianTag" label="CartesianTag" width="100" align="center">
        </el-table-column>
        <el-table-column prop="externalForce" label="External Force" width="100" align="center">
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
  export default {
    name: "forceCard",
    props: {
      title: {
        type: String,
        default: "TCP External Force"
      },
      tableData: {
        type: Array
      }
    }
  }
</script>

<style scoped>

</style>

