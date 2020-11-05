<template>
  <div>
    <el-dialog title="出金分类查看" :visible.sync="dialogTableVisible">
      <div class="optionLine" style="margin-bottom: 20px;padding-left: 60px;">              
        <div class="cellItem">入账日期</div>
        <div class="cellItem">{{detailData.billDate}}</div>
        <div class="cellItem" v-if="detailData.channelName">资金来源</div>
        <div class="cellItem" v-if="detailData.channelName">{{detailData.channelName}}</div>
      </div>
      <el-table :data="gridData" border>
        <el-table-column property="operator" label="" width="60"></el-table-column>
        <el-table-column property="columnIndex2" label="交易类型" width="180"></el-table-column>
        <el-table-column property="name" label="结算金额/元">
          <template slot-scope="scope" class="detail-content">
            <div class="detail-content">{{createColumnOne(scope.row.columnIndex1)}}</div>
          </template>
        </el-table-column>
        <el-table-column property="columnIndex1" label="结算笔数">
          <template slot-scope="scope" class="detail-content">
            <div class="detail-content">{{createColumnTwo(scope.row.columnIndex1)}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="optionLine" style="margin-top: 20px;">              
        <div class="cellItem total">=</div>
        <div class="cellItem totalAmount">{{detailData.totalAmount+'元'}}</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import cardServer from "../../../../service/scavengingManagement/reports.js";
export default {
  props: [],
  data() {
    return {
      gridData: [
        {
          columnIndex2: '余额消费',
          operator: '+',
          columnIndex1: 0
        },
        {
          columnIndex2: '余额消费撤销',
          operator: '-',
          columnIndex1: 1
        },
        {
          columnIndex2: '信用付',
          operator: '+',
          columnIndex1: 2
        },
        {
          columnIndex2: '信用付撤销',
          operator: '-',
          columnIndex1: 3
        }
      ],
      detailData: {},
      dialogTableVisible: false
    }
  },
  mounted() {
  },
  methods: {
    createColumnOne(index) {
      let str = ''
      switch (index) {
        case 0:
          str = this.detailData.payAmt
          break;
        case 1:
          str = this.detailData.payCancelAmt
          break;
        case 2:
          str = this.detailData.creditAmt
          break;
        case 3:
          str = this.detailData.creditCancelAmt
          break;
      }
      return str
    },
    createColumnTwo(index) {
      let str = ''
      switch (index) {
        case 0:
          str = this.detailData.payCnt
          break;
        case 1:
          str = this.detailData.payCancelCnt
          break;
        case 2:
          str = this.detailData.creditCnt
          break;
        case 3:
          str = this.detailData.creditCancelCnt
          break;
      }
      return str
    },
    //获取入金分类查看
    getWithdrawDialog(){    
      const data = JSON.parse(sessionStorage.getItem('withdrawObj')) || {}
      console.log(data)
      cardServer.withdrawView(data).then(
        response => {
          console.log(response,'response')
          this.detailData = response
        },
        response => {
          this.detailData = {}
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
    },
    show() {
      this.dialogTableVisible = true
      this.getWithdrawDialog()
    }
  }
}
</script>
<style lang="scss" scoped>
.el-tag{
  font-size: 15px;
  line-height: 2.4rem;
  margin-right: 0.5rem;
  height: auto;
  padding: 0 1rem;
}
.optionLine {
  display: flex;
}
.cellItem {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ebeef5;
  height: 45px;
  padding: 0 20px;
}
.total {
  width: 200px;
}
.totalAmount {
  flex: 1;
  text-align: center;
}
</style>
