<template>
  <v-app id="app">
    <Nuxt class="nuxt" />
  </v-app>
</template>

<script>
export default {
  mounted() {},
};
</script>
<style lang="less">
.cursor {
  cursor: pointer;
}
html,
body,
#app {
  overflow-y: auto;
  overflow-x: hidden;
  background: white;
}
* {
  font-family: "Noto Sans KR", sans-serif;
}

// .nuxt-holder {
//   position: relative;
//   .nuxt-container {
//     position: absolute;
//     left: 0;
//     right: 0;
//     top: 0;
//     bottom: 0;
//   }
// }

.input {
  border: 1px solid @border-color;
}
.input-header {
  margin-top: 10px;
  margin-bottom: 1px;
  margin-left: 3px;
  font-size: 14px;
  font-weight: bold;
}
.table-header {
  margin-top: 10px;
  margin-bottom: 3px;

  font-size: 18px;
  font-weight: bold;
}

.description {
  img {
    width: 100% !important;
  }
}
.inner-container {
  width: @inner-width;
  margin: 0 auto;
  max-width: 100%;
}
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
.text-right {
  input[type="number"] {
    text-align: right;
  }
}
.text-right.number {
  input {
    text-align: right;
  }
}

.tab-list {
  .tab-item {
    width: 20%;
    cursor: pointer;
    text-align: center;
    font-size: 20px;
    padding-top: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid @border-color;
    &.active {
      border-bottom: 3px solid @primary-color;
    }
  }
}
.section {
  background: white;
  box-shadow: 0 0 6px #ddd;
  padding: 20px;
  margin-bottom: 15px;
  .section-header {
    font-size: 25px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  .section-subheader {
    font-size: 20px;
    margin-bottom: 10px;
    font-weight: bold;
  }
}
.input-container {
  .theme--light.v-text-field--solo > .v-input__control > .v-input__slot {
    background: inherit;
  }
}
.tab-blank {
  height: 55px;
}
.tab-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  z-index: 100;
  border-top: 1px solid #ccc;
  .tab-item {
    text-align: center;
    padding-top: 5px;
    padding-bottom: 5px;

    &.active {
      color: @primary-color;
      font-weight: bold;
      .tab-icon {
        color: @primary-color;
      }
    }
    .tab-label {
      font-size: 12px;
    }
  }
}
.v-application p {
  margin-bottom: 0;
}
.flat.v-text-field.v-text-field--solo .v-input__control {
  min-height: 0;
  padding: 0;
  textarea {
    margin: 0;
  }
}
.flat-checkbox {
  margin: 0 !important;
  padding: 0 !important;
  display: inline-block !important;
  .v-input--selection-controls__input {
    margin: 0 !important;
    padding: 0 !important;
  }
}
.v-list-item--dense,
.v-list--dense .v-list-item {
  min-height: 0;
}
.v-list-item__content {
  padding: 5px 0 !important;
}

.section-box {
  background: #fff;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 3px 6px @shadow-color;
  .header {
    font-size: 25px;
    font-weight: bold;
  }
}
.dialog-header {
  text-align: center;
  font-size: 25px;
}
.skyblue {
  background: skyblue !important;
}
@media screen and (max-width: 1100px) {
  .nuxt-container {
    margin-top: 52px;
  }
  .app-header {
    padding: 10px 15px;
  }
}
.v-skeleton-loader__image {
  height: 100%;
}
.v-menu__content {
  z-index: 9999 !important;
}
th[data-column-name="orderNotice"],
th[data-column-name="partnerOrderDate"],
th[data-column-name="horizontal"],
th[data-column-name="vertical"],
th[data-column-name="height"] {
  background: Lawngreen;
}
th[data-column-name="status"],
th[data-column-name="partnerShop"],
th[data-column-name="partnerPrice"],
th[data-column-name="partnerOrderNo"],
th[data-column-name="PackageId"],
th[data-column-name="brandMemo"],
th[data-column-name="number"],
th[data-column-name="packageSum"] {
  background: skyblue;
}
th[data-column-name="orderType"],
th[data-column-name="orderDate"],
th[data-column-name="deliveryExpireDate"],
th[data-column-name="deleveryStartDate"],
th[data-column-name="tradeId"],
th[data-column-name="productId"],
th[data-column-name="productName"],
th[data-column-name="orderNumber"],
th[data-column-name="orderPrice"],
th[data-column-name="partnerPric"],
th[data-column-name="deliveryType"],
th[data-column-name="buyerId"],
th[data-column-name="buyerPhone"],
th[data-column-name="colorSize"],
th[data-column-name="buyerName"],
th[data-column-name="zipcode"],
th[data-column-name="address"] {
  background: Lightcoral;
}
th[data-column-name="deleveryMemo"],
th[data-column-name="orderMemo"] {
  background: yellow;
}
th[data-column-name="product"],
th[data-column-name="hscode"] {
  background: orange;
}
</style>