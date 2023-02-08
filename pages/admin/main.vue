<template>
  <div>
    <v-layout wrap>
      <v-flex xs4 class="pa-3">
        <div class="section-box">
          <div class="box-header">BUYMA 발주전</div>
          <div class="box-value">{{ data.type1status100 | number }}</div>
        </div>
      </v-flex>
      <v-flex xs4 class="pa-3">
        <div class="section-box">
          <div class="box-header">QOO10 발주전</div>
          <div class="box-value">{{ data.type2status100 | number }}</div>
        </div>
      </v-flex>
      <v-flex xs4 class="pa-3">
        <div class="section-box">
          <div class="box-header">RAKUTEN 발주전</div>
          <div class="box-value">{{ data.type3status100 | number }}</div>
        </div>
      </v-flex>
      <v-flex xs4 class="pa-3">
        <div class="section-box">
          <div class="box-header">BUYMA 배송기한3일남은주문</div>
          <div class="box-value">{{ data.type1Expire | number }}</div>
        </div>
      </v-flex>
      <!-- <v-flex xs4 class="pa-3">
        <div class="section-box">
          <div class="box-header">QOO10 배송기한3일남은주문</div>
          <div class="box-value">{{ data.type2Expire | number }}</div>
        </div>
      </v-flex> -->
      <!-- <v-flex xs4 class="pa-3">
        <div class="section-box">
          <div class="box-header">RAKUTEN 배송기한3일남은주문</div>
          <div class="box-value">{{ data.type3Expire | number }}</div>
        </div>
      </v-flex> -->
    </v-layout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {},
    };
  },
  mounted() {
    this.getMainData();
  },
  methods: {
    getMainData() {
      this.$axios.post("/admin/main").then((result) => {
        if (result.data.res) {
          this.data = result.data.data;
        }
      });
    },
  },
};
</script>

<style lang="less">
.box-header {
  font-size: 30px;
  text-align: center;
}
.box-value {
  font-size: 35px;
  font-weight: bold;
  text-align: center;
}
</style>