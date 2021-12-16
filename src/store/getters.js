import store from ".";

const getter = {
  loggedIn(state) {
    return state.user.loggedIn;
  },
};

export default getter;
