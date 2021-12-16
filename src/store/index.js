import { createStore } from "vuex";
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

const state = {
  // detailId: 0,
  user: {
    loggedIn: window.localStorage.getItem("token") ? true : false,
  },
  cartCount: 0,
};

export default createStore({
  state,
  mutations,
  actions,
  getters,
});
