import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui';
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Users from '../components/users.vue'
import Rights from '../components/rights.vue'
import Roles from '../components/roles.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [{
        name: 'users',
        path: '/users',
        component: Users
      }, {
        name: 'rights',
        path: '/rights',
        component: Rights
      }, {
        name: 'roles',
        path: '/roles',
        component: Roles
      }]
    }, {
      name: 'login',
      path: '/login',
      component: Login
    }
  ]
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  // 如果要去登录login
  if (to.name === 'login') {
    next()
  } else {
    // 如果不去登录login
    const token = localStorage.getItem('token')
    if (!token) {
      // 提示
      Message.warning('请先登录')
      // this.$router.push({ name: 'login' })
      router.push({
        name: 'login'
      })
      return;
    }
    next()
  }
  // console.log(to, from)
  // next方法

})
export default router;


// if (!localStorage.getItem("token")) {
//   this.$router.push({
//     name: "login"
//   });
//   this.$message.warning("请先登录");
// }