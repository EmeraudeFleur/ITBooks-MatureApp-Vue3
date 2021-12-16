<template>
  <div class="tab-nav">
    <!-- tab names are delivered from Home component -->
    <!-- add a class active munually to test styling, then add method to identify the active item and add dynamic active class -->
    <div
      class="tab-item"
      v-for="(title, index) in titles"
      :key="index"
      @click="itemClick(index)"
      :class="{ active: index == tabIndex }"
    >
      <span>{{ title }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    titles: {
      type: Array,
      default() {
        return [];
      },
    },
    tabIndex: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    //two parameters: props, context(emit in this) cannot use {emit} alone
    const itemClick = (index) => {
      emit("tabClick", index);
    };

    return {
      itemClick,
    };
  },
};
</script>

<style scoped lang="scss">
.tab-nav {
  display: flex;
  height: 40px;
  width: 100%;
  line-height: 40px;
  font-size: 14px;
  // make the tab-nav fixed while scrolling
  position: sticky;
  top: 44px;
  background-color: #ffffff;
  z-index: 9;

  .tab-item {
    flex: 1;

    span {
      padding: 5px 10px;
    }
  }

  .active {
    color: var(--color-tint);

    span {
      border-bottom: 2px solid var(--color-tint);
    }
  }
}
</style>
