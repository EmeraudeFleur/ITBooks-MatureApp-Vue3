<template>
  <div
    class="goods-item"
    v-for="g in goods"
    :key="g.id"
    @click="goDetail(g.id)"
  >
    <img v-lazy="g.cover_url" alt="" />
    <div class="goods-info">
      <p>{{ g.title }}</p>
      <span class="price"><small>€</small>{{ g.price }}</span>
      <span class="collected">{{ g.collects_count }}</span>
    </div>
  </div>
</template>

<script>
import { inject } from "vue";
import { useRouter } from "vue-router";
export default {
  setup() {
    const goods = inject("currentGoods");

    const router = useRouter();
    return {
      goods,
      goDetail: (id) => {
        router.push({ path: "/detail", query: { id } });
      },
    };
  },
};
</script>

<style scoped lang="scss">
.goods-item {
  width: 46%; //8% space in between
  padding: 20px 0;
  position: relative; //usually outer box positioned in relative, inner box absolute

  img {
    width: 100%;
    border-radius: 5px;
    padding-bottom: 20px;
  }

  div.goods-info {
    font-size: 12px;
    position: absolute; //absolute in parent div box
    bottom: 5px;
    left: 0;
    right: 0;

    p {
      overflow: hidden;
      text-overflow: ellipsis; //...at the end
      white-space: nowrap;
      margin: 3px 0;
    }

    span.price {
      color: red;
      margin-right: 5px;
    }

    span.collected {
      position: relative;
    }

    .collected::before {
      position: relative;
      content: ""; //inserting using content cannot resize, background can
      //background contains background-image
      //background: bg-color bg-image position/bg-size bg-repeat bg-origin bg-clip bg-attachment initial|inherit;
      //background:url(smiley.gif) 10px 20px/50px 50px;10px to left, 20px to top, image size 50 pixels wide and 50 pixels high.
      background: url("~assets/images/collect.png") 0 0/15px 15px;
      display: inline-block;
      // background-size: 14px 14px; //image size
      width: 15px; //box size
      height: 15px;
      top: 3px;
    }
  }
}
</style>
