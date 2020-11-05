<template>
    <div><head-top></head-top>
    <div class="outermost">
      <el-card shadow='never'>
        <div class="compoundQuery">
          <div class="optionLine2">              
            <div class="each">
               <el-tag type="info" plain>发卡主体 :&nbsp;&nbsp;{{dayItem.issuerName}}</el-tag> 
            </div> 

            <div class="each">
               <el-tag type="info" plain>渠道 :&nbsp;&nbsp;{{dayItem.channelName}}</el-tag>
            </div>

            <el-button type="primary" plain  icon="el-icon-printer" @click="chartsExport" style="position:absolute;right:6rem;">导出报表</el-button>
          </div>
        </div>
      </el-card>

      <div class="queryResult">
        <div class="tableList">
            <el-table :data="tableData" size="small" border>
                <el-table-column type="index" prop="id" align="center"></el-table-column>
                <el-table-column prop="day" label="日" min-width="30" align="center"></el-table-column>
                <el-table-column prop="beginBalance" label="期初余额/元" min-width="38" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.beginBalance/100}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="chargeAmount" label="账户充值总额/元" min-width="45" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.chargeAmount/100}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="consumeAmount" label="余额消费总额/元" min-width="45" align="center" >
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{scope.row.consumeAmount/100}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="deductAmount" label="余额消费渠道抵扣总额/元" min-width="50" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.deductAmount/100}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="refundAmount" label="退卡退款总额/元" min-width="45" align="center">
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{scope.row.refundAmount/100}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="endBalance" label="期末余额/元" min-width="36" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.endBalance/100}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="correctName" label="是否结平" min-width="30" align="center"></el-table-column>
                <el-table-column  label="操作" min-width="35" align="center" style="text-align:center">
                    <template slot-scope="scope">
                        <div style="display:flex">
                            <el-button size="small" type="text" plain class="ml10" @click="handleJump()">返回月<i class="el-icon-sort"></i></el-button>
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
import cardServer from "../../../service/scavengingManagement/reports.js";
import headTop from '../../../components/headTop'
import { weeks, ostreamRequset } from '../../../utils/common.js'

export default {
  data() {
    return {
      issuer:'',
      channel: '',
      status: '',     
      dayItem: '',   
      loadingShow: false,
      tableData: [],
      searchParams: {
        currentPage: 1,
        showCount: 10
      },
      totalSize: 0
      }
  },
  methods: {

    //获取表格数据
    getTableList(){
      const data = {
        month: this.dayItem.month,
        issuerCode: this.dayItem.issuer,
        channelCode: this.dayItem.channel,
        showCount: this.searchParams.showCount,
        currentPage: this.searchParams.currentPage
      }
      cardServer.getChangeDay(data).then(
        response => {
          this.tableData = response.recordList
          this.totalSize = response.totalCount
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
    hidden(str,link,frontLen,endLen) { 
        var len = str.length-frontLen-endLen;
        var xing = '';
        for (var i=0;i<len;i++) {
        xing+=link;
      }
        return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
    },

    //页面跳转
    handleJump(){
      this.$router.go(-1)
    },
    chartsExport() {
      const formData = {
          month: this.dayItem.month,
          issuerCode: this.dayItem.issuer,
          channelCode: this.dayItem.channel
      }
      const url = '/export/account/changeday'
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
    }
  },
  components: {
    headTop
  },
  created(){
    this.dayItem = JSON.parse(sessionStorage.getItem('dayItem')) || ''
  },
  mounted(){
    this.getTableList()
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