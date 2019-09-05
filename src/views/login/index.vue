<template>
  <div class="container">
    <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="login-container">
      <h3 class="title">欢迎使用新松机器人</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.prevent="handleSubmit" :loading="logining">{{hintText}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {requestLogin,start} from '@/api/index'
  import {ROBOT_STATE} from '@/constants/robot'
  export default {
    data() {
      return {
        logining: false,
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        loginRules: {
          username: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }]
        },
        redirect: undefined,
        hintText: '登录',
        timer: null,
      }
    },
    watch: {
      // 监听，路由变化时执行
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    computed: {
      robotState(){
        return this.$store.state.status.fromPLC.fbRobotData.robotState
      }
    },
    methods: {
      handleSubmit() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.logining = true
            let loginParams = {
              username: this.loginForm.username,
              password: this.loginForm.password
            }
            this.$store.dispatch('LoginByUsername', loginParams).then(() => {
              this.hintText = '正在初始化'

              var count = 0
              this.timer = setInterval(()=>{
                count++
                switch (this.robotState) {
                  case ROBOT_STATE.initial:
                  case ROBOT_STATE.disable:
                    this.logining = false
                    this.$router.push({path: '/init'})
                    clearInterval(this.timer)
                    break;
                  case ROBOT_STATE.enable:
                  case ROBOT_STATE.standstill:
                    this.logining = false
                    this.$router.push({path: '/'})
                    clearInterval(this.timer)
                    break;
                  default:
                    break;
                }
                if (count >= 400) {
                  this.$message('can\'t start')
                  clearInterval(this.timer)
                }
              }, 300)

              // 登录成功后重定向到redirect或首页
              // this.$router.push({path: this.redirect || '/'})
            })
            .catch(() => {
              this.$message.error('invalid Login or password')
              this.logining = false
            })

          } else {
            console.log('error submit!')
            return false
          }
        })
      },

      enable() {
        // set base coordinate
        this.$store.dispatch('setBaseCoordinate')
        //
      }
    },
    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer)
      }
    },
  }
</script>

<style scoped>
  .container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: #83b5e8;
    background-image: url("../../assets/img/bk.jpg");
    background-repeat: no-repeat;
  }
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    float: right;
    margin-right: 120px;
    margin-top: 100px;
    width: 280px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
  }
  .title {
    margin: 0 auto 40px auto;
    text-align: center;
    color: #505458;
  }

</style>
