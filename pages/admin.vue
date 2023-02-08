<template>
  <v-layout fill-height class="admin">
    <div class="menu-holder hidden-sm-and-down">
      <div class="menu-list">
        <div class="user-name text-center" v-if="$store.state.userInfo">
          {{ $store.state.userInfo.name }}님
        </div>
        <div class="user-email text-center" v-if="$store.state.userInfo">
          {{ $store.state.userInfo.email }}
        </div>
        <div class="text-center">
          <v-btn
            v-if="$store.state.userInfo"
            text
            color="primary"
            @click="logout"
          >
            로그아웃
          </v-btn>
        </div>
        <v-divider></v-divider>
        <div class="menu" v-for="(menu, key) in menuList" :key="key">
          <div
            class="menu-category"
            v-ripple
            @click="menu.extend = !menu.extend"
            v-if="menu.type == 'category'"
          >
            <v-layout>
              <v-flex class="menu-title">{{ menu.title }}</v-flex>
              <v-icon color="white"> mdi-chevron-down </v-icon>
            </v-layout>
          </div>

          <div class="menu-content" v-if="menu.extend">
            <div
              class="menu-item"
              v-ripple
              v-for="(item, key) in menu.items"
              :key="key"
              @click="moveMenu(item)"
              :class="{ active: item.path == $route.path }"
            >
              <v-layout align-center>
                <v-icon class="icon">{{ item.icon }}</v-icon>
                <div class="label">
                  {{ item.title }}
                </div>
              </v-layout>
            </div>
          </div>
        </div>
      </div>
    </div>

    <v-flex class="contents-holder">
      <div class="contents">
        <div class="mobile-header hidden-md-and-up">
          <v-layout align-center>
            <div class="pa-2" @click="drawer = !drawer">
              <v-icon>mdi-menu</v-icon>
            </div>
            <v-spacer></v-spacer>
          </v-layout>
          <v-navigation-drawer v-model="drawer" left fixed temporary>
            <div class="text-right">
              <v-btn icon @click="drawer = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
            <v-list dense>
              <v-list-item link v-for="(menu, key) in menuItemList" :key="key">
                <v-list-item-content @click="move(menu.path)">
                  <v-list-item-title class="menu-item">{{
                    menu.title
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
        </div>
        <router-view class="contents-view"></router-view>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import _ from "underscore";
export default {
  layout: "admin",
  data() {
    return {
      drawer: false,
      menuList: [
        {
          type: "category",
          title: "주문관리",
          extend: true,
          items: [
            {
              type: "item",
              title: "메인",
              path: "/admin/main",
              icon: "mdi-home",
            },
            {
              icon: "mdi-format-list-checks",
              title: "발주관리",
              path: "/admin/order/list",
            },
            {
              icon: "mdi-format-list-checks",
              title: "발송관리",
              path: "/admin/order/send",
            },
          ],
        },
        {
          type: "category",
          title: "사용자 관리",
          extend: true,
          items: [
            {
              icon: "mdi-account",
              title: "사용자관리",
              path: "/admin/user",
            },
            {
              icon: "mdi-account",
              title: "히스토리",
              path: "/admin/history",
            },
            {
              icon: "mdi-account",
              title: "매입처관리",
              path: "/admin/partnerShop",
            },
            {
              icon: "mdi-account",
              title: "상자관리",
              path: "/admin/addPackage",
            },
            {
              icon: "mdi-account",
              title: "HSCODE관리",
              path: "/admin/hscode",
            },
          ],
        },
      ],
    };
  },
  computed: {
    menuItemList() {
      var menuItemList = [];
      _.each(this.menuList, (item) => {
        if (item.type == "category") {
          _.each(item.items, (item) => {
            menuItemList.push(item);
          });
        } else {
          menuItemList.push(item);
        }
      });
      return menuItemList;
    },
  },
  mounted() {
    if (this.$route.path == "/admin" || this.$route.path == "/admin/") {
      this.moveFirstMenu();
    }
    if (this.$route.path == "/list") {
      this.moveMenu();
    }
    this.$axios.post("/userinfo").then((result) => {
      if (result.data.status == "ok") {
        this.$store.commit("setUserInfo", result.data.user);
      }
    });
  },
  methods: {
    moveMain() {
      this.$router.push("/");
    },
    moveFirstMenu() {
      _.find(this.menuList, (menu) => {
        if (menu.type == "item") {
          if (menu.path) {
            this.$router.push(menu.path);
            return true;
          }
        }
        if (menu.type == "category") {
          return _.find(menu.items, (item) => {
            if (item.path) {
              this.$router.push(item.path);
              return true;
            }
          });
        }
      });
    },
    moveMenu(item) {
      this.$router.push(item.path);
    },
    logout() {
      this.$axios.post("/logout").then((result) => {
        if (result.data.res) {
          this.$store.commit("logout");
          this.$router.replace("/");
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.logo {
  color: @primary-color;
  font-size: 25px;
  font-weight: bold;
  padding: 10px 15px;
  text-align: center;
  cursor: pointer;
}
.menu-holder {
  width: 200px;
  // background: @primary-color;
  position: relative;
  border-right: 1px solid #eee;
  .menu-list {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .menu {
      cursor: pointer;
      font-size: 16px;
      color: black;

      a {
        color: black;
        text-decoration: none;
      }
      .menu-category {
        padding: 5px 10px;
        font-size: 16px;
      }
      .menu-item {
        margin: 5px 10px;
        padding: 5px 10px;
        border-radius: 10px;
        .icon {
          margin-right: 5px;
        }
        &.active {
          background: @primary-color;
          color: white;
          .icon {
            color: white;
          }
        }
      }
    }
  }
}
.mobile-header {
  position: relative;
  z-index: 20;
  background: white;
  .logo {
    text-decoration: none;
  }
}
.contents-holder {
  position: relative;
  .contents {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;

    background: #f6f6f6;
    .contents-view {
      padding: 20px;
    }
  }
}
.user-name {
  font-size: 25px;
  //text-align: center;
}
.user-email {
  color: gray;
}
</style>
