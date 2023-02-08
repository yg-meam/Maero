<template>
  <v-layout fill-height column>
    <v-flex class="section-box">
      <v-layout fill-height column>
        <div>
          <v-layout align-center>
            <div class="header">히스토리</div>
            <v-spacer></v-spacer>
          </v-layout>
        </div>

        <div class="filter">
          <v-layout>
            <div>
              <date-picker
                dense
                v-model="filter.startDate"
                @change="changeFilter"
              ></date-picker>
            </div>

            <div class="ml-2 mr-2">-</div>

            <div>
              <date-picker
                dense
                v-model="filter.endDate"
                @change="changeFilter"
              ></date-picker>
            </div>
          </v-layout>
        </div>
        <v-flex>
          <no-ssr>
            <grid
              class="mt-2"
              ref="grid1"
              :data="historyList"
              :columns="columns"
              :scrollX="true"
              bodyHeight="fitToParent"
              :scrollY="true"
              theme="clean"
            ></grid>
          </no-ssr>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import moment from "moment";
import changeType from "@/data/changeType";
//import _ from "underscore";

export default {
  data() {
    return {
      historyList: [],
      filter: {
        startDate: moment().add(-1, "month").format("YYYY-MM-DD"),
        endDate: moment().format("YYYY-MM-DD"),
      },
      columns: [
        {
          header: "사용자ID",
          name: "UserId",
          minwidth: 100,
          align: "center",
        },
        {
          header: "주문ID",
          name: "orderKey",
          minwidth: 100,
          align: "center",
        },
        {
          header: "변경된 필드",
          name: "changeField",
          minwidth: 100,
          align: "center",
          formatter(item) {
            if (item.value) {
              var finded = _.find(changeType, (changeValue) => {
                return changeValue.value == item.value;
              });
              if (finded) {
                return finded.text;
              }
            }
          },
        },
        {
          header: "변경된 데이터",
          name: "changeValue",
          minwidth: 100,
          align: "center",
        },
        {
          header: "이전 데이터",
          name: "prevValue",
          minwidth: 100,
          align: "center",
        },
        {
          header: "변경된 날짜",
          name: "createDate",
          minwidth: 100,
          align: "center",
          formatter(item) {
            if (item.value) {
              return moment(item.value).format("YYYY-MM-DD");
            }
          },
        },
      ],
    };
  },
  mounted() {
    this.getHistoryList();
  },
  methods: {
    changeFilter() {
      this.getHistoryList();
    },
    getHistoryList() {
      this.$axios.post("/admin/history", this.filter).then((result) => {
        if (result.data.res) {
          this.historyList = result.data.historyList;
          this.$refs.grid1.invoke("resetData", this.historyList);
        }
      });
    },
  },
};
</script>
<style scoped lang="less">
.filter {
  background: #efefef;
  border-radius: 10px;
  padding: 10px;
}
</style>