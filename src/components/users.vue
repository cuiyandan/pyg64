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
        <el-button type="primary" @click="showDiaAddUser()">添加用户</el-button>
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
          <el-switch
            @change="changeseat(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <!--   下面template的属性 slot-scope="scope" -->
        <template slot-scope="scope">
          <el-button
            @click="showDiaEditUser(scope.row)"
            plain
            size="mini"
            type="primary"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            @click="showMsgBoxDele(scope.row)"
            plain
            size="mini"
            type="danger"
            icon="el-icon-delete"
            circle
          ></el-button>
          <el-button
            @click="showDiaSetRole(scope.row)"
            plain
            size="mini"
            type="success"
            icon="el-icon-check"
            circle
          ></el-button>
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

    <!-- 对话框 添加用户-->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户--对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input disabled v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色--对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">{{formdata.username}}</el-form-item>

        <el-form-item label="角色">
          <!-- {{selectVal}} -->
          <el-select v-model="selectVal" placeholder="请选择角色名">
            <el-option disabled label="请选择" :value="-1"></el-option>

            <!-- 5个角色都有自己的value -->
            <!-- 删掉了一个  i -->
            <el-option
              v-for="(item) in roles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>

            <!-- 将来获取角色名数据 -->
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
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
      list: [],
      // 对话框的默认数据
      dialogFormVisibleEdit: false,
      dialogFormVisibleAdd: false,
      dialogFormVisibleRole: false,
      // 表单数据->发送post请求
      formdata: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 下拉框用的数据
      selectVal: -1,
      currUserId: -1,
      //角色数组
      roles: []
    };
  },
  //   获取首屏数据的方法调用
  created() {
    this.pagenum = 1;
    this.getTableDate();
  },
  methods: {
    // 分配角色--发送请求
    async setRole() {
      const res = await this.$http.put(`users/${this.currUserId}/role`, {
        rid: this.selectVal
      });
      // console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        // 关闭对话框
        this.dialogFormVisibleRole = false;
      }
    },

    // 分配角色--打开对话框
    async showDiaSetRole(user) {
      // this.currUsername = user.username;
      this.formdata = user;
      this.currUserId = user.id;
      this.dialogFormVisibleRole = true;

      //获取角色名称
      const res = await this.$http.get(`roles`);
      console.log(res);
      this.roles = res.data.data;

      // /给下拉框绑定value值
      const res2 = await this.$http.get(`users/${user.id}`);
      // console.log(res2);
      this.selectVal = res2.data.data.rid;
    },

    // 用户状态功能
    async changeseat(user) {
      // console.log(user);
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      console.log(res);
    },

    // 编辑功能--发送请求
    async editUser() {
      const res = await this.$http.put(
        `users/${this.formdata.id}`,
        this.formdata
      );
      console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        // 关闭对话框
        this.dialogFormVisibleEdit = false;
        // 更新表格
        this.getTableDate();
      }
    },
    // 编辑功能-显示对话框
    showDiaEditUser(user) {
      // 获取当前用户的数据
      // this.formdata = user;
      this.dialogFormVisibleEdit = true;
      this.formdata.username = user.username;
      this.formdata.email = user.email;
      this.formdata.mobile = user.mobile;
    },

    // 删除功能--显示提示框
    showMsgBoxDele(user) {
      console.log(user);
      this.$confirm("确定删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 用户id
          const res = await this.$http.delete(`users/${user.id}`);
          console.log(res);
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.$message.success(msg);
            this.pagenum = 1;
            this.getTableDate();
          }
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },

    // 添加用户-发送请求
    async adduser() {
      // 发送请求
      const res = await this.$http.post(`users`, this.formdata);
      // console.log(res)
      const {
        // 删除了一个msg,
        meta: { msg, status }
      } = res.data;
      if (status === 201) {
        // 关闭对话框
        this.dialogFormVisibleAdd = false;
        // 更新表格
        this.getTableDate();
      }
    },

    // 添加用户->打开对话框
    showDiaAddUser() {
      this.dialogFormVisibleAdd = true;
      // 清空表单元素
      this.formdata = {};
    },

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
        meta: { msg, status }
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
