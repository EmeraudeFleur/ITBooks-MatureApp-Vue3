<template>
  <nav-bar>
    <template v-slot:default>Book Detail</template>
  </nav-bar>
  <div class="main">
    <img v-lazy="detail.cover_url" alt="" />

    <van-card
      :num="detail.stock"
      :title="detail.title"
      :desc="detail.description"
      :price="detail.price + '.00'"
    >
      <template #tags>
        <van-tag plain type="danger">{{
          detail.stock === 0 ? "Out of stock" : "Tag"
        }}</van-tag>
      </template>
      <template #footer>
        <van-button type="warning" @click="addToCart">Add to cart</van-button>
        <van-button type="danger" @click="goToCart">Buy now</van-button>
      </template>
    </van-card>

    <van-tabs v-model="activeName">
      <van-tab title="Summary" name="a">
        <!-- <div class="summary">{{ detail.details }}</div> -->
        <div class="summary" v-html="detail.details"></div>
      </van-tab>
      <van-tab title="Reviews" name="b"> </van-tab>
      <van-tab title="Relevant" name="c">
        <goods-list :goods="like_goods"></goods-list>
        <!-- ### this only refreshes the relevant section -->
        <!-- <goods-list :goods="like_goods" :key="$route.query.id"></goods-list> -->
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import NavBar from "components/common/navBar/NavBar";
import { useRoute, useRouter } from "vue-router";
import { ref, reactive, onMounted, toRefs, watch } from "vue";
import { getDetail } from "network/detail";
import { addCart } from "network/cart";
import GoodsList from "components/content/goods/GoodsList";
import { useStore } from "vuex";
import { Toast } from "vant";
export default {
  components: { NavBar, GoodsList },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const activeName = ref("a");
    let id = ref(0);
    let book = reactive({
      detail: {},
      like_goods: [],
    });
    onMounted(() => {
      id.value = route.query.id;
      getDetail(id.value).then((res) => {
        book.detail = res.goods;
        book.like_goods = res.like_goods;
      });
    });

    //reload Detail when click on any relevant book
    watch(route, (to, from) => {
      location.reload();
    });

    const addToCart = () => {
      if (book.detail.stock === 0) {
        Toast("Sorry, this book is currently out of stock");
      } else {
        //add item to backend
        addCart({ goods_id: id.value, num: 1 }).then((res) => {
          if (res.status == "204" || res.status == "201") {
            Toast.success("Added!");
            //backend success then manage state change
            store.dispatch("updateCart");
          }
        });
      }
    };

    const goToCart = () => {
      if (book.detail.stock === 0) {
        Toast("Sorry, this book is currently out of stock.");
      } else {
        addCart({ goods_id: id.value, num: 1 }).then((res) => {
          if (res.status == "204" || res.status == "201") {
            store.dispatch("updateCart");
            router.push({ path: "/cart" });
          }
        });
      }
    };

    return {
      id,
      ...toRefs(book),
      activeName,
      addToCart,
      goToCart,
    };
  },
};
</script>

<style scoped>
.main {
  width: 100vw;
  z-index: inherit;
  margin-top: 50px;
  margin-bottom: 60px;
}
.main > img {
  max-width: 100%;
}
.van-card {
  padding-left: 60px;
  text-align: left;
}

:deep .van-tabs__line {
  z-index: inherit;
}

:deep .summary img {
  max-width: 100%;
  height: auto;
}
</style>
