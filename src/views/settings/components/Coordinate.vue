<template>
  <el-row :gutter="40">
    <el-col :span="14">
      <!--<el-button type="primary" @click="loadExistedCoords">加载已有坐标系</el-button>-->
      <el-table :data="userCoords" class="coordTable" border>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="table-expand">
              <!-- <el-form-item :label="$t('settings.coordName')">
                <span>{{props.row.name}}</span>
              </el-form-item>
              <el-form-item :label="$t('settings.coordType')">
                <span>{{props.row.type}}</span>
              </el-form-item> -->
              <el-form-item :label="$t('settings.coordParams')" label-width="100px">
                <span>{{props.row.params}}</span>
              </el-form-item>
              <el-form-item :label="$t('settings.desc')">
                <span>{{props.row.desc}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="name" :label="$t('settings.coordName')" align="center"></el-table-column>
        <el-table-column prop="type" :label="$t('settings.coordType')" align="center"></el-table-column>
        <el-table-column :label="$t('settings.actions')" width="150">
          <template slot-scope="scope">
            <el-button @click="deleteRow(scope.$index, userCoords)" size="mini" type="danger">{{$t('button.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="tcpCoords" class="coordTable" border :show-header="false">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="table-expand">
              <!-- <el-form-item :label="$t('settings.coordName')">
                <span>{{props.row.name}}</span>
              </el-form-item>
              <el-form-item :label="$t('settings.coordType')">
                <span>{{props.row.type}}</span>
              </el-form-item> -->
              <el-form-item :label="$t('settings.coordParams')">
                <span>{{props.row.params.bias}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="name" :label="$t('settings.coordName')" align="center"></el-table-column>
        <el-table-column prop="type" :label="$t('settings.coordType')" align="center"></el-table-column>
        <el-table-column :label="$t('settings.actions')" width="150">
          <template slot-scope="scope">
            <el-button @click="deleteRow(scope.$index, tcpCoords)" size="mini" type="danger">{{$t('button.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="buttonGroup">
        <el-button type="primary" @click="addCoord('tcp')" >{{$t('settings.addToolCoord')}}</el-button>
        <el-button type="primary" @click="addCoord('userCoord')  ">{{$t('settings.addUserCoord')}}</el-button>
      </div>
    </el-col>

    <el-col :span="10">
      <div class="coord-define-area" v-show="addVisible">
        <tcp v-show="this.coordType === 'tcp'" :defaultTcpData = "tcpData"
          @confirm-add="confirmAdd" @cancel-add="cancelAdd"></tcp>
        <user-coord v-show="this.coordType === 'userCoord'"
          :defaultUserCoord = "userCoord"
          @confirm-add="confirmAdd" @cancel-add="cancelAdd">
        </user-coord>
       </div>
    </el-col>
  </el-row>
</template>

<script>
  import Tcp from './coordinate/Tcp'
  import UserCoord from './coordinate/UserCord'
  import {setTcp, setUserCoord} from '@/api/param'

  export default {
    props: {
      userCoord: {
        type: Array
      },
      tcpData: {
        type: Object
      }
    },
    data() {
      return {
        coordType: '',
        addVisible: false,
      }
    },
    computed: {
      userCoords: function() {
        return this.$store.state.config.userCoords
      },
      tcpCoords: function() {
        return this.$store.state.config.tcpCoords
      },
    },
    methods: {
      loadExistedCoords() {
        this.$store.dispatch('updateCoords')
      },
      addCoord(type) {
        this.addVisible = true
        this.coordType = type
      },
      deleteRow(index, rows) {
        let params = {
          type: rows[index].type,
          index: index
        }
        console.log(params)
        this.$store.dispatch('deleteCoord', params)
      },
      confirmAdd() {
        this.addVisible = false
      },
      cancelAdd() {
        console.log('cancel')
        this.addVisible = false
      }
    },
    components: {
      Tcp,
      UserCoord
    },
    mounted() {
      this.loadExistedCoords()
    }
  }
</script>

<style>
.coordTable {
  margin-top: 20px;
}
.coord-define-area {
  padding-left: 40px;
  /*border-left: 1px solid #99a9bf;*/
  /*#dfe3f0;*/
}
.table-expand {
  font-size: 0;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.table-expand label {
    width: 100px;
    color: #99a9bf;
  }
.buttonGroup {
  margin-top: 40px;
}
.innerContainer {
  margin: auto;
}
.userCoord-button-group {
  width: 500px;
  text-align: left;
}
.load-field {
  border: 2px solid #99a9bf;
  padding: 10px;
}
.tcp-button-group {
  margin: 10px 0;
  text-align: center;
}
.tcp-button-group1 {
  margin: 20px auto;
  text-align: left;
}
</style>
