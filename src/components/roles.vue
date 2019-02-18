<template>
  <el-card class="box">
    <cus-bread level1="权限管理" level2="角色列表"></cus-bread>
    <el-button class="btn" size="medium">添加角色</el-button>
    <!-- 表格 -->
    <el-table height="400px" :data="roles" style="width: 100%">
      <el-table-column type="expand" width="80">
        <template slot-scope="scope">
          <!-- 行列布局 -->
          <el-row class="level1" v-for="(item1) in scope.row.children" :key="item1.id">
            <el-col :span="4">
              <el-tag closable type="primary">{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row class="level2" v-for="(item2) in item1.children" :key="item2.id">
                <el-col :span="4">
                  <el-tag closable type="info">{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    type="danger"
                    v-for="(item3) in item2.children"
                    :key="item3.id"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row v-if="scope.row.children.length===0">
            <el-col>
              <span>未分配权限</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="180"></el-table-column>
      <el-table-column prop="roleName" label="用户名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="300"></el-table-column>

      <el-table-column label="操作" width="200">
        <!--   下面template的属性 slot-scope="scope" -->
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
          <el-button
            @click="showDiaSetRights(scope.row)"
            plain
            size="mini"
            type="success"
            icon="el-icon-check"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: []
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    showDiaSetRights() {},
    async getRoles() {
      const res = await this.$http.get(`roles`);
      console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.roles = data;
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.btn {
  margin-top: 20px;
}
.level1,
.level2 {
  margin-bottom: 20px;
}
</style>
