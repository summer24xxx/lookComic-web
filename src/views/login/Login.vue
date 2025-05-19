<template>
  <div id="login-div">
    <div class="text-center" id="login">
      <form
        @submit.prevent="submitEvent"
        class="form-signin"
        method="post"
        novalidate
      >
        <img
          alt="/favicon.ico"
          class="mb-4"
          height="72"
          src="/logo.png"
          width="72"
        />
        <h1 class="h3 mb-3 font-weight-normal">请登录</h1>
        <div class="row">
          <div class="col-3">
            <label class="sr-only" for="username">用户名</label>
          </div>
          <input
            :class="username.inputClass()"
            :pattern="username.pattern"
            @change="username.check($event)"
            autofocus=""
            class="form-control col-6"
            id="username"
            name="username"
            placeholder="用户名"
            required
            type="text"
            v-model.lazy="username.value"
          />
          <div
            :class="username.feedbackClass()"
            class="col-3 align-self-center"
          >
            {{ username.feedback }}
          </div>
        </div>

        <div class="row">
          <div class="col-3">
            <label class="sr-only" for="password">密码</label>
          </div>
          <input
            :class="password.inputClass()"
            :pattern="password.pattern"
            @change="password.check($event)"
            class="form-control col-6"
            id="password"
            name="password"
            placeholder="密码"
            required
            type="password"
            v-model.lazy="password.value"
          />
          <div
            :class="password.feedbackClass()"
            class="col-3 align-self-center"
          >
            {{ password.feedback }}
          </div>
        </div>

        <div class="checkbox mb-3">
          <label>
            <input
              class="mt-3"
              name="remember-me"
              type="checkbox"
              v-model="rememberMe"
            />
            Remember me
          </label>
        </div>
        <div class="row">
          <div class="col-4"></div>
          <button
            :class="submit.inputClass()"
            class="btn btn-lg btn-primary btn-block col-4"
            type="submit"
          >
            登录
          </button>
          <div
            :class="submit.feedbackClass()"
            class="col align-self-center text-left"
          >
            {{ submit.feedback }}
          </div>
        </div>

        <div class="row mt-4">
          <div class="col-3"></div>
          <span class="col text-right"
            >没有账号？去
            <router-link to="/register">注册</router-link>
          </span>
          <div class="col-3"></div>
        </div>
        <!--		<p class="mt-5 mb-3 text-muted">© 2017-2019</p>-->
      </form>
    </div>
  </div>
</template>

<script>
import ValidatorParam, {
  PasswordParam,
  UsernameParam,
} from "@/utils/ValidatorParam";

export default {
  name: "Login",
  data() {
    return {
      username: new UsernameParam(
        this.$route.query.username ? this.$route.query.username : "admin",
        "用户名格式不合法"
      ),
      password: new PasswordParam("123456", "密码长度应在6-16内"),
      submit: new ValidatorParam(),
      rememberMe: true,
    };
  },

  methods: {
    submitEvent() {
      if (this.username.isValid && this.password.isValid) {
        this.$store
          .dispatch("Login", {
            username: this.username.value,
            password: this.password.value,
            rememberMe: this.rememberMe,
          })
          .then(() => {
            // console.log(resp);
            this.$router.push({ path: "/" });
          })
          .catch((error) => {
            this.submit.invalid(error);
          });
      }
    },
  },
};
</script>

<style scoped>
#login-div {
  background-image: url("/log-regis.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}
#login {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  margin-left: 100px;
  position: absolute;
  top: 0;
  left: 0;
  overflow-y: auto;
  justify-content: flex-start;
  width: 400px;
  margin-top: 10%;
}

.form-signin {
  width: 100%;
  /*max-width: 660px;*/
  max-width: 550px;
  padding: 15px;
  margin: auto;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

#register {
  max-width: 840px;
}

.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
  /*margin-bottom: 10px;*/
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
#repeat-password {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
