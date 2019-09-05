<template>
  <div>
    <el-button @click="createUser">新建</el-button>
    <el-table :data="userList">
      <el-table-column type="index" label="id"></el-table-column>
      <el-table-column type="name" label="用户名"></el-table-column>
      <el-table-column type="role" label="角色"></el-table-column>
      <el-table-column type="state" label="状态"></el-table-column>
      <el-table-column :label="$t('settings.actions')">
        <template slot-scope="scope">
          <el-button @click.native.prevent="editRow(scope.$index)" type="text" size="small">{{$t('button.edit')}}</el-button>
          <el-button @click.native.prevent="deleteRow(scope.$index)" type="text" size="small">{{$t('button.delete')}}</el-button>
        </template>
      </el-table-column>
      
    </el-table>
    <el-dialog title="新建用户" width="30%" :visible.sync="createVisible">
      <el-form :model="userAdd" :rules="rule" ref="addUser" label-position="left" label-width="50px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="userAdd.name"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userAdd.name">
            <el-option
              v-for="(item, index) in roleOpt"
              :key="index"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="pswd">
          <el-input type="password" v-model="userAdd.pswd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPswd">
          <el-input type="password" v-model="userAdd.checkPswd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelCreate">取 消</el-button>
          <el-button type="primary" @click="confirmCreate">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) return callback(new Error('用户名不能为空'))
      // if ()
    }
    var validatePass = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.rule.checkPswd != '') {
          this.$refs.addUser.validateField('checkPswd');
        }
        callback()
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.rule.pswd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      createVisible: false,
      userAdd: {
        name: '',
        role: '',
        pswd: '',
        checkPswd: '',
      },
      roleOpt: [{
        label: '操作者',
        value: '1'
      },{
        label: '管理员',
        value: '2'
      }],
      rule: {
        name: [
          {required: true, message: '不能为空'},
          {validator: this.checkName, trigger: 'blur'}
        ],
        role: [
          {required: true, message: '不能为空'},
        ],
        pswd: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPswd: [
          { validator: validatePass2, trigger: 'blur' }
        ], 
      }
    }
  },
  computed: {
    userList: function() {
      return this.$store.state
    }
  },
  methods: {
    createUser: function() {
      this.createVisible = true
    },
    cancelCreate: function() {
      this.createVisible = false
    },
    confirmCreate: function() {
      this.createVisible = false
    },
    editRow: function() {

    },

    deleteRow: function() {

    }
  },
}
</script>
<style scoped>

</style>