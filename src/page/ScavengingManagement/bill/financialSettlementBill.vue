<template>
    <div>
        <div class="title-box"
             v-show="true">{{this.currentMonth}} 财务结算账单({{this.type==='IN'?"入金":"出金"}})
        </div>
        <div v-show="false">{{this.currentMonth}}</div>
        <div class="option-box">
            <el-radio-group v-model="type"
                            @change="onTypeChange">
                <el-radio-button label="OUT">出金</el-radio-button>
                <el-radio-button label="IN">入金</el-radio-button>
            </el-radio-group>
        </div>
        <div class="option-box">
            <el-tag type="info"
                    plain>日账单
            </el-tag>
            <div class="block div-inline">
                <el-date-picker v-model="selectDateValue"
                                type="month"
                                placeholder="选择月">
                </el-date-picker>
            </div>

            <el-button-group>
                <el-button icon="el-icon-arrow-left"
                           @click="preMonth()"></el-button>
                <el-button @click="nextMonth()"><i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </el-button-group>

            <div class="each div-inline ">
                <el-tag type="info"
                        plain>发卡主体
                </el-tag>
                <el-select v-model="compoundParams.code1"
                           clearable
                           @change="updateSelectData1"
                           placeholder="(必选)请选择">
                    <el-option v-for="item in code1List"
                               :key="item.code"
                               :label="item.name"
                               :value="item.code">
                    </el-option>
                </el-select>
            </div>

            <div class="each  div-inline">
                <el-tag type="info"
                        plain>资金收款方
                </el-tag>
                <el-select v-model="compoundParams.code2"
                           clearable
                           @change="updateSelectData2"
                           placeholder="(必选)请选择">
                    <el-option v-for="item in code2List"
                               :key="item.code"
                               :label="item.name"
                               :value="item.code">
                    </el-option>
                </el-select>
            </div>
            <el-button v-show="validParameter" @click="fetch()">刷新</el-button>
        </div>

        <v-dateDialog v-show="showDateDialog"
                      :dialog-option="dateDialogOption"
                      ref="dateDialog"
                      @create-download="onCreateDownload"
                      @file-download="onFileDownload"
                      @month-changed="onMonthChanged"
                      @cur-day-changed="onCurDayChanged"
                      class="date-box">
        </v-dateDialog>

    </div>
</template>

<script>
    import DatePicker from '../../../components/DatePicker'
    import cardServer from "../../../service/scavengingManagement/userRelevant.js";
    import billServer from "../../../service/scavengingManagement/bill.js";
    import moment from 'moment'

    export default {
        name: "financialSettlementBill",
        components: {
            'v-dateDialog': DatePicker
        },
        data() {
            let date = new Date()
            return {
                selectDateValue: date,
                showDateDialog: true,
                dateDialogOption: {
                    currentMonth: date,
                    fileInfo: [],

                },
                issuerCode: null,
                type: 'OUT',
                compoundParams: {
                    code1: null,
                    code2: null,

                },
                code1List: [],
                code2List: []
            }
        },
        async created() {
            await this.getSelectData(1)
            if (this.compoundParams.code1) await this.getSelectData(this.type === "IN" ? 12 : 11, this.compoundParams.code1)

        },

        computed: {
            validParameter() {
                return this.compoundParams.code1 && this.compoundParams.code2
            },
            currentMonth() {
                console.log("computed currentMonth")
                this.dateDialogOption.currentMonth = this.selectDateValue
                let date = this.selectDateValue
                this.dateDialogOption.fileInfo = []
                this.$nextTick(() => {
                    if (this.validParameter) {
                        this.fetch()
                    }
                })
                return (date && (date.getFullYear() + "年" + (date.getMonth() + 1) + "月份")) || ""
            }
        },
        methods: {
            async onTypeChange() {
                this.dateDialogOption.fileInfo = []
                this.compoundParams.code2 = null
                if (this.compoundParams.code1) {
                    await this.getSelectData(this.type === "IN" ? 12 : 11, this.compoundParams.code1)
                }
                this.$nextTick(() => {
                    if (this.validParameter) {
                        this.fetch()
                    }
                })
            },
            /*        outMoney () {
                        this.type = 'OUT'
                        this.dateDialogOption.fileInfo = []
                        if (this.compoundParams.code1 && this.compoundParams.code2) this.fetch()
                    },
                    inMoney () {
                        this.type = 'IN'
                        this.dateDialogOption.fileInfo = []
                        if (this.compoundParams.code1 && this.compoundParams.code2) this.fetch()
                    },*/
            onCreateDownload(m) {
                let that = this
                billServer.billCreate({
                    type: 'FinancialSettlement',
                    time: m.billTime,
                    // tradeType:this.compoundParams.code1,
                    // tradeCode:this.compoundParams.code2,
                    financialType: this.type === "IN" ? 'deposit' : 'withdraw',
                    issuerCode: this.compoundParams.code1,
                    cashReceiptCode: this.compoundParams.code2
                }).then(
                    response => {
                        if (response && response.suc) {
                            m.status = 2
                            m.desc = billServer.getStatusDesc(m.status)
                            setTimeout(() => {
                                if (that.compoundParams.code1 && that.compoundParams.code2) {
                                    that.fetch()
                                }
                            }, 10000)
                        }
                        // this.fetch()

                    },
                    response => {
                        this.$message.error(response.msg || '服务器连接失败！');
                    }
                )
            },
            onFileDownload(m) {
                billServer.billDonload({
                    type: 'FinancialSettlement',
                    time: m.billTime,
                    // tradeType:this.compoundParams.code1,
                    // tradeCode:this.compoundParams.code2,
                    financialType: this.type === "IN" ? 'deposit' : 'withdraw',
                    issuerCode: this.compoundParams.code1,
                    cashReceiptCode: this.compoundParams.code2
                }).then(
                    response => {
                        console.log(response)
                        let downUrl = response.downUrl
                        downUrl && window.open(downUrl)

                    },
                    response => {
                        this.$message.error(response.msg || '服务器连接失败！');
                    }
                )
            },
            nextMonth() {
                this.$refs.dateDialog.nextMonth()

            },
            preMonth() {
                this.$refs.dateDialog.preMonth()

            },
            onMonthChanged(m, date) {
                console.log(m, date)
                this.selectDateValue = new Date(date)
            },
            async updateSelectData1() {

                this.dateDialogOption.fileInfo = []
                this.compoundParams.code2 = null
                if (this.compoundParams.code1) await this.getSelectData(this.type === "IN" ? 12 : 11, this.compoundParams.code1)
                this.$nextTick(() => {
                    if (this.validParameter) {
                        this.fetch()
                    }
                })

            },
            updateSelectData2() {
                this.dateDialogOption.fileInfo = []
                this.$nextTick(() => {
                    if (this.validParameter) {
                        this.fetch()
                    }
                })
            },
            onCurDayChanged() {

            },
            fetch() {
                console.log("fetch")
                /*
                type	账单类型	String
                MerchantTransaction：商户交易账单
                FinancialSettlement：财务结算账单
                queryTime	查询时间	String YYYY-MM
                tradeType	商户交易类型	String
                tradeCode	商户交易商户	String
                financialType	财务结算账单类型	String
                withdraw：出金
                deposit：入金
                issuerCode
                发卡主体
                cashReceiptCode	资金收款方
                */
                let that = this
                billServer.billList({
                    type: 'FinancialSettlement',
                    queryTime: moment(this.selectDateValue).format("YYYY-MM"),
                    //tradeType:this.compoundParams.code1,
                    //tradeCode:this.compoundParams.code2,
                    financialType: this.type === "IN" ? 'deposit' : 'withdraw',
                    issuerCode: this.compoundParams.code1,
                    cashReceiptCode: this.compoundParams.code2
                }).then(
                    response => {
                        //{"msg":"success","code":200,"data":{"billInfos":[{"billTime":"2019-06-01","status":0},{"billTime":"2019-06-02","status":0},{"billTime":"2019-06-03","status":0},{"billTime":"2019-06-04","status":0},{"billTime":"2019-06-05","status":0},{"billTime":"2019-06-06","status":0},{"billTime":"2019-06-07","status":0},{"billTime":"2019-06-08","status":0},{"billTime":"2019-06-09","status":0},{"billTime":"2019-06-10","status":0},{"billTime":"2019-06-11","status":0},{"billTime":"2019-06-12","status":0},{"billTime":"2019-06-13","status":0},{"billTime":"2019-06-14","status":0},{"billTime":"2019-06-15","status":0},{"billTime":"2019-06-16","status":0},{"billTime":"2019-06-17","status":0},{"billTime":"2019-06-18","status":0},{"billTime":"2019-06-19","status":0},{"billTime":"2019-06-20","status":0},{"billTime":"2019-06-21","status":0},{"billTime":"2019-06-22","status":0},{"billTime":"2019-06-23","status":0},{"billTime":"2019-06-24","status":0},{"billTime":"2019-06-25","status":0},{"billTime":"2019-06-26","status":0},{"billTime":"2019-06-27","status":0},{"billTime":"2019-06-28","status":0},{"billTime":"2019-06-29","status":0},{"billTime":"2019-06-30","status":0}]},"suc":true}
                        console.log(response)
                        let billInfos = response.billInfos
                        if (billInfos && billInfos.length > 0) {
                            let fileInfo = []

                            billInfos.forEach((t) => {
                                fileInfo.push({
                                    billTime: t.billTime,
                                    canDownload: t.status === 3,
                                    status: t.status,
                                    desc: billServer.getStatusDesc(t.status),
                                })
                            })
                            that.dateDialogOption.fileInfo = fileInfo
                        }

                    },
                    response => {
                        this.$message.error(response.msg || '服务器连接失败！');
                    }
                )
                /*let that = this
                setTimeout(() => {
                    that.dateDialogOption.fileInfo = [{
                        canDownload: false,
                        desc: billServer.getStatusDesc(2),
                        status: 2,
                        url: "https://operation-citytsm.oss-cn-hangzhou.aliyuncs.com/test/%E6%B5%8B%E8%AF%95bug.csv"
                    }, {
                        canDownload: false,
                        desc: billServer.getStatusDesc(2),
                        status: 2,
                        url: "https://operation-citytsm.oss-cn-hangzhou.aliyuncs.com/test/%E6%B5%8B%E8%AF%95bug.csv"
                    }, {
                        canDownload: false,
                        desc: billServer.getStatusDesc(4),
                        status: 4,
                        url: "https://operation-citytsm.oss-cn-hangzhou.aliyuncs.com/test/%E6%B5%8B%E8%AF%95bug.csv"
                    }, {
                        canDownload: true,
                        desc: billServer.getStatusDesc(3),
                        status: 3,
                        url: "https://operation-citytsm.oss-cn-hangzhou.aliyuncs.com/test/%E6%B5%8B%E8%AF%95bug.csv"
                    }, {
                        canDownload: false,
                        desc: billServer.getStatusDesc(2),
                        status: 2,
                        url: "https://operation-citytsm.oss-cn-hangzhou.aliyuncs.com/test/%E6%B5%8B%E8%AF%95bug.csv"
                    }, {
                        canDownload: false,
                        desc:billServer.getStatusDesc(1),
                        status: 1,
                        url: "https://operation-citytsm.oss-cn-hangzhou.aliyuncs.com/test/%E6%B5%8B%E8%AF%95bug.csv"
                    }, {
                        canDownload: false,
                        desc: billServer.getStatusDesc(0),
                        status: 0,
                        url: "https://operation-citytsm.oss-cn-hangzhou.aliyuncs.com/test/%E6%B5%8B%E8%AF%95bug.csv"
                    }]
                }, 3000)*/

            },
            //获取下拉选项列表
            //1.发卡主体 2.渠道 3.卡状态 4.交易/消费-交易商户 5.报表/商户交易-交易类型
            //6.报表/商户交易-交易商户 7.入金-资金收款方 8.出金-资金收款方 9.交易/消费- 渠道（特殊)
            getSelectData(type, issuerCode, tradeTypeCode) {
                const data = {
                    type: type,
                    issuerCode: issuerCode,
                    tradeTypeCode: tradeTypeCode
                }
                cardServer.getSelectData(data).then(
                    response => {

                        if (type === 1) {
                            this.code1List = response
                            // this.issuerCode = response
                            this.compoundParams.code2 = null

                        }
                        else if (type === 12) {
                            this.code2List = response
                            this.compoundParams.code2 = null

                        } else if (type === 11) {
                            this.code2List = response
                            this.compoundParams.code2 = null
                        }

                    },
                    response => {
                        this.$message.error(response.msg || '服务器连接失败！');
                    }
                )
            },

        },
        watch: {
            selectDateValue: (e) => {
                console.log(e)

            }
        }

    }
</script>

<style lang="scss" scoped>
    .title-box {
        margin-top: 2rem;
        width: 100%;
        text-align: center;
        font-size: 30px;
    }

    .option-box {
        margin-left: 10%;
        margin-top: 3rem;
        width: 90%;
        .el-tag {
            height: 40px;
            line-height: 38px;
        }
    }

    .date-box {
        margin-top: 1rem;
        top: 10px;
        left: 10px;
        bottom: 10px;
        right: 10px;

        background: #fff;
    }

    .div-inline {
        display: inline;
    }
</style>
