<template>
  <div>
    <h3>选择坐标系</h3>
    <div class="content" :class="{disable: disableModify}">
      <div class="type-field">
        <span class="title">类型</span>
        <el-select v-model="coord.type" placeholder="坐标系" @change="typeChanged">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div v-if="coords.length!=0" class="select-hint">
        请选择以下坐标系
      </div>
      <ul class="val-list">
        <li v-for="(o, index) in coords" :key="index" class="item" 
          @click="select(index)"
          :class="selectedIndex==index? 'checked-item':''">
          <span class="index">{{index + 1}}.</span>
          <span class="name">{{o.name}}</span>
          <span class="param" v-if="coord.type=='user'">{{o.params}}</span>
          <span class="param" v-if="coord.type=='tool'">
            bias: {{o.params.bias}}<br>
            load: {{o.params.load}} &nbsp;&nbsp;&nbsp; loadPos: {{o.params.loadPos}}
          </span>
          <span class="desc">{{o.desc}}</span>
        </li>
      </ul>

      <div class="add-field" v-if="coord.type!='base'">
        <el-button @click="addNew" size="small" type="primary">Add new</el-button>
      </div>
    </div>
    <div class="confirm-field">
      <el-button @click="cancel">Cancel</el-button>
      <el-button type="primary" @click="confirm" :disabled="disableModify">Confirm</el-button>
    </div>

    <el-dialog :visible.sync="addVisible" custom-class="add-dialog">
      <user-cord :defaultUserCoord='[0,0,0,0,0,0]' v-if="addUserVisible" @confirm-add="confirmAdd" @cancel-add="cancelAdd"></user-cord>
      <tcp v-if="addTcpVisible" @confirm-add="confirmAdd" @cancel-add="cancelAdd"></tcp>
    </el-dialog>
  </div>
</template>

<script>
import UserCord from '@/views/settings/components/coordinate/UserCord'
import Tcp from '@/views/settings/components/coordinate/Tcp'
export default {
  props: ['info'],
  data() {
    return {
      options: [{
        value: 'base',
        label: '基坐标系'
      }, {
        value: 'tool',
        label: '工具坐标系'
      }, {
        value: 'user',
        label: '用户坐标系'
      }],
      coord: {
        type: 'base',
        index: -1,
        val: null,
      },
      coords: [],
      selectedIndex: -1,
      addVisible: false,
      addTcpVisible: false,
      addUserVisible: false,
    }
  },
  computed: {
    disableModify: function() {
      return !this.info.enable
    }
  },
  methods: {
    typeChanged: function() {
      this.alterCoord()
      this.ifChanged()
    },
    alterCoord: function() {
      switch (this.coord.type) {
        case 'base':
          this.coords = []
          break;
        case 'user':
          this.coords = this.$store.state.config.userCoords
          break;
        case 'tool':
          this.coords = this.$store.state.config.tcpCoords
          break;
        default:
          break;
      }
      // console.log(this._.cloneDeep(this.coord))
    },
    select: function(index) {
      this.selectedIndex = index

      this.ifChanged()
    },
    addNew: function() {
      if (this.coord.type == 'user') {
        this.addTcpVisible = false
        this.addUserVisible = true
      } else if (this.coord.type == 'tool') {
        this.addUserVisible = false
        this.addTcpVisible = true        
      }
      this.addVisible = true
    },
    confirmAdd: function() {
      this.addUserVisible = false
      this.addTcpVisible = false
      this.addVisible = false
    },
    cancelAdd: function() {
      this.addUserVisible = false
      this.addTcpVisible = false
      this.addVisible = false
    },
    cancel: function() {
      this.$emit('config-cancel')
    },
    confirm: function() {
      if (this.selectedIndex > -1 && this.coord.type != 'base') {
        var c = this.coords[this.selectedIndex]
        this.coord.val = c.params
      }
      this.coord.index = this.selectedIndex
      this.$emit('config-confirm', this.coord)
      // console.log(this.coord)
    },
    ifChanged: function() {
      var ret = this._.isEqual(this.coord, this.info.params)
      if (ret) {
        this.$emit('config-change', false)
      } else {
        this.$emit('config-change', true)
      }
    }
  },
  mounted() {
    this.coord = this._.cloneDeep(this.info.params)
    this.alterCoord()
    this.selectedIndex = this.coord.index
    // console.log(this.coord)
  },
  components: {
    UserCord,
    Tcp,
  }
}
</script>

<style scoped>
.disable {
  pointer-events: none;
}
.type-field {
  text-align: left;
}
.type-field .title {
  display: inline-block;
  width: 50px;
}
.type-field .el-select {
  width: 160px;
}
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
li {
  display: list-item;
}
.val-list {
  margin: 10px;
  text-align: left;
}
.val-list .item {
  /* color: #fff; */
  padding: 5px 5px;
  cursor: pointer;
}
.val-list .checked-item {
  background-color: #b8d0f5;
  /* border: 1px solid #888; */
}
.add-field {
  text-align: left;
}
.select-hint {
  text-align: left;
  margin-top: 10px;
  font-size: 14px;
  color: #777;
}
.val-list .item .index {
}
.val-list .item .name {
  font-weight: 600;
}
.val-list .item .param {
  display: block;
  margin-left: 20px;
}
.val-list .item .desc {
  display: block;
  font-size: 14px;
  color: #aaa;
  margin-left: 18px;
}
.add-dialog {
  /* height: 500px; */
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
