<template>
    <div><head-top></head-top>
    <div class="outermost">
      <el-card shadow='never'>
        <div class="compoundQuery">
          <div class="optionLine2" style="margin-bottom: 1.5rem;">
            <div class="each">
              <el-tag type="info" plain>活动</el-tag>
              <el-select v-model="searchParams.activityId" clearable placeholder="请选择活动">
                <el-option
                  v-for="item in activityList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </div>             
          </div>
          <div class="optionLine2">
            <div class="each" style="display:flex;">
              <el-tag  type="info" plain>日期选择</el-tag>
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
            </div>

            <el-button type="primary" plain  icon="el-icon-search" round @click="compoundSearch"></el-button>
            <el-button type="primary" plain  icon="el-icon-printer" @click="chartsExport" style="position:absolute;right:4rem;">导出报表</el-button>
          </div>
        </div>
      </el-card>

      <div class="queryResult">
        <div class="tableList">
            <el-table :data="tableData" size="small" border>
                <el-table-column prop="activityName" label="活动名称" align="center"></el-table-column>
                <el-table-column prop="voucherName" label="券名称" align="center"></el-table-column>
                <el-table-column prop="startEndTime" label="发放时间" align="center"></el-table-column>
                <el-table-column prop="summaryDate" label="日期" align="center"></el-table-column>
                <el-table-column prop="publishCount" label="发券数" align="center" ></el-table-column>
                <el-table-column prop="usedCount" label="核销数" align="center"></el-table-column>
                <el-table-column prop="publishAmount" label="发放金额" align="center"></el-table-column>
                <el-table-column prop="usedAmount" label="核销金额" align="center">
                </el-table-column>
                <el-table-column  label="操作" align="center" min-width="135" style="text-align:center">
                    <template slot-scope="scope">
                        <div style="display:flex;justify-content:center;">
                            <el-button size="small" type="text" plain @click="detailExport(scope.row.pubDetailUrl,scope.row.issuerCode)">发券明细下载</el-button>
                            <el-button size="small" type="text" plain @click="detailExport(scope.row.useDetailUrl,scope.row.issuerCode)">核销明细下载</el-button>
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
import commonServer from '../../../service/commonService/common.js'
import couponServer from "../../../service/scavengingManagement/coupon.js";
import headTop from '../../../components/headTop'
import { weeks, ostreamRequset } from '../../../utils/common.js'
export default {
  data() {
    return {
      daterange: '',
      loadingShow: false,
      activityList: [],
      tableData: [],
      searchParams: {
        currentPage: 1,
        showCount: 10,
        activityId: '',
        startDate: '',
        endDate: '',
      },
      totalSize: 0
    }
  },
  methods: {
    //复合检索
    compoundSearch() {
      this.searchParams.currentPage = 1
      this.getTableList()
    },

    //获取表格数据
    getTableList() {
      this.searchParams.startDate = this.daterange && this.daterange[0]
      this.searchParams.endDate = this.daterange && this.daterange[1]
      couponServer.getCouponDayList(this.searchParams).then(
        response => {
          this.tableData = response.list
          this.totalSize = response.totalCount
        },
        response => {
          this.tableData = []
          this.$message.error(response.msg || '服务器连接失败！')
        }
      )
    },
    
    //获取活动选项列表
    getActivityList() {
      couponServer.getActivityList().then(
        response => {
          this.activityList = response
          this.searchParams.activityId = ''
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！')
        }
      )
    },  

    // 时间跨度小于三个月
    judgeDate(daterange) {
      var date1 = daterange[0]
      var date2 = daterange[1]
      var year1 = parseInt(date1.substring(0, 4))
      var year2 = parseInt(date2.substring(0, 4))
      var month1 = parseInt(date1.substring(5, 7))
      var month2 = parseInt(date2.substring(5, 7))
      var day1 = parseInt(date1.substring(8))
      var day2 = parseInt(date2.substring(8))
      var flag = true
      if (year1 == year2) {
        //同年
        if (month2 - month1 > 3) {
          //月间隔超过3个月
          flag = false
        } else if (month2 - month1 == 3) {
          //月相隔3个月，比较日
          if (day2 > day1) {
            //结束日期的日大于开始日期的日
            flag = false
          }
        }
      } else {
        //不同年
        if (year2 - year1 > 1) {
          flag = false
        } else if (year2 - year1 == 1) {
          if (month1 < 10) {
            //开始年的月份小于10时，不需要跨年
            flag = false
          } else if (month1 + 3 - month2 < 12) {
            //月相隔大于3个月
            flag = false
          } else if (month1 + 3 - month2 == 12) {
            //月相隔3个月，比较日
            if (day2 > day1) {
              //结束日期的日大于开始日期的日
              flag = false
            }
          }
        }
      }
      if (!flag) {
        this.$message.error('时间跨度不可大于3个月哦')
        this.daterange = weeks()
      }
    },

    handleSizeChange(val) {
      this.searchParams.showCount = val
      this.getTableList()
    },
    handleCurrentChange(val) {
      this.searchParams.currentPage = val
      this.getTableList()
    },

    chartsExport() {
      const formData = {
        startDate: this.daterange[0],
        endDate: this.daterange[1],
        activityId: this.searchParams.activityId
      }
      const url = '/export/voucher/daysummary'
      this.doExport(formData,url)
    },
    detailExport(detailUrl,issuerCode) {
      const formData = {
        issuerCode,
        detailUrl
      }
      const url = '/export/voucher/daysummary/detail'
      this.doExport(formData,url)
    },
    doExport(formData,url) {
      commonServer.reportExport(formData, url).then(
        response => {
          if (response.emptyData) {
            this.$message.error(response.showMessage)
          } else {
            location.href = response.downloadUrl
          }
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！')
        }
      )
    }
  },
  components: {
    headTop
  },
  created() {
    this.daterange = weeks()
  },
  mounted() {    
    this.getActivityList()
  }
}
</script>
<style lang="scss" scoped>
.outermost {
  padding: 2rem;
  min-height: 100%;
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
.chooseBtn {
  margin: 0;
}
.activeBtn{
  background: rgba(64, 158, 255, 0.1);
  color: #409EFF;
}
.el-tag {
  font-size: 15px;
  line-height: 2.4rem;
  margin-right: 0.5rem;
  height: auto;
  padding: 0 1rem;
}
.el-input {
  width: 300px;
}
</style>