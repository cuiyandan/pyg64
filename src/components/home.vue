<template>
  <el-container class="container">
    <el-header>
      <el-row>
        <el-col :span="4">
          <img src="@/assets/logo.png" alt="图片加载失败">
        </el-col>
        <el-col :span="19" class="middle">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <a href="#" class="logout" @click="handleLoginout">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <el-menu
          :unique-opened="true"
          :router="true"
          default-active="2"
          class="el-menu-vertical-demo"
        >
          <!-- 1 -->
          <el-submenu :index="item1.order+''" v-for="(item1) in menus" :key="item1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>

            <el-menu-item :index="item2.path+''" v-for="(item2) in item1.children" :key="item2.id">
              <i class="el-icon-menu"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menus: []
    };
  },
  // 页面加载之前设置
  // 必须先登录才能进入首页功能
  beforeMount() {
    // 判断token有没有代码放到另外位置
  },
  mounted() {
    console.log(1111);
  },
  created() {
    this.getMenus();
  },
  methods: {
    // 动态导航
    async getMenus() {
      const res = await this.$http.get(`menus`);
      console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.menus = data;
      }
    },
    handleLoginout() {
      //   1.清除token
      localStorage.clear();
      // 2.来到登录
      this.$router.push({
        name: "login"
      });
      // 3.提示
      this.$message.warning("退出成功");
    }
  }
};
</script>

<style>
.container {
  height: 100%;
  background-color: #b3c0d1;
}
.aside {
  background-color: #fff;
  /* margin: 20px; */
}
.main {
  background-color: #e6eef1;
}
.middle {
  line-height: 60px;
  text-align: center;
  color: #fff;
}
.logout {
  line-height: 60px;
  text-decoration: none;
}
</style>
