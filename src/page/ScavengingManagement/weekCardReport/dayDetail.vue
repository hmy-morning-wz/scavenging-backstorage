<template>
    <div><head-top></head-top>
    <div class="outermost">
      <el-card shadow='never'>
        <div class="compoundQuery">
          <div class="optionLine2">              
            <div class="each">
               <el-tag type="info" plain>{{$route.query.productName}}&nbsp;&nbsp;({{$route.query.date}})</el-tag> 
            </div> 
          </div>
          <div class="optionLine2" style="display:flex;margin-top:1.5rem;">        
            <el-tag type="info" plain>交易日期</el-tag>      
            <div class="each">
                <div>
                  <el-date-picker
                    v-model="searchParams.startDate"
                    type="date"
                    :clearable="false"
                    @change="getTableList"
                    value-format="yyyy-MM-dd"
                    placeholder="开始日期">
                  </el-date-picker> 至 
                  <el-date-picker
                    v-model="searchParams.endDate"
                    type="date"
                    :clearable="false"
                    @change="getTableList"
                    value-format="yyyy-MM-dd"
                    placeholder="结束日期">
                  </el-date-picker>
                </div>
            </div>
          </div>
        </div>
      </el-card>

      <div class="queryResult">
        <div class="tableList">
          <el-table :data="tableData" size="small" border>
            <!-- <el-table-column prop="time" label="周期卡售卖" align="center"></el-table-column> -->
            <el-table-column prop="summaryDate" label="统计日期" align="center"></el-table-column>
            <el-table-column prop="saleNum" label="售卖张数" align="center"></el-table-column>
            <el-table-column prop="refundNum" label="退卡张数" align="center"></el-table-column>
            <el-table-column prop="effectNum" label="生效张数" align="center"></el-table-column>
            <el-table-column prop="invalidNum" label="失效张数" align="center"></el-table-column>
            <el-table-column prop="currentEffectNum" label="有效张数" align="center"></el-table-column>
            <el-table-column prop="benefitNum" label="优惠次数" align="center"></el-table-column>
            <el-table-column prop="benefitAmt" label="优惠金额" align="center"></el-table-column>
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
import cardServer from '../../../service/scavengingManagement/weekCardReport.js'
import headTop from '../../../components/headTop'
import { today, ostreamRequset } from '../../../utils/common.js'

export default {
  data() {
    return {
      loadingShow: false,
      tableData: [],
      searchParams: {
        currentPage: 1,
        showCount: 10,
        startDate:
          this.$route.query.date && this.$route.query.date.split('~')[0],
        endDate: '',
        issuerCode: this.$route.query.issuerCode,
        channelCode: this.$route.query.channelCode,
        productCode: this.$route.query.productCode,
      },
      totalSize: 0
    }
  },
  methods: {
    //获取表格数据
    getTableList() {
      if (!(this.searchParams.startDate && this.searchParams.endDate)) {
        return
      }
      cardServer.dayDetail(this.searchParams).then(
        response => {
          this.tableData = response.list
          this.totalSize = response.totalCount
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！')
        }
      )
    },

    handleSizeChange(val) {
      this.searchParams.showCount = val
      this.getTableList()
    },
    handleCurrentChange(val) {
      this.searchParams.currentPage = val
      this.getTableList()
    },





    //页面跳转
    handleJump() {
      this.$router.go(-1)
    }
  },
  components: {
    headTop
  },
  created() {},
  mounted() {
    this.searchParams.endDate = today()
    this.getTableList()
  },
  updated() {}
}
</script>
<style lang="scss" scoped>
.outermost {
  padding: 2rem;
  height: 100%;
  // background-color: #f5f7fa//rgba(0, 0, 0, 0.04);
}
.queryOption {
  background-color: white;
  padding: 1rem;
  // width: 92%;
}
.queryResult {
  // padding: 2rem;
  padding-top: 1rem;
}

.inputOption {
  width: 36rem;
}

.optionLine2 {
  display: flex;
}
.each {
  margin-right: 1.5rem;
}
.tableList,
.totalTable {
  margin-bottom: 1.5rem;
  // box-shadow: 0 -2px 8px 0 rgba(0,0,0,0.08);
}
.foot-page {
  background-color: white;
  // width: 60%;
}
.inputOption {
  display: inline-block;
}
.nowWrap {
  width: 80%;
  margin: 0 auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.el-tag {
  font-size: 15px;
  line-height: 2.4rem;
  margin-right: 0.5rem;
  height: auto;
  padding: 0 1rem;
}
</style>