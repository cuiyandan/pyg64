<template>
  <div class="login-wrap">
    <el-form class="login-form" label-position="top" label-width="80px" :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button @click.prevent="handleLogin()" class="login-btn" type="primary">登陆</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    // 登录请求
    handleLogin () {
      //   前提  服务器开启状态
      // 服务器支持跨域
      this.$http.post(`login`, this.formdata).then(res => {
        console.log(res)
        const {
          data: {

            meta: { msg, status }
          }
        } = res
        if (status === 200) {
          // 渲染home组件 home.vue 改标识 js编程导航
          this.$router.push({
            name:'home'
          })
        } else {
          // 提示框
          this.$message.error(msg)
        }
      })
    }
  }
}
</script>

<style>
/* 样式修改 */
.login-wrap {
  height: 100%;
  background-color: #324152;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form {
  background-color: #fff;
  border-radius: 5px;
  width: 400px;
  padding: 20px;
}
.login-btn {
  width: 100%;
}
</style>
