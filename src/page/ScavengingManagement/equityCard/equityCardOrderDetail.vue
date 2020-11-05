<template>
  <div>
    <head-top></head-top>
  <div class="outerBan">
    <el-button type="primary" plain class="backBtn" @click="backFrom()">返回上一页
      <i class="el-icon-sort"></i>
    </el-button>
                                          
    <div class="navBan">
      <el-tabs v-model="activeValue" type="card">
        <el-tab-pane label="订单详情" name="detail">
          <span slot="label">订单详情<i class="el-icon-printer"></i></span>
        </el-tab-pane>
        <!-- <el-tab-pane label="卡事件明细" name="event">
          <span slot="label">卡事件明细<i class="el-icon-tickets"></i></span>
        </el-tab-pane> -->
      </el-tabs>
    </div>
    <div class="showBan">
      <el-collapse accordion  v-model="activeValue">
        <el-collapse-item name="detail">
          <template slot="title">
            <div class="titleBan">订单详情 Detail <i class="el-icon-printer"></i></div>
          </template>
          <div class="cardBan">
            <el-card shadow="never" :body-style="{ padding: '10px' }">
              <div class="imgDiv">                
                <div style="display:inline-block;margin:10px auto">
                  CARD <br> <i class="el-icon-star-on"></i>
                </div>
              </div>
              <div class="itemDiv">
                <div class="line">
                  <span><el-tag style="font-size:15px">订单流水号：
                    <br>
                    {{detailList.bizTransId || '暂无数据'}}</el-tag></span>
                </div>
                <div class="line">
                  <span><el-tag type="info">CityCode：
                    <br>
                    {{detailList.cityCode || '暂无数据'}}</el-tag></span>
                  <span><el-tag type="info">主体商户：
                    <br>
                    {{detailList.mainMerchantName || '暂无数据'}}</el-tag></span>
                  <span><el-tag type="info">渠道：
                    <br>
                    {{detailList.payChannel || '暂无数据'}}</el-tag></span>
                  <span><el-tag type="info">下单商品：<br>{{detailList.productName || '暂无数据'}}</el-tag></span>
                </div>
                <div class="line">
                  <span><el-tag type="info">支付宝uid：<br>{{detailList.userId || '暂无数据'}}</el-tag></span>
                  <span><el-tag type="info">虚拟卡卡号：<br>{{detailList.cardNo || '暂无数据'}}</el-tag></span>
                  <span><el-tag type="info">下单时间：<br>{{detailList.transTime}}</el-tag></span>
                </div>
                <div class="line">
                  <span><el-tag type="info">订单状态：<br>{{detailList.statusName || '暂无数据'}}</el-tag></span>
                  <span><el-tag type="info">入账时间：<br>{{detailList.settleInTime || '暂无数据'}}</el-tag></span>
                  <span><el-tag type="info">订单金额/元：<br>{{detailList.orderAmout}}</el-tag></span>
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
              <div class="itemDiv">
                <div class="line">
                  <span><el-tag type="info">商品价格：
                    <br>
                    {{detailList.productAmout || '暂无数据'}}</el-tag></span>
                    <span><el-tag type="info" style="font-size:15px">业主补贴：
                    <br>
                    {{detailList.proprietorSubsidyAmt || '暂无数据'}}</el-tag></span>
                </div>
                <div class="line">
                  <!-- <span><el-tag type="info">交易金额：<br>{{detailList.transAmout || '暂无数据'}}</el-tag></span> -->
                  <span><el-tag type="info">渠道抵扣：<br>{{detailList.discountAmt || '暂无数据'}}</el-tag></span>
                  <span><el-tag type="info">交易金额/元：<br>{{detailList.transAmout || '暂无数据'}}</el-tag></span>
                </div>
                <div class="line">
                  <span><el-tag type="info">用户支付/元：<br>{{detailList.payAmt || '暂无数据'}}</el-tag></span>
                  <span><el-tag type="info">业主实收/元：<br>{{detailList.proprietorRealAmt || '暂无数据'}}</el-tag></span>
                  
                </div>
              </div>
            </el-card>
          </div>

          <div class="cardBan">
            <el-card shadow="never" :body-style="{ padding: '10px' }">
              <div class="imgDiv">
                <div style="display:inline-block;margin:10px auto">
                  TICKET <br> <i class="el-icon-phone"></i>
                </div>
              </div>
              <div class="itemDiv">
                
                <div class="line">
                  <span><el-tag type="info">序列号：<br>{{detailList.productCode || '暂无数据'}}</el-tag></span>
                  <span><el-tag type="info">生效时间：<br>{{detailList.effectStartTime || '暂无数据'}}</el-tag></span>
                  <span><el-tag type="info">失效时间：<br>{{detailList.effectEndTime || '暂无数据'}}</el-tag></span>
                </div>
              </div>
            </el-card>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
  </div>
</template>
<script>
import httpServer from "../../../service/scavengingManagement/orderQuery.js";
import headTop from '../../../components/headTop'

export default {
  data() {
    return {
      activeValue: 'detail',
      detailList:{
      },
      eventList: [],
    searchParams: {
      currentPage: 1,
      showCount: 10
    },
    totalSize: 0
    };
  },
  methods: {
    //获取订单详情数据
    getOrderDetail(){
      const data = {
        bizTransId: this.$route.query.bizTransId,
        // cityCode: this.$route.query.cityCode,
        issuerCode:this.$route.query.issuerCode,
        cardNo:this.$route.query.cardNo
      }
      httpServer.getOrderDetail(data).then(
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
    this.getOrderDetail()
  },
  mounted(){
    
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
  margin-bottom: 1rem;
}
.cardBan .imgDiv{
  // display: inline-block;
  width: 11%;
  height: 100%;
  float: left;
  font-size: 24px;
  text-align: center;
}
.cardBan .imgDiv img{
  width: 100%;
  height: 100%;
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
  display: flex;
}
.line .el-tag{
  font-size: 15px;
  margin-right: 0.5rem;
  height: auto;
  padding: 0 2rem;
}
.queryResult{
  width: 95%;
  margin: 0 auto;
}
.backBtn {
  z-index: 100000;
  position: absolute;
  right: 2.1rem;
}
</style>
