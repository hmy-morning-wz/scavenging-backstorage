<template>
  <div>
    <head-top></head-top>
    <div class="containBan">
      <div class="leftBan">
        <div class="cardBan">
          <el-row :gutter="12">
            <el-col :span="6">
              <el-card  shadow="never" class="box-card">
                <div slot="header" class="clearfix">
                  <span>当前总余额</span>
                  <div class="mountText"><span class="mountCell">￥</span>&nbsp;{{dataConversion(total.sumReChargeAmt,'amount') || '暂无数据'}}</div>
                </div>
                <div class="text item">
                    每天 {{total.sumReChargeTime || '2:00'}} 更新
                </div>
              </el-card>          
            </el-col>
            <el-col :span="6">
              <el-card  shadow="never" class="box-card">
                <div slot="header" class="clearfix">
                  <span>累计发卡</span>
                  <div class="mountText">{{dataConversion(total.cusumOpenCardNum,'number') || (dataConversion(total.cusumOpenCardNum,'number')==0?0:'暂无数据')}}&nbsp;<span class="mountCell">张</span></div>
                </div>
                <div class="text item">
                  今日开卡&nbsp;&nbsp;<span>{{dataConversion(total.todayOpenCardNum,'number') || (dataConversion(total.todayOpenCardNum,'number')==0?0:'暂无数据')}}</span>&nbsp;&nbsp;张
                </div>
              </el-card>          
            </el-col>
            <el-col :span="6">
              <el-card  shadow="never" class="box-card">
                <div slot="header" class="clearfix">
                  <span>累计充值</span>
                  <el-button :class="{activeBtn : activeTop1 === 'number'} " size="small" @click="handleClick('activeTop1','number')" style="float: right;border-left:none">笔数</el-button>
                  <el-button :class="{activeBtn : activeTop1 === 'money'} " size="small" @click="handleClick('activeTop1','money')" style="float: right;border-right:none">金额</el-button>
                  <div v-if="activeTop1 === 'money'" class="mountText"><span class="mountCell">￥</span>&nbsp;{{dataConversion(total.cusumReChargeAmt,'amount') || '暂无数据'}}</div>
                  <div v-if="activeTop1 === 'number'" class="mountText">{{dataConversion(total.cusumReChargeNum,'number' )|| '暂无数据'}}&nbsp;<span class="mountCell">笔</span></div>
                </div>
                <div class="text item" v-if="activeTop1 === 'number'">
                  今日充值&nbsp;&nbsp;<span>{{dataConversion(total.todayReChargeNum,'number') || (dataConversion(total.todayReChargeNum,'number')==0?0:'暂无数据')}}</span>&nbsp;&nbsp;笔
                </div>
                <div class="text item" v-if="activeTop1 === 'money'">
                  今日充值&nbsp;&nbsp;￥<span>{{dataConversion(total.todayReChargeAmt,'amount') || '暂无数据'}}</span>&nbsp;&nbsp;
                </div>
              </el-card>          
            </el-col>
            <el-col :span="6">
              <el-card  shadow="never" class="box-card">
                <div slot="header" class="clearfix">
                  <span>累计消费</span>
                  <el-button :class="{activeBtn : activeTop2 === 'number'} " size="small" @click="handleClick('activeTop2','number')" style="float: right;border-left:none">笔数</el-button>
                  <el-button :class="{activeBtn : activeTop2 === 'money'} " size="small" @click="handleClick('activeTop2','money')" style="float: right;border-right:none">金额</el-button>
                  <div v-if="activeTop2 === 'money'" class="mountText"><span class="mountCell">￥</span>&nbsp;{{dataConversion(total.cusumConsumeAmt,'amount') || '暂无数据'}}</div>
                  <div v-if="activeTop2 === 'number'" class="mountText">{{dataConversion(total.cusumConsumeNum,'number') || '暂无数据'}}&nbsp;<span class="mountCell">笔</span></div>
                </div>
                <div class="text item" v-if="activeTop2 === 'number'">
                  今日消费&nbsp;&nbsp;<span>{{dataConversion(total.todayConsumeNum,'number') || (dataConversion(total.todayOpenCardNum,'number')==0?0:'暂无数据')}}</span>&nbsp;&nbsp;笔
                </div>
                <div class="text item" v-if="activeTop2 === 'money'">
                  今日消费&nbsp;&nbsp;￥<span>{{dataConversion(total.todayConsumeAmt,'amount') || '暂无数据'}}</span>&nbsp;
                </div>
              </el-card>          
            </el-col>
          </el-row>
        </div>
        <el-card  shadow="never">
          <div class="chartBan">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" active-text-color="#409eff" @select="handleSelect">
              <el-menu-item index="1">开卡</el-menu-item>
              <el-menu-item index="2">充值</el-menu-item>
              <el-menu-item index="3">消费</el-menu-item>
              <div class="chooseDate">
                <el-date-picker
                  v-model="daterange"
                  type="daterange"
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
                <el-button type="primary" plain icon="el-icon-search" round @click="getFoldlineList"></el-button>
              </div>
            </el-menu>
            <div class="charts" style="margin-top:1px;">
                <div id="chartPic" ref="mychart">
                </div>
            </div>
          </div>
        </el-card>
      </div>

      <div class="rightBan">
        <el-card  shadow="never" class="box-card" style="margin-top:0">
          <div slot="header" class="clearfix">
            <span>异常交易占比</span>
                <el-button :class="{activeBtn : activeError1 === 'week'} " @click="handleClick('activeError1','week')" size="small" style="float: right;border-left:none">7天</el-button>
                <el-button :class="{activeBtn : activeError1 === 'today'} " @click="handleClick('activeError1','today')" size="small" style="float: right;border-right:none">今日</el-button>
          </div>
          <div class="text item" style="text-align: center" v-if="activeError1 === 'today'">
            <el-progress type="circle" :width="150" :percentage="abnormal.abnormalTradeDayRatio ? parseFloat((parseFloat(abnormal.abnormalTradeDayRatio)*100).toFixed(2)) : 0"></el-progress>
          </div>
          <div class="text item" style="text-align: center" v-if="activeError1 === 'week'">
            <el-progress type="circle" :width="150" :percentage="abnormal.abnormalTradeWeekRatio ? parseFloat((parseFloat(abnormal.abnormalTradeWeekRatio)*100).toFixed(2)) : 0"></el-progress>
          </div>
        </el-card>
        <el-card  shadow="never" class="box-card">
          <div slot="header" class="clearfix">
            <span>超期交易占比</span>
                <el-button :class="{activeBtn : activeError2 === 'week'} " @click="handleClick('activeError2','week')" size="small" style="float: right;border-left:none">7天</el-button>
                <el-button :class="{activeBtn : activeError2 === 'today'} " @click="handleClick('activeError2','today')" size="small" style="float: right;border-right:none">今日</el-button>
          </div>
          <div class="text item" style="text-align: center" v-if="activeError2 === 'today'">
            <el-progress type="circle" :width="150" :percentage="abnormal.exceedTradeDayRatio ? parseFloat((parseFloat(abnormal.exceedTradeDayRatio)*100).toFixed(2)) : 0"></el-progress>
          </div>
          <div class="text item" style="text-align: center" v-if="activeError2 === 'week'">
            <el-progress type="circle" :width="150" :percentage="abnormal.exceedTradeWeekRatio ? parseFloat((parseFloat(abnormal.exceedTradeWeekRatio)*100).toFixed(2)) : 0"></el-progress>
          </div>
        </el-card>
        <el-card  shadow="never" class="box-card">
          <div slot="header" class="clearfix">
            <span>异常交易原因</span>
                <el-button :class="{activeBtn : activeError3 === 'week' } " @click="handleClick('activeError3','week')" size="small" style="float: right;border-left:none">7天</el-button>
                <el-button :class="{activeBtn : activeError3 === 'today'} " @click="handleClick('activeError3','today')" size="small" style="float: right;border-right:none">今日</el-button>
          </div>
          <div v-show="activeError3 === 'today'">
            <div v-for="(item,index) in abnormal.abnormalTradeDayReasonList" :key="index" v-if="index<5" class="text-item" :class="{grayBan : index> 2} ">
              <div class="itemLeft">【{{index+1}}】 {{item.reason}}</div>
              <div class="itemRight">{{(item.ratio*100).toFixed(2)}}%</div>
            </div>
            <div v-show="(!abnormal.abnormalTradeDayReasonList)||(abnormal.abnormalTradeDayReasonList.length === 0)" class="text-item">
              &nbsp;暂无
            </div>
          </div>
          <div v-show="activeError3 === 'week'">
            <div v-for="(item,index) in abnormal.abnormalTradeWeekReasonList" :key="index" v-if="index<5" class="text-item" :class="{grayBan : index> 2} ">
              <div class="itemLeft">【{{index+1}}】 {{item.reason}}</div>
              <div class="itemRight">{{(item.ratio*100).toFixed(2)}}%</div>
            </div>
            <div v-show="(!abnormal.abnormalTradeWeekReasonList)||(abnormal.abnormalTradeWeekReasonList.length === 0)" class="text-item">
              &nbsp;暂无
            </div>
          </div>
        </el-card>            
      </div>
    </div>
  </div>
</template>
<script>
import overviewServer from "../../service/scavengingManagement/overview.js";
import headTop from '../../components/headTop'
import { weeks } from '../../utils/common.js'

export default {
  data() {
    return {
      activeIndex: '1',
      selectKey: '1',
      activeName: '',
      activeError1: 'today',
      activeError2: 'today',
      activeError3: 'today',
      activeTop1: 'money',
      activeTop2: 'money',
      seriesData: [1,22,3,29],
      seriesData2: [11,21,31,9],
      index: 100,
      daterange: [],
      active: true,
      total: {
        cusumOpenCardNum:'',
        todayOpenCardNum: '',
        cusumReChargeNum: '',
        todayReChargeNum: '',
        cusumReChargeAmt: '',
        todayReChargeAmt: '',
        cusumConsumeNum: '',
        todayConsumeNum: '',
        cusumConsumeAmt: '',
        todayConsumeAmt: ''
      },
      abnormal: {
        abnormalTradeDayRatio: '',
        abnormalTradeWeekRatio : '',
        exceedTradeDayRatio : '',
        exceedTradeWeekRatio : '',
        abnormalTradeDayReasonList:[],
        abnormalTradeWeekReasonList:[]
      },
      foldLineList: [
        // [
        //   {
        //     openCardNum: '22',
        //     reChargeAmt: '23',
        //     todayChargeAmt: '55',
        //     consumeAmt: '55',
        //     createDate:'7-1',
        //     source: '',
        //     sourceName: 'zfb'
        //   },
        //   {
        //     openCardNum: '1',
        //     reChargeAmt: '34',
        //     todayChargeAmt: '',
        //     consumeAmt: '42',
        //     createDate:'7-2',
        //     source: '',
        //     sourceName: 'zfb'
        //   },
        //   {
        //     openCardNum: '39',
        //     reChargeAmt: '45',
        //     todayChargeAmt: '3',
        //     consumeAmt: '7',
        //     createDate:'7-3',
        //     source: '',
        //     sourceName: 'zfb'
        //   }
        // ],
        // [
        //   {
        //     openCardNum: '2',
        //     reChargeAmt: '54',
        //     todayChargeAmt: '63',
        //     consumeAmt: '58',
        //     createDate:'7-1',
        //     source: '',
        //     sourceName: 'zfb1'
        //   },
        //   {
        //     openCardNum: '10',
        //     reChargeAmt: '79',
        //     todayChargeAmt: '',
        //     consumeAmt: '23',
        //     createDate:'7-2',
        //     source: '',
        //     sourceName: 'zfb1'
        //   },
        //   {
        //     openCardNum: '3',
        //     reChargeAmt: '45',
        //     todayChargeAmt: '',
        //     consumeAmt: '34',
        //     createDate:'7-3',
        //     source: '',
        //     sourceName: 'zfb1'
        //   }
        // ],
        // [
        //   {
        //     openCardNum: '12',
        //     reChargeAmt: '32',
        //     todayChargeAmt: '45',
        //     consumeAmt: '34',
        //     createDate:'7-1',
        //     source: '',
        //     sourceName: '支付宝'
        //   },
        //   {
        //     openCardNum: '13',
        //     reChargeAmt: '3',
        //     todayChargeAmt: '56',
        //     consumeAmt: '59',
        //     createDate:'7-2',
        //     source: '',
        //     sourceName: '支付宝'
        //   },
        //   {
        //     openCardNum: '30',
        //     reChargeAmt: '47',
        //     todayChargeAmt: '',
        //     consumeAmt: '54',
        //     createDate:'7-3',
        //     source: '',
        //     sourceName: '支付宝'
        //   }
        // ],
      ],
      xPoints: [],
      xAxisInterval: 0
      // activeName: 'first'
    }
  },

  methods: {
    //获取概览顶部part数据
    getTotalData() {
      overviewServer.getTotalData().then(
        response => {
          this.total = JSON.parse(JSON.stringify(response));
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！');
        }
      );
    },

    //获取概览异常数据
    getAbnormalData() {
      overviewServer.getAbnormalData().then(
        response => {
          this.abnormal = JSON.parse(JSON.stringify(response));
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！');
        }
      );
    },

    //获取折线图所需数据
    getFoldlineList() {
      const data = {
        startDate: this.daterange[0],
        endDate: this.daterange[1]
      }
      overviewServer.getFoldlineList(data).then(
        response => {
          this.foldLineList = response
          if(response && response[0]) {
            this.xAxisInterval = Math.ceil(response[0].length/8)
          }
          this.drawChart(this.$refs.mychart)
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！');
        }
      );
    },

    handleSelect(key, keyPath) {
      this.selectKey = key
      // console.log(key)
      // console.log(this.selectKey+'555')
      this.drawChart(this.$refs.mychart)
    },

    createSeries: function(lists,index){
      // var lists = []
      var series = []
      var color = ['#409eff','#67c23a','#f56c6c']
      var serieData = []//= data
      var xPoint = []
      var seriesData = {}
      var name = []

      // debugger
      for (var x=0; x<lists.length;x++){
        serieData = []      
        name.push(lists[x][0].sourceName)

        for(var i=0; i<lists[x].length;i++){
          if(index === '1'){
            serieData.push(lists[x][i].openCardNum)
          }
          if(index === '2'){
            serieData.push(lists[x][i].reChargeAmt/100)
          }
          if(index === '3'){
            serieData.push(lists[x][i].consumeAmt/100)
          }

          if ( x=== 0) {
            xPoint.push(lists[0][i].createDate)
          } 
        }
        seriesData = {name: name[x], type: 'line',symbol: 'circle',symbolSize: 1,
              itemStyle: {
                normal: {
                  color: color[x]
                }
              },
              data:serieData}
        // debugger
        series.push(seriesData)
      }
      this.xPoints = xPoint

      return series
    },

    drawChart: function(charts) {
      var series = this.createSeries(this.foldLineList,this.selectKey)
      console.log(this.foldLineList.length)
      // console.log(this.foldLineList)
      var that = this

      // this.index = 24 / this.seriesData.length * 100
      // 基于准备好的dom,初始化eChars实例
      var myChart = echarts.init(charts)
      // 指定图表的配置项和数据
      var option = {
        // title: {
        //   text: this.buslove
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          formatter: function(params) {
            var res = '<div><p>' + params[0].name + '</p></div>'
            if(that.selectKey === '1'){
              for (var i = 0; i < params.length; i++) {
                res +=
                  '<p><div style="display:inline-block;width:10px;height:10px;margin-right:4px;border-radius:50%;background-color:'+params[i].color+';"></div>' + params[i].seriesName + ':' + params[i].data + '&nbsp;张</p>'
              }
            } else if(that.selectKey === '2' || that.selectKey === '3'){
              for (var i = 0; i < params.length; i++) {
                res +=
                  '<p><div style="display:inline-block;width:10px;height:10px;margin-right:4px;border-radius:50%;background-color:'+params[i].color+';"></div>' + params[i].seriesName + ':' + params[i].data + '&nbsp;元</p>'
              }
            } else {
              for (var i = 0; i < params.length; i++) {
                res +=
                  '<p><div style="display:inline-block;width:10px;height:10px;margin-right:4px;border-radius:50%;background-color:'+params[i].color+';"></div>' + params[i].seriesName + ':' + params[i].data + '</p>'
              }
            }           
            return res
          }
        },
        legend: {},
        xAxis: {
          type: 'category',
          boundaryGap: 1,        
          data: this.xPoints,
          axisLabel: { 
            interval: this.xAxisInterval 
          }
        },
        yAxis: {
          // type: 'value'
        },
        series: series
      }
      // 使用刚指定的配置项和数据显示图表
      myChart.setOption(option,true)
    },
    
    handleClick(str,name) {
      if( str === 'activeTop1'){
        this.activeTop1 = name;
      }
      if( str === 'activeTop2'){
        this.activeTop2 = name;
      }
      if( str === 'activeError1'){
        this.activeError1 = name;
      }
      if( str === 'activeError2'){
        this.activeError2 = name;
      }
      if( str === 'activeError3'){
        this.activeError3 = name;
      }
      
    },

    judgeDate(date1,date2){
      var year1 = date1.substring(0,4)
      var year2 = date2.substring(0,4)
      var month1 = date1.substring(5,7)
      var month2 = date2.substring(5,7)
      var day1 = date1.substring(8)
      var day2 = date2.substring(8)
      if((year2-year1)>1 || (((year2-year1)===1)&&(month1<month2)) || (((year2-year1)===1)&&(month1===month2)&&(day1<day2))){        
        this.$message.error('时间跨度不可大于365天哦');
        this.daterange = weeks()
      }
      // console.log(year2-year1)
      // debugger
      // var    d = new Date(Date.parse(date1.replace(/-/g, "/")));   
      // var    d2 = new Date(Date.parse(date2.replace(/-/g, "/")));  

      // var m = d.getMonth() + 1;//从 Date 对象返回月份 (0 ~ 11)。如果是超过11，setMonth的时候，年份会+1
      // d.setMonth(m);

      // if(d < d2)  
      // {
      //   this.$message.error('时间跨度不可大于一个月哦');
      //   this.daterange = weeks()
      // } 
    },

    dataConversion(data,type){
      var newData = ''
      if(type === 'amount'){
        if(data<1000000){
          newData = (data/100).toFixed(2)
        }else{
          newData = (data/1000000).toFixed(2)+'万'
        }
      }else if(type === 'number'){
        if(data>=10000){
          newData = (data/10000).toFixed(2)+'万'
        }
      }
      return newData || data
    },
  },

  components: {
    headTop
  },

  created(){
    this.daterange = weeks()
    this.getTotalData()
    this.getAbnormalData()
    this.getFoldlineList()
  },

  mounted() {
    this.drawChart(this.$refs.mychart)
  },

  updated() {
    this.judgeDate(this.daterange[0],this.daterange[1])
  }
}
</script>
<style lang="scss" scoped>
.containBan {
  padding: 1rem;
  // padding-top: 1rem;
  height: 100%;
  // background-color: rgba(0, 0, 0, 0.04);
}
.cardBan{
  margin-bottom: 1.5rem;
}
.leftBan {
  width: 77%;
  padding-right: 0.5%;
  float: left;
}
.rightBan {
  width: 22.5%;
  float: left;
}
.rightBan .box-card {
  margin-top: 2rem;
}
.chooseDate {
  float: right;
  margin-top: 0.6rem;
  padding-right: 1.3rem;
}
#chartPic {
  height: 28rem;
  padding-top: 1rem;
  background-color: white;
}
.activeBtn{
  background: rgba(64, 158, 255, 0.1);
  color: #409EFF;
}
.clearfix span{
  font-size: 15px;
}
.clearfix .mountText{
  font-size: 20px;
  padding: 1.2rem;
  padding-bottom: 0.1rem;
}
.text-item{
  // letter-spacing: 1px;
  line-height: 22px;
  display: flex;
}
.itemLeft {
  width: 80%;
}
.grayBan{
  color: #c0c4cc
}
</style>