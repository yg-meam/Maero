<template>
  <v-layout fill-height column>
    <v-flex class="section-box">
      <v-layout fill-height column>
        <div>
          <v-layout align-center>
            <div class="header">사용자관리</div>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  class="ml-2"
                  outlined
                  v-bind="attrs"
                  v-on="on"
                >
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
                  v-model="newBox"
                  placeholder="상자"
                ></v-textarea>
                <v-textarea
                  class="input mt-2"
                  auto-grow
                  hide-details
                  solo
                  flat
                  :rows="1"
                  v-model="newWidth"
                  placeholder="width"
                ></v-textarea>
                <v-textarea
                  class="input mt-2"
                  auto-grow
                  hide-details
                  solo
                  flat
                  :rows="1"
                  v-model="newLength"
                  placeholder="length"
                ></v-textarea>
                <v-textarea
                  class="input mt-2"
                  auto-grow
                  hide-details
                  solo
                  flat
                  :rows="1"
                  v-model="newHeight"
                  placeholder="height"
                ></v-textarea>
                <v-btn class="mt-2" @click="addBox" block>추가</v-btn>
              </v-card>
            </v-dialog>
            <v-btn class="ml-2" @click="removeBox" outlined>삭제</v-btn>
          </v-layout>
        </div>
        <no-ssr>
          <grid
            class="mt-2"
            ref="grid1"
            :data="packageList"
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
      packageList: [],
      dialog: false,
      newBox: "",
      newWidth: "",
      newLength: "",
      newHeight: "",
      rowHeaders: ["checkbox"],
      columns: [
        {
          header: "상자",
          name: "no",
          minWidth: 200,
          align: "center",
        },
        {
          header: "WIDTH",
          name: "horizontal1",
          minWidth: 200,
          align: "center",
        },
        {
          header: "LENGTH",
          name: "vertical1",
          minWidth: 200,
          align: "center",
        },
        {
          header: "HEIGHT",
          name: "height1",
          minWidth: 200,
          align: "center",
        },
      ],
    };
  },
  mounted() {
    this.getPackageList();
  },
  methods: {
    removeBox() {
      var checkBoxList = this.$refs.grid1.invoke("getCheckedRows");
      console.log(checkBoxList);

      var checkList = _.map(checkBoxList, (item) => {
        return {
          no: item.no,
          horizontal: item.horizontal,
          vertical: item.vertical,
          height: item.height,
        };
      });
      console.log(checkList);
      if (checkBoxList == false) {
        return window.alert("삭제할 상자목록을 선택해주세요");
      } else {
        this.$axios
          .post("/admin/boxpackage/remove", checkList)
          .then((result) => {
            if (result.data.res) {
              this.getPackageList();
            }
          });
      }
    },
    addBox() {
      if (!this.newBox) {
        return window.alert("상자값을 입력해주세요");
      } else if (!this.newWidth) {
        return window.alert("width값을 입력해주세요");
      } else if (!this.newLength) {
        return window.alert("length값을 입력해주세요");
      } else if (!this.newHeight) {
        return window.alert("heigth값을 입력해주세요");
      } else {
        this.$axios
          .post("/admin/boxpackage/add", {
            no: this.newBox,
            horizontal: this.newWidth,
            vertical: this.newLength,
            height: this.newHeight,
          })
          .then((result) => {
            if (result.data.res) {
              console.log(result.data.res);
              this.dialog = false;
              this.newBox = null;
              this.newWidth = null;
              this.newLength = null;
              this.newHeight = null;
              this.getPackageList();
            }
          });
      }
    },
    changeList() {
      this.getPackageList();
    },
    getPackageList() {
      this.$axios.post("/admin/boxpackage").then((result) => {
        if (result.data.res) {
          _.each(result.data.packageList, (item) => {
            item.horizontal1 = item.horizontal;
            item.vertical1 = item.vertical;
            item.height1 = item.height;
          });
          this.packageList = result.data.packageList;
          this.$refs.grid1.invoke("resetData", this.packageList);
        }
      });
    },
  },
};
</script>

<style>
</style>