<template>
    <div><head-top></head-top>
    <div class="outermost">

      <div class="queryResult">
        <div class="tableList">
            <el-table :data="tableData" size="small" border>
                <el-table-column type="index" label="分佣结算明细" align="center"></el-table-column>
                <!-- <el-table-column prop="issuerCode" label="城市" min-width="38" align="center"></el-table-column> -->
                <el-table-column prop="productName" label="卡类型" min-width="38" align="center"></el-table-column>
                <el-table-column prop="royaltyDate" label="交易日期" min-width="38" align="center"></el-table-column>
                <el-table-column prop="typeName" label="交易类型" min-width="38" align="center"></el-table-column>
                <el-table-column prop="cardNo" label="卡号" min-width="38" align="center"></el-table-column>
                <el-table-column prop="bizOrderId" label="商户订单号" min-width="38" align="center"></el-table-column>
                <el-table-column prop="channelVoucherId" label="渠道支付订单号" min-width="38" align="center"></el-table-column>
                <el-table-column prop="tramsAmount" label="交易金额" min-width="38" align="center"></el-table-column>
                <el-table-column prop="commissionAmount" label="分佣金额" min-width="38" align="center"></el-table-column>
                 
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
import commonServer from '../../../service/commonService/common.js'
import headTop from '../../../components/headTop'

export default {
  data() {
    return {
      loadingShow: false,
      tableData: [],
      totalTable: [],
      searchParams: {
        currentPage: 1,
        showCount: 10
      },
      totalSize: 0
    }
  },
  methods: {
    //复合检索
    compoundSearch(page) {
      this.getTableList(this.searchParams)
    },

    //获取表格数据
    getTableList(data) {
      this.tableData = []
      cardServer.getCommissionDetail(data).then(
        response => {
          if (response.list) {
            this.tableData = response.list
            this.totalSize = response.totalCount
          }
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！')
        }
      )
    },

    handleSizeChange(val) {
      this.searchParams.showCount = val
      this.compoundSearch()
    },
    handleCurrentChange(val) {
      this.searchParams.currentPage = val
      this.compoundSearch()
    },

  },
  components: {
    headTop
  },
  created() {},
  mounted() {
    const data = JSON.parse(sessionStorage.getItem('commissionDetail')) || {}
    Object.assign(this.searchParams,data)
    console.log(data,this.searchParams)
    this.compoundSearch()
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

.optionLine {
  display: flex;
  margin-bottom: 1.5rem;
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
