<template>
  <el-card class="box">
    <cus-bread level1="商品管理" level2="商品列表"></cus-bread>
    <el-alert class="alert" title="添加商品信息" type="info" center show-icon></el-alert>

    <!-- 步骤条 -->
    <el-steps :active="active*1" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>

    <!-- 标签页 -->
    <el-form class="form" label-position="top" label-width="80px" :model="form">
      <el-tabs @tab-click="changeTab()" v-model="active" tab-position="left">
        <el-tab-pane name="1" label="基本信息">
          <!-- 1 -->
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 表单元素  级联选择器-->
            <el-cascader
              clearable
              expand-trigger="hover"
              :options="options"
              :props="defaultProp"
              v-model="selectedOptions"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane name="2" label="商品参数">
          <el-form-item :label="item1.attr_name " v-for="(item1) in arrDy" :key="item1.attr_id">
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox border :label="item2" v-for="(item2,i) in item1.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane name="3" label="商品属性">
          <el-form-item :label="item.attr_name" v-for="(item) in arrStatic" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane name="4" label="商品图片">
          <el-form-item>
            <el-upload
              action="http://localhost:8888/api/private/v1/upload"
              :headers="headers"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">商品内容</el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      active: "1",
      //   添加商品表单数据
      form: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        goods_cat: "",
        pics: "",
        attrs: ""
      },
      //   级联使用的数据
      options: [],
      selectedOptions: [1, 3, 6],
      defaultProp: {
        label: "cat_name",
        value: "cat_id"
      },

      //动态参数数组
      arrDy: [],
      // 静态参数数组
      arrStatic: [],
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    // 图片上传相关方法
    handleRemove(file, fileList) {
      // console.log("remove---");
      console.log(file);
    },
    handleSuccess(response, file, fileList) {
      // console.log("chenggong");
      console.log(response);
    },
    // 点击tab触发
    async changeTab() {
      // 若果点了第二个tab
      if (this.active === "2" || this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          // 提示
          this.$message.error("请先选择三级分类");
          return;
        }
        // 获取静态数据
        if (this.active === "3") {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          // console.log(res);
          const {
            meta: { msg, status },
            data
          } = res.data;
          if (status === 200) {
            this.arrStatic = data;
            console.log(this.arrStatic);
          }
        }

        //获取动态参数数据
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        // console.log(res);
        const {
          meta: { msg, status },
          data
        } = res.data;
        if (status === 200) {
          this.arrDy = data;
          // console.log("----");
          // console.log(this.arrDy);
          this.arrDy.forEach(item => {
            // 空字符串处理
            // if (item.attr_vals.length === 0) {
            //   item.attr_vals = [];
            // } else {
            //   item.attr_vals = item.attr_vals.trim().split(",");
            // }
            item.attr_vals =
              item.attr_vals.trim().length === 0
                ? []
                : item.attr_vals.trim().split(",");
          });
        }
      }
    },
    //   获取三级商品分类数据
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      // console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.options = data;
      }
    },
    handleChange() {}
  }
};
</script>

<style>
.box {
  height: 100%;
}
.alert {
  margin: 20px 0px;
}
.form {
  height: 350px;
  overflow: auto;
}
</style>
