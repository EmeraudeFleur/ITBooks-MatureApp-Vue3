<template>
  <div id="home">
    <nav-bar>
      <template v-slot:default>ITBooks</template>
    </nav-bar>

    <!-- tab-nav first hidden, when scrolling content is longer than certain num, show it fixed to top -->
    <tab-nav
      v-if="tabFixed"
      :titles="['Popular', 'New', 'Selected']"
      :tabIndex="tabIndex"
      @tabClick="tabClick"
    ></tab-nav>

    <div ref="wrapper" class="wrapper">
      <div class="content">
        <div ref="aboveTabs">
          <home-carousel :banners="banners"></home-carousel>

          <!-- deliver data to Recommendations -->
          <recommendations :recomds="recomds"></recommendations>
        </div>

        <tab-nav
          :titles="['Popular', 'New', 'Selected']"
          :tabIndex="tabIndex"
          @tabClick="tabClick"
        ></tab-nav>
        <!-- <goods-list :goods="currentGoods"></goods-list> -->
        <goods-list :goods="currentGoods"></goods-list>
      </div>
    </div>

    <back-top v-show="tabFixed" @click="toTop"></back-top>
  </div>
</template>

<script>
import NavBar from "components/common/navBar/NavBar";
import Recommendations from "./childCmps/Recommendations";
import TabNav from "components/content/tabNav/TabNav";
import GoodsList from "components/content/goods/GoodsList";
import BackTop from "components/common/backTop/BackTop";
import HomeCarousel from "./childCmps/HomeCarousel";
import { getHomeData, getHomeGoods } from "@/network/home";
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import BetterScroll from "better-scroll";

export default {
  components: {
    NavBar,
    Recommendations,
    TabNav,
    GoodsList,
    BackTop,
    HomeCarousel,
  },

  setup() {
    const tabIndex = ref(0);

    let tabFixed = ref(false);
    const aboveTabs = ref(null);
    const recomds = ref([]);
    const banners = ref([]);

    const goods = reactive({
      sales: { page: 1, list: [] },
      new: { page: 1, list: [] },
      recommend: { page: 1, list: [] },
    });

    let currentType = ref("sales");
    const currentGoods = computed(() => {
      return goods[currentType.value].list;
    });

    // provide(
    //   "currentGoods",
    //   computed(() => {
    //     return goods[currentType.value].list; //Accessing JavaScript Properties syntax
    //   })
    // );

    const wrapper = ref(null);
    let bscroll = reactive({});
    onMounted(() => {
      getHomeData().then((res) => {
        recomds.value = res.goods.data;
        banners.value = res.slides;
      });

      //tab-nav data, 3 sections. get data , then use computed property to filter relevant to deliver to GoodList
      getHomeGoods("sales").then((res) => {
        goods.sales.list = res.goods.data;
      });
      getHomeGoods("new").then((res) => {
        goods.new.list = res.goods.data;
      });
      getHomeGoods("recommend").then((res) => {
        goods.recommend.list = res.goods.data;
      });

      //create better-scroll object 必须要等到DOM渲染完成后，再new BScroll();
      bscroll = new BetterScroll(wrapper.value, {
        probeType: 2, //0,1,2,3 different moments to trigger scroll event
        click: true, //clicks on the list still work.
        pullUpLoad: true,
        // scrollbar: true,
      });

      //pulling up event
      bscroll.on(
        "pullingUp",
        () => {
          // console.log("pulling up to load more");

          //append more data from 2nd page onwards
          const nextPage = goods[currentType.value].page + 1;
          getHomeGoods(currentType.value, nextPage).then((res) => {
            goods[currentType.value].page += 1;
            res && goods[currentType.value].list.push(...res.goods.data);
          });
          bscroll.finishPullUp();
          //recalculate size of content after refresh
          bscroll.refresh();
          // console.log(
          //   "contentHeight",
          //   document.querySelector(".content").clientHeight
          // );
          // console.log(currentType.value, loadingPage);
        },
        { passive: true }
      );

      //logging positions
      bscroll.on(
        "scroll",
        (position) => {
          // console.log(position.y); //vertical position, negative value
          // console.log(aboveTabs.value.offsetHeight); //height of an element, including padding and border
          tabFixed.value = -position.y > aboveTabs.value.offsetHeight;
        },
        { passive: true }
      );
    });
    // watchEffect(() => {});
    const tabClick = (index) => {
      tabIndex.value = index;
      let types = ["sales", "new", "recommend"];
      currentType.value = types[index];
      //when switching section, refresh and recalculate the content height
      //better-scroll自主检测子元素高度可能会计算不及时，所以你需要在子元素渲染完毕时，
      //调用better-scroll的refresh,重新计算高度

      nextTick(() => {
        bscroll && bscroll.refresh();
      });
    };

    const toTop = () => {
      bscroll.scrollTo(0, 0, 500); //x=0,y=0,time=500ms
    };

    return {
      recomds,
      tabClick,
      goods,
      currentGoods,
      wrapper,
      tabFixed,
      aboveTabs,
      toTop,
      tabIndex,
      banners,
    };
  },
};
</script>

<style scoped>
#home {
  /* whole viewport height */
  height: 100vh;
  position: relative;
}

div.wrapper {
  position: absolute;
  top: 45px;
  bottom: 50px;
  left: 0;
  right: 0;
  overflow: hidden;
}
</style>
