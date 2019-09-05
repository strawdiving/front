<template>
  <div class="usersContainer">
    <el-table stripe :data="userList" style="width: 80%">
      <el-table-column type="index" label="id"></el-table-column>
      <el-table-column prop="userName" :label="$t('users.userName')"></el-table-column>
      <el-table-column prop="type" :label="$t('users.type')">
      <template slot-scope="scope">
        <span>{{ typeShow(scope.row.type)}}</span>
      </template>
      </el-table-column>
      <el-table-column :label="$t('settings.actions')">
        <template slot-scope="scope">
          <el-button @click.native.prevent="editRow(scope.$index)" type="text" size="small">{{$t('button.edit')}}</el-button>
          <el-button @click.native.prevent="deleteRow(scope.$index)" type="text" size="small">{{$t('button.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="$t('users.addUser')" width="30%" :visible.sync="dialogVisible">
      <el-form ref="addForm" :model="UserInfo" label-position="left" label-width="80px"  class="userInfo"
               :rules="rules">
        <el-form-item :label="$t('users.userName')" prop="userName">
          <el-input v-model="UserInfo.userName" placeholder="admin"></el-input>
        </el-form-item>
        <el-form-item :label="$t('users.type')">
          <el-select v-model="UserInfo.type" :placeholder="$t('users.type')">
            <el-option v-for="item in types" :key="item.value" :label="generateLabel(item.label)" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="button-group">
        <el-button @click="showDialog(false)">{{$t('button.cancel')}}</el-button>
        <el-button type="primary" @click="confirmAdd">{{$t('button.confirm')}}</el-button>
      </div>
    </el-dialog>
    <div class="addButton">
      <el-button type="primary" icon="el-icon-plus" @click="showDialog(true)"></el-button>
    </div>
  </div>
</template>

<script>
    export default {
      data() {
        return {
          dialogVisible: false,
          UserInfo: {
            userName: '',
            type: 0,
          },
          types: [
            {label: 'admin', value: 0},
            {label: 'user', value: 1},
          ],
          rules: {
            userName: [{validator: this.checkName, trigger: 'blur'}]
          }
        }
      },
      computed: {
        userList: function () {
          console.log(this.$store.state.users.userList)
          return this.$store.state.users.userList
        },
        userNames: function() {
          return this.userList.map((x)=>{ return x.userName })
        }
      },
      methods: {
        typeShow: function (type) {
          if (type === 0) {
            return this.$t('users.admin')
          } else if (type === 1) {
            return this.$t('users.user')
          }
        },
        checkName: function(rule, value, callback) {
          if (!value)
            return callback(new Error('不能为空'))
          if (this.userNames.includes(value)) {
            return callback(new Error('节点名重复'))
          }
          callback()
        },
        showDialog(show){
          this.dialogVisible = show
        },

        confirmAdd() {
          this.$refs['addForm'].validate((valid)=> {
            if (valid) {
              this.dialogVisible = false
              this.addUser()
            } else {
              return false
            }
          })
        },
        addUser(){
          let o = this._.cloneDeep(this.UserInfo)
          this.$store.dispatch('addUser', o)
        },
        deleteRow(index) {
          this.$store.dispatch('deleteUser', {index: index})
        },
        editRow(index) {

        },
        generateLabel(label) {
          const hasKey = this.$te('users.'+label)
          const translatedTitle = this.$t('users.'+label)
          if(hasKey) {
            return translatedTitle
          }
          return label
        },
      }
    }
</script>

<style scoped>
  .item {
    height: 40px;
    display: -webkit-box;
    -webkit-box-pack: start;
    -webkit-box-align: center;
  }
  .el-table {
    margin: auto;
    text-align: start;
  }
  .userInfo {
    padding: 20px;
  }
  .usersContainer {
    clear: both;
  }
  .addButton {
    float: right;
    margin-right: 16%;
    margin-top: 20px;
  }
</style>
