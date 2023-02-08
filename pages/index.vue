<template>
  <v-layout v-if="init" align-center justify-center class="background">
    <div>
      <div class="login-form">
        <div class="logo"><b>M</b>AERO</div>
        <v-text-field
          v-model="form.email"
          placeholder="이메일 주소"
          @keyup.enter="login"
        ></v-text-field>
        <v-text-field
          type="password"
          @keyup.enter="login"
          v-model="form.password"
          placeholder="비밀번호"
        ></v-text-field>
        <div class="text-center">
          <v-btn class="mr-3 login-btn" color="primary" @click="login"
            >로그인</v-btn
          >
          <v-btn color="primary" @click="moveJoin">회원가입</v-btn>
        </div>
      </div>
    </div>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      init: false,
      form: {
        email: "",
        password: "",
      },
    };
  },
  mounted() {
    this.$axios.post("/userinfo").then((result) => {
      if (result.data.status == "ok") {
        this.$router.push("/admin");
        this.$store.commit("setUserInfo", result.data.user);
      } else {
        this.init = true;
      }
    });
  },
  methods: {
    moveJoin() {
      this.$router.push("/join");
    },
    login() {
      this.$axios.post("/login", this.form).then((result) => {
        //서버에서 로그인이 성공하면 /admin으로 가게하기
        console.log(result);
        if (result.data.status == "ok") {
          this.$store.commit("setUserInfo", result.data.user);
          this.$router.push("/admin");
        } else if (result.data.status == "fail") {
          window.alert("비밀번호가 틀렸습니다.");
          return;
        }
      });
    },
  },
};
</script>
<style scoped lang="less">
.background {
  background-color: #eee;
}
.login-form {
  width: 450px;
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 3px 6px #aaa;
  .logo {
    font-size: 50px;
    font-weight: bold;
    text-align: center;
    color: #888;
    b {
      color: @primary-color;
    }
  }
}
</style>
