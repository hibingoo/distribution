<template>
  <div class="mechanism">
    <mt-header title="">
      <router-link to="/homePage" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div v-show="supperPartner">
      1
    </div>
    <div v-show="bosslist">
      2
    </div>
    <div v-show="disciplePartner">
      3
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { API_ROOT } from "../api/config";
import { Header } from "mint-ui";
export default {
  name: "mechanism",
  data() {
    return {
      supperPartner: false,
      bosslist: false,
      disciplePartner: false
    };
  },
  components: {},
  created() {},
  mounted() {
    this.AuthorityControl();
  },
  methods: {
    AuthorityControl() {
      let level = parseInt(sessionStorage.getItem("level"));
      switch (level) {
        case 1:
          this.supperPartner = true;
          break;
        case 2:
          this.bosslist = true;
          break;
        case 3:
          this.disciplePartner = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>
<style scoped lang="less">
.mint-header {
  background-color: #fff;
}

.mintui-back:before {
  color: #000 !important;
}

.mechanism {
  width: 100%;
  height: 100%;
  .mechanismImg {
    width: 90%;
    margin: 3rem auto;
  }
  .img {
    display: table-cell;
  }
}
</style>
