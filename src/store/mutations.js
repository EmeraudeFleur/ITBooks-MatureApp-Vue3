const mutations = {
  setLoggedIn(state, payload) {
    state.user.loggedIn = payload;
  },
  addCart(state, payload) {
    state.cartCount = payload.count;
  },
};

export default mutations;
