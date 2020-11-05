<template>
    <div>
      <head-top></head-top>
    <div class="outermost">
      <el-card  shadow="never">
        <div class="queryOption">
          <el-tabs tab-position="right" v-model="activeName">
            <el-tab-pane name="first">
              <span slot="label"><i class="el-icon-arrow-up"></i> 快速检索</span>
              <div class="fastQuery">
                <el-tabs v-model="activeName2" type="card">
                  <el-tab-pane label="用户手机号" name="first">
                    <span slot="label"><i class="el-icon-phone-outline"></i>用户手机号</span>
                    <div class="inputOption">
                      <el-input
                        placeholder="请输入用户手机号"
                        suffix-icon="el-icon-phone-outline"
                        v-model="selectValue"
                        clearable>
                      </el-input>
                    </div>
                    <el-button type="primary" plain  icon="el-icon-search" round @click="quickSearch('first')"></el-button>
                  </el-tab-pane>
                  <el-tab-pane label="卡号" name="second">                
                    <span slot="label"><i class="el-icon-goods"></i>卡号</span>
                    <div class="inputOption">
                      <el-input
                        placeholder="请输入用户卡号"
                        suffix-icon="el-icon-goods"
                        v-model="selectValue"
                        clearable>
                      </el-input>
                    </div>
                    <el-button type="primary" plain  icon="el-icon-search" round @click="quickSearch('second')"></el-button>
                  </el-tab-pane>
                  <el-tab-pane label="用户证件号" name="third">
                    <span slot="label"><i class="el-icon-tickets"></i>用户证件号</span>
                    <div class="inputOption">
                      <el-input
                        placeholder="请输入用户证件号"
                        suffix-icon="el-icon-tickets"
                        v-model="selectValue"
                        clearable>
                      </el-input>
                    </div>
                    <el-button  type="primary" plain icon="el-icon-search" round @click="quickSearch('third')"></el-button>
                  </el-tab-pane>
                  <!-- <el-tab-pane label="用户姓名" name="fourth">
                    <span slot="label"><i class="el-icon-star-off"></i>用户姓名</span>
                    <div class="inputOption" style="display:inline-block">
                      <el-input
                        placeholder="请输入用户姓名"
                        suffix-icon="el-icon-star-off"
                        v-model="selectValue"
                        clearable>
                      </el-input>
                    </div>
                    <el-button type="primary" plain  icon="el-icon-search" round @click="quickSearch('fourth')"></el-button>
                  </el-tab-pane> -->
                </el-tabs>
              </div>
            </el-tab-pane>
            <el-tab-pane name="second" style="float:left">      
              <span slot="label"><i class="el-icon-arrow-down"></i> 复合查询</span>
              <div class="compoundQuery">
                <div class="optionLine1">              
                  <el-tag type="info" plain>发卡时间</el-tag>
                  <el-date-picker
                    v-model="daterange"
                    type="daterange"
                    unlink-panels
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                  <el-button type="primary" plain  icon="el-icon-search" round @click="compoundSearch(1)"></el-button>
                </div>
                <div class="optionLine2">              
                  <div class="each">
                    <el-tag type="info" plain>发卡主体</el-tag>
                      <el-select v-model="compoundSearchParams.issuerCode" clearable @change="updateSelectData" placeholder="请选择">
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
                  
                  <div class="each">
                    <el-tag type="info" plain>卡状态</el-tag>
                      <el-select v-model="compoundSearchParams.statusCode" clearable placeholder="请选择">
                        <el-option
                          v-for="item in statusList"
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
      </el-card>

      <div class="queryResult" v-show="activeName==='first'">
        <!-- <div v-if="showFirstTable===true" class="totalTable" style="width:100%">
            <el-table :data="tableData" size="small" border>
                <el-table-column prop="totalCards" label="发卡汇总" min-width="50" align="center">
                  <template slot-scope="scope">
                    <i class="el-icon-news"></i>
                    <span>{{ scope.row.totalCards }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="totalUsers" label="用户汇总" min-width="50" align="center">
                  <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span>{{ scope.row.totalUsers }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="totalMoney" label="金额汇总（元）" min-width="70" show-overflow-tooltip align="center">
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{scope.row.totalMoney/100}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="totalEntey" label="入金汇总（元）" min-width="50" align="center" >
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{scope.row.totalEntey/100}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="totalOut" label="出金汇总（元）" min-width="50" align="center">
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{scope.row.totalOut/100}}</div>
                    </template>
                </el-table-column>
            </el-table>
        </div> -->
        <div class="tableList">
            <el-table v-loading="loading" element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
             :data="tableData2" size="small" border>
                <el-table-column type="index" prop="id" min-width="10" align="center"></el-table-column>
                <el-table-column prop="cityCode" label="Citycode" min-width="40" align="center"></el-table-column>
                <el-table-column prop="issuerName" label="发卡主体" min-width="38" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.issuerName}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="channelName" label="发卡渠道" min-width="38" align="center"></el-table-column>
                <el-table-column prop="cardNo" label="卡号" min-width="55" show-overflow-tooltip align="center">
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{hidden(scope.row.cardNo,'.',4,4)}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="发卡时间" min-width="50" align="center" >
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{scope.row.createTime}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="statusName" label="卡状态" min-width="34" align="center"></el-table-column>
                <el-table-column prop="userName" label="用户姓名" min-width="40" align="center">
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{hidden(scope.row.userName,'*',0,scope.row.userName&&(scope.row.userName.length-1))}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="用户手机号" min-width="58" align="center">
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{hidden(scope.row.mobile,'*',3,4)}}</div>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="余额/元" min-width="35" align="center">
                  <template slot-scope="scope" class="detail-content">
                      <div class="detail-content">{{scope.row.balance/100}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="入金累计/元" min-width="45" align="center">
                  <template slot-scope="scope" class="detail-content">
                      <div class="detail-content">{{scope.row.deposit/100}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="出金累计/元" min-width="45" align="center">
                  <template slot-scope="scope" class="detail-content">
                      <div class="detail-content">{{scope.row.withdraw/100}}</div>
                  </template>
                </el-table-column> -->
                <el-table-column  label="操作" min-width="75" align="center" style="text-align:center">
                    <template slot-scope="scope">
                        <div style="display:flex">
                            <el-button size="small" type="text" plain @click="handleJump('cardDetail?active=detail',scope.row.cardNo,scope.row.cityCode,scope.row.merchantNo)">卡详情</el-button>
                            <el-button size="small" type="text" plain class="ml10" @click="handleJump('cardDetail?active=event',scope.row.cardNo,scope.row.cityCode,scope.row.merchantNo)">卡事件明细</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-card  shadow="never" >
          <div class="foot-page" style="text-align:center">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="quickSearchParams.currentPage" :page-sizes="[10]" :page-size="quickSearchParams.showCount" layout="total, sizes, prev, pager, next, jumper" :total="totalSize">
            </el-pagination>
          </div>
        </el-card>
      </div>

      <div class="queryResult" v-show="activeName==='second'">
        <div class="tableList">
            <el-table :data="tableData3" size="small" border>
                <el-table-column type="index" prop="id" min-width="10" align="center"></el-table-column>
                <el-table-column prop="cityCode" label="Citycode" min-width="40" align="center"></el-table-column>
                <el-table-column prop="issuerName" label="发卡主体" min-width="38" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.issuerName}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="channelName" label="发卡渠道" min-width="38" align="center"></el-table-column>
                <el-table-column prop="cardNo" label="卡号" min-width="55" show-overflow-tooltip align="center">
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{hidden(scope.row.cardNo,'.',4,4)}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="发卡时间" min-width="50" align="center" >
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{scope.row.createTime}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="statusName" label="卡状态" min-width="34" align="center"></el-table-column>
                <el-table-column prop="userName" label="用户姓名" min-width="40" align="center">
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{hidden(scope.row.userName,'*',0,scope.row.userName&&(scope.row.userName.length-1))}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="用户手机号" min-width="58" align="center">
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{hidden(scope.row.mobile,'*',3,4)}}</div>
                    </template>
                </el-table-column>
                <el-table-column  label="操作" min-width="75" align="center" style="text-align:center">
                    <template slot-scope="scope">
                        <div style="display:flex">
                            <el-button size="small" type="text" plain @click="handleJump('cardDetail?active=detail',scope.row.cardNo,scope.row.cityCode,scope.row.merchantNo)">卡详情</el-button>
                            <el-button size="small" type="text" plain class="ml10" @click="handleJump('cardDetail?active=event',scope.row.cardNo,scope.row.cityCode,scope.row.merchantNo)">卡事件明细</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-card  shadow="never" >
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
import cardServer from "../../../service/scavengingManagement/userRelevant.js";
import headTop from '../../../components/headTop'
import { weeks, ostreamRequset } from '../../../utils/common.js'

export default {
  data() {
    return {
      loading: false,
      activeName: 'first',
      activeName2: 'first',
      searchKey: 'first',
      searchKeyOption: '',
      selectValue: '',
      selectVal: '',
      showFirstTable: false,
      daterange:'',
      issuerList: [],
      channelList: [],
      statusList: [],
      disableChannel: '',
      issuer:'',
      channel: '',
      status: '', 
      currentOption: {}, 
      activeTapOption: '',            
      loadingShow: false,
      tableData: [],
      tableData2: [],
      tableData3: [],
      quickSearchParams:{
        isQuickScreen: true,
        currentPage: 1,
        showCount: 10,
      },
      compoundSearchParams:{
        isQuickScreen: false,
        currentPage: 1,
        showCount: 10,
        startTime: '',
        endTime: '',
        issuerCode: '',
        channelCode: '',
        statusCode: ''
      },
      totalSize: 0,
      totalSize2: 0
      }
  },
  methods: {
    //快速检索
    quickSearch(searchKey,page){
      if(!page) this.quickSearchParams.currentPage = 1
      this.searchKey = searchKey
      this.selectVal = this.selectValue
      this.activeTapOption = this.activeName
      var obj = {
        userName: searchKey === 'fourth'? this.selectValue : '',
        cardNo: searchKey === 'second'? this.selectValue : '',
        certNo: searchKey === 'third'? this.selectValue : '',
        mobile: searchKey === 'first'? this.selectValue : ''
      }
      var oobj = Object.assign(this.quickSearchParams,obj)

      this.searchKeyOption = searchKey
      this.getTableList(this.quickSearchParams,searchKey)
    },
    //复合检索
    compoundSearch(page){
      if(page) this.compoundSearchParams.currentPage = 1
      this.activeTapOption = this.activeName
      
      this.compoundSearchParams.startTime = this.daterange? this.daterange[0] : ''
      this.compoundSearchParams.endTime = this.daterange? this.daterange[1] : ''

      this.getTableList(this.compoundSearchParams)
    },

    //获取表格数据
    getTableList(data,searchKey){
      this.loading = true
      var oobj = Object.assign(this.currentOption,this.compoundSearchParams)
      
      console.log(this.searchKeyOption)
      cardServer.getTableData(data).then(
        response => {      
          this.loading = false             
          if(this.activeName === 'first'){
            // this.showFirstTable = true
            this.totalSize = response.totalCount
            this.tableData2 = response.ecCardList 
          }
          if(this.activeName === 'second'){
            // this.showFirstTable = false
            this.totalSize2 = response.totalCount
            this.tableData3 = response.ecCardList 
          }
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！')
        }
      )
    },

    //获取下拉选项列表
    getSelectData(type,issuerCode){
      const data = {
        type: type,
        issuerCode: issuerCode
      }
      cardServer.getSelectData(data).then(
        response => {
          if(type === 1){
            this.issuerList = response
          }
          if(type === 2){
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
        this.getSelectData(2,this.compoundSearchParams.issuerCode)
      }else{
        this.compoundSearchParams.channelCode = ''
      }
    },

    handleSizeChange(val) {
      this.quickSearchParams.currentPage = 1
      this.quickSearchParams.showCount = val;
      this.selectValue = this.selectVal
      this.activeName2 = this.searchKeyOption
      this.quickSearch(this.searchKey,1)
    },
    handleSizeChange2(val) {
      this.quickSearchParams.currentPage = 1
      this.compoundSearchParams.showCount = val;
      this.compoundSearch()
    },
    handleCurrentChange(val) {
      this.quickSearchParams.currentPage = val;
      this.selectValue = this.selectVal
      this.activeName2 = this.searchKeyOption
      this.quickSearch(this.searchKey,1)
    },
    handleCurrentChange2(val) {
      this.currentOption.currentPage = val;
      this.daterange = [this.currentOption.startTime,this.currentOption.endTime]
      var oobj = Object.assign(this.compoundSearchParams,this.currentOption)
      this.compoundSearch()
    },
    hidden(str,link,frontLen,endLen) { 
        var len = str&&(str.length-frontLen-endLen)
        var xing = '';
        if(len > 4){
          xing += (link+link+link+link)
        }else{
          for (var i=0;i<len;i++) {
            xing+=link;
          }
        }
        return str&&(str.substring(0,frontLen)+xing+str.substring(str.length-endLen))
    },

    //页面跳转
    handleJump(link,cardNo,cityCode,merchantNo){
      const router = `./${link}&num=${cardNo}&code=${cityCode}&merchant=${merchantNo}`;
      this.$router.push(router);
      // const {href} = this.$router.resolve({
      //   name: 'cardDetail',
      //   query: {
      //     active: 'detail',
      //     num: cardNo,
      //     code: cityCode
      //   }
      // })
      // window.open(href, '_blank')
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
    if(from.name==='cardDetail'){
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
    this.getSelectData(3)
  },
  mounted(){
    this.daterange = weeks()
  },
  updated() {
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
  margin-top: 1.5rem;
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
.detail-content{
  text-align: center;
}
.el-tag{
  font-size: 15px;
  line-height: 2.4rem;
  margin-right: 0.5rem;
  height: auto;
  padding: 0 1rem;
}
</style>
