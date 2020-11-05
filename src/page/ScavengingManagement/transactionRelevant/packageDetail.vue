<template>
    <div><head-top></head-top>
    <div class="outerBan">
        <el-button type="primary" plain class="backBtn" @click="backFrom()">返回上一页
          <i class="el-icon-sort"></i>
        </el-button>
        <div class="cardBan">
          <el-card shadow="never" :body-style="{ padding: '10px' }">
            <div class="imgDiv">                
              <div style="display:inline-block;margin:10px auto">
                ORDER <br> <i class="el-icon-star-on"></i>
              </div>
            </div>
            <div class="itemDiv">
              <div class="line">
                <span><el-tag style="font-size:15px">渠道交易号：
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
                <span><el-tag type="info">交易套餐<br>{{detailList.ticketName || '暂无数据'}}</el-tag></span>
              </div>
              <div class="line">
                <span><el-tag type="info">发卡主体：<br>{{detailList.issuerName || '暂无数据'}}</el-tag></span>
                <span><el-tag type="info">卡号：<br>{{detailList.cardNo || '暂无数据'}}</el-tag></span>
                <span><el-tag type="info">交易时间：<br>{{detailList.bizTime || '暂无数据'}}</el-tag></span>
                <!-- <span><el-tag type="info">交易金额/元：<br>{{detailList.consumeAmt/100}}</el-tag></span> -->
              </div>
              <div class="line">
                <span><el-tag type="info">交易状态：<br>{{detailList.statusName || '暂无数据'}}</el-tag></span>
                <span><el-tag type="info">入账时间：<br>{{detailList.settleInTime || '暂无数据'}}</el-tag></span>
                <span><el-tag type="info">余额/元：<br>{{detailList.balance/100}}</el-tag></span>
              </div>
            </div>
          </el-card>
        </div>
        <div class="cardBan">
          <el-card shadow="never" :body-style="{ padding: '10px' }">
            <div class="imgDiv">
              <div style="display:inline-block;margin:10px auto">
                DEAL <br> <i class="el-icon-phone"></i>
              </div>
            </div>
            <div style="display:flex;">
              <div class="itemDiv">
                <div class="line">
                  <span><el-tag type="info" style="font-size:15px">套餐价格：
                    <br>
                    {{detailList.ticketAmt/100}}</el-tag></span>
                  <span><el-tag type="info" style="font-size:15px">业主补贴：
                    <br>
                    {{detailList.proprietorSubsidyAmt/100}}</el-tag></span>
                </div>
                <div class="line">
                  <span><el-tag type="info" style="font-size:15px">交易金额：
                    <br>
                    {{detailList.consumeAmt/100}}</el-tag></span>
                  <span><el-tag type="info" style="font-size:15px">渠道抵扣：
                    <br>
                    {{detailList.discountAmt/100}}</el-tag></span>
                </div>
                <div class="line">
                  <span><el-tag type="info">用户支付/元：<br>{{detailList.payAmt/100}}</el-tag></span>
                </div>
              </div>
              <div class="itemDiv">
                <div class="line"> <br> <br><br> </div>
                <div class="line">
                  <span><el-tag type="info" style="font-size:15px">交易金额/元：
                    <br>{{detailList.consumeAmt/100}}</el-tag></span>
                </div>
                <div class="line">
                  <span><el-tag type="info">业主实收/元：<br>{{detailList.proprietorRealAmt/100}}</el-tag></span>
                </div>
              </div>
            </div>
          </el-card>
        </div>
        <div class="cardBan">
          <el-card shadow="never" :body-style="{ padding: '10px' }">
            <div class="imgDiv">
              <div style="display:inline-block;margin:10px auto;font-size:18px;line-height:32px;">
                套餐明细 <br> <i class="el-icon-phone" style="font-size:24px;"></i>
              </div>
            </div>
            <div class="itemDiv">
              <div class="line">
                <span><el-tag type="info">套餐类型：<br>{{detailList.ticketName || '暂无数据'}}</el-tag></span>
                <span><el-tag type="info">生效时间：<br>{{detailList.ticketStartTime || '暂无数据'}}</el-tag></span>
                <span><el-tag type="info">失效时间：<br>{{detailList.ticketEndTime || '暂无数据'}}</el-tag></span>
              </div>
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
      activeValue: 'detail',
      activeName: '',
      detailList: {
        orderNum: '',
        channelName: '',
        cityCode: '',
        issuerName: '',
        channelNum: '',
        cardNo: '',
        createTime: '',
        rechargeAmt: '',
        statusName: '',
      }
    }
  },
  methods: {      
    //获取充值详情数据
    getPackageDetail(){
      const data = {
        id: this.$route.query.num,
        cardNo: this.$route.query.no
      }
      tradeServer.getPackageDetail(data).then(
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
  created(){
    this.getPackageDetail()
  }
}
</script>
<style lang="scss" scoped>
.outerBan{
  padding: 2rem;
  height: 100%;
  // background-color: #f5f7fa;
}
.titleBan {
  padding-left: 0.8rem;
  font-size: 17px;
  // color: #909399;
}
.cardBan{
  width: 96.5%;
  font-size: 16px;
  padding-left: 1.3rem;
  margin: 3rem 0;
}
.cardBan .imgDiv{
  // display: inline-block;
  width: 11%;
  height: 100%;
  float: left;
  font-size: 24px;
  text-align: center;
}
.cardBan .itemDiv{
  width: 80%;
  float: left;
  margin-left: 0.7rem;
  // display: inline-block;
}
.line{
  margin-top: 0.3rem;
  margin-bottom: 0.8rem;
}
.line .el-tag{
  font-size: 15px;
  margin-right: 0.1rem;
  height: auto;
  padding: 0.3rem 1.3rem;
}
// .backBtn {
//   z-index: 100000;
//   line-height: 1.2rem;
//   // float: left;
//   margin: 3rem 0;
//   padding: 1.2rem 0.8rem;
// }
.backBtn {
  z-index: 100000;
  position: absolute;
  right: 6.6%;
}
</style>
