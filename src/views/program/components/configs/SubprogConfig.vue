<template>
  <div>
    <h3>子程序</h3>

    <div class="content" :class="{disable: disableModify}">
      选择子程序
      <div class="item">
        <span class="name"> {{prog.name}} </span>
        <div class="button">
          <el-button size="small" type="primary" @click="open">选择</el-button>
        </div>
      </div>
    </div>

    <div class="confirm-field">
      <el-button @click="cancel">Cancel</el-button>
      <el-button type="primary" @click="confirm" :disabled="disableModify">Confirm</el-button>
    </div>

    <el-dialog title="选择调用的子程序" :visible.sync="listVisible" 
      :close-on-click-modal="false" center>
      <prog-list :enCtrl="false" @select="handleSelect"></prog-list>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSelect">{{$t('button.cancel')}}</el-button>
        <el-button type="primary" @click="confirmSelect">{{$t('button.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>  
</template>

<script>
import ProgList from '@/components/ProgList'
export default {
  props: ['info'],
  data() {
    return {
      listVisible: false,
      prog: {
        name: '',
      },
      name: ''
    }
  },
  computed: {
    disableModify: function() {
      return !this.info.enable
    }
  },
  methods: {
    open: function() {
      this.listVisible = true
    },
    handleSelect: function(val) {
      if (val) {
        this.name = val.name
      }
    },
    cancelSelect: function() {
      this.listVisible = false
      this.prog.name = ''
    },
    confirmSelect: function() {
      this.listVisible = false
      this.prog.name = this.name
      this.ifChanged()
    },
    cancel: function() {
      this.$emit('config-cancel')
    },
    confirm: function() {
      this.$emit('config-confirm', this.prog)
    },
    ifChanged: function() {
      if (this.prog.name == this.info.params.name) {
        this.$emit('config-change', false)
        return
      }
      this.$emit('config-change', true)
    }
  },
  mounted() {
    this.prog.name = this.info.params.name
  },
  components: {
    ProgList,
  }
}
</script>

<style scoped>
.disable {
  pointer-events: none;
}
.content {
  text-align: left;
}
.item {
  margin-top: 20px;
  padding-left: 15px;
}
.item .name {
  display: inline-block;
  width: 130px;
  height: 35px;
  line-height: 35px;
  padding-left: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  vertical-align: middle;
}
.item .button {
  margin-left: 50px;
  display: inline-block;
  vertical-align: middle;
}
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
