<template>
  <v-layout fill-height column>
    <v-flex class="section-box">
      <v-layout fill-height column>
        <v-layout align-center>
          <div class="header">HSCODE관리</div>
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
                v-model="newHscode"
                placeholder="HSCODE"
              ></v-textarea>
              <v-textarea
                class="input mt-2"
                auto-grow
                hide-details
                solo
                flat
                :rows="1"
                v-model="newCategory"
                placeholder="구분"
              ></v-textarea>
              <v-textarea
                class="input mt-2"
                auto-grow
                hide-details
                solo
                flat
                :rows="1"
                v-model="newKind"
                placeholder="종류"
              ></v-textarea>
              <v-textarea
                class="input mt-2"
                auto-grow
                hide-details
                solo
                flat
                :rows="1"
                v-model="newProduct"
                placeholder="상품명"
              ></v-textarea>
              <v-textarea
                class="input mt-2"
                auto-grow
                hide-details
                solo
                flat
                :rows="1"
                v-model="newOrigin"
                placeholder="원산지"
              ></v-textarea>

              <v-btn class="mt-2" @click="addHscode" block>추가</v-btn>
            </v-card>
          </v-dialog>
          <v-btn class="ml-2" outlined @click="removeHscode">삭제</v-btn>
        </v-layout>

        <no-ssr>
          <grid
            class="mt-2"
            ref="grid1"
            :data="hscodeList"
            :rowHeaders="rowHeaders"
            :columns="columns"
            :scrollX="true"
            :bodyHeight="800"
            :scrollY="true"
            theme="clean"
            @change="changeList"
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
      dialog: false,
      newHscode: "",
      newCategory: "",
      newKind: "",
      newProduct: "",
      newOrigin: "",
      hscodeList: [],
      rowHeaders: ["checkbox"],
      columns: [
        {
          header: "HSCODE",
          name: "hscode2",
          mixWidth: 200,
          align: "center",
        },
        {
          header: "구분",
          name: "category",
          mixWidth: 200,
          align: "center",
        },
        {
          header: "종류",
          name: "kind",
          mixWidth: 200,
          align: "center",
        },
        {
          header: "상품명",
          name: "product1",
          mixWidth: 200,
          align: "center",
        },
        {
          header: "원산지",
          name: "origin",
          mixWidth: 200,
          align: "center",
        },
      ],
    };
  },
  mounted() {
    this.getHscodeList();
  },
  methods: {
    addHscode() {
      if (!this.newHscode) {
        return window.alert("hscode를 입력해주세요");
      } else if (!this.newCategory) {
        return window.alert("구분을 입력해주세요");
      } else if (!this.newKind) {
        return window.alert("종류를 입력해주세요");
      } else if (!this.newProduct) {
        return window.alert("상품명을 입력해주세요");
      } else if (!this.newOrigin) {
        return window.alert("원산지를 입력해주세요");
      } else {
        this.$axios
          .post("/admin//hscodeList/add", {
            hscode: this.newHscode,
            category: this.newCategory,
            kind: this.newKind,
            product: this.newProduct,
            origin: this.newOrigin,
          })
          .then((result) => {
            if (result.data.res) {
              this.newHscode = null;
              this.newCategory = null;
              this.newKind = null;
              this.newProduct = null;
              this.newOrigin = null;
              this.dialog = false;
              this.getHscodeList();
            }
          });
      }
    },
    removeHscode() {
      var checkBoxList = this.$refs.grid1.invoke("getCheckedRows");
      var checkList = _.map(checkBoxList, (item) => {
        console.log(item.hscode);
        return {
          hscode: item.hscode,
          category: item.category,
          kind: item.kind,
          product: item.product,
          origin: item.origin,
        };
      });
      if (checkBoxList == false) {
        return window.alert("삭제할 HSCODE목록을 선택해주세요");
      } else {
        this.$axios
          .post("/admin/hscodeList/remove", checkList)
          .then((result) => {
            if (result.data.res) {
              this.getHscodeList();
            }
          });
      }
    },
    changeList() {
      this.getHscodeList();
    },
    getHscodeList() {
      this.$axios.post("/admin/hscodeList").then((result) => {
        if (result.data.res) {
          _.each(result.data.hscodeList, (item) => {
            item.hscode2 = item.hscode;
            item.product1 = item.product;
          });
          this.hscodeList = result.data.hscodeList;
          this.$refs.grid1.invoke("resetData", this.hscodeList);
        }
      });
    },
  },
};
</script>

<style>
</style>