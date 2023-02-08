<template>
  <div class="pagenation" v-if="nav">
    <div class="prev-btn" v-on:click="movePage(1)" v-if="nav.startNav != 1">
      <v-icon>mdi-chevron-double-left</v-icon>
    </div>
    <div
      v-on:click="movePage(nav.startNav - 1)"
      class="prev-btn"
      v-if="nav.isPrev"
    >
      <v-icon>mdi-chevron-left</v-icon>
    </div>
    <div
      class="page-btn"
      fab
      small
      v-for="p in pages"
      :class="{ active: p == page }"
      :key="p"
      v-on:click="movePage(p)"
    >
      {{ p }}
    </div>
    <div
      class="prev-btn"
      v-on:click="movePage(nav.endNav + 1)"
      v-if="nav.isNext"
    >
      <v-icon>mdi-chevron-right</v-icon>
    </div>
    <div
      class="prev-btn"
      v-on:click="movePage(nav.totalPage)"
      v-if="nav.endNav != nav.totalPage"
    >
      <v-icon>mdi-chevron-double-right</v-icon>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pages: [],
    };
  },
  props: ["page", "nav", "color"],
  watch: {
    nav: function () {
      this.pages = [];
      if (this.nav) {
        for (var i = this.nav.startNav; i <= this.nav.endNav; i++) {
          this.pages.push(i);
        }
      }
    },
  },
  mounted() {
    this.pages = [];
    if (this.nav) {
      for (var i = this.nav.startNav; i <= this.nav.endNav; i++) {
        this.pages.push(i);
      }
    }
  },
  methods: {
    movePage(page) {
      this.$emit("movePage", page);
    },
  },
};
</script>
<style scoped lang="less">
.pagenation {
  text-align: center;
  .prev-btn {
    vertical-align: middle;
    cursor: pointer;
    display: inline-block;
    width: 35px;
    height: 35px;
    line-height: 30px;
    // padding: 7px;
    background: #f2f4f6;
    border: 1px solid #d9dee1;
    margin-right: 13px;
    img {
      padding-top: 3px;
      width: 15px;
      height: 15px;
      //vertical-align: middle;
    }
  }
  .page-btn {
    cursor: pointer;
    display: inline-block;
    width: 35px;
    height: 35px;
    border: 1px solid #d9dee1;
    color: #707070;
    background: white;
    font-size: 14px;
    line-height: 35px;
    margin-right: 13px;
    &.active {
      color: white;
      background: @primary-color;
      border: 0;
    }
  }
}
</style>
