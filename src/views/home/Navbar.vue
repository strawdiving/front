
<template>
  <div class="header">
    <div class="logo">
      <router-link to="/" style="text-decoration: none; color: #ffffff">
        <img src="../../assets/img/siasun.png" class="logo-icon" height="70"/>
        <span class="title">{{$t('navbar.cobot')}}</span>
      </router-link>
    </div>
    <div class="menu">
      <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" background-color="transparent" text-color="#fff"
               active-text-color="#ffd04b" unique-opened router>
        <!--<el-menu-item v-for="item in items" :index="item.path" :key="item.path">-->
          <!--<div><i :class=item.icon></i>{{generateTitle(item.name)}}</div>-->
        <!--</el-menu-item>-->
        <el-menu-item v-for="route in routers" :index="route.path" :key="route.path">
          <div><i :class=route.meta.icon></i>{{generateTitle(route.meta.title)}}</div>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="right-menu">
      <el-button class="full-btn" size="small" @click="enterFullScreen">
        <svg-icon icon-class="full-screen"></svg-icon>
        <!-- <svg-icon class="full" icon-class="full-screen-exit"></svg-icon> -->
      </el-button>
      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <!--<i class="iconfont icon-power"></i>-->
          <svg-icon icon-class="power"></svg-icon>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>{{$t('navbar.homePage')}}</el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span style="display: block;" @click="changeLanguage">{{languageText}}</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span style="display: block;" @click="exit">{{$t('navbar.logout')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog :visible.sync="logoutVisible" close-on-click-modal>
      <el-button @click="cancel">取消</el-button>
      <el-button @click="logout">退出登陆</el-button>
      <el-button @click="back">返回初始化页面</el-button>
    </el-dialog>
  </div>
</template>

<script>
import * as screenfull from 'screenfull'
import {reset} from '@/api/index'
import {ROBOT_STATE} from '@/constants/robot'
  export default {
    data() {
      return {
        logoutVisible: false,
        items: [
          // { name: "移动", icon: "el-icon-rank", path: "/ctrl" },
          { name: "program", icon: "el-icon-edit-outline", path: "/program" },
          // { name: "运行", icon: "el-icon-menu", path: "/run" },
          { name: "status", icon: "el-icon-info", path: "/status" },
          { name: "settings", icon: "el-icon-setting", path: "/settings" }
        ]
      }
    },
    watch: {
      errorInfo: function (newVal, oldVal) {
        if (newVal.errorIndex !== oldVal.errorIndex) {
          this.warn(newVal.errorMsg)
          console.log(newVal)
        }
      },
      robotState: function (newVal, oldVal) {
        if (newVal == ROBOT_STATE.error && !this.emcStopSignal) {
          for (let i = 0; i < 7; i++) {
            if(this.exceedJointlimit[i]) {
              //
            }
          }
          this.handleErrorId()
        }
      }
    },
    computed: {
      routers() {
        const routers = this.$store.getters.addRouters
        var menu_routers = routers.filter(function (value) {
          if(value.meta){
              return true
          }
        })
        return menu_routers
      },
      languageText() {
        return (this.language === 'en')? '中文':'English'
      },
      language() {
        return this.$store.getters.language
      },
      errorInfo() {
        return this.$store.state.status.errorInfo
      },
      errorId() {
        return this.$store.state.status.fromPLC.fbRobotData.errorID[0]
      },
      robotState() {
        return this.$store.state.status.fromPLC.fbRobotData.robotState
      },
      emcStopSignal() {
        return this.$store.state.status.fromPLC.fbRobotData.emcStopSignal
      },
      exceedJointlimit() {
        return this.$store.state.status.fromPLC.fbRobotData.exceedJointLimit
      },
    },
    methods: {
      changeLanguage(){
        this.$store.commit('changeLanguage')
        this.$i18n.locale = this.language
      },
      exit() {
        this.logoutVisible = true
      },
      cancel() {
        this.logoutVisible = false
      },
      back() {
        this.$router.push({path: '/init'})
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload();// In order to re-instantiate the vue-router object to avoid bugs
        })
      },
      enterFullScreen() {
        if (screenfull.enabled) {
          screenfull.toggle()
        }
      },
      resetSystem() {
        //stop program

        // clear coordinate
        this.$store.dispatch('setCoordBase')
        reset()
      },
      warn(msg){
        this.$confirm(this.errorInfo.errorMsg, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.resetSystem()
        })
      },
      generateTitle(title) {
        const hasKey = this.$te('navbar.'+title)
        const translatedTitle = this.$t('navbar.'+title)
        if(hasKey) {
          return translatedTitle
        }
        return title
      },
      handleErrorId() {
        var errorMsg = ''
        switch (this.errorId) {
          case 1:
            errorMsg = this.$t('errMsg.initFile')
            break;
          case 2:
            errorMsg = this.$t('errMsg.comm')
            break;
          case 3:
            errorMsg = this.$t('errMsg.safetyModule')
            break;
          case 4:
            errorMsg = this.$t('errMsg.tcpBoard')
            break;
          case 5:
            errorMsg = this.$t('errMsg.middleDisconnect')
            break;
          case 1234:
            errorMsg = this.$t('errMsg.toolWeightSet')
            break;
          case 1001:
            errorMsg = this.$t('errMsg.dhParam')
            break;
          case 1002:
            errorMsg = this.$t('errMsg.enterPoints')
            break;
          case 1003:
            errorMsg = this.$t('errMsg.endPoint')
            break;
          case 1004:
            errorMsg = this.$t('errMsg.exceedLimit')
            break;
          case 1005:
            errorMsg = this.$t('errMsg.notContinuous')
            break;
          case 0:
            errorMsg = this.$t('errMsg.safetyController')
            break;
          default:
            if (this.errorId >= 2000 && this.errorId < 3000) {
              errorMsg = this.$t('errMsg.jointSpacePlan')
              break;
            } else if (this.errorId >= 3000 && this.errorId < 4000) {
              errorMsg = this.$t('errMsg.cartSpacePlan')
              break;
            } else if (this.errorId >= 4000 && this.errorId < 5000) {
              errorMsg = this.$t('errMsg.onlinePlan')
              break;
            } else if (this.errorId >= 5000 && this.errorId < 6000) {
              errorMsg = this.$t('errMsg.bezierBlendPlan')
              break;
            } else if (this.errorId >= 6000 && this.errorId < 7000) {
              errorMsg = this.$t('errMsg.jointBlendPlan')
              break;
            } else if (this.errorId >= 7000 && this.errorId < 8000) {
              var num = this.errorId % 10
              switch (num) {
                case 1:
                  errorMsg = this.$t('errMsg.encoder')
                  break;
                case 2:
                  errorMsg = this.$t('errMsg.axis')
                  break;
                case 3:
                  errorMsg = this.$t('errMsg.axisEnable')
                  break;
                case 4:
                  errorMsg = this.$t('errMsg.axisReset')
                  break;
                default:
                  errorMsg = this.$t('errMsg.internal')
                  break;
              }
            } else {
              errorMsg = this.$t('errMsg.internal')
              break;
            }

          // case 2001:
          //   errorMsg = this.$t('errMsg.endPoint')
          //   break;
          // case 3001:
          //   errorMsg = 'Moveto规划错误'
          //   break;
          // case 4001:
          //   errorMsg = 'Jogto错误'
          //   break;
          // case 5001:
          //   errorMsg = '融合点Q错误'
          //   break;
          // case 5002:
          //   errorMsg = '融合点Q2错误'
          //   break;
          // case 5003:
          //   errorMsg = '融合点计算错误'
          //   break;
          // case 5004:
          //   errorMsg = '融合速度计算错误'
          //   break;
          // case 5005:
          //   errorMsg = 'N线段错误'
          //   break;
          // case 5006:
          //   errorMsg = '过渡段错误'
          //   break;
          // case 6000:
          //   errorMsg = 'MoveJ融合错误'
          //   break;
          // case 7102:
          //   errorMsg = '1轴错误'
          //   break;
          // case 7202:
          //   errorMsg = '2轴错误'
          //   break;
          // case 7302:
          //   errorMsg = '3轴错误'
          //   break;
          // case 7402:
          //   errorMsg = '4轴错误'
          //   break;
          // case 7502:
          //   errorMsg = '5轴错误'
          //   break;
          // case 7602:
          //   errorMsg = '6轴错误'
          //   break;
          // case 7702:
          //   errorMsg = '7轴错误'
          //   break;
          // case 7103:
          //   errorMsg = '1轴使能错误'
          //   break;
          // case 7203:
          //   errorMsg = '2轴使能错误'
          //   break;
          // case 7303:
          //   errorMsg = '3轴使能错误'
          //   break;
          // case 7403:
          //   errorMsg = '4轴使能错误'
          //   break;
          // case 7503:
          //   errorMsg = '5轴使能错误'
          //   break;
          // case 7603:
          //   errorMsg = '6轴使能错误'
          //   break;
          // case 7703:
          //   errorMsg = '7轴使能错误'
          //   break;
          // case 7104:
          //   errorMsg = '1轴复位错误'
          //   break;
          // case 7204:
          //   errorMsg = '2轴复位错误'
          //   break;
          // case 7304:
          //   errorMsg = '3轴复位错误'
          //   break;
          // case 7404:
          //   errorMsg = '4轴复位错误'
          //   break;
          // case 7504:
          //   errorMsg = '5轴复位错误'
          //   break;
          // case 7604:
          //   errorMsg = '6轴复位错误'
          //   break;
          // case 7704:
          //   errorMsg = '7轴复位错误'
          //   break;
          // case 7101:
          //   errorMsg = '1轴编码器错误'
          //   break;
          // case 7201:
          //   errorMsg = '2轴编码器错误'
          //   break;
          // case 7301:
          //   errorMsg = '3轴编码器错误'
          //   break;
          // case 7401:
          //   errorMsg = '4轴编码器错误'
          //   break;
          // case 7501:
          //   errorMsg = '5轴编码器错误'
          //   break;
          // case 7601:
          //   errorMsg = '6轴编码器错误'
          //   break;
          // case 7701:
          //   errorMsg = '7轴编码器错误'
          //   break;

        }
        this.warn(errorMsg + '\n' + this.errorId)
      },
    }
  }
</script>

<style scoped>
  .header {
    height: 60px;
    line-height: 60px;
    /*background: #324057;*/
    background: rgba(0,56,148,0.9);
    color: #fff;
  }
  .logo {
    float: left;
    font-size: 22px;
    text-align: left;
    margin-left: 20px;
  }
  .logo-icon {
    vertical-align: middle;
  }
  .menu {
    float: left;
    bottom: 0;
    height: 100%;
    padding-left: 20px;
    overflow: hidden;
  }
  .el-menu-item {
    font-size: 16px;
    line-height: 70px;
    height: 70px;
  }
  .right-menu {
    text-align: right;
    margin-right: 20px;
    line-height: 70px;
  }
  .right-menu .full-btn {
    background-color: transparent;
    border: none;
    display: inline-block;
    margin-right: 10px;
    font-size: 20px;
    cursor: pointer;
    color: #eee;
  }
  .right-menu .avatar-container {
    display: inline-block;
  }
  .right-menu .avatar-wrapper {
    cursor: pointer;
    font-size: 20px;
    color: rgb(202, 25, 25);
  }
  .right-menu .avatar-wrapper i {
    color: #eee;
  }
  /*.icon-power {*/
    /*cursor: pointer;*/
    /*font-size: 40px;*/
    /*color: rgb(202, 25, 25);*/
  /*}*/
  /*.icon-full-screen {*/
    /*font-size: 40px;*/
    /*cursor: pointer;*/
    /*color: #eee;*/
  /*}*/
</style>
