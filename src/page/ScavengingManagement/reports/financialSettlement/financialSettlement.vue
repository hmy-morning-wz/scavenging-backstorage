<template>
    <div><head-top></head-top>    
    <div class="outermost">
      <el-card shadow='never'>
        <div class="queryOption">
          <div class="compoundQuery">
            <div class="optionLine1">              
              <el-tag type="info" plain>入账时间</el-tag>
              <el-date-picker
                v-model="daterange"
                type="daterange"
                :clearable = false
                unlink-panels
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
              <el-button type="primary" plain  icon="el-icon-search" round @click="quickSearch(1)"></el-button>
            </div>
            <div class="optionLine2">              
              <div class="each">
                <el-tag type="info" plain>发卡主体</el-tag>
                  <el-select v-model="searchParams.issuerCode"  @change="updateSelectData"  placeholder="(必选)请选择">
                    <el-option
                      v-for="item in issuerList"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code">
                    </el-option>
                  </el-select>   
              </div> 

              <div class="each">
                <el-tag type="info" plain>资金收款方</el-tag>
                <el-select v-model="disableCashReceiptCode" v-if="!searchParams.issuerCode" disabled  placeholder="请先选择发卡主体"></el-select>
                <el-select v-model="searchParams.cashReceiptCode" v-if="searchParams.issuerCode"  placeholder="(必选)请选择">
                  <el-option
                    v-for="item in channelList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </div>   

              <div class="each" v-if="radio==1">
                <el-tag type="info" plain>资金来源</el-tag>
                <el-select v-model="searchParams.channelType"  placeholder="请选择">
                  <el-option
                    v-for="item in channelTypeList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </div>   

            </div>
          </div>
        </div>
        <div class="radioDiv">        
          <el-radio v-model="radio" @change="getSelectData(7)" label="1">入金</el-radio>
          <br>
          <br>
          <el-radio v-model="radio" @change="getSelectData(8)" label="2">出金</el-radio>
        </div>
        <el-button type="primary" plain  icon="el-icon-printer" @click="chartsExport" style="position:relative;right:-4rem;top:-2.3rem;float:right;">导出报表</el-button>
            
      </el-card>

      <div class="queryResult">
        <div v-if="radio==='1'" class="totalTable">
          <el-table :data="tableData" size="small" border>
              <el-table-column :key="Math.random()" prop="totalCards" label="入账时间" align="center">
                <template slot-scope="scope">
                  <span>{{ dateString }}</span>
                </template>
              </el-table-column>
              <el-table-column :key="Math.random()" prop="issuerName" label="发卡主体" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.issuerName }}</span>
                </template>
              </el-table-column>
              <el-table-column :key="Math.random()" prop="cashReceiptName" label="资金收款方" align="center"></el-table-column>
              <el-table-column :key="Math.random()" prop="totalTradeAmount" label="交易总金额/元" align="center">
                <template slot-scope="scope" class="detail-content">
                    <div class="detail-content">{{scope.row.totalTradeAmount}}</div>
                </template>
              </el-table-column>
              <el-table-column :key="Math.random()" prop="totalTradeNum" label="交易总笔数" align="center">
                <template slot-scope="scope" class="detail-content">
                    <div class="detail-content">{{scope.row.totalTradeNum}}</div>
                </template>
              </el-table-column>
              <template v-for="(col,index) in cols" >
                <el-table-column :key="index" :label="col.channelName+'交易金额/元'" align="center">
                  <template slot-scope="scope" class="detail-content">
                      <div class="detail-content">{{col.channelAmt}}</div>
                  </template>
                </el-table-column>
                <el-table-column :key="index+10" :label="col.channelName+'交易笔数'" align="center">
                  <template slot-scope="scope" class="detail-content">
                      <div class="detail-content">{{col.channelNum}}</div>
                  </template>
                </el-table-column>
              </template>
              <el-table-column :key="Math.random()" prop="totalServiceAmount" label="渠道总服务费/元" show-overflow-tooltip align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.totalServiceAmount }}</span>
                </template>
              </el-table-column>
              <el-table-column :key="Math.random()" prop="totalSettleAmount" label="结算总金额/元" show-overflow-tooltip align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.totalSettleAmount }}</span>
                </template>
              </el-table-column>
              <el-table-column :key="Math.random()"  label="操作" width="90" align="center" style="text-align:center">
                  <template slot-scope="scope">
                      <div style="display:flex">
                          <el-button size="small" type="text" plain class="ml10" @click="handleDepositDialog(scope.row,true)">分类查看</el-button>
                      </div>
                  </template>
              </el-table-column>
          </el-table>
        </div>
        <div class="tableList" v-if="radio==='1'">
            <el-table :data="tableData2" size="small" border>
                <el-table-column :key="Math.random()" type="index" prop="id" align="center"></el-table-column>
                <el-table-column :key="Math.random()" prop="cityCode" label="入账日期" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div>{{scope.row.billDate}}</div>
                  </template>
                </el-table-column>
                <el-table-column :key="Math.random()" prop="issuerName" label="发卡主体" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.issuerName}}</div>
                  </template>
                </el-table-column>
                <el-table-column :key="Math.random()" prop="cashReceiptName" label="资金收款方" align="center"></el-table-column>
                <el-table-column :key="Math.random()" prop="tradeAmount" label="交易金额/元" align="center">
                </el-table-column>
                <el-table-column :key="Math.random()" prop="tradeNum" label="交易笔数" align="center">
                </el-table-column>
              <el-table-column :key="Math.random()" prop="rate" label="渠道费率" align="center"></el-table-column>
              <el-table-column :key="Math.random()" prop="serviceAmount" label="渠道服务费/元" show-overflow-tooltip align="center">
              </el-table-column>
                <el-table-column :key="Math.random()" prop="settlementAmtTotal" label="结算金额/元" align="center">
                </el-table-column>
                <el-table-column :key="Math.random()" prop="channelName" label="资金来源" align="center">
                </el-table-column>
                <el-table-column :key="Math.random()"  label="操作" width="170" align="center" style="text-align:center">
                    <template slot-scope="scope">
                        <div style="display:flex">
                            <!-- <el-button size="small" type="text" plain class="ml10" @click="handleJump(scope.row)">结算详情<i class="el-icon-zoom-in"></i></el-button> -->
                            <el-button size="small" type="text" plain class="ml10" @click="handleJump(scope.row)">结算明细导出</el-button>
                            <el-button size="small" type="text" plain class="ml10" @click="handleDepositDialog(scope.row)">分类查看</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-card shadow='never' v-if="radio==='1'">
          <div class="foot-page" style="text-align:center">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParams.currentPage" :page-sizes="[10]" :page-size="searchParams.showCount" layout="total, sizes, prev, pager, next, jumper" :total="totalSize">
            </el-pagination>
          </div>
        </el-card>

        
        <div class="totalTable" v-if="(radio==='2')&&(cashReceiptCodeOption === 'all')">
            <el-table :data="tableData5" size="small" border>
              <el-table-column :key="Math.random()" prop="totalCards" label="入账时间" width="125" align="center">
                <template slot-scope="scope">
                  <span>{{ dateString2 }}</span>
                </template>
              </el-table-column>
              <el-table-column :key="Math.random()" prop="issuerName" label="发卡主体" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.issuerName }}</span>
                </template>
              </el-table-column>
              <el-table-column :key="Math.random()" prop="cashReceiptName" label="资金收款方" width="120" align="center"></el-table-column>
              <el-table-column :key="Math.random()" prop="balanceSettleAmount" label="余额消费结算总额/元" width="120" align="center">
                <template slot-scope="scope" class="detail-content">
                    <div class="detail-content">{{scope.row.balanceSettleAmount}}</div>
                </template>
              </el-table-column>
              <el-table-column :key="Math.random()" prop="balanceCnt" label="余额消费结算笔数" width="120" align="center"></el-table-column>
              <el-table-column :key="Math.random()" prop="alipaySettleAmount" label="第三方信用消费结算总额/元" width="150" align="center">
                <template slot-scope="scope" class="detail-content">
                    <div class="detail-content">{{scope.row.alipaySettleAmount}}</div>
                </template>
              </el-table-column>
              <el-table-column :key="Math.random()" prop="creditCnt" label="第三方信用消费结算笔数" width="130" align="center"></el-table-column>
              <el-table-column :key="Math.random()" prop="appSettleAmount" label="APP信用消费结算总额/元" width="130" align="center">
                <template slot-scope="scope" class="detail-content">
                    <div class="detail-content">{{scope.row.appSettleAmount}}</div>
                </template>
              </el-table-column>
              <el-table-column :key="Math.random()" prop="appCreditCnt" label="APP信用消费结算笔数" width="130" align="center"></el-table-column>
              <el-table-column :key="Math.random()" prop="totalSettleAmount" label="结算总金额/元" align="center" >
                  <template slot-scope="scope" class="detail-content">
                      <div class="detail-content">{{scope.row.totalSettleAmount}}</div>
                  </template>
              </el-table-column>
              <el-table-column :key="Math.random()" prop="settlementCnt" label="结算总笔数" align="center"></el-table-column>
              <el-table-column :key="Math.random()"  label="操作" width="90" align="center" style="text-align:center">
                  <template slot-scope="scope">
                      <div style="display:flex">
                          <el-button size="small" type="text" plain class="ml10" @click="handleWithdrawDialog(scope.row,true)">分类查看</el-button>
                      </div>
                  </template>
              </el-table-column>
          </el-table>
        </div>
        <div v-if="radio==='2'" class="totalTable">
          <el-table :data="tableData3" size="small" border>
              <el-table-column :key="Math.random()" prop="totalCards" label="入账时间" width="125" align="center">
                <template slot-scope="scope">
                  <span>{{ dateString2 }}</span>
                </template>
              </el-table-column>
              <el-table-column :key="Math.random()" prop="issuerName" label="发卡主体" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.issuerName }}</span>
                </template>
              </el-table-column>
              <el-table-column :key="Math.random()" prop="cashReceiptName" label="资金收款方" width="120" align="center"></el-table-column>
              <el-table-column :key="Math.random()" prop="balanceSettleAmount" label="余额消费结算总额/元" width="120" align="center">
                <template slot-scope="scope" class="detail-content">
                    <div class="detail-content">{{scope.row.balanceSettleAmount}}</div>
                </template>
              </el-table-column>
              <el-table-column :key="Math.random()" prop="balanceCnt" label="余额消费结算笔数" width="120" align="center"></el-table-column>
              <el-table-column :key="Math.random()" prop="alipaySettleAmount" label="第三方信用消费结算总额/元" width="150" align="center">
                <template slot-scope="scope" class="detail-content">
                    <div class="detail-content">{{scope.row.alipaySettleAmount}}</div>
                </template>
              </el-table-column>
              <el-table-column :key="Math.random()" prop="creditCnt" label="第三方信用消费结算笔数" width="130" align="center"></el-table-column>
              <el-table-column :key="Math.random()" prop="appSettleAmount" label="APP信用消费结算总额/元" width="130" align="center">
                <template slot-scope="scope" class="detail-content">
                    <div class="detail-content">{{scope.row.appSettleAmount}}</div>
                </template>
              </el-table-column>
              <el-table-column :key="Math.random()" prop="appCreditCnt" label="APP信用消费结算笔数" width="130" align="center"></el-table-column>
              <el-table-column :key="Math.random()" prop="totalSettleAmount" label="结算总金额/元" align="center" >
                  <template slot-scope="scope" class="detail-content">
                      <div class="detail-content">{{scope.row.totalSettleAmount}}</div>
                  </template>
              </el-table-column>
              <el-table-column :key="Math.random()" prop="settlementCnt" label="结算总笔数" align="center"></el-table-column>
              <el-table-column :key="Math.random()"  label="操作" width="90" align="center" style="text-align:center">
                  <template slot-scope="scope">
                      <div style="display:flex">
                          <el-button size="small" type="text" plain class="ml10" @click="handleWithdrawDialog(scope.row,true)">分类查看</el-button>
                      </div>
                  </template>
              </el-table-column>
          </el-table>
        </div>
        <div class="tableList" v-if="(radio==='2')&&(cashReceiptCodeOption !== 'all')">
            <el-table :data="tableData4" size="small" border>
                <el-table-column :key="Math.random()" type="index" prop="id" align="center"></el-table-column>
                <el-table-column :key="Math.random()" prop="cityCode" label="入账日期" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div>{{scope.row.billDate}}</div>
                  </template>
                </el-table-column>
                <el-table-column :key="Math.random()" prop="issuerName" label="发卡主体" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.issuerName}}</div>
                  </template>
                </el-table-column>
                <el-table-column :key="Math.random()" prop="cashReceiptName" label="资金收款方" align="center"></el-table-column>
                <el-table-column :key="Math.random()" prop="balanceSettleAmount" label="余额消费结算总额/元" width="120" align="center" >
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{scope.row.balanceSettleAmount}}</div>
                    </template>
                </el-table-column>
                <el-table-column :key="Math.random()" prop="balanceSettleCnt" label="余额消费结算笔数" width="110" align="center"></el-table-column>
                <el-table-column :key="Math.random()" prop="alipaySettleAmount" label="第三方信用消费结算总额/元" width="125" align="center">
                  <template slot-scope="scope" class="detail-content">
                      <div class="detail-content">{{scope.row.alipaySettleAmount}}</div>
                  </template>
                </el-table-column>
                <el-table-column :key="Math.random()" prop="alipaySettleCnt" label="第三方信用消费结算笔数" width="125" align="center"></el-table-column>
                <el-table-column :key="Math.random()" prop="appSettleAmount" label="APP信用消费结算总额/元" width="125" align="center">
                  <template slot-scope="scope" class="detail-content">
                      <div class="detail-content">{{scope.row.appSettleAmount}}</div>
                  </template>
                </el-table-column>
                <el-table-column :key="Math.random()" prop="appSettleCnt" label="APP信用消费结算笔数" width="125" align="center"></el-table-column>
                <el-table-column :key="Math.random()" prop="totalSettleAmount" label="结算总金额/元" align="center">
                  <template slot-scope="scope" class="detail-content">
                      <div class="detail-content">{{scope.row.totalSettleAmount}}</div>
                  </template>
                </el-table-column>
                <!-- <el-table-column :key="Math.random()" prop="settlementCnt" label="结算总笔数" align="center"></el-table-column> -->
                <el-table-column :key="Math.random()"  label="操作" width="170" align="center" style="text-align:center">
                    <template slot-scope="scope">
                        <div style="display:flex">
                            <!-- <el-button size="small" type="text" plain class="ml10" @click="handleJump(scope.row)">结算详情<i class="el-icon-zoom-in"></i></el-button> -->
                            <el-button size="small" type="text" plain class="ml10" @click="handleJump(scope.row)">结算明细导出</el-button>
                            <el-button size="small" type="text" plain class="ml10" @click="handleWithdrawDialog(scope.row)">分类查看</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-card shadow='never' v-if="((radio==='2')&&(cashReceiptCodeOption !== 'all'))">
          <div class="foot-page" style="text-align:center">
            <el-pagination background @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="searchParams.currentPage" :page-sizes="[10]" :page-size="searchParams.showCount" layout="total, sizes, prev, pager, next, jumper" :total="totalSize2">
            </el-pagination>
          </div>
        </el-card>
      </div>
    </div>
    <deposit-view ref="depositView"></deposit-view>
    <withdraw-view ref="withdrawView"></withdraw-view>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import cardServer from "../../../../service/scavengingManagement/reports.js";
import headTop from '../../../../components/headTop'
import { weeks, ostreamRequset } from '../../../../utils/common.js'
import depositView from './depositClassifiedView'
import withdrawView from './withdrawClassifiedView'

export default {
  name: 'index',
  data() {
    return {
      radio: '1',
      showFirstTable: true,
      daterange:'',
      dateString:'',
      dateString2:'',
      issuerList: [],
      channelList: [],
      statusList: [],
      channelTypeList: [],
      disableCashReceiptCode: '',
      status: '',        
      loadingShow: false,
      tableData: [],
      tableData2: [],
      tableData3: [],
      tableData4: [],
      tableData5: [],
      cashReceiptCodeOption: '',
      cashReceiptCodeOption2: '',
      searchParams: {
        currentPage: 1,
        showCount: 10,
        startDate: '',
        endDate: '',
        issuerCode: '',
        cashReceiptCode: '',
        channelType: ''
      },
      totalSize: 0,
      totalSize2: 0,
      totalSize3: 0,
      cols: [],
      isDepositGather: false,
    }
  },
  methods: {
    //快速检索
    quickSearch(page){
      if(this.searchParams.issuerCode&&this.searchParams.cashReceiptCode&&this.daterange){
        this.searchParams.startDate = this.daterange[0]
        this.searchParams.endDate = this.daterange[1]

        if(page) this.searchParams.currentPage = 1
        if(this.radio === '1'){
          this.getDepositGather(this.searchParams)
          this.getdepositList(this.searchParams)
        }else{
          this.getWithdrawGather(this.searchParams)
          if(this.searchParams.cashReceiptCode !== 'all') {
            this.getwithdrawList(this.searchParams)
          } else {
            this.getAllWithdrawList(this.searchParams)
          }
        }
      }else{
        this.$message({
          message: '有选项未选择哦',
          type: 'warning'
        });
      }
    },

    //获取入金汇总数据
    getDepositGather(data){
      
      cardServer.depositGatherV2(data).then(
        response => {
          this.tableData = []
          this.cashReceiptCodeOption2 = this.searchParams.cashReceiptCode
          if(response.issuerName){
            this.tableData.push(response)            
            this.dateString = this.daterange[0]+'~'+this.daterange[1]
            this.cols = response.channelDepositGatherList
          }
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
    },

    //获取入金列表数据
    getdepositList(data){
      cardServer.depositV2(data).then(
        response => {
          this.tableData2 = response.recordList
          this.totalSize = response.totalCount
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
    },
    
    //获取出金汇总数据
    getWithdrawGather(data){
      
      cardServer.withdrawGather(data).then(
        response => {
          this.cashReceiptCodeOption = this.searchParams.cashReceiptCode
          if(response.data) {
            this.dateString2 = this.daterange[0]+'~'+this.daterange[1]
            this.tableData3 = response.data
          } else {
            this.tableData3 = []
          }
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
    },
    
    //获取出金列表数据
    getwithdrawList(data){
      cardServer.withdraw(data).then(
        response => {
          this.tableData4 = response.recordList
          this.totalSize2 = response.totalCount
          
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
    },
    //获取出金全部资金收款方列表数据
    getAllWithdrawList(data){
      cardServer.withdrawGatherAll(data).then(
        response => {
          if(response.data) {
            this.dateString2 = this.daterange[0]+'~'+this.daterange[1]
            this.tableData5 = response.data
          } else {
            this.tableData5 = []
          }
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
    },
    //导出列表数据
    chartsExport(){
      if(!(this.searchParams.issuerCode&&this.searchParams.cashReceiptCode)){
        this.$message({
          message: '有选项未选择哦',
          type: 'warning'
        });
        return
      }
      const formData = {
          startDate: this.daterange[0],
          endDate: this.daterange[1],
          issuerCode: this.searchParams.issuerCode,
          cashReceiptCode: this.searchParams.cashReceiptCode,
          channelType: this.searchParams.channelType
      };
      if(this.radio === '1') {
        this.depositExport(formData)
      } else {
        delete formData.channelType
        this.withdrawExport(formData)
      }
      
    },
    //导出出金列表数据
    withdrawExport(formData){
      const url = '/export/settle/withdraw'
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
    },
    //导出入金列表数据
    depositExport(formData){
      const url = '/export/settle/deposit'
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
    },

    //获取下拉选项列表
    getSelectData(type,issuerCode,tradeTypeCode){
      // debugger
      if((type === 7 || type === 8)&&(!this.searchParams.issuerCode)){
        return
      } else {
        const data = {
          type: type,
          issuerCode: this.searchParams.issuerCode,
          tradeTypeCode: tradeTypeCode
        }
        cardServer.getSelectData(data).then(
          response => {
            if(type === 1){
              this.issuerList = response
              this.searchParams.issuerCode = ''
            }
            if(type === 8){
              this.channelList = response
              this.searchParams.cashReceiptCode = ''
            }
            if(type === 7){
              this.channelList = response
              this.searchParams.cashReceiptCode = ''
            }
            if(type === 13){
              this.channelTypeList = response
              this.searchParams.channelType = ''
            }
          },
          response => {
            this.$message.error(response.msg || '服务器连接失败！');
          }
        )
      }
    },

    updateSelectData(){
      if(this.searchParams.issuerCode){
        if(this.radio === '1'){
          this.getSelectData(7,this.searchParams.issuerCode)
        }else{
          this.getSelectData(8,this.searchParams.issuerCode)
        }        
      }else{
        this.searchParams.cashReceiptCode = ''
      }
    },


    handleSizeChange(val) {
      this.searchParams.showCount = val;
    },
    handleCurrentChange(val) {
      this.searchParams.currentPage = val;
      this.quickSearch()
    },
    handleSizeChange2(val) {
      this.searchParams.showCount = val;
    },
    handleCurrentChange2(val) {
      this.searchParams.currentPage = val;
      this.quickSearch()
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
    handleJump(obj){
      // if(this.radio === '2'){
      //   sessionStorage.setItem('wiithdrawDetail',JSON.stringify(obj))
      //   const router2 = `./withdrawDetail`;
      //   this.$router.push(router2);
      // } else{
      //   sessionStorage.setItem('depositDetail',JSON.stringify(obj))
      //   const router = `./depositDetail`;
      //   this.$router.push(router);
      // }
      this.$router.push('./MTBill')
    },
    // v1.4
    //分类查看
    handleDepositDialog(row,gather) {
      const depositObj = {
        cashReceiptCode: this.cashReceiptCodeOption2,
        issuerCode: this.searchParams.issuerCode,
        channelType: gather ? this.searchParams.channelType : row.channelType,
        startDate: gather ? this.searchParams.startDate : row.billDate,
        endDate: gather ? this.searchParams.endDate : row.billDate
      }      
      sessionStorage.setItem('depositObj',JSON.stringify(depositObj))
      this.$refs.depositView.show()
    },
    handleWithdrawDialog(row,gather) {
      const withdrawObj = {
        cashReceiptCode: row.cashReceiptCode,
        issuerCode: this.searchParams.issuerCode,
        startDate: gather ? this.searchParams.startDate : row.billDate,
        endDate: gather ? this.searchParams.endDate : row.billDate
      }      
      sessionStorage.setItem('withdrawObj',JSON.stringify(withdrawObj))
      this.$refs.withdrawView.show()
    }
  },
  components: {
    headTop,
    depositView,
    withdrawView
  },
  beforeRouteEnter(to, from, next) {
    // 路由导航钩子，此时还不能获取组件实例 `this`，所以无法在data中定义变量（利用vm除外）
    // 参考 https://router.vuejs.org/zh-cn/advanced/navigation-guards.html
    // 所以，利用路由元信息中的meta字段设置变量，方便在各个位置获取。这就是为什么在meta中定义isBack
    // 参考 https://router.vuejs.org/zh-cn/advanced/meta.html
    if((from.name==='withdrawDetail')||(from.name === 'depositDetail')){
        to.meta.isBack=true;
        //判断是从哪个路由过来的，
        //如果是withdrawDetail/depositDetail过来的，表明当前页面不需要刷新获取新数据，直接用之前缓存的数据即可
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
    this.getSelectData(13)
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
  min-height: 100%;
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
  width: 220px;
}
.tableList, .totalTable{
  margin-bottom: 1.5rem;
  overflow: scroll;
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
.radioDiv{
  position: relative;
  right: 3rem;
  top: -7.6rem;
  padding: 0 1rem 1rem 1rem;
  float: right;
  height: 0;
}
.el-tag{
  font-size: 15px;
  line-height: 2.4rem;
  margin-right: 0.5rem;
  height: auto;
  padding: 0 1rem;
}
</style>
