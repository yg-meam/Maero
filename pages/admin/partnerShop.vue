<template>
  <v-layout fill-height column>
    <v-flex class="section-box">
      <v-layout fill-height column>
        <v-layout align-center>
          <div class="header">매입처관리</div>
          <v-spacer></v-spacer>

          <v-dialog v-model="dialog" width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" outlined v-bind="attrs" v-on="on">
                추가
              </v-btn>
            </template>
            <v-card class="pa-4">
              <v-textarea
                class="input mt-2"
                auto-grow
                hide-details
                solo
                flat
                :rows="1"
                v-model="newMarket"
                placeholder="매입처"
              ></v-textarea>
              <v-textarea
                class="input mt-2"
                auto-grow
                hide-details
                solo
                flat
                :rows="1"
                v-model="newMarketUrl"
                placeholder="매입처 주소"
              ></v-textarea>
              <v-btn class="mt-2" @click="addMarket" block>추가</v-btn>
            </v-card>
          </v-dialog>
          <v-btn class="ml-2" outlined @click="removeMarket">삭제</v-btn>
        </v-layout>

        <no-ssr>
          <grid
            class="mt-2"
            ref="grid1"
            :data="partnerShopList"
            :rowHeaders="rowHeaders"
            :columns="columns"
            :scrollX="true"
            :bodyHeight="800"
            :scrollY="true"
            :contextMenu="contextMenu"
            theme="clean"
            @change="changeList"
            @afterChange="marketChange"
          ></grid>
        </no-ssr>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      partnerShopList: [],
      rowHeaders: ["checkbox"],
      dialog: false,
      newMarket: "",
      newMarketUrl: "",
      contextMenu: ({ rowKey }) => [
        [
          {
            name: "popupPage",
            label: "매입처 주소로 가기",
            action: () => {
              this.movePage(this.partnerShopList[rowKey]);
            },
          },
        ],
      ],

      columns: [
        {
          header: "매입처",
          name: "market",
          minWidth: 200,
          align: "center",
          editor: "text",
        },
        {
          header: "매입처 주소",
          name: "marketUrl",
          minWidth: 200,
          align: "center",
          editor: "text",
        },
      ],
    };
  },
  mounted() {
    this.getPartnerShopList();
  },
  methods: {
    marketChange(event) {
      var newShopList = [];
      _.each(event.changes, (item) => {
        var newShop = {
          id: this.partnerShopList[item.rowKey].id,
        };
        newShop[item.columnName] = item.value;
        newShopList.push(newShop);
      });
      this.$axios.post("/admin/partnerShop", newShopList).then((result) => {
        if (result.data.res) {
          _.each(result.data.partnerShopList, (changeItem) => {
            var index = _.findIndex(this.partnerShopList, (shopItem) => {
              return shopItem.id == changeItem.id;
            });
            this.partnerShopList[index] = changeItem;
          });
        }
      });
    },
    movePage(marketItem) {
      window.open(`${marketItem.marketUrl}`);
    },
    changeList() {
      this.getPartnerShopList();
    },
    addMarket() {
      if (!this.newMarket) {
        window.alert("매입처를 입력해주세요");
      } else if (!this.newMarketUrl) {
        window.alert("매입처 주소를 입력해주세요.");
      } else {
        this.$axios
          .post("/admin/partnerShop/add", {
            market: this.newMarket,
            marketUrl: this.newMarketUrl,
          })
          .then((result) => {
            if (result.data.res) {
              this.newMarket = null;
              this.newMarketUrl = null;
              this.dialog = false;
              this.getPartnerShopList();
            }
          });
      }
    },
    removeMarket() {
      var checkBoxList = this.$refs.grid1.invoke("getCheckedRows");

      var checkList = _.map(checkBoxList, (item) => {
        return {
          market: item.market,
          marketUrl: item.marketUrl,
        };
      });
      if (checkBoxList == false) {
        window.alert("삭제할 매입처목록을 선택해주세요");
      } else {
        this.$axios
          .post("/admin/partnerShop/remove", checkList)
          .then((result) => {
            if (result.data.res) {
              this.getPartnerShopList();
            }
          });
      }
    },
    getPartnerShopList() {
      this.$axios.post("/admin/partnerShop").then((result) => {
        if (result.data.res) {
          this.partnerShopList = result.data.partnerShopList;
          this.$refs.grid1.invoke("resetData", this.partnerShopList);
        }
      });
    },
  },
};
</script>

<style>
</style>