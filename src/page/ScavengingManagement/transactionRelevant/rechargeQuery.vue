<template>
    <div><head-top></head-top>
    <div class="outermost">
      <el-card  shadow="never">
        <div class="queryOption">
          <el-tabs tab-position="right" v-model="activeName">
            <el-tab-pane name="first">
              <span slot="label"><i class="el-icon-arrow-up"></i> 快速检索</span>
              <div class="fastQuery">
                <el-tabs v-model="activeName2" type="card">
                  <el-tab-pane label="用户手机号" name="first">
                    <span slot="label"><i class="el-icon-document"></i>商户订单号</span>
                    <div class="inputOption">
                      <el-input
                        placeholder="请输入商户订单号"
                        suffix-icon="el-icon-document"
                        v-model="selectValue"
                        clearable>
                      </el-input>
                    </div>
                    <el-button type="primary" plain  icon="el-icon-search" round @click="quickSearch('orderNo')"></el-button>
                  </el-tab-pane>
                  <el-tab-pane label="渠道交易号" name="second">                
                    <span slot="label"><i class="el-icon-refresh"></i>渠道交易号</span>
                    <div class="inputOption">
                      <el-input
                        placeholder="请输入渠道交易号"
                        suffix-icon="el-icon-refresh"
                        v-model="selectValue"
                        clearable>
                      </el-input>
                    </div>
                    <el-button icon="el-icon-search" round @click="quickSearch('channelNo')"></el-button>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-tab-pane>
            <el-tab-pane name="second" style="float:left">      
              <span slot="label"><i class="el-icon-arrow-down"></i> 复合查询</span>
              <div class="fastQuery">
                <el-tabs v-model="activeName3" type="card">
                  <el-tab-pane label="用户手机号" name="first">
                    <span slot="label"><i class="el-icon-phone-outline"></i>用户手机号</span>
                    <div class="inputOption">
                      <el-input
                        placeholder="请输入用户手机号"
                        suffix-icon="el-icon-phone-outline"
                        v-model="selectValue2"
                        clearable>
                      </el-input>
                    </div>
                    <el-button type="primary" plain  icon="el-icon-search" round @click="compoundSearch('mobile')"></el-button>
                  </el-tab-pane>
                  <el-tab-pane label="卡号" name="second">                
                    <span slot="label"><i class="el-icon-goods"></i>卡号</span>
                    <div class="inputOption">
                      <el-input
                        placeholder="请输入卡号"
                        suffix-icon="el-icon-goods"
                        v-model="selectValue2"
                        clearable>
                      </el-input>
                    </div>
                    <el-button type="primary" plain  icon="el-icon-search" round @click="compoundSearch('cardNo')"></el-button>
                  </el-tab-pane>
                </el-tabs>
              </div>
              <div class="compoundQuery">
                <div class="optionLine1">
                  <div class="chooseDate">
                    <el-tag type="info" plain>交易时间</el-tag>
                    <el-date-picker
                      v-model="tradeDaterange"
                      type="daterange"
                      unlink-panels
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </div>
                  <!-- <div class="chooseDate">
                    <el-tag type="info" plain>入账时间</el-tag>
                    <el-date-picker
                      v-model="entryDaterange"
                      type="daterange"
                      unlink-panels
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker></div> -->
                </div>
                <div class="optionLine2">              
                  <div class="each">
                    <el-tag type="info" plain>发卡商户</el-tag>
                      <el-select v-model="compoundSearchParams.issuerCode" @change="updateSelectData" clearable placeholder="请选择">
                        <el-option
                          v-for="item in issuerList"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code">
                        </el-option>
                      </el-select>   
                  </div> 

                  <div class="each">
                    <el-tag type="info" plain>渠道</el-tag>
                    <el-select v-model="disableChannel" v-if="!compoundSearchParams.issuerCode" disabled clearable placeholder="请先选择发卡主体"></el-select>
                    <el-select v-model="compoundSearchParams.channelCode" v-if="compoundSearchParams.issuerCode" clearable placeholder="请选择">
                      <el-option
                        v-for="item in channelList"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </div>               

                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <!-- <div class="radioDiv">        
          <el-radio disabled  v-model="radio" label="1">充值</el-radio>
          <el-radio disabled  v-model="radio" label="2">退卡退款</el-radio>
        </div> -->
      </el-card>

      <div class="queryResult" v-show="activeName==='first'">
        <div class="tableList">
            <el-table :data="rechargeList" size="small" border>
                <el-table-column type="index" prop="id" align="center"></el-table-column>
                <el-table-column prop="cityCode" label="CityCode" min-width="38" align="center"></el-table-column>
                <el-table-column prop="issuerName" label="交易商户" min-width="35" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.issuerName}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="orderNum" label="商户订单号" min-width="45" show-overflow-tooltip align="center">
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{hidden(scope.row.orderNum,'.',4,4)}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="channelName" label="渠道" min-width="45" show-overflow-tooltip align="center"></el-table-column>              
                <el-table-column prop="cardNo" label="卡号" min-width="45" show-overflow-tooltip align="center">
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{hidden(scope.row.cardNo,'.',4,4)}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="交易时间" min-width="48" align="center" ></el-table-column>
                <el-table-column prop="amt" label="交易金额（元）" min-width="53" align="center" >
                  <template slot-scope="scope" class="detail-content">
                      <div class="detail-content">{{scope.row.amt/100}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="statusName" label="交易状态" min-width="48" align="center" ></el-table-column>
                <el-table-column  label="操作" min-width="97" align="center" style="text-align:center">
                    <template slot-scope="scope">
                        <div style="display:flex">
                            <el-button size="small" type="text" plain @click="handleJump('cardDetail?active=detail',scope.row.cardNo,scope.row.cityCode)">查看该用户<i class="el-icon-zoom-in"></i></el-button>
                            <el-button v-if="radio === '1'" size="small" type="text" plain class="ml10" @click="handleJump2('rechargeDetail',scope.row.id)">充值详情<i class="el-icon-zoom-in"></i></el-button>
                            <el-button v-if="radio === '2'" size="small" type="text" plain class="ml10" @click="handleJump2('refundDetail',scope.row.id)">退款详情<i class="el-icon-zoom-in"></i></el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-card shadow="never">
          <div class="foot-page" style="text-align:center">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="quickSearchParams.currentPage" :page-sizes="[10]" :page-size="quickSearchParams.showCount" layout="total, sizes, prev, pager, next, jumper" :total="totalSize">
            </el-pagination>
          </div>
        </el-card>
      </div>
      <div class="queryResult" v-show="activeName==='second'">
        <div class="tableList">
            <el-table :data="rechargeList2" size="small" border>
                <el-table-column type="index" prop="id" align="center"></el-table-column>
                <el-table-column prop="cityCode" label="CityCode" min-width="38" align="center"></el-table-column>
                <el-table-column prop="issuerName" label="交易商户" min-width="35" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.issuerName}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="orderNum" label="商户订单号" min-width="45" show-overflow-tooltip align="center">
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{hidden(scope.row.orderNum,'.',4,4)}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="channelName" label="渠道" min-width="45" show-overflow-tooltip align="center"></el-table-column>              
                <el-table-column prop="cardNo" label="卡号" min-width="45" show-overflow-tooltip align="center">
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{hidden(scope.row.cardNo,'.',4,4)}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="交易时间" min-width="48" align="center" ></el-table-column>
                <el-table-column prop="amt" label="交易金额（元）" min-width="53" align="center" >
                  <template slot-scope="scope" class="detail-content">
                      <div class="detail-content">{{scope.row.amt/100}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="statusName" label="交易状态" min-width="48" align="center" ></el-table-column>
                <el-table-column  label="操作" min-width="97" align="center" style="text-align:center">
                    <template slot-scope="scope">
                        <div style="display:flex">
                            <el-button size="small" type="text" plain @click="handleJump('cardDetail?active=detail',scope.row.cardNo,scope.row.cityCode)">查看该用户<i class="el-icon-zoom-in"></i></el-button>
                            <el-button v-if="radio === '1'" size="small" type="text" plain class="ml10" @click="handleJump2('rechargeDetail',scope.row.id)">充值详情<i class="el-icon-zoom-in"></i></el-button>
                            <el-button v-if="radio === '2'" size="small" type="text" plain class="ml10" @click="handleJump2('refundDetail',scope.row.id)">退款详情<i class="el-icon-zoom-in"></i></el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-card shadow="never">
          <div class="foot-page" style="text-align:center">
            <el-pagination background @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="compoundSearchParams.currentPage" :page-sizes="[10]" :page-size="compoundSearchParams.showCount" layout="total, sizes, prev, pager, next, jumper" :total="totalSize2">
            </el-pagination>
          </div>
        </el-card>
      </div>
    </div>
    </div>
</template>
<script>
import tradeServer from "../../../service/scavengingManagement/transactionRelevant.js";
import headTop from '../../../components/headTop'
export default {
  data() {
    return {
      activeName: 'first',
      activeName2: 'first',
      activeName3: 'first',
      selectValue: '',
      selectValue2: '',
      selectVal: '',
      selectVal2: '',
      radio: '1',
      radioOption: '',
      searchKey: 'orderNo',
      compoundKey:'mobile',
      nowDate1:'',
      nowDate2: '',
      rechargeList: [],
      rechargeList2: [],
      tradeDaterange:'',
      entryDaterange:'',
      issuerList: [],
      channelList: [],
      issuer:'',
      channel: '',
      disableChannel: '',
      
    loadingShow: false,
    currentOption: {},
    quickSearchParams:{
      isQuickScreen: true,
      currentPage: 1,
      showCount: 10,
      orderNum: '',
      channelNum: ''
    },
    compoundSearchParams:{
      isQuickScreen: false,
      currentPage: 1,
      showCount: 10,
      startTime: '',
      endTime: '',
      issuerCode: '',
      channelCode: '',
      mobile: '',
      cardNo: ''
    },
    totalSize: 0,
    totalSize2: 0
    };
  },
  methods: {
    //快速检索
    quickSearch(searchKey){
      this.searchKey = searchKey
      this.selectVal = this.selectValue
      if(searchKey === 'orderNo'){
        this.quickSearchParams.orderNum = this.selectValue
        this.quickSearchParams.channelNum = ''
      } else {
        this.quickSearchParams.channelNum = this.selectValue
        this.quickSearchParams.orderNum = ''
      }

      this.getTableList(this.quickSearchParams)
    },
    //复合检索
    compoundSearch(compoundKey,params,page){
      this.compoundKey = compoundKey
      this.selectVal2 = this.selectValue2
      if(compoundKey === 'mobile'){
        this.compoundSearchParams.mobile = this.selectValue2
        this.compoundSearchParams.cardNo = ''
      }
      if(compoundKey === 'cardNo'){
        this.compoundSearchParams.mobile = ''
        this.compoundSearchParams.cardNo = this.selectValue2
      }
      
      this.compoundSearchParams.startTime = this.tradeDaterange ? this.tradeDaterange[0] : ''
      this.compoundSearchParams.endTime = this.tradeDaterange ? this.tradeDaterange[1] : ''

      if(!page) this.compoundSearchParams.currentPage = 1
      if(params){
        this.getTableList(params)
      }else{
        this.getTableList(this.compoundSearchParams)
      }
    },

    //获取表格数据
    getTableList(data){
      var oobj = Object.assign(this.currentOption,this.compoundSearchParams)
      this.radioOption = this.radio
      tradeServer.getRechargeData(data).then(
        response => {
          if(this.activeName === 'first'){
            this.rechargeList = response.ecRechargeList
            this.totalSize = response.totalCount
          } else {
            this.rechargeList2 = response.ecRechargeList
            this.totalSize2 = response.totalCount
          }
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
    },

    //获取下拉选项列表
    getSelectData(type,issuerCode){
      const data = {
        type: type,
        issuerCode: issuerCode
      }
      tradeServer.getSelectData(data).then(
        response => {
          if(type === 1){
            this.issuerList = response
          }
          if(type === 9){
            this.channelList = response
            this.compoundSearchParams.channelCode = ''
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
      if(this.compoundSearchParams.issuerCode){
        this.getSelectData(9,this.compoundSearchParams.issuerCode)
      }else{
        this.compoundSearchParams.channelCode = ''
      }
    },

    handleSizeChange(val) {
      this.searchParams.showCount = val;
      this.radio = this.radioOption
      this.quickSearch(this.searchKey)
    },
    handleSizeChange2(val) {
      // debugger
      this.currentOption.showCount = val;
      this.selectValue2 = this.selectVal2
      this.radio = this.radioOption
      this.tradeDaterange = [this.currentOption.startTime,this.currentOption.endTime]
      var oobj = Object.assign(this.compoundSearchParams,this.currentOption)
      if(this.compoundKey === 'mobile'){
        this.activeName3 = 'first'
      }else{
        this.activeName3 = 'second'
      }
      this.compoundSearch(this.compoundKey,this.currentOption,1)
    },
    handleCurrentChange(val) {
      this.searchParams.currentPage = val;
      this.radio = this.radioOption
      this.quickSearch(this.searchKey)
    },
    handleCurrentChange2(val) {
      // debugger
      this.currentOption.currentPage = val;
      this.selectValue2 = this.selectVal2
      this.radio = this.radioOption
      this.tradeDaterange = [this.currentOption.startTime,this.currentOption.endTime]   
      var oobj = Object.assign(this.compoundSearchParams,this.currentOption)
      if(this.compoundKey === 'mobile'){
        this.activeName2 = 'first'
      }else{
        this.activeName2 = 'second'
      }
      this.compoundSearch(this.compoundKey,this.currentOption,1)
    },

    //页面跳转
    handleJump(link,cardNo,cityCode){
      const router = `./${link}&num=${cardNo}&code=${cityCode}`;
      this.$router.push(router);
    },
    //页面跳转
    handleJump2(link,cardNo,cityCode){
      const router = `./${link}?num=${cardNo}`;
      this.$router.push(router);
    },
    hidden(str,link,frontLen,endLen) { 
        var len = str.length-frontLen-endLen;
        var xing = '';
        if(len > 4){
          xing += (link+link+link+link)
        }else{
          for (var i=0;i<len;i++) {
            xing+=link;
          }
        }
        return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
    },

  },

  components: {
    headTop
  },
  beforeRouteEnter(to, from, next) {
    // 路由导航钩子，此时还不能获取组件实例 `this`，所以无法在data中定义变量（利用vm除外）
    // 参考 https://router.vuejs.org/zh-cn/advanced/navigation-guards.html
    // 所以，利用路由元信息中的meta字段设置变量，方便在各个位置获取。这就是为什么在meta中定义isBack
    // 参考 https://router.vuejs.org/zh-cn/advanced/meta.html
    if(from.name==='cardDetail' || 'rechargeDetail'){
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
    this.getSelectData(1)
  },

  mounted(){
  },
  updated() {
    // console.log(this.tradeDaterange)
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
.chooseDate{
  margin-top: 0.8rem;
}
.optionLine2{
  display: flex;
  margin-top: 1rem;
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
  width: 70%;
  margin: 0 auto;
  overflow: hidden; 
  white-space: nowrap; 
  text-overflow: ellipsis;
}
.radioDiv{
  padding: 0 1rem 1rem 1rem;
  float: right;
}
.el-tag{
  font-size: 15px;
  line-height: 2.4rem;
  margin-right: 0.5rem;
  height: auto;
  padding: 0 1rem;
}
</style>
