<template>
    <div>
        <div class="title-box"
             v-show="true">{{billType=='day' ? this.currentMonth : this.currentMonth.slice(0,5)}} 套餐购买账单
        </div>
        <div class="option-box">
            <div>
                <el-button class="chooseBtn" :class="{activeBtn : billType === 'day'} " @click="handleClick('day')" style="float: left;border-right:none">日</el-button>
                <el-button class="chooseBtn" :class="{activeBtn : billType === 'month'} " @click="handleClick('month')" style="float: left;border-left:none">月</el-button> 
            </div>
            <div class="block div-inline" style="margin-left:0.5rem;" v-if="billType==='day'">
                <el-date-picker v-model="selectDateValue"
                                type="month"
                                :clearable="false"
                                placeholder="选择月">
                </el-date-picker>
            </div>
            <div class="block div-inline" style="margin-left:0.5rem;" v-if="billType==='month'">
                <el-date-picker v-model="selectDateValue"
                                :clearable="false"
                                type="year"
                                placeholder="选择年">
                </el-date-picker>
            </div>

            <el-button-group v-if="billType==='day'">
                <el-button icon="el-icon-arrow-left"
                           @click="preMonth()"></el-button>
                <el-button @click="nextMonth()"><i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </el-button-group>

            <div class="each div-inline ">
                <el-tag type="info"
                        plain>发卡商户
                </el-tag>
                <el-select v-model="issuerCode"
                           @change="updateSelectData"
                           placeholder="(必选)请选择">
                    <el-option v-for="item in issuerList"
                               :key="item.code"
                               :label="item.name"
                               :value="item.code">
                    </el-option>
                </el-select>
            </div>

            <el-button v-show="validParameter" type="primary" plain @click="fetch()">刷新</el-button>
        </div>

        <v-dateDialog v-show="showDateDialog && (billType==='day')"
                      :dialog-option="dateDialogOption"
                      ref="dateDialog"
                      @create-download="onCreateDownload"
                      @file-download="onFileDownload"
                      @month-changed="onMonthChanged"
                      @cur-day-changed="onCurDayChanged"
                      class="date-box">
        </v-dateDialog>

        <div class="monthBill" v-show="billType==='month' && monthList.length>0">
            <div class="quarterGro">
                <div class="quarterHead">
                    第一季度
                </div>
                <div class="quarter">                        
                    <div class="eachItem" v-for="(item,index) in monthList" :key="index" v-if="index<3">
                        <div class="month">
                            {{index+1}}
                        </div>
                        <div class="monthBtn">
                            <el-button style="width:125px;" v-if="item.status==3" type="primary" @click="onFileDownload(item.downUrl)">{{item.desc||'下载'}}</el-button>
                            <el-button style="width:125px;" disabled  v-else type="info">{{item.desc||'无法下载'}}</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="quarterGro">
                <div class="quarterHead">
                    第二季度
                </div>
                <div class="quarter">                        
                    <div class="eachItem" v-for="(item,index) in monthList" :key="index" v-if="(index<6)&&(index>=3)">
                        <div class="month">
                            {{index+1}}
                        </div>
                        <div class="monthBtn">
                            <el-button style="width:125px;" v-if="item.status==3" type="primary" @click="onFileDownload(item.downUrl)">{{item.desc||'下载'}}</el-button>
                            <el-button style="width:125px;" disabled  v-else type="info">{{item.desc||'无法下载'}}</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="quarterGro">
                <div class="quarterHead">
                    第三季度
                </div>
                <div class="quarter">                        
                    <div class="eachItem" v-for="(item,index) in monthList" :key="index" v-if="(index<9)&&(index>=6)">
                        <div class="month">
                            {{index+1}}
                        </div>
                        <div class="monthBtn">
                            <el-button style="width:125px;" v-if="item.status==3" type="primary" @click="onFileDownload(item.downUrl)">{{item.desc||'下载'}}</el-button>
                            <el-button style="width:125px;" disabled  v-else type="info">{{item.desc||'午饭下载'}}</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="quarterGro">
                <div class="quarterHead">
                    第四季度
                </div>
                <div class="quarter">                        
                    <div class="eachItem" v-for="(item,index) in monthList" :key="index" v-if="index>=9">
                        <div class="month">
                            {{index+1}}
                        </div>
                        <div class="monthBtn">
                            <el-button style="width:125px;" v-if="item.status==3" type="primary" @click="onFileDownload(item.downUrl)">{{item.desc||'下载'}}</el-button>
                            <el-button style="width:125px;" disabled  v-else type="info">{{item.desc||'无法下载'}}</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import DatePicker from '../../../components/DatePicker'
    import cardServer from "../../../service/scavengingManagement/userRelevant.js";
    import billServer from "../../../service/scavengingManagement/bill.js";
    import moment from 'moment'

    export default {
        name: "merchantTransactionBill",
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
                issuerList: [],
                billType: 'day',
                monthList: []
            }
        },
        async created() {
            await this.getSelectData(1)
        },
        computed: {
            validParameter() {
                return this.issuerCode
            },
            currentMonth() {
                console.log("computed currentMonth")
                this.dateDialogOption.currentMonth = this.selectDateValue
                this.dateDialogOption.fileInfo = []
                //this.$refs.dateDialog.setDate(this.selectDateValue)
                let date = this.selectDateValue
                this.$nextTick(() => {
                    if (this.validParameter) {
                        this.fetch()
                    }
                })
                return (date && (date.getFullYear() + "年" + (date.getMonth() + 1) + "月份")) || ""
            }
        },
        methods: {
            nextMonth() {
                this.$refs.dateDialog.nextMonth()

            },
            preMonth() {
                this.$refs.dateDialog.preMonth()

            },
            handleClick(str) {
                this.billType = str
                if(this.validParameter) {
                    this.fetch()
                }
            },
            onCreateDownload(m) {
            },
            onFileDownload(downUrl) {
                downUrl && window.open(downUrl)
            },
            onMonthChanged(m, date) {
                console.log(m, date)
                this.selectDateValue = new Date(date)
                //this.fetch()
            },
            async updateSelectData() {
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
                let that = this
                billServer.packageList({
                    billType: that.billType,
                    time: that.billType==='day' ? moment(this.selectDateValue).format("YYYYMM") : moment(this.selectDateValue).format("YYYY"),
                    issuerCode: that.issuerCode
                }).then(
                    response => {
                        console.log(response)
                        let billInfos = response.billInfos
                        if (billInfos && billInfos.length > 0) {
                            let fileInfo = []

                            billInfos.forEach((t) => {
                                //t.status = 3
                                fileInfo.push({
                                    billTime: t.billTime,
                                    canDownload: t.status === 3,
                                    status: t.status,
                                    desc: billServer.getStatusDesc(t.status),
                                    downUrl: t.downUrl
                                })
                            })
                            if(that.billType === 'day') {
                                that.dateDialogOption.fileInfo = fileInfo
                            } else {
                                that.monthList = fileInfo
                            }
                        }

                    },
                    response => {
                        this.$message.error(response.msg || '服务器连接失败！');
                    }
                )
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
                        console.log(response)
                        if (type === 1) {
                            if (response && response.length >= 1) {
                                // this.issuerCode = response[0].code
                                this.issuerList = response
                            }
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
        display: flex;
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
    .chooseBtn {
    margin: 0;
    }
    .activeBtn{
    background: rgba(64, 158, 255, 0.1);
    color: #409EFF;
    }
    .monthBill {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 920px;
        margin: 0 auto;
        margin-top: 2.6rem;
        .quarterGro {
            width: 435px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-bottom: 2rem;
            .quarterHead {
                width: 100%;
                text-align: center;
                font-size: 22px;
                line-height: 60px;
            }
            .quarter {
                display: flex;
                justify-content: space-around;
                .eachItem {
                    width: 145px;
                    padding: 10px 0 17px 0;
                    text-align: center;
                    border: 1px solid #909399;
                    .month {
                        font-size: 18px;
                        line-height: 38px;
                        margin-bottom: 8px;
                    }
                }
            }
        }
    }
</style>
