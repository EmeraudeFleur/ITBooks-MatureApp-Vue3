import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import { Toast } from "vant";
const Home = () => import("views/home/Home.vue");

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "ITBooks",
    },
  },
  {
    path: "/category",
    name: "Category",
    component: () => import("../views/category/Category.vue"),
    meta: {
      title: "ITBooks-Category",
    },
  },
  {
    path: "/detail",
    name: "Detail",
    component: () => import("../views/detail/Detail.vue"),
    meta: {
      title: "ITBooks-Detail",
    },
  },
  {
    path: "/cart",
    name: "Cart",
    component: () => import("../views/cart/Cart.vue"),
    meta: {
      title: "ITBooks-ShoppingCart",
      isAuthRequired: true,
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/profile/Profile.vue"),
    meta: {
      title: "ITBooks-Profile",
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/profile/Register.vue"),
    meta: {
      title: "ITBooks-Register",
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/profile/Login.vue"),
    meta: {
      title: "ITBooks-Login",
    },
  },
  {
    path: "/address",
    name: "Address",
    component: () => import("../views/profile/Address"),
    meta: {
      title: "ITBooks-Address",
      isAuthRequired: true,
    },
  },
  {
    path: "/addressedit",
    name: "AddressEdit",
    component: () => import("../views/profile/AddressEdit"),
    meta: {
      title: "ITBooks-EditAddress",
      isAuthRequired: true,
    },
  },
  {
    path: "/order",
    name: "Order",
    component: () => import("../views/order/Order"),
    meta: {
      title: "ITBooks-Orders",
      isAuthRequired: true,
    },
  },
  {
    path: "/createorder",
    name: "CreateOrder",
    component: () => import("../views/order/CreateOrder"),
    meta: {
      title: "ITBooks-Order",
      isAuthRequired: true,
    },
  },
  {
    path: "/orderdetail",
    name: "OrderDetail",
    component: () => import("../views/order/OrderDetail"),
    meta: {
      title: "ITBooks-Order",
      isAuthRequired: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

//navigation guards.
router.beforeEach((to, from, next) => {
  //if not logged in, redirect to login page
  if (to.meta.isAuthRequired && store.state.user.loggedIn === false) {
    Toast("Please log in first!");
    return next("/login");
  } else {
    next();
  }
  document.title = to.meta.title;
});

export default router;
