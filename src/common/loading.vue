<template>
    <div class="loading" v-show="loading" >
    	<div class="indicator" style="">
            <div class="indicator-wrapper" style="padding: 10px;">
                <span class="indicator-spin">
                    <div class="spinner-snake" style="border-top-color: #fff; border-left-color: #fff; border-bottom-color: #fff; height: 32px; width: 32px;">
                    </div>
                </span>
                <span class="indicator-text" style="">加载中...</span>
            </div>
            <div class="indicator-mask"></div>
        </div>
    </div>
</template>
<script>
export default {
  replace: true,
  data() {
    return {};
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  mounted() {},
  methods: {}
};
</script>
<style  lang="less" scoped>
.indicator {
  transition: opacity 0.2s linear;
}
.indicator-wrapper {
  top: 50%;
  left: 50%;
  position: fixed;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.65);
  color: white;
  box-sizing: border-box;
  text-align: center;
  width: 120px;
  height: 120px;
}
.indicator-spin {
  display: inline-block;
  text-align: center;
  margin: 25px auto 0;
}
.indicator-text {
  display: block;
  color: #fff;
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
  word-break: break-all;
  word-wrap: break-word;
  white-space: normal;
}

@-webkit-keyframes spinner-rotate {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.spinner-snake {
  -webkit-animation: spinner-rotate 0.8s infinite linear;
  animation: spinner-rotate 0.8s infinite linear;
  border: 4px solid transparent;
  border-radius: 50%;
}
.indicator-mask {
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  opacity: 0;
  background: transparent;
}
</style>
