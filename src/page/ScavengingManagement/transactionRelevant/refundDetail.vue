<template>
    <!-- <div><head-top></head-top> -->
    <div class="outerBan">
        <div class="cardBan">
          <!-- <el-card shadow="hover" :body-style="{ padding: '10px' }" style="background-color: #f5f7fa"> -->
            <div class="imgDiv">                
              <div style="display:inline-block;margin:10px auto">
                退款 <br> 详情 <br> <i class="el-icon-star-on"></i>
              </div>
            </div>
            <div class="itemDiv">
              <div class="line">
                <span><el-tag style="font-size:15px">商户订单号：
                  <br>
                  {{detailList.orderNum}}</el-tag></span>
                <span><el-tag type="info">渠道交易号：
                  <br>
                  {{detailList.channelNum}}</el-tag></span>
              </div>
              <div class="line">
                <span><el-tag type="info">CityCode：
                  <br>
                  {{detailList.cityCode}}</el-tag></span>
                <span><el-tag type="info">交易商户：
                  <br>
                  {{detailList.issuerName}}</el-tag></span>
                <span><el-tag type="info">渠道：
                  <br>
                  {{detailList.channelName}}</el-tag></span>
                <span><el-tag type="info">交易类型：<br>{{activeValue}}12:33:44</el-tag></span>
              </div>
              <div class="line">
                <span><el-tag type="info">发卡主体：<br>{{detailList.issuerName}}</el-tag></span>
                <span><el-tag type="info">卡号：<br>{{detailList.cardNo}}</el-tag></span>
                <span><el-tag type="info">交易时间：<br>{{detailList.createTime}}</el-tag></span>
                <span><el-tag type="info">交易金额（元）：<br>{{detailList.rechargeAmt}}</el-tag></span>
              </div>
              <div class="line">
                <span><el-tag type="info">交易状态：<br>{{detailList.statusName}}</el-tag></span>
                <span><el-tag type="info">入账时间：<br>{{activeValue}}12334455</el-tag></span>
                <span><el-tag type="info">余额（元）：<br>{{activeValue}}12334455</el-tag></span>
              </div>
            </div>
          <!-- </el-card> -->
        </div>
    </div>
    <!-- </div> -->
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
    getRechargeDetail(){
      const id = this.$route.query.num
      tradeServer.getRechargeDetail(id).then(
        response => {
          this.detailList = response
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
    },
  },
  components: {
    headTop
  },
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
  margin-right: 0.5rem;
  height: auto;
  padding: 0.3rem 2rem;
}
</style>
