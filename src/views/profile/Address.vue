<template>
  <div class="address-box">
    <nav-bar class="nav-bar">
      <template v-slot:default> Address </template>
    </nav-bar>

    <p class="empty" v-show="list.length == 0">Address book is empty...</p>

    <div class="address-item">
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="Default"
        @add="onAdd"
        @edit="onEdit"
      />
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import NavBar from "components/common/navBar/NavBar";
import { getAddressList } from "network/address";
import { useRouter } from "vue-router";
export default {
  components: {
    NavBar,
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      chosenAddressId: "1",
      list: [],
    });

    onMounted(() => {
      //get addressList
      getAddressList().then((res) => {
        if (res.data.length === 0) {
          state.list = [];
          return;
        }

        state.list = res.data.map((item) => {
          //follow the data format of the ui library
          return {
            id: item.id,
            name: item.name,
            tel: item.phone,
            address: `${item.province} ${item.city} ${item.county} ${item.address}`,
            isDefault: !!item.is_default, //0/1 => true/false. is_default=way of written in backend
          };
        });
      });
    });

    const onAdd = () => {
      router.push({ path: "/addressedit", query: { type: "add" } });
    };

    const onEdit = (item) => {
      router.push({
        path: "/addressedit",
        query: { type: "edit", addressId: item.id },
      });
    };

    return {
      ...toRefs(state),
      onAdd,
      onEdit,
    };
  },
};
</script>

<style lang="scss">
p.empty {
  margin-top: 200px;
  text-align: center;
}
.address-box {
  height: 300px;
  .van-radio__icon {
    display: none;
  }
  .address-item {
    margin-top: 45px;
    .van-button {
      background: var(--color-tint);
      border-color: var(--color-tint);
    }
  }
}
.van-address-list__bottom {
  bottom: 100px;
  background: 0;
}
</style>
