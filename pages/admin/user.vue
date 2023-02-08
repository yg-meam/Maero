<template>
  <v-layout fill-height column>
    <v-flex class="section-box">
      <v-layout fill-height column>
        <div>
          <v-layout align-center>
            <div class="header">사용자관리</div>
            <v-spacer></v-spacer>
          </v-layout>
        </div>
        <no-ssr>
          <grid
            class="mt-2"
            ref="grid1"
            :data="userList"
            :columns="columns"
            :scrollX="true"
            :bodyHeight="800"
            :scrollY="true"
            theme="clean"
            @change="changeList"
            @afterChange="valueChange"
          ></grid>
        </no-ssr>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import moment from "moment";
import authorityType from "@/data/authorityType.json";
export default {
  data() {
    return {
      userList: [],
      columns: [
        {
          header: "E-mail",
          name: "email",
          minWidth: 200,
          align: "center",
        },
        {
          header: "이름",
          name: "name",
          minWidth: 200,
          align: "center",
        },
        {
          header: "권한",
          name: "authority",
          mixWidth: 80,
          align: "center",
          formatter(item) {
            if (item.value) {
              var finded = _.find(authorityType, (authority) => {
                return authority.value == item.value;
              });
              if (finded) {
                return finded.text;
              }
            }
          },
          editor: {
            type: "select",
            options: {
              listItems: authorityType,
            },
          },
        },
        {
          header: "가입일자",
          name: "signdate",
          minWidth: 200,
          align: "center",
          formatter(item) {
            if (item) {
              return moment(item.value).format("YYYY-MM-DD");
            }
          },
        },
        {
          header: "접속시간",
          name: "connecttime",
          minWidth: 200,
          align: "center",
          formatter(item) {
            if (item) {
              return moment(item.value).format("YYYY-MM-DD HH:mm:ss");
            }
          },
        },
      ],
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    changeList() {
      this.getUserList();
    },
    valueChange(event) {
      var changeList = [];
      _.each(event.changes, (event) => {
        var changeId = {
          email: this.userList[event.rowKey].email,
        };
        changeId[event.columnName] = event.value;

        changeList.push(changeId);
      });

      this.$axios.post("/admin/user", changeList).then((result) => {
        if (result.data.res) {
          this.userList = result.data.userList;
        }
      });
    },
    getUserList() {
      this.$axios.post("/admin/user").then((result) => {
        if (result.data.res) {
          this.userList = result.data.userList;
          this.$refs.grid1.invoke("resetData", this.userList);
          this.$refs.grid1.invoke("refreshLayout");
        }
      });
    },
  },
};
</script>
<style scoped lang="less">
</style>