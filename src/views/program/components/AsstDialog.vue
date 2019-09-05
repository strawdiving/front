<template>
  <div v-if="show" id="asst">
    <div class="header">输入助手
      <i class="el-icon-close" @click="$emit('close')"></i>
    </div>
    <input-asst @input-word="inputExpr"></input-asst>
  </div>
</template>

<script>
import InputAsst from './InputAsst'
export default {
  props: ['show'],
  data() {
    return {
    }
  },
  methods: {
    inputExpr: function(word) {
      this.$emit('input-expr', word)
    }
  },
  components: {
    InputAsst,
  },
}
</script>

<style scoped>
#asst {
  position: fixed;
  left: 0;
  right: 0;
  top: 20%;
  margin: 0 auto;
  background: #fff;
  padding: 15px 10px 15px 10px;
  width: 35%;
  border-radius: 2px;
  -webkit-box-shadow:0 1px 3px rgba(0,0,0,.3);
  box-shadow:0 1px 3px rgba(0,0,0,.3);
}
#asst .header {
  height: 40px;
}
#asst .header .el-icon-close {
  position: absolute;
  right: 15px;
  font-size: 18px;
  cursor: pointer;
}
</style>
