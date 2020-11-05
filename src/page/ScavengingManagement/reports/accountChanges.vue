<template>
    <div><head-top></head-top>
    <div class="outermost">
      <el-card shadow='never'>
        <div class="compoundQuery">
          <div class="optionLine2">              
            <div class="each">
               <el-tag type="info" plain>发卡主体</el-tag>
                <el-select v-model="issuer" @change="updateSelectData"  placeholder="(必选)请选择">
                  <el-option
                    ref="selectOp"
                    v-for="item in issuerList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>  
            </div> 

            <div class="each">
               <el-tag  type="info" plain>渠道</el-tag>
              <el-select v-model="disableChannel" v-if="!issuer" disabled  placeholder="请先选择发卡主体"></el-select>
              <el-select v-model="channel" v-if="issuer"   placeholder="(必选)请选择">
                <el-option
                  ref="selectOpt"
                  v-for="item in channelList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>   
            </div>

            <el-button type="primary" plain  icon="el-icon-search" round @click="compoundSearch"></el-button>
            <el-button type="primary" plain  icon="el-icon-printer" @click="chartsExport" style="position:absolute;right:4rem;">导出报表</el-button>
            <!-- <el-button type="primary" plain style="margin-left:6rem;">导出报表</el-button> -->
          </div>
        </div>
      </el-card>

      <div class="queryResult">
        <div class="tableList">
            <el-table :data="tableData" size="small" border>
                <el-table-column type="index" prop="id" align="center"></el-table-column>
                <el-table-column prop="month" label="月" min-width="30" align="center"></el-table-column>
                <el-table-column prop="beginBalance" label="期初余额/元" min-width="38" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.beginBalance/100}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="chargeAmount" label="账户充值总额/元" min-width="45" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.chargeAmount/100}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="consumeAmount" label="余额消费总额/元" min-width="45" align="center" >
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{scope.row.consumeAmount/100}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="deductAmount" label="余额消费渠道抵扣总额/元" min-width="50" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.deductAmount/100}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="refundAmount" label="退卡退款总额/元" min-width="45" align="center">
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{scope.row.refundAmount/100}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="endBalance" label="期末余额/元" min-width="36" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.endBalance/100}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="correctName" label="是否结平" min-width="30" align="center"></el-table-column>
                <el-table-column  label="操作" min-width="35" align="center" style="text-align:center">
                    <template slot-scope="scope">
                        <div style="display:flex">
                            <el-button size="small" type="text" plain class="ml10" @click="handleJump(scope.row.month,issuerOption,channelOption)">查看日<i class="el-icon-zoom-in"></i></el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-card shadow='never'>
          <div class="foot-page" style="text-align:center">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParams.currentPage" :page-sizes="[10]" :page-size="searchParams.showCount" layout="total, sizes, prev, pager, next, jumper" :total="totalSize">
            </el-pagination>
          </div>
        </el-card>
      </div>
    </div>
    </div>
</template>
<script>
import cardServer from "../../../service/scavengingManagement/reports.js";
import headTop from '../../../components/headTop'
import { weeks, ostreamRequset } from '../../../utils/common.js'

export default {
  data() {
    return {
      activeName: 'first',
      activeName2: 'first',
      searchKey: 'phone',
      selectValue: '',
      showFirstTable: true,
      daterange:'',
      issuerList: [],
      channelList: [],
      statusList: [],
      issuer:'',
      issuerOption: '',
      channel: '',
      channelOption: '',
      disableChannel: '',
      status: '',        
      loadingShow: false,
      tableData: [],
      searchParams: {
        currentPage: 1,
        showCount: 10,
        issuerCode: '',
        channelCode: '',
      },
      totalSize: 0
      }
  },
  methods: {
    //复合检索
    compoundSearch(){

      if(this.issuer&&this.channel){
        this.searchParams.currentPage = 1
        this.getTableList(this.issuer,this.channel)
      }else{
        this.$message({
          message: '有选项未选择哦',
          type: 'warning'
        });
      }
    },

    //获取表格数据
    getTableList(issuer,channel){
      this.searchParams.issuerCode = issuer
      this.searchParams.channelCode = channel
      cardServer.getChangeMonth(this.searchParams).then(
        response => {
          this.tableData = response.recordList
          this.totalSize = response.totalCount
          this.issuerOption = issuer
          this.channelOption = channel
        },
        response => {
          this.tableData = []
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
    },

    //获取下拉选项列表
    getSelectData(type,issuerCode,tradeTypeCode){
      const data = {
        type: type,
        issuerCode: issuerCode,
        tradeTypeCode: tradeTypeCode
      }
      cardServer.getSelectData(data).then(
        response => {
          if(type === 1){
            this.issuerList = response
          }
          if(type === 2){
            this.channelList = response
            this.channel = ''
          }
          if(type === 3){
            this.statusList = response
          }
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
    },

    updateSelectData(){
      console.log(this.$refs.selectOp[0].$options.propsData.label)
      // debugger
      if(this.issuer){
        this.getSelectData(2,this.issuer)
      }else{
        this.channel = ''
      }
    },

    handleSizeChange(val) {
      this.searchParams.showCount = val;
    },
    handleCurrentChange(val) {
      this.searchParams.currentPage = val;
      this.issuer = this.issuerOption
      this.channel = this.channelOption
      this.getTableList(this.issuerOption,this.channelOption)
    },
    hidden(str,link,frontLen,endLen) { 
        var len = str.length-frontLen-endLen;
        var xing = '';
        for (var i=0;i<len;i++) {
        xing+=link;
      }
        return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
    },

    //页面跳转
    handleJump(month,issuer,channel){
      this.issuer = this.issuerOption
      this.channel = this.channelOption
      const router = `./everydayChange`;
      const dayItem = {
        month: month,
        issuer: issuer,
        channel: channel,
        issuerName: this.$refs.selectOp[0].$options.propsData.label,
        channelName: this.$refs.selectOpt[0].$options.propsData.label
      }
      sessionStorage.setItem('dayItem',JSON.stringify(dayItem))
      this.$router.push(router);
    },
    chartsExport() {
      if(!(this.issuer&&this.channel)){
        this.$message({
          message: '有选项未选择哦',
          type: 'warning'
        });
        return
      }
      const formData = {
          issuerCode: this.issuer,
          channelCode: this.channel
      }
      const url = '/export/account/changemonth'
      cardServer.reportExport(formData,url).then(
        response => {
          if(response.emptyData){
            this.$message.error(response.showMessage);
          }else{
            location.href = response.downloadUrl
          }          
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
    }
  },
  components: {
    headTop
  },
  beforeRouteEnter(to, from, next) {
    // 路由导航钩子，此时还不能获取组件实例 `this`，所以无法在data中定义变量（利用vm除外）
    // 参考 https://router.vuejs.org/zh-cn/advanced/navigation-guards.html
    // 所以，利用路由元信息中的meta字段设置变量，方便在各个位置获取。这就是为什么在meta中定义isBack
    // 参考 https://router.vuejs.org/zh-cn/advanced/meta.html
    if(from.name==='everydayChange'){
        to.meta.isBack=true;
        //判断是从哪个路由过来的，
        //如果是everydayChange过来的，表明当前页面不需要刷新获取新数据，直接用之前缓存的数据即可
    }

    next();
  },
  activated() {
    if(!this.$route.meta.isBack){
      // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
      // this.getData();
    }
    // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
    this.$route.meta.isBack=false

  },
  created(){
    // this.getSelectData()
    this.getSelectData(1)
  },
  mounted(){
  },
  updated() {
    // console.log(this.issuer+'issuer')
    // console.log(this.issuerOption+'issuerOption')
    // console.log(this.channel+'channel')
    // console.log(this.channelOption+'channelOption')
  }
};
</script>
<style lang="scss" scoped>
.outermost {
  padding: 2rem;
  height: 100%;
  // background-color: #f5f7fa//rgba(0, 0, 0, 0.04);
}
.queryOption{
  background-color: white;
  padding: 1rem;
  // width: 92%;
}
.queryResult{
  // padding: 2rem;
  padding-top: 1rem;
}

.inputOption{
  width: 36rem;
}

.optionLine2{
  display: flex;
}
.each{
  margin-right: 1.5rem;
}
.tableList, .totalTable{
  margin-bottom: 1.5rem;
  // box-shadow: 0 -2px 8px 0 rgba(0,0,0,0.08);
}
.foot-page{
  background-color: white;
  // width: 60%;
}
.inputOption{
  display:inline-block;
}
.nowWrap{
  width: 80%;
  margin: 0 auto;
  overflow: hidden; 
  white-space: nowrap; 
  text-overflow: ellipsis;
}
.el-tag{
  font-size: 15px;
  line-height: 2.4rem;
  margin-right: 0.5rem;
  height: auto;
  padding: 0 1rem;
}
</style>