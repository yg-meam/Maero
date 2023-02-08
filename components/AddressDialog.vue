<template>
  <v-dialog @click:outside="close" v-model="value" width="600px">
    <v-card class="pa-4">
      <div class="dialog-header">
        <div class="dialog-title">주소검색</div>
        <v-btn icon class="close-btn" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <div class="address" ref="address"></div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["value"],
  data() {
    return {
      tmpValue: false,
    };
  },
  mounted() {
    new daum.Postcode({
      width: "100%",
      oncomplete: (data) => {
        var geocoder = new kakao.maps.services.Geocoder();

        geocoder.addressSearch(data.address, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            this.$emit("change", {
              zipcode: data.zonecode,
              address: data.address,
              x: Number(result[0].x),
              y: Number(result[0].y),
            });
          }
          this.close();
        });
        // this.applicant.zipcode = data.zonecode;
        // this.applicant.address = data.address;
        // this.addressDialog.visible = false;
      },
    }).embed(this.$refs.address);
  },
  methods: {
    close() {
      this.$emit("input", false);
    },
  },
};
</script>
<style lang="less" scoped>
.dialog-header {
  position: relative;
  height: 48px;
  border-bottom: 1px solid #ddd;
  .dialog-title {
    width: 100%;
    font-size: 18px;
    text-align: center;
    line-height: 48px;
  }

  .close-btn {
    position: absolute;
    right: 5px;
    top: 0;
  }
}
.address {
  width: 100%;
  max-width: 100%;
  height: 500px;
}
</style>