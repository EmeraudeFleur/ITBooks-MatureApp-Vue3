import { request } from "./request.js";

export function getCategories() {
  return request({
    url: "/api/goods",
  });
}
//default ctyId = 0 will load all goods
export function getCategoryGoods(sort = "sales", ctyId = 0, page = 1) {
  return request({
    url:
      "/api/goods?category_id=" + ctyId + "&page=" + page + "&" + sort + "=1",
  });
}
