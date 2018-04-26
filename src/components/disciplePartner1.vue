<template>
  <div class="disciplePartner">
    <nv-loading :loading="loading"></nv-loading>
    <div v-show="!loading">
      <mt-header title="">
        <router-link to="/homePage" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>
      </mt-header>
      <div class="tip">
        <p>什么是有效？完成任意四项新人任务</p>
        <p>什么是待转化？未完成任意四项新人任务</p>
      </div>
      <div class="total">
        <ul class="clear">
          <li class="left">
            <span>有效数</span>
            <span v-text="title.converted"></span>
          </li>
          <li class="left">
            <span>待转化</span>
            <span v-text="title.pre_convert"></span>
          </li>
        </ul>
      </div>
      <div class="spacer"></div>
      <div class="table">
        <div class="inputDate">
          <div class="date">日期：</div>
          <div class="input" @click="openPicker('start')">
            <span>{{startTime}}</span>
            <span class="iconfont" :class="{rotate:transform.dateStart}">&#xe6a6;</span>
          </div>
          <div class="minus">&minus;</div>
          <div class="input" @click="openPicker('end')">
            <span>{{endTime}}</span>
            <span class="iconfont" :class="{rotate:transform.dateEnd}">&#xe6a6;</span>
          </div>
          <div class="btn" @click.stop="InitializationData(null,null,startTime,endTime,null)">
            <button class="screen">筛选</button>
          </div>
        </div>
        <div class="tableData">
          <div class="tablehead">
            <div class="date ">收徒日期</div>
            <div class="agent ">代理</div>
            <div class="state">
              <span class="stateText">状态</span>
              <!-- <span class="iconfont stateicon" :class="{rotate:transform.state}">&#xe632;</span> -->
            </div>
            <div class="disciple">
              <span class="discipleText ">徒孙总数</span>
              <!-- <span class="iconfont discipleicon" :class="{rotate:transform.disciple}">&#xe633;</span> -->
            </div>
            <div class="effective" @click.stop="InitializationData('effective',desc,null,null,null)">
              <span class="effectiveText">有效
                <br>徒孙率</span>
              <span class="iconfont effectiveicon" :class="{rotate:transform.effective}">&#xe632;</span>
            </div>
          </div>
          <div v-show="!noData">
            <div class="tablebody" v-show="!circle">
              <div class="tableList" v-for="tabledata in list">
                <div class="time">
                  <div class="timechild">{{tabledata.created}}</div>
                </div>
                <div class="bossTips">
                  <span class="bossName" v-if="tabledata.name!=null">{{tabledata.name}}</span>
                  <span class="bossNum">{{tabledata.account}}</span>
                  <span class="bossCall" @click="callNumber(tabledata.account)">
                    <a>呼叫</a>
                  </span>
                </div>
                <div class="activeColor" :class="{ 'activeColor-a': tabledata.trans_key==1, 'activeColor-b': tabledata.trans_key==2}" v-text="tabledata.trans_key==1?'有效':'待转化'">
                </div>
                <div class="disciple">
                  {{tabledata.invite_count}}
                </div>
                <div class="effective">
                  {{tabledata.percent}}
                </div>
              </div>
              <div class="LoadMore" @click.stop="PageLoading()" v-show="loadMore">点击加载更多</div>
            </div>
            <div class="iconlazy" v-show="circle">
              <span class="iconfont Loadicon" :class="{circle:circle}">&#xe666;</span>
              <div class="LoadText">正在加载</div>
            </div>
          </div>
          <div class="iconlazy" v-show="noData">
            没有更多数据
          </div>
        </div>
      </div>
      <mt-datetime-picker ref="picker" type="date" v-model="pickerValue" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日"
        @confirm="handleConfirm" :startDate="nowData" @cancel="handleCancel">
      </mt-datetime-picker>
    </div>

  </div>
</template>
<script>
import axios from "axios";
import { DatetimePicker, MessageBox, Header } from "mint-ui";
import formatDate from "../config/formatDate";
import nvLoading from "@/common/loading.vue";
import { API_ROOT } from "../api/config";
export default {
  name: "disciplePartner",
  data() {
    return {
      startTime: "",
      endTime: "",
      nowData: new Date("Jan 1, 2018 23:30:00"),
      pickerValue: "",
      type: "",
      transform: {
        dateStart: false,
        dateEnd: false,
        state: false,
        disciple: false,
        effective: false
      },
      desc: "asc",
      list: [],
      page: 2,
      loadMore: true,
      title: {
        converted: "",
        pre_convert: ""
      },
      loading: false,
      circle: true,
      noData: false
    };
  },
  mounted() {
    this.getPupilCount();
    this.InitializationData();
    this.startTime = this.formatTime();
    this.endTime = this.formatTime();
  },
  components: {
    DatetimePicker,
    MessageBox,
    Header,
    nvLoading
  },
  methods: {
    //初始化页面数据
    InitializationData(type, order, begin, end, page) {
      this.noData = false;
      this.circle = true;
      let token = sessionStorage.getItem("token");
      let url = API_ROOT + "/pupil/pupilInvite";
      this.change(type);
      let _this = this;
      axios({
        method: "GET",
        url: url,
        params: {
          token: token,
          order: order,
          begin: begin,
          end: end,
          page: page
        }
      })
        .then(function(res) {
          let rs = res.data;
          if (rs && rs.code === 1001) {
            if (page) {
              _this.list = _this.list.concat(rs.data.list);
            } else {
              _this.list = rs.data.list;
            }
            _this.loading = false;
            _this.circle = false;
          } else if (rs.code === 4002) {
          } else if (rs && rs.code === 4008) {
            _this.noData = true;
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    //初始化页面数据
    getPupilCount() {
      let token = sessionStorage.getItem("token");
      let url = API_ROOT + "/pupil/getPupilCount";
      let _this = this;
      axios({
        method: "GET",
        url: url,
        params: {
          token: token
        }
      })
        .then(function(res) {
          let rs = res.data;
          if (rs && rs.code === 1001) {
            _this.title.converted = rs.data.converted;
            _this.title.pre_convert = rs.data.pre_convert;
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    PageLoading() {
      this.InitializationData(null, this.desc, null, null, this.page++);
    },
    callNumber(data) {
      MessageBox("拨打电话", data);
    },
    formatTime() {
      return formatDate(new Date(), "yyyy-MM-dd");
    },
    change(type) {
      if (type == "state") {
        this.transform.state = !this.transform.state;
        this.desc = !this.transform.state ? "asc" : "desc";
      }
      if (type == "disciple") {
        this.transform.disciple = !this.transform.disciple;
        this.desc = !this.transform.disciple ? "asc" : "desc";
      }
      if (type == "effective") {
        this.transform.effective = !this.transform.effective;
        this.desc = !this.transform.effective ? "asc" : "desc";
      }
    },
    openPicker(type) {
      this.type = type;
      if (type == "start") {
        this.transform.dateStart = true;
      }
      if (type == "end") {
        this.transform.dateEnd = true;
      }
      this.$refs.picker.open();
    },
    handleCancel() {
      if (this.type == "start") {
        this.transform.dateStart = false;
      }
      if (this.type == "end") {
        this.transform.dateEnd = false;
      }
    },
    handleConfirm(data) {
      let date = formatDate(data, "yyyy-MM-dd");
      if (this.type == "start") {
        this.startTime = date;
        this.transform.dateStart = false;
      }
      if (this.type == "end") {
        this.endTime = date;
        this.transform.dateEnd = false;
      }
    }
  }
};
</script>
<style>
.circle {
  display: inline-block;
  animation: circle 1s infinite linear;
  -webkit-animation: circle 1s infinite linear;
}

@-webkit-keyframes circle {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes circle {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.mint-datetime-cancel {
  background-color: #eeeeee !important;
  color: #666666 !important;
}

.mint-datetime-confirm {
  background-color: #d53c3e !important;
  color: #fff !important;
}

.mint-header {
  background-color: #fff !important;
}

.mintui-back:before {
  color: #000 !important;
}
</style>
<style lang="less" scoped>
.rotate {
  display: inline-block;
  transform-origin: center center; //旋转中心要是正中间 才行
  transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  transition: transform 0.2s; //过度时间 可调
  -moz-transition: -moz-transform 0.2s;
  -moz-transition: -moz-transform 0.2s;
  -o-transition: -o-transform 0.2s;
  -ms-transition: -ms-transform 0.2s;
}

.rotate1 {
  display: inline-block;
  transform-origin: center center;
  transform: rotate(0deg);
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(deg);
  -ms-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transition: transform 0.2s;
  -moz-transition: -moz-transform 0.2s;
  -moz-transition: -moz-transform 0.2s;
  -o-transition: -o-transform 0.2s;
  -ms-transition: -ms-transform 0.2s;
}

.disciplePartner {
  .tip {
    font-size: 0.26rem;
    background: #fff8da;
    color: #666;
    text-align: center;
    display: block;
    line-height: 0.4rem;
    padding: 0.1rem 0;
  }
  .total {
    height: 1.6rem;
    ul li {
      width: 50%;
      text-align: center;
      &:first-child {
        position: relative;
        &:after {
          content: "";
          height: 1rem;
          width: 1px;
          display: block;
          position: absolute;
          top: 0.3rem;
          right: 0;
          background: #e8e8e8;
        }
      }
      span {
        color: #333;
        font-size: 0.48rem;
        &:first-child {
          line-height: 0.85rem;
          font-size: 0.3rem;
          display: block;
          color: #666;
        }
      }
    }
  }
  .table {
    .inputDate {
      height: 1.06rem;
      width: 100%;
      padding: 0 0.3rem;
      display: flex;
      display: -webkit-inline-box;
      flex-flow: row nowrap;
      justify-content: space-between;
      border-bottom: 1px solid #ccc;
      .date {
        font-size: 0.3rem;
        line-height: 1.06rem;
      }
      .minus {
        font-size: 0.3rem;
        line-height: 1.06rem;
      }
      .input {
        margin-top: 0.25rem;
        width: 2.2rem;
        height: 0.56rem;
        font-size: 0.3rem;
        line-height: 0.56rem;
        border: 1px solid #ccc;
        border-radius: 0.1rem;
        text-align: left;
        padding-left: 0.05rem;
      }
      .btn {
        height: 0.56rem;
        width: 1.2rem;
        margin-top: 0.25rem;
        margin-left: 0.2rem;
        .screen {
          width: 100%;
          height: 100%;
          background-color: #d53c3e;
          color: #fff;
          border-radius: 0.1rem;
          font-size: 0.3rem;
          border: 0;
          outline: none;
        }
        &:active {
          transform: scale(0.98);
        }
      }
    }
    .tableData {
      .tablehead {
        display: flex;
        display: -webkit-flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        border-bottom: 0.01rem solid #ccc;
        .date {
          text-align: center;
          font-size: 0.24rem;
          font-weight: 700;
          color: #666;
          height: 0.9rem;
          width: 1.2rem;
          line-height: 0.9rem;
          border-right: 0.01rem solid #ccc;
        }
        .agent {
          font-size: 0.24rem;
          font-weight: 700;
          color: #666;
          height: 0.9rem;
          width: 2.13rem;
          line-height: 0.9rem;
          border-right: 0.01rem solid #ccc;
        }
        .state {
          font-size: 0.24rem;
          font-weight: 700;
          color: #666;
          height: 0.9rem;
          width: 1.37rem;
          line-height: 0.9rem;
          border-right: 0.01rem solid #ccc;
          .stateText {
            font-weight: 700;
            font-size: 0.24rem;
            color: #666;
          }
          .stateicon {
            font-weight: 700;
            font-size: 0.24rem;
            color: #e51215;
          }
        }
        .disciple {
          height: 0.9rem;
          width: 1.37rem;
          line-height: 0.9rem;
          border-right: 0.01rem solid #ccc;
          .discipleText {
            font-weight: 700;
            font-size: 0.24rem;
            color: #666;
          }
          .discipleicon {
            font-weight: 700;
            font-size: 0.24rem;
            color: #2ac857;
          }
        }
        .effective {
          height: 0.9rem;
          width: 1.37rem;
          display: -webkit-inline-flex;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          .effectiveText {
            font-size: 0.24rem;
            font-weight: 700;
            color: #666;
          }
          .effectiveicon {
            font-weight: 700;
            font-size: 0.24rem;
            color: #2ac857;
          }
        }
      }
      .iconlazy {
        margin-top: 0.3rem;
        .Loadicon {
          font-size: 0.3rem !important;
        }
      }
      .tablebody {
        .tableList {
          display: flex;
          display: -webkit-flex;
          flex-wrap: nowrap;
          justify-content: space-between;
          border-bottom: 0.01rem solid #ccc;
          .time {
            text-align: center;
            font-size: 0.24rem;
            color: #333333;
            height: 1.38rem;
            width: 1.2rem;
            border-right: 0.01rem solid #ccc;
            display: table;
            .timechild {
              vertical-align: middle;
              display: table-cell;
            }
          }
          .bossTips {
            font-size: 0.24rem;
            color: #333333;
            height: 1.38rem;
            width: 2.13rem;
            border-right: 0.01rem solid #ccc;
            display: -webkit-inline-flex;
            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            .bossName {
            }
            .bossNum {
            }
            .bossCall {
              a {
                color: #d53c3e;
                text-decoration: underline;
              }
            }
          }
          .activeColor {
            width: 1.37rem;
            height: 1.38rem;
            font-size: 0.24rem;
            line-height: 1.38rem;
            border-right: 0.01rem solid #ccc;
          }
          .activeColor-a {
            color: #2ac857;
          }
          .activeColor-b {
            color: #d53c3e;
          }
          .disciple {
            width: 1.37rem;
            height: 1.38rem;
            font-size: 0.24rem;
            color: #333333;
            line-height: 1.38rem;
            border-right: 0.01rem solid #ccc;
          }
          .effective {
            width: 1.37rem;
            height: 1.38rem;
            font-size: 0.24rem;
            color: #333333;
            line-height: 1.38rem;
          }
        }
      }
      .LoadMore {
        width: 2.2rem;
        height: 0.64rem;
        background-color: #fff8da;
        color: #999;
        font-size: 0.28rem;
        line-height: 0.64rem;
        text-align: center;
        border-radius: 0.1rem;
        margin: 0.1rem auto;
      }
    }
  }
}
</style>
