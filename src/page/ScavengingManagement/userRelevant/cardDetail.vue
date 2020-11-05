<template>
  <div>
    <head-top></head-top>
  <div class="outerBan">
    <el-button type="primary" plain class="backBtn" @click="backFrom()">返回上一页
      <i class="el-icon-sort"></i>
    </el-button>
                                          
    <div class="navBan">
      <el-tabs v-model="activeValue" type="card">
        <el-tab-pane label="卡详情" name="detail">
          <span slot="label">卡详情<i class="el-icon-printer"></i></span>
        </el-tab-pane>
        <el-tab-pane label="卡事件明细" name="event">
          <span slot="label">卡事件明细<i class="el-icon-tickets"></i></span>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="showBan">
      <el-collapse accordion  v-model="activeValue">
        <el-collapse-item name="detail">
          <template slot="title">
            <div class="titleBan">卡详情 Detail <i class="el-icon-printer"></i></div>
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
                  <span><el-tag style="font-size:15px">卡号：
                    <br>
                    {{detailList.cardNo || '暂无数据'}}</el-tag></span>
                  <span><el-tag type="info">发卡时间：
                    <br>
                    {{detailList.createTime || '暂无数据'}}</el-tag></span>
                </div>
                <div class="line">
                  <span><el-tag type="info">CityCode：
                    <br>
                    {{detailList.cityCode || '暂无数据'}}</el-tag></span>
                  <span><el-tag type="info">发卡主体：
                    <br>
                    {{detailList.issuerName || '暂无数据'}}</el-tag></span>
                  <span><el-tag type="info">渠道：
                    <br>
                    {{detailList.channelName || '暂无数据'}}</el-tag></span>
                  <span><el-tag type="info">渠道用户ID：<br>{{detailList.channelUserId || '暂无数据'}}</el-tag></span>
                </div>
                <div class="line">
                  <span><el-tag type="info">卡状态：<br>{{detailList.statusName || '暂无数据'}}</el-tag></span>
                  <span><el-tag type="info">套餐状态：<br>{{detailList.packageTypeName || '暂无数据'}}</el-tag></span>
                  <span><el-tag type="info">余额（元）：<br>{{detailList.balance/100}}</el-tag></span>
                  <span><el-tag type="info">入金累计（元）：<br>{{detailList.cusumDeposit/100}}</el-tag></span>
                  <span><el-tag type="info">出金累计（元）：<br>{{detailList.cusumWithdraw/100}}</el-tag></span>
                </div>
              </div>
            </el-card>
          </div>
          <div class="cardBan">
            <el-card shadow="never" :body-style="{ padding: '10px' }">
              <div class="imgDiv">
                <div style="display:inline-block;margin:10px auto">
                  USER <br> <i class="el-icon-phone"></i>
                </div>
              </div>
              <div class="itemDiv">
                <div class="line">
                  <span><el-tag style="font-size:15px">系统用户ID：
                    <br>
                    {{detailList.userUuid || '暂无数据'}}</el-tag></span>
                </div>
                <div class="line">
                  <span><el-tag type="info">用户证件：<br>{{detailList.certTypeName || '暂无数据'}}</el-tag></span>
                  <span><el-tag type="info">用户证件号：<br>{{detailList.certNo || '暂无数据'}}</el-tag></span>
                  <span><el-tag type="info">用户姓名：<br>{{detailList.userName || '暂无数据'}}</el-tag></span>
                  <span><el-tag type="info">用户手机号：<br>{{detailList.mobile || '暂无数据'}}</el-tag></span>
                </div>
              </div>
            </el-card>
          </div>
        </el-collapse-item>
        <el-collapse-item name="event">
          <template slot="title">
            <div class="titleBan">卡事件明细 Event <i class="el-icon-tickets"></i></div>
          </template>
          <div class="queryResult">
            <div class="tableList">
                <el-table :data="eventList" size="small" border>
                    <el-table-column type="index" align="center"></el-table-column>
                    <el-table-column prop="orderNum" label="商户订单号" min-width="45" align="center"></el-table-column>
                    <el-table-column prop="createTime" label="发生时间" min-width="50" align="center">
                      <template slot-scope="scope" style="text-align:center">
                          <div class="nowWrap">{{scope.row.createTime}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="eventName" label="发生事件" min-width="50" show-overflow-tooltip align="center"></el-table-column>
                    <el-table-column prop="statusName" label="事件状态" min-width="40" align="center" ></el-table-column>
                    <el-table-column prop="settleInTime" label="入账时间" min-width="40" align="center" ></el-table-column>
                    <el-table-column prop="payAmt" label="发生金额/元" min-width="40" align="center" ></el-table-column>
                    <el-table-column prop="balance" label="卡账户金额/元" min-width="40" align="center" ></el-table-column>
                    <!-- <el-table-column  label="操作" min-width="60" align="center" style="text-align:center">
                        <template slot-scope="scope">
                            <div style="display:inline-block">
                              <el-button size="small" type="primary" disabled plain class="ml10">查看该事件<i class="el-icon-zoom-in"></i></el-button>
                            </div>
                        </template>
                    </el-table-column> -->
                </el-table>
            </div>
            <!-- <el-card shadow="hover"> -->
              <div class="foot-page" style="text-align:center; margin-top:0.8rem">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParams.currentPage" :page-sizes="[10]" :page-size="searchParams.showCount" layout="total, sizes, prev, pager, next, jumper" :total="totalSize">
                </el-pagination>
              </div>
            <!-- </el-card> -->
        </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
  </div>
</template>
<script>
import cardServer from "../../../service/scavengingManagement/userRelevant.js";
import headTop from '../../../components/headTop'

export default {
  data() {
    return {
      activeValue: 'detail',
      detailList:{
        cityCode: '',
        issuerName: '',
        channelName: '',
        channelUserId: '',
        cardNo:'',
        createTime: '',
        statusName: '',
        balance: '',
        cusumWithdraw: '',
        cusumDeposit: '',
        userUuid: '',
        certTypeName: '',
        certNo: '',
        userName: '',
        mobile: '',
        packageTypeName: ''
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
    //获取卡详情数据
    getCardDetail(){
      const data = {
        cardNo: this.$route.query.num,
        cityCode: this.$route.query.code,
        merchantNo: this.$route.query.merchant
      }
      cardServer.getCardDetail(data).then(
        response => {
          this.detailList = response
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
    },

    //获取卡事件明细数据
    getEventList(){
      const data = {
        cardNo: this.$route.query.num,
        cityCode: this.$route.query.code,
        currentPage: this.searchParams.currentPage,
        showCount: this.searchParams.showCount
      }
      // console.log(JSON.stringify(data))
      cardServer.getEventList(data).then(
        response => {
          this.eventList = response.ecCardEventList
          this.totalSize = response.totalCount
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
    },

    handleSizeChange(val) {
      this.searchParams.showCount = val;
      this.getEventList();
    },
    handleCurrentChange(val) {
      this.searchParams.currentPage = val;
      this.getEventList();
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
    this.getCardDetail()
    this.getEventList()
    this.activeValue = this.$route.query.active
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
