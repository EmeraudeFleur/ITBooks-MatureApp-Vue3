<template>
  <div class="address-edit-box">
    <nav-bar class="nav-bar">
      <template v-slot:default>
        {{ title }}
      </template>
    </nav-bar>
    <van-address-edit
      :area-list="areaList"
      :address-info="addressInfo"
      :show-delete="type == 'edit'"
      show-set-default
      :area-columns-placeholder="['Choose', 'Choose', 'Choose']"
      @save.once="onSave"
      @delete="onDelete"
    />
  </div>
</template>

<script>
import NavBar from "components/common/navBar/NavBar";
import { reactive, onMounted, toRefs, computed } from "vue";
import { Dialog, Toast } from "vant";
import {
  addAddress,
  editAddress,
  deleteAddress,
  getAddressDetail,
} from "network/address";
import { tdist } from "utils/address";
import { useRoute, useRouter } from "vue-router";
export default {
  components: {
    NavBar,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      areaList: {
        province_list: {},
        city_list: {},
        county_list: {},
      },
      addressInfo: {},
      type: "add",
      addressId: "",
      title: "",
    });

    onMounted(() => {
      //construct areaList
      let _province_list = {};
      let _city_list = {};
      let _county_list = {};

      //3 levels nested data access from address book
      tdist.getLev1().forEach((p) => {
        _province_list[p.id] = p.text;
        tdist.getLev2(p.id).forEach((c) => {
          _city_list[c.id] = c.text;
          tdist.getLev3(c.id).forEach((q) => {
            _county_list[q.id] = q.text;
          });
        });
      });
      state.areaList.province_list = _province_list;
      state.areaList.city_list = _city_list;
      state.areaList.county_list = _county_list;

      // receive query data after clicked onEdit on Address page.
      const { type, addressId } = route.query;
      state.type = type;
      state.addressId = addressId;
      //return title
      state.title = computed(() => {
        return state.type == "add" ? "Add address" : "Edit address";
      });

      //initiate addressInfo to be edited
      if (type == "edit") {
        getAddressDetail(addressId).then((res) => {
          const addressDetail = res;

          let _areaCode = "";
          const province = tdist.getLev1();
          //Object > .keys / .values / .entries(both keys and values)
          Object.entries(state.areaList.county_list).forEach(([id, text]) => {
            // 先找出当前对应的区
            if (text == addressDetail.county) {
              // 找到区对应的几个省份
              const provinceIndex = province.findIndex(
                (item) => item.id.substr(0, 2) == id.substr(0, 2)
              );
              // 找到区对应的几个市区
              const cityItem = Object.entries(state.areaList.city_list).filter(
                ([cityId, city]) => cityId.substr(0, 4) == id.substr(0, 4)
              )[0];
              // 对比找到的省份和接口返回的省份是否相等，因为有一些区会重名
              if (
                province[provinceIndex].text == addressDetail.province &&
                cityItem[1] == addressDetail.city
              ) {
                _areaCode = id;
              }
            }
          });

          state.addressInfo = {
            name: addressDetail.name,
            tel: addressDetail.phone,
            province: addressDetail.province,
            city: addressDetail.city,
            county: addressDetail.county,
            areaCode: _areaCode,
            addressDetail: addressDetail.address,
            isDefault: !!addressDetail.is_default, //0/1 => T/F
          };
        });
      }
    });

    //save data
    const onSave = (content) => {
      const params = {
        name: content.name,
        phone: content.tel,
        province: content.province,
        city: content.city,
        county: content.county,
        address: content.addressDetail,
        is_default: content.isDefault ? 1 : 0, //T/F  => 0/1
      };
      //update or add address.
      if (state.type == "edit") {
        editAddress(state.addressId, params);
        Toast("Updated!");
      } else if (state.type == "add") {
        addAddress(params);
        Toast("Saved!");
      }
      setTimeout(() => {
        router.back();
      }, 500);
    };
    //delete
    const onDelete = () => {
      Dialog.confirm({
        message: "Are you sure you want to delete?",
      })
        .then(() => {
          // on confirm
          deleteAddress(state.addressId).then((res) => {
            Toast("Deleted!");
            setTimeout(() => {
              router.back();
            }, 500);
          });
        })
        .catch(() => {
          // on cancel
        });
    };

    return {
      ...toRefs(state),
      onSave,
      onDelete,
    };
  },
};
</script>

<style lang="scss">
.edit {
  .van-field__body {
    textarea {
      height: 26px !important;
    }
  }
}
.address-edit-box {
  margin-top: 44px;
  .van-address-edit {
    .van-cell__title.van-field__label {
      // width: fit-content; //doesn't align nicely.
      white-space: nowrap;
    }
    .van-button--danger {
      background: var(--color-tint);
      border-color: var(--color-tint);
    }
    .van-switch--on {
      background: var(--color-tint);
    }
  }
}
</style>
