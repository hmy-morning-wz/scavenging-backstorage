<template>
  <div><head-top></head-top>
  <div class="outerBan">
    <div class="headPart">      
      <el-button type="primary" plain class="backBtn" @click="backFrom()">返回上一页
        <i class="el-icon-sort"></i>
      </el-button>
      <el-button type="primary" :disabled="!detailList.canRefund" plain @click="dialogFormVisible = true">消费撤销
        <i class="el-icon-refresh"></i>
      </el-button>
    </div>
    <div class="cardBan">
      <el-card  shadow="never" :body-style="{ padding: '10px' }">
        <div class="imgDiv">                
          <div style="display:inline-block;margin:10px auto">
            ORDER <br> <i class="el-icon-document"></i>
          </div>
        </div>
          <div class="itemDiv">
            <div class="line">
              <span><el-tag style="font-size:15px">商户订单号：
                <br>
                {{detailList.orderNum || '暂无数据'}}</el-tag></span>
              <span><el-tag type="info">渠道交易号：
                <br>
                {{detailList.channelNum || '暂无数据'}}</el-tag></span>
            </div>
            <div class="line">
              <span><el-tag type="info">CityCode：
                <br>
                {{detailList.cityCode || '暂无数据'}}</el-tag></span>
              <span><el-tag type="info">交易商户：
                <br>
                {{detailList.tradeCodeName || '暂无数据'}}</el-tag></span>
              <span><el-tag type="info">渠道：
                <br>
                {{detailList.channelName || '暂无数据'}}</el-tag></span>
              <span><el-tag type="info">交易类型：<br>{{detailList.tradeTypeName || '暂无数据'}}</el-tag></span>
            </div>
            <div class="line">
              <span><el-tag type="info">发卡主体：<br>{{detailList.issuerName || '暂无数据'}}</el-tag></span>
              <span><el-tag type="info">卡号：<br>{{detailList.cardNo}}</el-tag></span>
              <span><el-tag type="info">交易时间：<br>{{detailList.bizTime || '暂无数据'}}</el-tag></span>
              <span><el-tag type="info">交易金额/元：<br>{{detailList.consumeAmt!==null ? detailList.consumeAmt/100 : '暂无数据'}}</el-tag></span>
            </div>
            <div class="line">
              <span><el-tag type="info">交易状态：<br>{{detailList.statusName || '暂无数据'}}</el-tag></span>
              <span><el-tag type="info">入账时间：<br>{{detailList.settleInTime || detailList.createTime||'暂无数据'}}</el-tag></span>
              <span><el-tag type="info">余额/元：<br>{{detailList.balance!==null ? detailList.balance/100 : '暂无数据'}}</el-tag></span>
            </div>
          </div>
      </el-card>
    </div>
    <div class="cardBan">
      <el-card shadow="never" :body-style="{ padding: '10px' }">
        <div class="imgDiv">
          <div style="display:inline-block;margin:10px auto">
            DEAL <br> <i class="el-icon-star-on"></i>
          </div>
        </div>
        <div class="itemDiv">
          <div style="display:inline-block; width:100%; float:left">
            <div class="line">
              <span><el-tag type="info" style="font-size:15px">原始票价/元：
                <br>
                {{detailList.ticketAmt!==null ? detailList.ticketAmt/100 : '暂无数据'}}</el-tag></span>
              <!-- <span><el-tag type="info">卡类型优惠/元：<br>{{detailList.cardDiscountAmt!==null ? detailList.cardDiscountAmt/100 : '暂无数据'}}</el-tag></span> -->
              <span><el-tag type="info">业主补贴/元：<br>{{detailList.proprietorSubsidyAmt!==null ? detailList.proprietorSubsidyAmt/100 : '暂无数据'}}</el-tag></span>
              <span><el-tag type="info">订单金额/元：<br>{{detailList.bizOrderAmount!==null ? detailList.bizOrderAmount/100 : '暂无数据'}}</el-tag></span>
            </div>
            <div class="line">
              <!-- <span><el-tag type="info">交易金额/元：<br>{{detailList.consumeAmt!==null ? detailList.consumeAmt/100 : '暂无数据'}}</el-tag></span> -->
              <span><el-tag type="info">渠道抵扣/元：<br>{{detailList.discountAmt!==null ? detailList.discountAmt/100 : '暂无数据'}}</el-tag></span>
              <span><el-tag type="info">用户支付/元：<br>{{detailList.payAmt!==null ? detailList.payAmt/100 : '暂无数据'}}</el-tag></span>
              <span><el-tag type="info">业主实收/元：<br>{{detailList.proprietorRealAmt!==null ? detailList.proprietorRealAmt/100 : '暂无数据'}}</el-tag></span>
            </div>
          </div>
          <!-- <div style="display:inline-block; float:left">
            <div class="line" style="margin-top:0">
              <span><el-tag type="info">渠道服务费/元：<br>{{detailList.channelServiceCharge!==null ? detailList.channelServiceCharge/100 : '暂无数据'}}</el-tag></span>
            </div>
          </div> -->
        </div>
      </el-card>
    </div>
    <div class="cardBan" v-if="detailList.hasBenefit">
      <el-card shadow="never" :body-style="{ padding: '10px' }">
        <div class="imgDiv">
          <div style="display:inline-block;margin:10px auto">
            Benefit <br> <i class="el-icon-printer"></i>
          </div>
        </div>
        <div class="itemDiv">
          <div style="display:inline-block; width:100%; float:left">
            <div class="line">
              <span><el-tag type="info" style="font-size:15px">权益码：
                <br>
                {{detailList.benefitCode || '暂无数据'}}</el-tag></span>
              <span><el-tag type="info">权益名称：<br>{{detailList.benefitName || '暂无数据'}}</el-tag></span>
              <span><el-tag type="info">权益类型：<br>{{detailList.benefitType || '暂无数据'}}</el-tag></span>
              <span><el-tag type="info">优惠金额/元：<br>{{detailList.benefitAmount!==null ? detailList.benefitAmount : '暂无数据'}}</el-tag></span>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="cardBan">
      <el-card shadow="never" :body-style="{ padding: '10px' }">
        <div class="imgDiv">                
          <div style="display:inline-block;margin:10px auto">
            Vehicle <br> <i class="el-icon-location"></i>
          </div>
        </div>
          <div class="itemDiv">
            <div class="line">
              <span><el-tag type="info">车辆编号：
                <br>
                {{detailList.vehicleId || '暂无数据'}}</el-tag></span>
              <span><el-tag type="info">车辆线路：
                <br>
                {{detailList.lineName || '暂无数据'}}</el-tag></span>
              <span><el-tag type="info">机具厂商<br>{{detailList.Terminal || '暂无数据'}}</el-tag></span>
            </div>
            <div class="line">
              <span><el-tag type="info">上车机具编号：<br>{{detailList.startTerminalId || '暂无数据'}}</el-tag></span>
              <span><el-tag type="info">上车站点：<br>{{detailList.startStationName || '暂无数据'}}</el-tag></span>
              <span><el-tag type="info">上车位置（GPS）：<br>{{detailList.startLbs || '暂无数据'}}</el-tag></span>
              <span><el-tag type="info">上车时间：<br>{{detailList.startTerminalTime || '暂无数据'}}</el-tag></span>
            </div>
            <div class="line">
              <span><el-tag type="info">下车机具编号：<br>{{detailList.endTerminalId || '暂无数据'}}</el-tag></span>
              <span><el-tag type="info">下车站点：<br>{{detailList.endStationName || '暂无数据'}}</el-tag></span>
              <span><el-tag type="info">下车位置（GPS）：<br>{{detailList.endLbs || '暂无数据'}}</el-tag></span>
              <span><el-tag type="info">下车时间：<br>{{detailList.endTerminalTime || '暂无数据'}}</el-tag></span>
            </div>
          </div>
      </el-card>
    </div>
    <el-dialog title="消费撤销" width="35%" :visible.sync="dialogFormVisible">
      <div>
        <el-form :model="detailList">
          <el-form-item label="发卡主体" :label-width="formLabelWidth">
            <el-input :value="detailList.issuerName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="发卡渠道" :label-width="formLabelWidth">
            <el-input :value="detailList.channelName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="交易卡号" :label-width="formLabelWidth">
            <el-input :value="detailList.cardNo" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="交易时间" :label-width="formLabelWidth">
            <el-input :value="detailList.bizTime" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="交易金额" :label-width="formLabelWidth">
            <el-input :value="detailList.consumeAmt/100" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="撤销金额" :label-width="formLabelWidth">
            <el-input v-model="refundAmount"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-button size="middle" type="text" plain class="allMount" @click="allAmount">全部金额</el-button>                           
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="tradeRefund">确 定</el-button>
      </div>
    </el-dialog>
    <div v-if="(detailList.refundInfoList && detailList.refundInfoList.length>0)">
      <div style="margin-left:1rem;">撤销信息：</div>
      <div class="tableList">
            <el-table :data="detailList.refundInfoList" size="small" border>
                <el-table-column prop="issuerName" label="商户订单号" min-width="38" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.refundNum}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="payChannel" label="交易撤销时间" min-width="40" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.refundTime}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="cardNo" label="交易撤销金额" min-width="45" align="center" >
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{scope.row.refundAmount/100}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="applyTime" label="操作账号" min-width="50" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.opUser}}</div>
                  </template>
                </el-table-column>
            </el-table>
        </div>
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
      activeValue: 'detail',
      activeName: 'first',
      detailList: {},
      dialogFormVisible: false,
      formLabelWidth: '70px',
      refundAmount: ''
    }
  },
  methods: {      
    //获取消费详情数据
    getConsumeDetail(){
      const id = this.$route.query.num
      const data = {
        id: id
      }
      tradeServer.getConsumeDetail(data).then(
        response => {
          this.detailList = response
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
    },
    tradeRefund() {
      if(!!this.refundAmount) {
        if((this.detailList.consumeAmt < this.refundAmount*100) || (this.refundAmount == 0)) {
          this.$message.error('撤销金额有误');
          return
        }
        this.$confirm('确认撤销?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const data = {
            orderNum: this.detailList.orderNum,
            refundAmount: String(this.refundAmount*100),
            cardNo: this.detailList.cardNo
          }
          tradeServer.consumeRefund(data).then(
            response => {              
              this.$message({
                type: 'success',
                message: '撤销成功!'
              });
              this.dialogFormVisible = false
              this.getConsumeDetail()
            },
            response => {
              this.$message.error(response.msg);
              if(response.code == 40001) {
                this.$router.push('/refundRecords')
              }
            }
          )
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
      }else{
        this.$message.error('请填写金额');
        console.log(this.refundAmount)
      }
    },
    backFrom() {
      // this.$router.push('cardQuery')
      this.$router.go(-1)
    },
    allAmount() {
      this.refundAmount = this.detailList.consumeAmt/100
    }
    
  },
  components: {
    headTop
  },
  created(){
    this.getConsumeDetail()
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
.cardBan .imgDiv{
  // display: inline-block;
  width: 12%;
  height: 100%;
  float: left;
  font-size: 24px;
  text-align: center;
}
.cardBan .itemDiv{
  width: 85%;
  float: left;
  margin-left: 0.7rem;
  // display: inline-block;
}
.line{
  margin-top: 0.3rem;
  margin-bottom: 0.8rem;
}
.line .el-tag{
  text-align: center;
  font-size: 15px;
  margin-right: 0.5rem;
  height: auto;
  padding: 0.4rem 1rem;
}
.headPart{ 
  padding: 1rem;
  padding-top: 0;
}
.backBtn {
  margin-right: 2rem;
}
.allMount {
  float: right;
  padding-top: 0;
}
.tableList {
  margin: 0.8rem;
}
</style>
