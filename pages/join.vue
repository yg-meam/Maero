<template>
  <v-layout align-center justify-center class="background">
    <div>
      <div class="login-form">
        <v-text-field
          v-model="form.email"
          placeholder="이메일 주소"
        ></v-text-field>
        <v-text-field v-model="form.name" placeholder="이름"></v-text-field>
        <v-text-field
          type="password"
          v-model="form.password"
          placeholder="패스워드"
        >
        </v-text-field>
        <v-text-field
          type="password"
          v-model="form.passwordConfirm"
          placeholder="패스워드 확인"
        >
        </v-text-field>

        <div class="text-center">
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
      form: {
        email: "",
        name: "",
        password: "",
        passwordConfirm: "",
      },
    };
  },
  methods: {
    moveJoin() {
      if (this.form.email == "") {
        window.alert("이메일을 입력해주세요.");
        return;
      }
      if (this.form.name == "") {
        window.alert("이름을 입력해주세요.");
        return;
      }
      if (this.form.password.length < 6) {
        window.alert("패스워드를 6자 이상 입력해주세요.");
        return;
      }
      if (this.form.password != this.form.passwordConfirm) {
        window.alert("패스워드가 일치하지 않습니다.");
        return;
      }

      this.$axios.post("/join", this.form).then((result) => {
        console.log(result);
        if (result.data.status == "ok") {
          window.alert("회원가입이 완료되었습니다.");
          this.$router.push("/");
          return;
        } else if (result.data.status == "fail") {
          window.alert("이미 존재하는 이메일입니다.");
          return;
        }
      });
    },
  },
};
</script>

<style scoped>
.background {
  background-color: #eee;
}
.login-form {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 3px 6px #aaa;
}
</style>