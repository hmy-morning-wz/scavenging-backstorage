<template>
    <div><head-top></head-top>
    <div class="outermost">
      <el-card  shadow="never">
        <div class="queryOption">
          <el-tabs tab-position="right" v-model="activeName">
            <el-tab-pane name="first">
              <span slot="label"><i class="el-icon-arrow-up"></i> 快速检索</span>
              <div class="fastQuery">
                <el-tabs v-model="active" type="card">
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
                  <el-tab-pane label="卡号" name="second">                
                    <span slot="label"><i class="el-icon-refresh"></i>渠道交易号</span>
                    <div class="inputOption">
                      <el-input
                        placeholder="请输入渠道交易号"
                        suffix-icon="el-icon-refresh"
                        v-model="selectValue"
                        clearable>
                      </el-input>
                    </div>
                    <el-button type="primary" plain  icon="el-icon-search" round @click="quickSearch('channelNum')"></el-button>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-tab-pane>
            <el-tab-pane name="second" style="float:left">      
              <span slot="label"><i class="el-icon-arrow-down"></i> 复合查询</span>
              <div class="fastQuery">
                <el-tabs v-model="activeName2" type="card">
                  <el-tab-pane label="用户手机号" name="mobile">
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
                  <el-tab-pane label="卡号" name="cardNo">                
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
                  <el-tab-pane label="卡号" name="lineName">                
                    <span slot="label"><i class="el-icon-goods"></i>线路号</span>
                    <div class="inputOption">
                      <el-input
                        placeholder="请输入线路号"
                        suffix-icon="el-icon-goods"
                        v-model="selectValue2"
                        clearable>
                      </el-input>
                    </div>
                    <el-button type="primary" plain  icon="el-icon-search" round @click="compoundSearch('lineName')"></el-button>
                  </el-tab-pane>
                  <el-tab-pane label="卡号" name="vehicleId">                
                    <span slot="label"><i class="el-icon-goods"></i>车辆编号</span>
                    <div class="inputOption">
                      <el-input
                        placeholder="请输入车辆编号"
                        suffix-icon="el-icon-goods"
                        v-model="selectValue2"
                        clearable>
                      </el-input>
                    </div>
                    <el-button type="primary" plain  icon="el-icon-search" round @click="compoundSearch('vehicleId')"></el-button>
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
                    <el-tag type="info" plain>交易商户</el-tag>
                    <el-select v-model="disableChannel" v-if="!compoundSearchParams.issuerCode" disabled placeholder="请先选择发卡主体"></el-select>
                    <el-select v-model="compoundSearchParams.tradeCode" clearable v-if="compoundSearchParams.issuerCode" placeholder="请选择">
                      <el-option
                        v-for="item in tradelList"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </div>

                  <div class="each">
                    <el-tag type="info" plain>渠道</el-tag>
                    <el-select v-model="disableChannel" clearable v-if="!compoundSearchParams.issuerCode" disabled placeholder="请先选择发卡主体"></el-select>
                    <el-select v-model="compoundSearchParams.channelCode" clearable v-if="compoundSearchParams.issuerCode" placeholder="请选择">
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
          <el-checkbox-group 
            disabled
            v-model="checkedOption"
            :min="4"
            :max="4">
            <el-checkbox v-for="option in checkedValue" :label="option" :key="option"> {{option}} </el-checkbox>
          </el-checkbox-group>
        </div> -->
      </el-card>

      <div class="queryResult" v-show="activeName === 'first'">
        <div class="tableList">
            <el-table :data="consumList" size="small" border>
                <el-table-column type="index" prop="id" align="center"></el-table-column>
                <el-table-column prop="cityCode" label="CityCode" min-width="36" align="center"></el-table-column>
                <el-table-column prop="tradeCodeName" label="交易商户" min-width="35" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.tradeCodeName}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="orderNum" label="商户订单号" min-width="43" show-overflow-tooltip align="center">
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{hidden(scope.row.orderNum,'.',4,4)}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="channelName" label="渠道" min-width="33" align="center" >
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{scope.row.channelName}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="issuerName" label="发卡主体" min-width="35" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.issuerName}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="cardNo" label="卡号" min-width="44" align="center">
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{hidden(scope.row.cardNo,'.',4,4)}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="交易时间" min-width="45" align="center"></el-table-column>
                <el-table-column prop="consumeAmt" label="交易金额/元" min-width="40" align="center">
                  <template slot-scope="scope" class="detail-content">
                      <div class="detail-content">{{scope.row.consumeAmt/100}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="statusName" label="交易状态" min-width="37" align="center"></el-table-column>
                <el-table-column  label="操作" align="center" style="text-align:center">
                    <template slot-scope="scope">
                        <div style="display:flex">
                            <el-button size="small" type="text" plain  @click="handleJump('cardDetail?active=detail',scope.row.cardNo,scope.row.cityCode)">查看该用户<i class="el-icon-zoom-in"></i></el-button>
                            <el-button size="small" type="text" plain class="ml10"  @click="handleJump2('consumptionDetail',scope.row.id)">消费详情<i class="el-icon-zoom-in"></i></el-button>
                            <!-- <el-button size="small" type="info" plain>撤销该消费</el-button> -->
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-card  shadow="never">
          <div class="foot-page" style="text-align:center">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="quickSearchParams.currentPage" :page-sizes="[10]" :page-size="quickSearchParams.showCount" layout="total, sizes, prev, pager, next, jumper" :total="totalSize">
            </el-pagination>
          </div>
        </el-card>
      </div>

      <div class="queryResult" v-show="activeName === 'second'">
        <div class="tableList">
            <el-table :data="consumList2" size="small" border>
                <el-table-column type="index" prop="id" align="center"></el-table-column>
                <el-table-column prop="cityCode" label="CityCode" min-width="36" align="center"></el-table-column>
                <el-table-column prop="tradeCodeName" label="交易商户" min-width="35" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.tradeCodeName}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="orderNum" label="商户订单号" min-width="43" show-overflow-tooltip align="center">
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{scope.row.orderNum}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="channelName" label="渠道" min-width="33" align="center" >
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{scope.row.channelName}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="issuerName" label="发卡主体" min-width="35" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.issuerName}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="cardNo" label="卡号" min-width="44" align="center">
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{hidden(scope.row.cardNo,'.',4,4)}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="bizTime" label="交易时间" min-width="45" align="center"></el-table-column>
                <el-table-column prop="consumeAmt" label="交易金额/元" min-width="40" align="center">
                  <template slot-scope="scope" class="detail-content">
                      <div class="detail-content">{{scope.row.consumeAmt/100}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="statusName" label="交易状态" min-width="37" align="center"></el-table-column>
                <el-table-column  label="操作" align="center" style="text-align:center">
                    <template slot-scope="scope">
                        <div style="display:flex">
                            <el-button size="small" type="text" plain  @click="handleJump('cardDetail?active=detail',scope.row.cardNo,scope.row.cityCode)">查看该用户<i class="el-icon-zoom-in"></i></el-button>
                            <el-button size="small" type="text" plain class="ml10"  @click="handleJump2('consumptionDetail',scope.row.id)">消费详情<i class="el-icon-zoom-in"></i></el-button>
                            <!-- <el-button size="small" type="info" plain>撤销该消费</el-button> -->
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-card  shadow="never">
          <div class="foot-page" style="text-align:center">
            <el-pagination background @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="compoundSearchParams.currentPage" :page-sizes="[5,10]" :page-size="compoundSearchParams.showCount" layout="total, sizes, prev, pager, next, jumper" :total="totalSize2">
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
const Options = ['余额消费', '余额消费撤销', '信用消费', '信用消费撤销'];
export default {
  data() {
    return {
      activeName: 'first',
      active: 'first',
      activeName2: 'mobile',
      selectValue: '',
      selectVal: '',
      selectValue2: '',
      selectVal2: '',
      radio: '1',
      searchKey: 'orderNo',
      compoundKey:'mobile',
      checkedOption: ['余额消费', '余额消费撤销', '信用消费', '信用消费撤销'],
      checkedValue: Options,
      tradeDaterange:'',
      entryDaterange:'',
      issuerList: [],
      channelList: [],
      tradelList: [],
      disableChannel: '',
      disableTrade: '',      
      issuer:'',
      channel: '',
      trade: '',
      daterange:'',
      consumList: [],
      consumList2: [],
      
    loadingShow: false,
    tableData2: [],
    tableData: [],
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
      tradeCode:'',
      mobile: '',
      cardNo: ''
    },
    currentOption: {},
    activeTapOption: '',
    searchParams: {
      currentPage: 1,
      showCount: 10
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
    compoundSearch(compoundKey,params){
      this.compoundSearchParams.currentPage = 1
      this.compoundKey = compoundKey
      this.selectVal2 = this.selectValue2
      this.compoundSearchParams.cardNo = ''
      this.compoundSearchParams.mobile = ''
      this.compoundSearchParams.lineName = ''
      this.compoundSearchParams.vehicleId = ''
      this.compoundSearchParams[compoundKey] = this.selectValue2
      
      this.compoundSearchParams.startTime = this.tradeDaterange ? this.tradeDaterange[0] : ''
      this.compoundSearchParams.endTime = this.tradeDaterange ? this.tradeDaterange[1] : ''

      if(params){
        this.getTableList(params)
      }else{
        this.getTableList(this.compoundSearchParams)
      }
    },

    //获取表格数据
    getTableList(data){
      var oobj = Object.assign(this.currentOption,this.compoundSearchParams)
      tradeServer.getConsumeData(data).then(
        response => {
          if(this.activeName === 'first') {
            this.consumList = response.ecConsumeList
            this.totalSize = response.totalCount
          } else {
            this.consumList2 = response.ecConsumeList
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
          if(type === 4){
            this.tradelList = response
            this.compoundSearchParams.tradeCode = ''
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
        this.getSelectData(4,this.compoundSearchParams.issuerCode)
      }else{
        this.compoundSearchParams.channelCode = ''
        this.compoundSearchParams.tradeCode = ''
      }
    },

    handleSizeChange(val) {
      this.quickSearchParams.showCount = val;
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
      this.getTableList(this.currentOption)
    },
    handleCurrentChange(val) {
      this.quickSearchParams.currentPage = val;
      this.quickSearch(this.searchKey)
    },
    handleCurrentChange2(val) {
      // debugger
      this.currentOption.currentPage = val;
      this.selectValue2 = this.selectVal2
      this.radio = this.radioOption
      this.tradeDaterange = [this.currentOption.startTime,this.currentOption.endTime]   
      var oobj = Object.assign(this.compoundSearchParams,this.currentOption)
      this.activeName2 = this.compoundKey
      this.getTableList(this.currentOption)
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
    handleJump(link,cardNo,cityCode){
      const router = `./${link}&num=${cardNo}&code=${cityCode}`;
      this.$router.push(router);
    },
    handleJump2(link,cardNo,cityCode){
      const router = `./${link}?num=${cardNo}`;
      this.$router.push(router);
    },

    revoke(id){

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
    if(from.name==='cardDetail' || 'consumptionDetail'){
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
    // console.log(this.entryDaterange)
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
  margin-right: 1rem;
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
