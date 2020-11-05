<template>
    <div class="__vev_calendar-wrapper">
        <div class="none-bg-10"></div>
        <div class="cal-wrapper">
            <div class="none-bg-1"></div>
            <div class="cal-body">
                <div class="weeks">
            <span
                    v-for="(dayName, dayIndex) in i18n[calendar.options.locale].dayNames"
                    class="item"
                    :key="dayIndex"
            >
          {{i18n[calendar.options.locale].dayNames[(dayIndex + calendar.options.weekStartOn) % 7]}}
        </span>
                </div>
                <div class="dates">
                    <div v-for="date in dayList" class="item"
                         :class="[{
            today: date.status ? (today === date.date) : false,
            event: date.status ? (date.downloadFile !== undefined) : false,
            [calendar.options.className] : (isSelectDay(date.date))
          }, ...date.customClass]"
                         :key="date.date"
                         @click="handleChangeCurday(date)"
                    >
                        <p class="date-num">
                            {{date.status ? (today === date.date ? '今天' : date.date.split('/')[2]) : '&nbsp;'}}</p>
                        <!--  <span v-if="date.status ? (today === date.date) : false" class="is-today" :style="{backgroundColor: customColor }" ></span>-->
                        <span v-if="date.status ? (date.downloadFile&&date.downloadFile.canDownload) : false"
                            class="is-event" >
                            <el-popover
                            placement="top-start"
                            @show="handleHover(date)"
                            trigger="hover">
                            <!-- <el-button slot="reference">hover 激活</el-button> -->
                                <div>
                                    总收入：{{popoverOption.depositAmt}}元  {{popoverOption.depositCnt}}笔
                                    <br>
                                    总支出： {{popoverOption.withdrawtAmt}}元  {{popoverOption.withdrawCnt}}笔
                                </div>
                                <el-button slot="reference" type="primary" @click="fileDownload(date.downloadFile.downUrl)">{{date.downloadFile.desc}}</el-button>
                            </el-popover>
                        </span>
                        <!-- <span v-if="date.status ? (date.downloadFile && (!date.downloadFile.canDownload) && date.downloadFile.status ===1) : false"
                              class="is-event"
                              ><el-button type="info" @click="fileDownload(date.downloadFile)">{{date.downloadFile.desc}}</el-button></span> -->
                        <span v-if="date.status ? (date.downloadFile && (!date.downloadFile.canDownload)) : false"
                              class="is-event"
                        ><el-button disabled  :type="getTagType(date.downloadFile.status)">{{date.downloadFile.desc}}</el-button></span>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="none-bg">
        </div> -->
    </div>
</template>

<script>
    const debug = false

    function dateTimeFormatter(date, format) {
        // 时间格式化辅助函数 date:毫秒数 format:'yyyy-MM-dd hh:mm:ss'
        if (!date || date === '') {
            return ''
        }

        if (typeof date === 'string') {
            var mts = date.match(/(\/Date\((\d+)\)\/)/)
            if (mts && mts.length >= 3) {
                date = parseInt(mts[2])
            }
        }

        date = new Date(date)
        if (!date || date.toUTCString() === 'Invalid Date') {
            return ''
        }

        var map = {
            'M': date.getMonth() + 1, // 月份
            'd': date.getDate(), // 日
            'h': date.getHours(), // 小时
            'm': date.getMinutes(), // 分
            's': date.getSeconds(), // 秒
            'q': Math.floor((date.getMonth() + 3) / 3), // 季度
            'S': date.getMilliseconds() // 毫秒
        }

        format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
            var v = map[t]
            if (v !== undefined) {
                if (all.length > 1) {
                    v = '0' + v
                    v = v.substr(v.length - 2)
                }
                return v
            } else if (t === 'y') {
                return (date.getFullYear() + '').substr(4 - all.length)
            }
            return all
        })

        return format
    }

    export default {
        components: {},
        data() {
            let dateObj = new Date()
            return {
                i18n: {
                    en: {
                        dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                        format: 'MM/yyyy',
                        fullFormat: 'dd/MM/yyyy',
                        dayEventsTitle: 'All Events',
                        notHaveEvents: 'Not Have Events'
                    },
                    zh: {
                        dayNames: ['日', '一', '二', '三', '四', '五', '六'],
                        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                        format: 'yyyy年MM月',
                        fullFormat: 'yyyy年MM月dd日',
                        dayEventsTitle: '全部事件',
                        notHaveEvents: '没有事件'
                    }
                },
                calendar: {
                    options: {
                        locale: 'zh', // en
                        color: ' #f29543',
                        className: 'selected-day',
                        weekStartOn: 0 // 0 mean sunday
                    },
                    params: {
                        curYear: dateObj.getFullYear(),
                        curMonth: dateObj.getMonth(),
                        curDate: dateObj.getDate(),
                        curEventsDate: 'all'
                    }
                },
                isActive: false,
                selectedDays: [],
                selectedDay: dateObj.getDate()
            }
        },
        props: {
            title: String,
            dialogOption: Object,
            popoverOption: Object
        },
        computed: {
            fileInfo() {
                debug && console.log('computed fileInfo')
                let fileInfo = this.dialogOption.fileInfo
                // console.log('lineInfo:' + JSON.stringify(lineInfo))
                return fileInfo
            },

            dayList() {
                debug && console.log('computed dayList')
                let d = this.dialogOption.currentMonth;
                if (d) {
                    this.calendar.params.curYear = d.getFullYear()
                    this.calendar.params.curMonth = d.getMonth()
                }

                let firstDay = new Date(this.calendar.params.curYear, this.calendar.params.curMonth, 1)
                let dayOfWeek = firstDay.getDay()
                // 根据当前日期计算偏移量 // Calculate the offset based on the current date
                if (this.calendar.options.weekStartOn > dayOfWeek) {
                    dayOfWeek = dayOfWeek - this.calendar.options.weekStartOn + 7
                } else {
                    dayOfWeek = dayOfWeek - this.calendar.options.weekStartOn
                }

                let startDate = new Date(firstDay)
                startDate.setDate(firstDay.getDate() - dayOfWeek)

                let item
                let status
                let tempArr = []
                let tempItem
                let fileInfo = this.fileInfo
                let k = 0;
                debug && console.log("fileInfo:" + fileInfo)
                for (let i = 0; i < 42; i++) {
                    item = new Date(startDate)
                    item.setDate(startDate.getDate() + i)
                    /*      let downloadFile = i % 2 === 0 ? {
                              canDownload: true,
                              status: "下载账单",
                              url: "http://www.baidu.com"
                          } : {canDownload: false, status: "未生成账单"}*/

                    if (this.calendar.params.curMonth === item.getMonth()) {
                        status = 1
                    } else {
                        status = 0
                    }
                    let downloadFile = null
                    if (status && fileInfo && fileInfo.length > k) {
                        downloadFile = fileInfo[k++]
                    }
                    tempItem = {
                        date: `${item.getFullYear()}/${item.getMonth() + 1}/${item.getDate()}`,
                        status: status,
                        customClass: []
                    }
                    if (downloadFile) {
                        tempItem.downloadFile = downloadFile
                    }
                    tempArr.push(tempItem)
                }
                debug && console.log('dayList:' + JSON.stringify(tempArr))
                return tempArr
            },
            today() {
                let dateObj = new Date()
                return `${dateObj.getFullYear()}/${dateObj.getMonth() + 1}/${dateObj.getDate()}`
            },
            curYearMonth() {
                let tempDate = Date.parse(new Date(`${this.calendar.params.curYear}/${this.calendar.params.curMonth + 1}/01`))
                return dateTimeFormatter(tempDate, this.i18n[this.calendar.options.locale].format)
            },
            curDate() {
                let tempDate = Date.parse(new Date(`${this.calendar.params.curYear}/${this.calendar.params.curMonth + 1}/01`))
                return tempDate
            },
            customColor() {
                return this.calendar.options.color
            },
            tickets() {
                return this.selectedDays.length
            },
            days() {
                return this.selectedDays.length
            }

        },
        created() {
            debug && console.log('DatePicker created ')
        },
        methods: {
            getTagType(s){
                if(s===0) return 'warning'
                else if(s===1) return 'info'
                else if(s===2) return ''
                else if(s===3) return ''
                else if(s===4) return 'info'
            },
            setDate(date) {
                this.calendar.params.curYear = date.getFullYear()
                this.calendar.params.curMonth = date.getMonth()
            },
            nextMonth() {
                if (this.calendar.params.curMonth < 11) {
                    this.calendar.params.curMonth++
                } else {
                    this.calendar.params.curYear++
                    this.calendar.params.curMonth = 0
                }
                this.$emit('month-changed', this.curYearMonth, this.curDate)
            },
            preMonth() {
                if (this.calendar.params.curMonth > 0) {
                    this.calendar.params.curMonth--
                } else {
                    this.calendar.params.curYear--
                    this.calendar.params.curMonth = 11
                }
                this.$emit('month-changed', this.curYearMonth, this.curDate)
            },
            isSelectDay(date) {
                let isSelected = false
                if (this.selectedDays.length > 0) {
                    this.selectedDays.forEach(function (t) {
                        if (t === date) {
                            isSelected = true
                        }
                    })
                }
                return isSelected
            },
            createDownload(item) {
                if (item.status === 1) {
                    this.$emit('create-download', item)
                }
            },
            handleHover(item) {
                // console.log(item)
                this.$emit('handle-hover', item.date)
            },
            fileDownload(item) {
                console.log(item)
                this.$emit('file-download', item)
            },
            handleChangeCurday(date) {
                /*if (date.status && date.downloadFile && date.downloadFile.remain > 0) {
                    let isSelected = false
                    let arrIndex = 0
                    if (this.selectedDays.length > 0) {
                        for (arrIndex = 0; arrIndex < this.selectedDays.length; arrIndex++) {
                            if (this.selectedDays[arrIndex] === date.date) {
                                isSelected = true
                                break
                            }
                        }
                    }
                    if (isSelected) {
                        this.selectedDays.splice(arrIndex, 1)
                    } else {
                        this.selectedDays.push(date.date)
                    }
                    console.log(JSON.stringify(this.selectedDays))
                    this.selectedDay = date.date
                    this.actualPrice = 0
                    this.ticketPrice = 0
                    if (this.selectedDays.length > 0) {
                        for (arrIndex = 0; arrIndex < this.selectedDays.length; arrIndex++) {
                            this.actualPrice += parseFloat(this.lineInfo[0].actualPrice)
                            this.ticketPrice += (this.lineInfo[0].ticketPrice ? parseFloat(this.lineInfo[0].ticketPrice) : 0)
                        }
                    }
                    this.isActive = this.selectedDays.length > 0
                    console.log('selectedDay:' + this.selectedDay)
                    this.$emit('cur-day-changed', this.selectedDays)
                }*/
            },
            /*            buyTickets() {
                            console.log('buyTickets selectedDay:' + this.selectedDay)
                            if (this.isActive && this.selectedDay.length > 0) {
                                let ret = {
                                    lineName: this.lineInfo[0].lineName,
                                    selectedDays: this.selectedDays,
                                    ticketPrice: this.getTicketPrice,
                                    actualPrice: this.getActualPrice,
                                    lineId: this.lineInfo[0].id
                                }
                                console.log(JSON.stringify(ret))
                                this.$emit('buy-tickets', ret)
                            }
                        },*/
            clear() {
                this.selectedDays = []
                this.selectedDay = null
                this.isActive = false
            }
        },
        watch: {}
    }
</script>

<style lang="less">
    @base-orange: #f29543;
    @white: #ffffff;
    @gray: #e0e0e0;
    @gray-dark: #b1b1b1;
    @large-padding: 0.41rem;
    @small-padding: 0.277rem;
    @date-margin: 7%;
    @buy-height: 1.6rem;
    @icon-border-size: 0.056rem;
    .__vev_calendar-wrapper {
        position: relative;
        overflow: hidden;
        background: #f2f2f2;
        width: 100%;
        * {
            box-sizing: border-box;
        }
        ::-webkit-scrollbar {
            width: 0.22rem;
            height: 0.22rem;
        }
        ::-webkit-scrollbar-track {
            box-shadow: inset 0 0 0.056rem rgba(0, 0, 0, .2);
            border-radius: 0.139rem;
        }
        ::-webkit-scrollbar-thumb {
            border-radius: 0.139rem;
            background: rgba(0, 0, 0, .2);
        }
        .none-bg-1 {
            background: #f2f2f2;
            height: 0.027rem;
        }
        .none-bg-10 {
            background: #f2f2f2;
            height: 0.277rem;
        }
        .none-bg {
            background: #f2f2f2;
            height: 2.77rem;
        }
        .lineInfo {
            position: relative;
            width: 90%;
            height: 1.94rem;
            top: 2%;
            left: 5%;
            right: 5%;
            .row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                .t1 {
                    text-align: center;
                    height: 0.66rem;
                    font-size: 0.44rem;
                    font-weight: bold;
                    color: #00a0e9;
                }
                .t2 {
                    line-height: 0.66rem;
                    font-size: 0.33rem;
                    height: 0.66rem;
                    padding-top: 0.027rem;
                    padding-left: 0.083rem;
                    padding-right: 0.083rem;
                    margin-left: 0.139rem;
                    margin-right: 0.139rem;
                    margin-bottom: 0.139rem;
                    text-align: center;
                    width: 1.38rem;
                    border-radius: 0.277rem;
                    color: #00a0e9;
                    background: #d9f0ff;
                    border-color: #00a0e9;
                    border: 0.027rem solid;
                }
                .t3 {
                    font-weight: bold;
                    font-size: 0.44rem;
                    float: right;
                    color: #0079c5;
                }
                .t4 {
                    font-weight: bold;
                    font-size: 0.44rem;
                    color: #303033;
                }
                .t5 {
                    color: #a2a2a2;
                    text-align: center;
                    font-size: 0.33rem;
                    line-height: 0.66rem;
                    height: 0.66rem;
                }
                .arrow-img {
                    margin-left: 0.277rem;
                    margin-right: 0.277rem;
                    width: 0.83rem;
                    height: 0.277rem;
                }
            }
        }
        .cal-wrapper {
            .title1 {
                color: #303030;
                font-weight: bold;
                position: relative;
                font-size: 0.49rem;
                width: 100%;
                text-align: center;
            }
            .cal-header {
                position: relative;
                width: 100%;
                background-color: @white;
                // box-shadow: 0 0.167rem 0.139rem rgba(0,0,0,.1);
                font-weight: 500;
                overflow: hidden;
                padding-bottom: 0px;
                & > div {
                    float: left;
                    line-height: 0.277rem;
                    padding: @large-padding;
                }
                .title {
                    margin-top: 0.167rem;
                    font-size: 0.49rem;
                    width: 60%;
                    text-align: center;
                }
                .l {
                    text-align: left;
                    width: 20%;
                    cursor: pointer;
                    user-select: none;
                    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                }
                .r {
                    text-align: right;
                    width: 20%;
                    cursor: pointer;
                    user-select: none;
                    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                }
            }
            .cal-body {
                width: 100%;
                .weeks {
                    width: 100%-2*@date-margin;
                    overflow: hidden;
                    text-align: center;
                    font-size: 0.99rem;
                    margin-left: @date-margin;
                    margin-right: @date-margin;
                    .item {
                        line-height: 1.38rem;
                        float: left;
                        width: (100%)/7;
                    }
                }
                .dates {
                    width: 100%-2*@date-margin;
                    overflow: hidden;
                    text-align: center;
                    font-size: 0.99rem;
                    margin-left: @date-margin;
                    margin-right: @date-margin;
                    .item {
                        position: relative;
                        float: left;
                        display: block;
                        width: (100%)/7;
                        cursor: default;
                        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                        .date-num {
                            border-color: #f0f0f0;
                            border-style: solid;
                            border-width: 1px;
                            padding-top: 10%;
                            font-size: 1rem;
                            position: relative;
                            width: 100%;
                            padding-bottom: 90%; /* padding百分比相对父元素宽度计算 */
                            height: 0; //避免被内容撑开多余的高度
                            z-index: 3;
                        }
                        &.event {
                            cursor: pointer;
                            .is-event {
                                color: #000000;
                            }
                            .date-num {
                                color: #000000;
                            }
                        }
                        &.selected-day {
                            .is-event {
                                margin-top: 0.22rem;
                                color: #fff;
                            }
                            .date-num {
                                border-radius: 50%;
                                color: #fff;
                                background: #000000;
                            }
                        }
                        .is-event {
                            font-size: 0.33rem;
                            content: '';
                            width: 100%;
                            height: 100%;
                            position: absolute;
                            left: 0%;
                            top: 40%;
                            z-index: 4;
                            // margin-left: -0.49rem;
                            margin-top: 0.277rem;
                        }
                        .is-today {
                            content: '';
                            background-color: @base-orange;
                            border-radius: 50%;
                            opacity: .8;
                            width: 0.33rem;
                            height: 0.11rem;
                            position: absolute;
                            left: 50%;
                            top: 50%;
                            z-index: 2;
                            margin-left: -0.167rem;
                            margin-top: 0.22rem;
                        }
                    }
                }
            }
        }
        .events-wrapper {
            border-radius: 0.277rem;
            .cal-events {
                height: 95%;
                overflow-y: auto;
                padding: 0 0.139rem;
                margin: 0.41rem 0;
            }
            .date {
                max-width: 60%;
                min-width: 5.55rem;
                text-align: center;
                color: @white;
                background-color: rgba(0, 0, 0, 0.2);
                border-radius: 0.56rem;
                margin: 0 auto;
                font-size: 0.61rem;
            }
            .event-item {
                padding: 0.139rem 0.56rem;
                margin-top: 0.41rem;
                box-shadow: 0 0.083rem 0.30rem 0.056rem rgba(0, 0, 0, .1);
                background-color: #fff;
                border-radius: 0.139rem;
                color: #323232;
                position: relative;
                &:first-child {
                    margin-top: 0;
                }
                .title {
                    height: 1.11rem;
                    line-height: 1.11rem;
                    color: #323232;
                    font-size: 0.44rem;
                    border-bottom: 0.027rem solid #f2f2f2;
                }
                .time {
                    position: absolute;
                    right: 0.83rem;
                    top: 0.47rem;
                    color: #9b9b9b;
                    font-size: 0.38rem;
                }
                .desc {
                    color: #9b9b9b;
                    font-size: 0.38rem;
                    padding: 0.19rem 0;
                }
            }
        }
        .arrow-box-l {
            position: absolute;
            left: 8%;
            width: 0.83rem;
            height: 0.83rem;
            border-radius: 50%;
            border: 0.056rem solid;
            border-color: #00A0E9;
        }
        .arrow-box-r {
            position: absolute;
            right: 8%;
            width: 0.83rem;
            height: 0.83rem;
            border-radius: 50%;
            border: 0.056rem solid;
            border-color: #00A0E9;
        }
        .arrow-left.icon {
            color: #00A0E9;
            position: absolute;
            left: 35%;
            margin-top: 0.33rem;
        }
        .arrow-left.icon:before {
            content: '';
            position: absolute;
            left: 0.027rem;
            top: -0.139rem;
            width: 0.277rem;
            height: 0.277rem;
            border-top: solid @icon-border-size currentColor;
            border-right: solid @icon-border-size currentColor;
            -webkit-transform: rotate(-135deg);
            transform: rotate(-135deg);
        }
        .arrow-right.icon {
            position: absolute;
            right: 35%;
            color: #00A0E9;
            margin-top: 0.33rem;
        }
        .arrow-right.icon:before {
            content: '';
            position: absolute;
            right: 0.027rem;
            top: -0.139rem;
            width: 0.277rem;
            height: 0.277rem;
            border-top: solid @icon-border-size currentColor;
            border-right: solid @icon-border-size currentColor;
            -webkit-transform: rotate(45deg);
            transform: rotate(45deg);
        }
        h3, p {
            margin: 0;
            padding: 0;
        }
        .buy {
            display: flex;
            position: fixed;
            left: 0;
            bottom: 0;
            right: 0;
            background: #fff;
            height: @buy-height;
            border-radius: 0px;
            z-index: 50001;
            .text1 {
                position: fixed;
                left: 5%;
                bottom: 0.277rem;
                color: #00a0e9;
                font-size: 0.49rem;
            }
            .text2 {
                position: fixed;
                left: 25%;
                bottom: 0.277rem;
                color: #a2a2a2;
                text-decoration: line-through;
                font-size: 0.38rem;
            }
            .text3 {
                position: fixed;
                left: 40%;
                bottom: 0.277rem;
                color: #a2a2a2;
                font-size: 0.38rem;
            }
            .btn {
                position: relative;
                bottom: 0.27rem;
                top: @buy-height*0.15;
                left: 70%;
                width: 25%;
                height: @buy-height*0.7;
                border-radius: 0.83rem;
                background: #0079c5;
                color: #fff;
                text-align: center;
                line-height: @buy-height*0.7;
                font-size: 0.61rem;
            }
            .btn-disable {
                position: relative;
                bottom: 0.27rem;
                top: @buy-height*0.15;
                left: 70%;
                width: 25%;
                height: @buy-height*0.7;
                border-radius: 0.83rem;
                background: #92CDF2;
                color: #fff;
                text-align: center;
                line-height: @buy-height*0.7;
                font-size: 0.61rem;
            }
        }
    }
</style>
