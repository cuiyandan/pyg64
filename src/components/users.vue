<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索+添加 -->
    <el-row class="seartBox">
      <el-col>
        <!-- 搜索框 -->
        <el-input
          @clear="getAllUsers()"
          clearable
          class="seartinput"
          placeholder="请输入内容"
          v-model="query"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
        </el-input>
        <!-- 添加按钮 -->
        <el-button type="primary">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table height="300px" :data="list" style="width: 100%">
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="140"></el-table-column>

      <!-- 日期格式处理 -->
      <!-- 过滤器的使用 -->
      <el-table-column label="创建日期" width="140">
        <template slot-scope="scope">{{scope .row.create_time|fmtdate}}</template>
      </el-table-column>

      <el-table-column label="用户状态" width="140">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <!--   下面template的属性 slot-scope="scope" -->
        <template>
          <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
          <el-button plain size="mini" type="success" icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!-- @size-change每页条数改变时触发 -->
    <!-- @current-change 页码改变时触发 -->
    <!-- :current-page 当前显示第几页 -->
    <!-- :page-sizes每页条数的不同情况的数组 -->
    <!-- layout  附加功能 -->
    <!-- :total一共数据的条数 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      class="page"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 2,
      total: -1,
      //   表格数据
      list: []
    };
  },
  //   获取首屏数据的方法调用
  created() {
    this.pagenum = 1;
    this.getTableDate();
  },
  methods: {
    // 搜索清空时获取所有用户
    getAllUsers() {
      this.getTableDate();
    },

    // 搜索用户
    searchUser() {
      this.pagenum = 1;
      // 按照quert关键字搜索
      this.getTableDate();
    },

    // 分页相关的方法

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      // 按照新pagesize发送请求
      this.pagenum = 1;
      this.pagesize = val;
      this.getTableDate();
    },
    // 点击当前页，触发下面的方法
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      // 按照新页码发送请求
      this.pagenum = val;
      this.getTableDate();
    },

    //   获取表格数据
    async getTableDate() {
      // 除了登录请求，其他请求都需要授权  Authorization
      // 发请求之前  设置请求头
      // {
      //   Authorization
      // }

      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      //   console.log(res) // 接口文档有额外的说明
      const {
        data,
        // 有个msg被删了
        meta: { status }
      } = res.data;
      if (status === 200) {
        this.total = data.total;
        this.list = data.users;
        console.log(this.list);
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.seartBox {
  margin-top: 20px;
}
.seartinput {
  width: 350px;
}
.page {
  margin-top: 20px;
}
</style>
