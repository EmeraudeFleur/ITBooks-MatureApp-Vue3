<template>
  <nav-bar>
    <template v-slot:default>Category</template>
  </nav-bar>

  <div id="main-area">
    <p class="sort">Sort by:</p>
    <div class="sort-tab">
      <van-tabs v-model="active" color="#eb331b" @click="tabClick">
        <van-tab
          v-for="title in ['Sales', 'Price', 'Reviews']"
          :title="title"
          :key="title"
        >
        </van-tab>
      </van-tabs>
    </div>
    <van-sidebar class="left-menu" v-model="activeKey">
      <van-collapse v-model="activeName" accordion>
        <van-collapse-item
          v-for="cty in categories.slice(0, 5)"
          :key="cty.id"
          :title="cty.name"
          :name="cty.id"
        >
          <van-sidebar-item
            v-for="item in cty.children"
            :key="item.id"
            :title="item.name"
            :name="item.name"
            @click="getGoods(item.id)"
          />
        </van-collapse-item>
      </van-collapse>
    </van-sidebar>

    <div class="goods-list">
      <div class="content">
        <van-card
          @click="goDetail(item.id)"
          v-for="item in showGoods"
          :key="item.id"
          :tag="item.collects_count > 10 ? 'Hot' : 'Tag'"
          :price="item.price"
          :title="item.title"
          :desc="item.updated_at"
          :thumb="item.cover_url"
          :lazy-load="true"
        />
      </div>
    </div>
  </div>
  <back-top v-show="showArrow" @click="toTop"></back-top>
</template>

<script>
import NavBar from "components/common/navBar/NavBar";
import { ref, reactive, onMounted, computed, nextTick } from "vue";
import { getCategories, getCategoryGoods } from "network/category";
import BetterScroll from "better-scroll";
import BackTop from "components/common/backTop/BackTop";
import { useRouter } from "vue-router";
export default {
  components: { NavBar, BackTop },
  setup() {
    let active = ref(0);
    let activeName = ref(0);
    let activeKey = ref(0);

    let bscroll = reactive({});
    let showArrow = ref(false);

    const categories = ref([]);
    const currentSortType = ref("sales");
    const currentCtyId = ref(0);
    const goods = reactive({
      sales: { page: 1, list: [] },
      price: { page: 1, list: [] },
      comments_count: { page: 1, list: [] },
    });
    //computed data to show as sorted
    const showGoods = computed(() => {
      return goods[currentSortType.value].list;
    });

    //get data in onMounted default & after clicked in second level menu
    const init = () => {
      getCategoryGoods("sales", currentCtyId.value).then((res) => {
        goods.sales.list = res.goods.data;
      });
      getCategoryGoods("price", currentCtyId.value).then((res) => {
        goods.price.list = res.goods.data;
      });
      getCategoryGoods("comments_count", currentCtyId.value).then((res) => {
        goods.comments_count.list = res.goods.data;
      });
    };

    //get data to traverse for left menu
    onMounted(() => {
      getCategories().then((res) => {
        categories.value = res.categories;
      });
      getCategoryGoods().then((res) => {
        goods.sales.list = res.goods.data;
      });

      bscroll = new BetterScroll(document.querySelector(".goods-list"), {
        probeType: 2, //0,1,2,3 different moments to trigger scroll event
        click: true, //clicks on the list still work.
        pullUpLoad: true,
        // scrollbar: true,
      });
      document.addEventListener("touchmove", function (e) {
        e.preventDefault();
      });
      bscroll.on("pullingUp", () => {
        // document.addEventListener("touchmove", function (e) {
        //   e.preventDefault();
        // });

        const nextPage = goods[currentSortType.value].page + 1;
        getCategoryGoods(currentSortType.value, nextPage).then((res) => {
          goods[currentSortType.value].page += 1;
          res && goods[currentSortType.value].list.push(...res.goods.data);
        });
        bscroll.finishPullUp();
        bscroll.refresh();
      });

      bscroll.on("scroll", (position) => {
        showArrow.value = -position.y > 500;
      });
    });

    //sort tab event
    const tabClick = (index) => {
      const sortTypes = ["sales", "price", "comments_count"];
      currentSortType.value = sortTypes[index];
      getCategoryGoods(currentSortType.value, currentCtyId.value).then(
        (res) => {
          goods[currentSortType.value].list = res.goods.data;
        }
      );
      nextTick(() => {
        bscroll && bscroll.refresh();
      });
    };

    //category menu event
    const getGoods = (ctyId) => {
      currentCtyId.value = ctyId;
      init();
    };
    const toTop = () => {
      bscroll.scrollTo(0, 0, 500); //x=0,y=0,time=500ms
    };
    const router = useRouter();
    return {
      active,
      activeName,
      activeKey,
      categories,
      tabClick,
      currentSortType,
      getGoods,
      currentCtyId,
      goods,
      showGoods,
      toTop,
      showArrow,
      goDetail: (id) => {
        router.push({ path: "/detail", query: { id } });
      },
    };
  },
};
</script>

<style lang="scss" scoped>
#main-area {
  margin-top: 45px;
  position: relative;

  p.sort {
    font-size: 14px;
    position: fixed;
    left: 30px;
    top: 60px;
    z-index: 5;
  }

  .sort-tab {
    display: block;
    height: 40px;
    position: fixed;
    left: 130px;
    right: 0;
    z-index: 5;
  }

  .left-menu {
    display: inline-block;
    width: 130px;
    position: fixed;
    top: 85px;
    left: 0;
    z-index: 5;

    //overwritting vant component styles(checking selector names in devtools elements)
    //solution: 1-delete scoped. 2-deepen selectors: .a>>>.b ; :deep
    :deep .van-collapse-item__title {
      padding: 10px 0;
      text-align: left;
      & .van-cell__title {
        //be careful with the space in between, no space means at the same element
        max-width: 100px; //when width doesn't work
        padding-left: 30px;
      }
    }

    :deep .van-collapse-item__content {
      padding: 0;

      .van-sidebar-item {
        position: relative;
        left: 40px;
        padding: 5px 0 5px 20px;
        font-size: 12px;
        text-align: left;

        .van-sidebar-item__text {
          padding: 0;
        }
      }

      .van-sidebar-item--select::before {
        background-color: #eb331b;
      }
    }
  }

  .goods-list {
    display: inline-block;
    height: 100vh;
    position: absolute;
    top: 40px;
    left: 130px;
    right: 0;
    text-align: left;

    .van-card {
      background: none;
      margin: 8px 0 0;
      padding: 5px 15px 0 0;
    }
  }
}
</style>
