<template>
  <div><head-top></head-top>
  <div class="outerBan">
    <el-button type="primary" plain class="backBtn" @click="backFrom()">返<br>回<br>上<br>页<br>
      <i class="el-icon-sort"></i>
    </el-button>
    <el-table :data="tableData" size="small" border style="margin-bottom: 2.5rem;width:95%;">
      <el-table-column label="入账日期" min-width="40" align="center">
        <template slot-scope="scope" style="text-align:center">
            <div class="nowWrap">{{detailList.billDate}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="issuerName" label="发卡主体" min-width="35" align="center">
        <template slot-scope="scope" style="text-align:center">
            <div class="nowWrap">{{detailList.issuerName}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="cashReceiptName" label="资金收款方" min-width="38" align="center">
        <template slot-scope="scope" style="text-align:center">
            <div class="nowWrap">{{detailList.cashReceiptName}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="statusName" label="余额消费结算金额/元" min-width="50" align="center">
        <template slot-scope="scope" style="text-align:center">
            <div class="nowWrap">{{detailList.balanceSettleAmount/100}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="statusName" label="支付宝信用消费结算金额/元" min-width="58" align="center">
        <template slot-scope="scope" style="text-align:center">
            <div class="nowWrap">{{detailList.alipayCreditAmount/100}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="statusName" label="APP信用消费结算金额/元" min-width="53" align="center">
        <template slot-scope="scope" style="text-align:center">
            <div class="nowWrap">{{detailList.appCreditAmount/100}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="总结算金额/元" min-width="35" align="center">
          <template slot-scope="scope" class="detail-content">
              <div class="detail-content">{{detailList.totalSettleAmount/100}}</div>
          </template>
      </el-table-column>
    </el-table>
    <div style="display:flex">
      <el-table :data="tableData2" size="small" border style="margin-right:2rem">
        <!-- <el-table-column type="index" prop="id" align="center"></el-table-column> -->
        <el-table-column prop='' label="" min-width="40" align="center">
          <template slot-scope="scope" style="text-align:center">
              <div class="nowWrap">{{scope.row.issuerName}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="issuerName" label="笔数" min-width="35" align="center">
          <template slot-scope="scope" class="detail-content" style="text-align:center">
              <div class="nowWrap">{{scope.row.count}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="channelName" label="金额（元）" min-width="38" align="center">
          <template slot-scope="scope" class="detail-content" style="text-align:center">
              <div class="nowWrap">{{scope.row.amount/100}}</div>
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="tableData3" size="small" border>
        <el-table-column prop='' label="" min-width="40" align="center">
          <template slot-scope="scope" style="text-align:center">
              <div class="nowWrap">{{scope.row.issuerName}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="issuerName" label="笔数" min-width="35" align="center">
          <template slot-scope="scope" class="detail-content" style="text-align:center">
              <div class="nowWrap">{{scope.row.count}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="channelName" label="金额（元）" min-width="38" align="center">
          <template slot-scope="scope" class="detail-content" style="text-align:center">
              <div class="nowWrap">{{scope.row.amount/100}}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="cardBan">
      <div style="background-color:#f5f7fa">
        <div class="imgDiv">                
          <div style="display:inline-block;margin:10px auto">
            结&nbsp; 算 <br> 详&nbsp; 情 <br> <i class="el-icon-document"></i>
          </div>
        </div>
        <el-table :data="tableData4" size="small" border style="width:80%">
          <el-table-column prop='' label="" min-width="40" align="center">
            <template slot-scope="scope" style="text-align:center">
                <div class="nowWrap">APP信用消费</div>
            </template>
          </el-table-column>
          <el-table-column prop="issuerName" label="笔数" min-width="35" align="center">
            <template slot-scope="scope" class="detail-content" style="text-align:center">
                <div class="nowWrap">{{detailList.appCreditCount}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="channelName" label="金额（元）" min-width="38" align="center">
            <template slot-scope="scope" class="detail-content" style="text-align:center">
                <div class="nowWrap">{{detailList.appCreditAmount/100}}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
import tradeServer from "../../../../service/scavengingManagement/transactionRelevant.js";
import headTop from '../../../../components/headTop'

export default {
  data() {
    return {
      activeValue: 'detail',
      activeName: 'first',
      detailList: {
        billdate: '1',//入账日期
        merchantNo: '2',//商户号
        merchantName: '2',//商户名
        issuerName: '2',//发卡主体
        tsmSettleAmount: '3',//通卡联城结算金额
        alipaySettleAmount: '4',//支付宝消费结算金额
        totalSettleAmount: '',//消费结算总金额
        cashReceiptName: '',//资金收款方
        tsmRechargeCount: '',//通卡联城充值笔数
        tsmRechargeAmount: '',//通卡联城充值金额
        tsmRefundCount: '',//通卡联城退款笔数
        tsmRefundAmount: '',//通卡联城退款金额
        alipayCreditCount: '',//支付宝信用消费笔数
        alipayCreditAmount: '',//支付宝信用消费金额
        alipayCancelCount: '',//支付宝信用消费撤销笔数
        alipayCancelAmount: '',//支付宝信用消费撤销金额
      },
      tableData: [{}],
      tableData2: [{
        issuerName: '余额消费',
        count: '',
        amount: ''
        },
        {
        issuerName: '余额消费撤销',
        count: '',
        amount: ''
        }
      ],
      tableData3: [{
        issuerName: '支付宝信用消费',
        count: '',
        amount: ''
        },
        {
        issuerName: '支付宝信用消费撤销',
        count: '',
        amount: ''
        }
      ],
      tableData4: [{}]
    }
  },
  methods: {      
    //获取消费详情数据
    getConsumeDetail(){
      const id = this.$route.query.id
      // console.log(card_no)
      tradeServer.getConsumeDetail(id).then(
        response => {
          this.detailList = response
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
    },
    backFrom() {
      // this.$router.push('cardQuery')
      this.$router.go(-1)
    }
    
  },
  components: {
    headTop
  },
  mounted() {
    // const date = JSON.parse(this.$route.query.card_no)
    // console.log(JSON.parse(sessionStorage.getItem('depositDetail')))
    this.tableData2[0].count = this.detailList.balanceCount
    this.tableData2[1].count = this.detailList.balanceCancelCount
    this.tableData2[0].amount = this.detailList.balanceAmount
    this.tableData2[1].amount = this.detailList.balanceCancelAmount
    this.tableData3[0].count = this.detailList.alipayCreditCount
    this.tableData3[1].count = this.detailList.alipayCancelCount
    this.tableData3[0].amount = this.detailList.alipayCreditAmount
    this.tableData3[1].amount = this.detailList.alipayCancelAmount
  },
  created(){
    this.detailList = JSON.parse(sessionStorage.getItem('wiithdrawDetail')) || ''
  }
}
</script>
<style lang="scss" scoped>
.outerBan{
  padding: 2rem;
  height: 100%;
  // background-color: #f5f7fa;
}
.titleSpan{
  display:inline-block;
  width:15rem;
  font-size:20px;
  text-align:center;
  color:#303133;
  line-height:45px;
  letter-spacing:5px;
}
.titleBan {
  padding-left: 0.8rem;
  font-size: 17px;
  // color: #909399;
}
.cardBan{
  width: 98%;
  font-size: 16px;
  // padding-left: 1.3rem;
  margin: 1.2rem auto;
  margin-top: 0;
}
.cardBan {
  width: 100%;
  margin-top: 2rem;
}
.cardBan .imgDiv{
  // display: inline-block;
  width: 20%;
  height: 100%;
  float: left;
  font-size: 24px;
  // letter-spacing: 0.5rem;
  text-align: center;
}
.cardBan .itemDiv{
  width: 85%;
  float: left;
  margin-left: 0.7rem;
  // display: inline-block;
}
.nowWrap {
  line-height: 2.7rem;
}
.line{
  margin-top: 0.3rem;
  margin-bottom: 0.8rem;
}
.line .el-tag{
  font-size: 15px;
  margin-right: 0.5rem;
  height: auto;
  padding: 0rem 0.5rem;
}
.backBtn {
  z-index: 100000;
  position: absolute;
  right: 2.1rem;
  padding: 0.6rem 0.8rem;
  line-height: 1rem;
}
</style>
