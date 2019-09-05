<!--Log list, info ,search-->
<template>
<el-row :gutter="40" class="log-container">
  <el-col :span="6" class="list-area">
    <div class="list-title">
      <h3>日志列表</h3>
      <i class="el-icon-refresh" @click="requireLogs"></i>
      <!-- <el-button @click="requireLogs" type="primary" size="small">获取</el-button> -->
    </div>
    <div class="list-content">
      <div class="item" v-for="(item, index) in logs" :key="index" 
        :class="selectedIndex==index?'checked-item':''"  @click="selectItem(index)">
        {{item}}
      </div>
    </div>
  </el-col>
  <el-col :span="18" class="log-area">
    <div class="search-option">
      <el-input class="search-input" v-model="keyword" placeholder="请输入关键词">
        <el-button slot="append" icon="el-icon-search" @click="searchKey"></el-button>
      </el-input>
    </div>
    <!-- <textarea class="log-content" readonly wrap="soft" cols="20" v-model="content">
    </textarea> -->
    <div class="log-content">
      <div v-for="(o, index) in contentShow" :key="index" class="log-row" v-html="o">
      </div>
    </div>
  </el-col>
</el-row>
</template>

<script>
import {getLogs, readLog} from '@/api'
export default {
  data() {
    return {
      listLoading: false,
      logs: [],
      logLoading: false,
      content: [],
      contentShow: [],
      keyword: '',
      selectedIndex: -1,
    }
  },
  methods: {
    selectItem(index) {
      this.selectedIndex = index
      this.requireLog(this.logs[index])
    },
    requireLogs() {
      let para = {
        name
      }
      this.listLoading = true
      getLogs(para).then((res) => {
        this.logs = res.data.data
        this.listLoading = false
      }).catch((err) => {
        console.log(err)
      })
    },
    requireLog(filename) {
      let para = {
        name:filename
      }
      this.logLoading = true
      readLog(para).then((res) => {
        this.content = res.data.content.trim().split('\n')
        this.logLoading = false
        this.contentShow = this.content
      }).catch((err) => {
        console.log(err)
      })
    },
    searchKey() {
      if (!this.keyword) {
        this.contentShow = this.content
        return
      }
      var re = new RegExp(`${this.keyword}`, 'gi')
      var result = []
      for (let i = 0; i < this.content.length; i++) {
        result[i] = this.content[i].replace(re, `<b>${this.keyword}</b>`)
      }
      this.contentShow = result
    }
  }
}
</script>

<style scoped>
.log-container {
  width: 100%;
  height: 500px;
  background: #fff;
  margin-left: 10px;
  margin-right: 10px;
}
.log-area {
  padding: 20px 20px 20px 20px;
}
.log-area span {
  float: right;
}
.search-option {
  text-align: right;
}
.search-input {
  width: 200px;
  margin-bottom: 10px;
}
.list-area {
  height:100%;
}
.list-title {
  height: 60px;
  padding-left: 25px;
  display: -webkit-box;
  -webkit-box-pack: start;
  -webkit-box-align: center;
}
.list-content {
  padding-left: 10px;
  height: 80%;
  scroll-behavior: auto;
  overflow: auto;
}
.item {
  line-height: 35px;
  text-align: left;
  margin: 5px 10px 5px 10px;
  padding: 0px 5px;
  cursor: pointer;
}
.item:hover{
  background-color: #7cb5ec;
}
.checked-item {
  background-color: #7cb5ec;
}
.log-content {
  width: 100%;
  height: 400px;
  border: 1px solid #a0b2e6;
  background: #fff;
  white-space: nowrap;
  overflow: auto;
  text-align: left;
  /* scroll-behavior: auto;
  overflow: auto; */
}
.log-row {
  padding-left: 5px;
  padding-right: 5px;
}
.el-icon-refresh {
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  margin-left: 10px;
}
.el-icon-refresh:active {
  color: #aaa;
}
</style>
