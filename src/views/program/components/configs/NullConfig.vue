<template>
  <div>
    <div class="confirm-field">
      <el-button @click="cancel">Cancel</el-button>
      <el-button type="primary" @click="confirm">Confirm</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['info'],
  data() {
    return {
    }
  },
  methods: {
    cancel: function() {
      this.$emit('config-cancel')
    },
    confirm: function() {
      this.$emit('config-confirm')
    },
  },
}
</script>

<style scoped>
.confirm-field {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #e1e1e1;
  text-align: center;
  background: #fff;
}
</style>