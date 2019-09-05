<template>
  <div id="container" :style="{height:height,width: width}"></div>
</template>

<script>
  import Highcharts from 'highcharts/highstock'
  import HighchartsMore from 'highcharts/highcharts-more'
  HighchartsMore(Highcharts)

  export default {
    props: {
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '400px'
      }
    },
    data() {
      return {
        chart: null,
        interval: null,
      }
    },
    computed: {
      jointInfo() {
        return this.$store.state.status.fromPLC.jointInfo
      },
      controllerTemp() {
        return this.$store.state.status.fromPLC.fbRobotData.controllerTemp
      }
    },
    watch: {

    },
    methods: {
      initChart() {
        let options = {
          chart: {
            type: 'column'
          },
          title: {
            text: 'Temperature',
            align: 'right',
            style: {"color": "rgba(0, 0, 0, 0.45)","font-size": "16px","font-weight": "bold"}
          },
          xAxis: {
            categories: [
              'Joint1',
              'Joint2',
              'Joint3',
              'Joint4',
              'Joint5',
              'Joint6',
              'Joint7',
              'Controller'
            ],
            crosshair: true
          },
          yAxis: {
            min: 0,
            title: {
              text: 'temperature (℃)'
            }
          },
          tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} ℃</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0
            },
            series: {
              dataLabels: {
                enabled: true,
                border: 0,
                format: '{y}℃',
                style: {"fontWeight": "normal","font-size":"16px"}
              }
            },
          },
          series: [{
            name: 'temperature',
            data: [49.9, 71.5, 6.4, 19.2, 14.0, 76.0, 35.6, 48.9]

          }],
          credits: {
            enabled: false
          }
        }
        this.chart = Highcharts.chart('container',options)
        let that = this
        this.interval = setInterval(function () {
          let jointTemp = []
          if(that.jointInfo.length !== 0) {
            for(let i=0;i<7;i++) {
              jointTemp.push(that.jointInfo[i].actualTemp)
            }
          }
          if(that.controllerTemp.length !==0) {
            jointTemp.push(that.controllerTemp)
          }
          if(!jointTemp.length !== 0) {
            that.chart.series[0].setData(jointTemp)
          }

        },1000)
      }
    },
    mounted() {
      this.initChart()
    },
    beforeDestroy() {
      if (this.interval) {
        clearInterval(this.interval)
      }
    },
  }
</script>

<style scoped>

</style>
