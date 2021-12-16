import { request } from "./request.js";

export function getHomeData() {
  return request({
    url: "/api/index",
  });
}

// 2 queries as parameters in this function
//function fnName(param1 = defaultValue1, ..., paramN = defaultValueN) { ... }
export function getHomeGoods(type = "sales", page = 1) {
  return request({
    url: "/api/index?" + type + "=1&page=" + page,
  });
}
