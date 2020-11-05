<template>
    <div><head-top></head-top>
    <div class="outermost">
      <el-card shadow='never'>
        <div class="compoundQuery">
          <div class="optionLine2">              
            <div class="each">
               <el-tag type="info" plain>总计 : {{totalCount}} 张卡, —— {{totalAmount/100}}元</el-tag> 
            </div> 

            <div class="each">
               <el-tag type="info" plain>每日 {{etlTime || '2:00'}} 更新</el-tag>
            </div>

            <el-button type="primary" plain  icon="el-icon-search" round @click="compoundSearch"></el-button>
            
          </div>
        </div>
      </el-card>

      <div class="queryResult">
        <div class="tableList">
            <el-table :data="tableData" size="small" border>
                <el-table-column type="index" prop="id" align="center"></el-table-column>
                <el-table-column prop="issuerName" label="发卡主体" min-width="38" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.issuerName}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="channelName" label="发卡渠道" min-width="40" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.channelName}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="cardNo" label="卡号" min-width="45" align="center" >
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{scope.row.cardNo}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="balance" label="余额" min-width="30" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.balance/100}}</div>
                  </template>
                </el-table-column>
                <el-table-column  label="操作" min-width="55" align="center" style="text-align:center">
                    <template slot-scope="scope">
                        <div style="display:flex">
                            <el-button size="small" type="text" plain class="ml10" @click="handleJump('cardDetail?active=detail',scope.row.cardNo,scope.row.cityId)">卡详情</el-button>
                            <el-button size="small" type="text" plain class="ml10" @click="handleJump('cardDetail?active=event',scope.row.cardNo,scope.row.cityId)">卡事件明细</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-card shadow='never'>
          <div class="foot-page" style="text-align:center">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParams.currentPage" :page-sizes="[10]" :page-size="searchParams.showCount" layout="total, sizes, prev, pager, next, jumper" :total="totalSize">
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
      loadingShow: false,
      tableData: [],
      searchParams: {
        currentPage: 1,
        showCount: 10
      },
      totalSize: 0,
      totalCount: '',
      totalAmount: '',
      etlTime: ''
    }
  },
  methods: {
    compoundSearch(){
      this.searchParams.currentPage = 1
      this.getTableList()
      this.getSum()
    },

    //获取表格数据
    getTableList(){
      cardServer.getAbnormalList(this.searchParams).then(
        response => {
          this.tableData = response.abnormalUserList
          this.totalSize = response.totalCount
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
    },

    //获取表格数据
    getSum(){
      cardServer.getAbnormalInfo().then(
        response => {
          this.totalCount = response.totalNum
          this.totalAmount = response.totalBalance
          this.etlTime = response.etlTime
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
    },

    handleSizeChange(val) {
      this.searchParams.showCount = val;
      this.getTableList()
    },
    handleCurrentChange(val) {
      this.searchParams.currentPage = val;
      this.getTableList()
    },

    //页面跳转
    handleJump(link,cardNo,cityCode){
      let ram = Math.random()
      const router = `./${link}&num=${cardNo}&code=${cityCode}&ram=${ram}`;
      this.$router.push(router);
    },
  },
  components: {
    headTop
  },
  created(){
  },
  mounted(){
    this.getTableList()
    this.getSum()
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
.el-tag{
  font-size: 15px;
  line-height: 2.4rem;
  margin-right: 0.5rem;
  height: auto;
  padding: 0 1rem;
}
</style>