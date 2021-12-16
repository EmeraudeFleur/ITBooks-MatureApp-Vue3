import { getCart } from "network/cart";

const actions = {
  //{commit}  = context.commit =/= store.commit
  updateCart({ commit }) {
    getCart().then((res) => {
      //   console.log("getCart data", res);
      //get cart list from backend. use array length as the total count in cart
      commit("addCart", { count: res.data.length || 0 }); //context.commit
    });
  },
};

export default actions;
