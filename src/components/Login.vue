<template>
  <div class="login-outer">
    <div class="logo">
      <img src="https://s3.amazonaws.com/vvxteam/assets/logo.png">
    </div>
    <form @submit.prevent="login">
      <div class="login-wrap">
        <div class="input-wrap">
          <label for="email">Email Address</label>
          <input type="text" name="email" v-model="email">
        </div>
        <div class="input-wrap">
          <label for="password">Password</label>
          <input type="password" name="password" v-model="password">
        </div>
        <input type="submit" class="submit" value="Login">
      </div>
    </form>
  </div>
 </template>

<script>
import * as $ from '../store/api/api-config'

export default {
  data () {
    return {
      loading: false
    }
  },
  methods: {
    login () {
      this.loading = false
      var payload = {
        auth: {
          email: this.email,
          password: this.password
        }
      }
      $.post('/user_token', payload).then((res) => {
        window.localStorage.setItem('apiKey', res.body.jwt)
        this.$router.push({name: 'kanban'})
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/vendor/bourbon";
@import "../assets/css/colors";

.login-outer {
  margin-top: 100px;
  .logo {
    text-align: center;
  }
  img {
    height: 50px;
  }
}

.login-wrap {
  width: 300px;
  margin: 25px auto;
  border: 1px solid #ccc;
  background-color: white;
  padding: 35px;
  border-radius: 3px;
  box-shadow: 0 0 15px #eee;
}

.input-wrap {
  margin-top: 20px;
  &:first-child {
    margin-top: 0;
  }
  label {
    display: block;
    margin-bottom: 10px;
  }
  input {
    padding: 10px;
    border-radius: 3px;
    display: block;
    box-sizing: border-box;
    width: 100%;
    border: 1px solid #ddd;
    &:focus {

    }
  }
}

.submit {
  display: block;
  border: none;
  width: 100%;

  background-color: $prime;
  color: white;
  text-align: center;
  padding: 15px 0;
  font-size: 18px;
  border-radius: 3px;
  margin-top: 25px;
  box-shadow: 0 2px 0 shade($prime, 25%);
  &:hover {
    cursor: pointer;
    background-color: shade($prime, 5%);
  }
}

</style>
