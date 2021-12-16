import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// https://www.wenjiangs.com/doc/vant-locale
import { Locale } from "vant";
// import language package
import enUS from "vant/es/locale/lang/en-US";
Locale.use("en-US", enUS);
import {
  Swipe,
  SwipeItem,
  Lazyload,
  Badge,
  Sidebar,
  SidebarItem,
  Collapse,
  CollapseItem,
  Tab,
  Tabs,
  Card,
  Tag,
  Button,
  Form,
  Field,
  Icon,
  AddressList,
  AddressEdit,
  Dialog,
  CheckboxGroup,
  Checkbox,
  Stepper,
  SwipeCell,
  SubmitBar,
  Grid,
  GridItem,
  Popup,
  List,
  PullRefresh,
} from "vant";

createApp(App)
  .use(Swipe)
  .use(SwipeItem)
  .use(Lazyload, {
    loading: require("./assets/images/loading.gif"),
  })
  .use(Badge)
  .use(Sidebar)
  .use(SidebarItem)
  .use(Collapse)
  .use(CollapseItem)
  .use(Tab)
  .use(Tabs)
  .use(Card)
  .use(Tag)
  .use(Button)
  .use(Form)
  .use(Field)
  .use(Icon)
  .use(AddressList)
  .use(AddressEdit)
  .use(Dialog)
  .use(CheckboxGroup)
  .use(Checkbox)
  .use(Stepper)
  .use(SwipeCell)
  .use(SubmitBar)
  .use(Grid)
  .use(GridItem)
  .use(Popup)
  .use(List)
  .use(PullRefresh)
  .use(store)
  .use(router)
  .mount("#app");

//change default field and placeholder text
// const messages = {
//   "en-US": {
//     vanAddressEdit: {
//       postal: "Postcode", //replace postal with Postcode.
//     },
//   },
// };
// Locale.add(messages);
