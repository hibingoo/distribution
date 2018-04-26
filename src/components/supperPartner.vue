<template>
  <div class="supperPartner">
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
        <!-- <div class="inputDate">
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
        </div> -->
        <div class="wrapper">
          <table class="table-border">
            <colgroup>
            </colgroup>
            <thead class="table-head">
              <tr class="tr">
                <th class="th" @click.stop="SortNumber(item.clickTimes,item.sort,$index)" v-for="(item,$index) in listHeader">
                  <span class="text">{{item.name}}</span>
                  <span class="direction" v-show="item.isSort" :class="{'top':item.clickTimes%3==1,'bottom':item.clickTimes%3==2}">
                    <i class="sort-caret ascending"></i>
                    <i class="sort-caret descending"></i>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody class="table-body" v-show="!noData">
              <tr class="tr" v-for="tabledata in list">
                <!-- <td>{{tabledata.created|capitalize}}</td> -->
                <td class="bossTips">
                  <div class="bossName" v-if="tabledata.name!=null">{{tabledata.name}}</div>
                  <div class="bossNum">{{tabledata.account}}</div>
                  <div class="bossCall">
                    <a :href='"tel:"+ tabledata.account'>呼叫</a>
                  </div>
                </td>
                <td :class="{ 'activeColor-a': tabledata.trans_key==1, 'activeColor-b': tabledata.trans_key==2}" v-text="tabledata.trans_key==1?'有效':'待转化'"></td>
                <td>{{tabledata.second_count}}</td>
                <td>{{tabledata.second_percent}}</td>
                <td>{{tabledata.task_count}}</td>
                <td >{{tabledata.percent}}</td>
              </tr>
            </tbody>
          </table>
          <div class="iconlazy" v-show="circle" style="width:100vw;text-align:center;">
              <span class="iconfont Loadicon" :class="{circle:circle}">&#xe666;</span>
              <div class="LoadText">正在加载</div>
          </div>
          <div class="iconlazy" v-show="noData">
            没有更多数据
          </div>
          <div class="LoadMore" @click.stop="PageLoading()" v-show="loadMore">点击加载更多</div>
        </div>
      </div>
      <mt-datetime-picker ref="picker" type="date" v-model="pickerValue" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日"
        :startDate="nowData" @confirm="handleConfirm" @cancel="handleCancel">
      </mt-datetime-picker>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { DatetimePicker, MessageBox, Header } from "mint-ui";
import { API_ROOT } from "../api/config";
import nvLoading from "@/common/loading.vue";
import formatDate from "../config/formatDate";
import BScroll from "better-scroll";
export default {
  name: "supperPartner",
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
        effective: false,
        bossTotal: false,
        bossPercent: false,
        disciplePercent: false
      },
      desc: "asc",
      list: [],
      page: 2,
      loadMore: false,
      title: {
        converted: "",
        pre_convert: ""
      },
      loading: false,
      circle: true,
      noData: false,
      listHeader: [
        // {
        //   name: "收徒日期",
        //   isSort: false,
        //   clickTimes: 0,
        //   order: "",
        //   sort: ""
        // },
        {
          name: "代理",
          isSort: false,
          clickTimes: 0,
          order: "",
          sort: ""
        },
        {
          name: "状态",
          isSort: true,
          clickTimes: 0,
          order: "asc",
          sort: "trans_key"
        },
        {
          name: "老板总数",
          isSort: true,
          clickTimes: 0,
          order: "asc",
          sort: "second_count"
        },
        {
          name: "有效老板率",
          isSort: true,
          clickTimes: 0,
          order: "asc",
          sort: "second_percent"
        },
        {
          name: "有效徒弟",
          isSort: true,
          clickTimes: 0,
          order: "asc",
          sort: "task_count"
        },
        {
          name: "有效徒弟率",
          isSort: true,
          clickTimes: 0,
          order: "asc",
          sort: "percent"
        }
      ]
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
  beforeDestroy: {
  },
  methods: {
    //初始化页面数据
    InitializationData(type, order, begin, end, page) {
      sessionStorage.removeItem("index")
      this.loadMore = false;
      this.list = [];
      this.noData = false;
      this.circle = true;
      let token = sessionStorage.getItem("token");
      let url = API_ROOT + "/pupil/superPupil";
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
            _this.loadMore = true;
            _this.circle = false;
          } else if (rs.code === 4002) {
          } else if (rs && rs.code === 4008) {
            _this.circle = false;
            _this.noData = true;
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    SortNumber(clickTimes, sort, index) {
      sessionStorage.setItem("index", index);
      switch (index) {
        case 1:
          this.styleTransform(this.listHeader[index].clickTimes++, sort,index);
          this.clickTimesInit(index);
          break;
        case 2:
          this.styleTransform(this.listHeader[index].clickTimes++, sort,index);
          this.clickTimesInit(index);
          break;
        case 3:
          this.styleTransform(this.listHeader[index].clickTimes++, sort,index);
          this.clickTimesInit(index);
          break;
        case 4:
          this.styleTransform(this.listHeader[index].clickTimes++, sort,index);
          this.clickTimesInit(index);
          break;
        case 5:
          this.styleTransform(this.listHeader[index].clickTimes++, sort,index);
          this.clickTimesInit(index);
          break;
        default:
          break;
      }
    },
    clickTimesInit(index) {
      for (var i = 0; i < this.listHeader.length; i++) {
        if (i == index) {
        } else {
          this.listHeader[i].clickTimes = 0;
          this.listHeader[i].order = "asc";
        }
      }
    },
    styleTransform(clickTimes, sort,index) {
      let value = clickTimes % 3;
      switch (value) {
        case 0:
          this.listHeader[index].order = "asc";
          this.clickSort(sort, "asc");
          this.page = 2;
          break;
        case 1:
          this.listHeader[index].order = "desc";
          this.clickSort(sort, "desc");
          this.page = 2;
          break;
        case 2:
         sessionStorage.removeItem("index")
          this.clickSort();
          break;
        default:
          break;
      }
    },
    //排序请求数据的方法
    clickSort(sort, order) {
      this.loadMore = false;
      this.list = [];
      this.noData = false;
      this.circle = true;
      let token = sessionStorage.getItem("token");
      let url = API_ROOT + "/pupil/superPupil";
      let _this = this;
      axios({
        method: "GET",
        url: url,
        params: {
          token: token,
          order: order,
          sort: sort
        }
      })
        .then(function(res) {
          let rs = res.data;
          if (rs && rs.code === 1001) {
            _this.list = rs.data.list;
            _this.loading = false;
            _this.circle = false;
            _this.loadMore = true;
          } else if (rs.code === 4002) {
          } else if (rs && rs.code === 4008) {
            _this.circle = false;
            _this.noData = true;
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    //获取有效数
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
      let index = sessionStorage.getItem("index");
      if (index) {
        let order = this.listHeader[index].order;
        let sort = this.listHeader[index].sort;
        this.loadMoreData(this.page++, sort, order);
      } else {
        this.loadMoreData(this.page++);
      }
    },
    //加载更多
    loadMoreData(page, sort, order) {
      this.loadMore = false;
      this.noData = false;
      this.circle = true;
      let token = sessionStorage.getItem("token");
      let url = API_ROOT + "/pupil/superPupil";
      let _this = this;
      axios({
        method: "GET",
        url: url,
        params: {
          token: token,
          page: page,
          sort: sort,
          order,order
        }
      })
        .then(function(res) {
          let rs = res.data;
          if (rs && rs.code === 1001) {
            _this.list = _this.list.concat(rs.data.list);
            _this.circle = false;
          } else if (rs.code === 4002) {
          } else if (rs && rs.code === 4008) {
            _this.circle = false;
            _this.noData = false;
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    formatTime() {
      return formatDate(new Date(), "yyyy-MM-dd");
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
.top .ascending {
  border-bottom-color: #e51215 !important;
}
.bottom .descending {
  border-top-color: #2ac857 !important;
}
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

.supperPartner {
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
    .wrapper {
      width: 7.5rem;
      overflow-x: scroll;
      overflow-y: scroll;
      margin-bottom: 0.5rem;
      &::-webkit-scrollbar {
        display: none;
      }
      .table-border {
        width: 11rem;
        border-spacing: 0;
        border-collapse: collapse;
        .table-head {
          background-color: #eee;
          tr {
            display: table-row;
            th {
              border: 1px solid #ddd;
              text-align: center;
              height: 0.9rem;
              line-height: 0.9rem;
              display: table-cell;
              &:last-child {
                border-right: 0;
              }
              &:first-child {
                border-left: 0;
              }
              .text {
                font-size: 0.24rem;
                color: #666;
              }
              .direction {
                display: inline-flex;
                display: -webkit-inline-flex;
                align-items: center;
                height: 0.9rem;
                width: 0.48rem;
                vertical-align: middle;
                cursor: pointer;
                overflow: initial;
                position: relative;
                .sort-caret {
                  width: 0;
                  height: 0;
                  border: 0.1rem solid transparent;
                  position: absolute;
                  left: 0.14rem;
                }
                .ascending {
                  border-bottom-color: #c0c4cc;
                  top: 0.21rem;
                }
                .descending {
                  border-top-color: #c0c4cc;
                  bottom: 0.25rem;
                }
              }
            }
          }
        }
        .table-body {
          tr {
            td {
              border: 1px solid #ddd;
              text-align: center;
              height: 1rem; // line-height: 1.5rem;
              display: table-cell;
              &:last-child {
                border-right: 0;
              }
              &:first-child {
                border-left: 0;
              }
              .bossCall {
                a {
                  color: #d53c3e;
                  text-decoration: underline;
                }
              }
            }
            .activeColor-a {
              color: #2ac857;
            }
            .activeColor-b {
              color: #d53c3e;
            }
          }
          .iconlazy {
            margin-top: 10rem;
            text-align: center;
            .Loadicon {
              font-size: 0.3rem !important;
            }
          }
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
</style>
