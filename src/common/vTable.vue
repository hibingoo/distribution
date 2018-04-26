<template>
  <div class="vTable">
    <table class="table-border">
      <thead class="table-head">
        <tr class="tr" v-for="item in listHeader">
          <th class="th" :style="{width:width+'rem',height:height+'rem'}">
            <span class="text">{{item.title}}</span>
            <span class="direction">
              <i class="sort-caret ascending"></i>
              <i class="sort-caret descending"></i>
            </span>
          </th>
        </tr>
      </thead>
      <tbody class="table-body">
        <tr class="tr">
          <th>2</th>
          <th>3</th>
          <th>1</th>
          <th>1</th>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    width: {
      type: String,
      default: ""
    },
    height: {
      type: String,
      default: ""
    },
    listHeader:{
      type: Object,
      default: ''
    }
  },
  components: {},
  mounted() {},
  methods: {
    handleConfirm() {},
    handleCancel() {}
  }
};
</script>
<style lang="less" scoped>
.vTable {
  .table-border {
    width: 100%;
    max-width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
    .table-head {
      tr {
        th {
          border: 1px solid #ddd;
          text-align: center;
          height: 0.9rem;
          line-height: 0.9rem;
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
              top: 0.2rem;
            }
            .descending {
              border-top-color: #c0c4cc;
              bottom: 0.24rem;
            }
          }
        }
      }
    }
    .table-body {
      tr {
        th {
          border: 1px solid #ddd;
          &:last-child {
            border-right: 0;
          }
          &:first-child {
            border-left: 0;
          }
        }
      }
    }
  }
}
</style>
