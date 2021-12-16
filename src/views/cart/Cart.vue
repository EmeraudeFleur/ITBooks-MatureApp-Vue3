<template>
  <nav-bar>
    <template v-slot:default> Shopping Cart </template>
  </nav-bar>

  <div class="cart-box">
    <div class="cart-body">
      <van-checkbox-group
        ref="checkboxGroup"
        v-model="result"
        @change="groupChange"
      >
        <van-swipe-cell
          :right-width="50"
          v-for="(item, index) in list"
          :key="index"
        >
          <div class="good-item">
            <van-checkbox :name="item.id" checked-color="#6bc488" />
            <div class="good-img">
              <!-- <router-link :to="{ name: 'Detail', query: { id: item.id } }">
                <img :src="item.goods.cover_url" alt="" />
              </router-link> -->
              <img :src="item.goods.cover_url" alt="" />
            </div>
            <div class="good-desc">
              <div class="good-title">
                <span>{{ item.goods.title }}</span>
                <span>x{{ item.goods.stock }}</span>
              </div>
              <div class="good-btn">
                <div class="price">
                  <small>¥</small>{{ item.goods.price + ".00" }}
                </div>
                <van-stepper
                  integer
                  :min="1"
                  :max="item.goods.stock"
                  :model-value="item.num"
                  :name="item.id"
                  async-change
                  @change="onChange"
                />
              </div>
            </div>
          </div>
          <template #right>
            <van-button
              square
              icon="delete"
              type="danger"
              class="delete-button"
              @click="deleteItem(item.id)"
            />
          </template>
        </van-swipe-cell>
      </van-checkbox-group>
    </div>

    <van-submit-bar
      v-if="list.length"
      class="submit-all"
      :price="total * 100"
      @submit="onSubmit"
      button-text="Check out"
    >
      <!-- v-model argument-->
      <van-checkbox
        @click="checkAll"
        v-model:checked="allChecked"
        checked-color="#6bc488"
        >Check all</van-checkbox
      >
    </van-submit-bar>

    <div class="empty" v-else>
      <img class="empty-cart" src="~assets/images/empty-cart.png" alt="" />
      <div class="title">Cart is empty...</div>
      <van-button round color="#6bc488" type="primary" block @click="goShopping"
        >Go shopping</van-button
      >
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navBar/NavBar";
import { reactive, toRefs, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { getCart, deleteCartItem, checkedCart, modifyCart } from "network/cart";
import { Toast } from "vant";
export default {
  setup() {
    const router = useRouter();
    const store = useStore();

    const state = reactive({
      list: [],
      result: [], //array of item ids for checkbox-group v-model
      allChecked: true,
    });

    // initiate cart data.
    const init = () => {
      Toast.loading({ message: "loading...", forbidClick: true });
      //get cart data
      getCart("include=goods").then((res) => {
        state.list = res.data;
        //map calls a provided callbackFn function once for each element in an array, in order, and constructs a new array from the results
        state.result = res.data
          .filter((n) => n.is_checked == 1)
          .map((item) => item.id);
        //thus. constructs an array of ids from the items checked
        Toast.clear();
      });
    };

    //deep nested watch... refer to lodash.cloneDeep
    // watch(
    //   () => state.result,
    //   () => {
    //     "deep", console.log("00", state.result);
    //   }
    // );

    onMounted(() => {
      init();
    });

    //## individual checked
    // async change van-stepper book num. change event returns > value: string, detail: { name: string }
    const onChange = (value, detail) => {
      Toast.loading({ message: "updating...", forbidClick: true }); //avoid double click
      //update num to backend
      modifyCart(detail.name, { num: value }).then((res) => {
        //when backend data modified, also update the num in list array.
        state.list.forEach((item) => {
          if (item.id === detail.name) {
            item.num = value;
          }
        });
        Toast.clear();
      });
    };

    //## group checked effect, change allChecked radio button based on individual checks
    const groupChange = (result) => {
      if (result.length === state.list.length) {
        state.allChecked = true;
      } else {
        state.allChecked = false;
      }
      checkedCart({ cart_ids: result }); // update backend checked items in cart.
    };

    //checkAll button toggle allChecked state. result change will trigger groupChange and toggle allChecked value.
    const checkAll = () => {
      if (!state.allChecked) {
        state.result = state.list.map((item) => item.id);
      } else {
        state.result = [];
      }
    };

    //swipe left to delete
    const deleteItem = (id) => {
      deleteCartItem(id).then((res) => {
        init(); //reload cart data
        store.dispatch("updateCart"); //update cart number
      });
    };

    // compute total price
    const total = computed(() => {
      let sum = 0;
      state.list
        //use state.result(filtered above) to filter is_checked, but use num and price from state.list data
        .filter((item) => state.result.includes(item.id)) //The includes() method determines whether an array includes a certain value among its entries, returning true or false as appropriate.
        .forEach((item) => {
          sum += parseInt(item.num) * parseFloat(item.goods.price);
        });
      return sum;
    });

    const onSubmit = () => {
      if (state.result.length == 0) {
        Toast.fail("Please select items to check out.");
        return;
      } else {
        router.push("CreateOrder");
      }
    };

    const goShopping = () => {
      router.push("/");
    };

    return {
      ...toRefs(state),
      onChange,
      groupChange,
      checkAll,
      deleteItem,
      total,
      onSubmit,
      goShopping,
    };
  },

  components: {
    NavBar,
  },
};
</script>

<style scoped lang="scss">
.cart-box {
  .cart-body {
    margin-top: 50px;
    padding-left: 20px;
    .good-item {
      display: flex;
      .good-img {
        img {
          width: 100px;
          height: auto;
        }
      }
      .good-desc {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        padding: 20px;
        .good-title {
          display: flex;
          justify-content: space-between;
        }
        .good-btn {
          display: flex;
          justify-content: space-between;
          .price {
            font-size: 16px;
            color: red;
            line-height: 28px;
          }
          .van-icon-delete {
            font-size: 20px;
            margin-top: 4px;
          }
        }
      }
    }
    .delete-button {
      width: 50px;
      height: 100%;
    }
  }
  .empty {
    width: 50%;
    margin: 0 auto;
    text-align: center;
    margin-top: 200px;
    .empty-cart {
      width: 150px;
      margin-bottom: 20px;
    }
    .van-icon-smile-o {
      font-size: 50px;
    }
    .title {
      font-size: 16px;
      margin-bottom: 20px;
    }
  }
  .submit-all {
    margin-bottom: 50px;
    .van-checkbox {
      margin-left: 5px;
    }
    .van-submit-bar__text {
      margin-right: 10px;
    }
    .van-submit-bar__button {
      background: red;
    }
  }
  .van-checkbox__icon--checked .van-icon {
    background-color: red;
    border-color: red;
  }
}
</style>
