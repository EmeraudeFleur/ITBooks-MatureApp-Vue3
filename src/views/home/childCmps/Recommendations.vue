<template>
  <div id="recommendations">
    <div class="recom-item" v-for="item in recomds.slice(0, 4)" :key="item.id">
      <!-- 2 ways of redirecting pages -1.add query in method -2.add params in router config  -->
      <!-- .prevent prevents the default behaviour of navigating to the location in the href attribute -->
      <a href="" @click.prevent="goDetail(item.id)">
        <!-- <a
        :href="{
          name: 'Detail',
          params: { id: item.id },
        }"
      > -->
        <img v-lazy="item.cover_url" alt="" />
        <p>{{ item.title }}</p>
      </a>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
export default {
  props: {
    //write props in this way (if props data are arrays or objects) to traverse/iterate items even when empty. ##default is in function form
    recomds: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  setup() {
    const router = useRouter();
    const goDetail = (id) => {
      router.push({ path: "/detail", query: { id } });
    };
    return {
      goDetail,
    };
  },
};
</script>

<style scoped lang="scss">
#recommendations {
  display: flex;
  width: 100%;
  text-align: center;
  padding: 20px 0 20px;
  border-bottom: 8px solid #eee;

  .recom-item {
    flex: 1;

    img {
      width: 60px;
      height: 70px;
    }
  }

  p {
    font-size: 12px;
    padding-top: 5px;
  }
}
</style>
