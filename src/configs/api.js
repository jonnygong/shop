import systems from '@/configs'

const baseUrl = systems.debug ? '' : 'http://greentown.kfw001.com'
export default {
  // 接口请求baseUrl
  // baseUrl: 'http://api.mp.kfw001.com/',
  baseUrl: baseUrl,
  api: {
    // 公共接口
    imageUpload: 'https://api.kfw001.com/System/img/upload', // 文件上传

    configInfo: '/Shopadmin/Config/info', // 创建活动
    configSave: '/Shopadmin/Config/save', // 创建活动

    categoryList: '/Shopadmin/Category/list', // 创建活动
    categoryInfo: '/Shopadmin/Category/info', // 创建活动
    categoryArray: '/Shopadmin/Category/array', // 创建活动
    categoryAdd: '/Shopadmin/Category/add', // 创建活动
    categoryUpdate: '/Shopadmin/Category/update', // 创建活动
    categoryStatus: '/Shopadmin/Category/status', // 创建活动

    categoryindexList: '/Shopadmin/Categoryindex/list', // 创建活动
    categoryindexInfo: '/Shopadmin/Categoryindex/info', // 创建活动
    categoryindexAdd: '/Shopadmin/Categoryindex/add', // 创建活动
    categoryindexUpdate: '/Shopadmin/Categoryindex/update', // 创建活动
    categoryindexStatus: '/Shopadmin/Categoryindex/status', // 创建活动

    goodsList: '/Shopadmin/Goods/list', // 创建活动
    goodsInfo: '/Shopadmin/Goods/info', // 创建活动
    goodsCategory: '/Shopadmin/Goods/category', // 创建活动
    goodsIndex: '/Shopadmin/Goods/index', // 创建活动
    goodsAdd: '/Shopadmin/Goods/add', // 创建活动
    goodsUpdate: '/Shopadmin/Goods/update', // 创建活动
    goodsStatus: '/Shopadmin/Goods/status', // 创建活动

    specList: '/Shopadmin/Spec/list', // 创建活动
    specInfo: '/Shopadmin/Spec/info', // 创建活动
    specAdd: '/Shopadmin/Spec/add', // 创建活动
    specUpdate: '/Shopadmin/Spec/update', // 创建活动
    specStatus: '/Shopadmin/Spec/status', // 创建活动

    orderList: '/Shopadmin/Order/list', // 创建活动
    orderInfo: '/Shopadmin/Order/info', // 创建活动
    orderAdd: '/Shopadmin/Order/add', // 创建活动
    orderUpdate: '/Shopadmin/Order/update', // 创建活动
    orderStatus: '/Shopadmin/Order/status', // 创建活动

    ordergoodsList: '/Shopadmin/Ordergoods/list', // 创建活动
    ordergoodsInfo: '/Shopadmin/Ordergoods/info', // 创建活动
    ordergoodsAdd: '/Shopadmin/Ordergoods/add', // 创建活动
    ordergoodsUpdate: '/Shopadmin/Ordergoods/update', // 创建活动
    ordergoodsStatus: '/Shopadmin/Ordergoods/status', // 创建活动

    placeList: '/Shopadmin/Place/list', // 创建活动
    placeInfo: '/Shopadmin/Place/info', // 创建活动
    placeAdd: '/Shopadmin/Place/add', // 创建活动
    placeUpdate: '/Shopadmin/Place/update', // 创建活动
    placeStatus: '/Shopadmin/Place/status', // 创建活动

    adsList: '/Shopadmin/Ads/list', // 创建活动
    adsInfo: '/Shopadmin/Ads/info', // 创建活动
    adsArray: '/Shopadmin/Ads/array', // 创建活动
    adsAdd: '/Shopadmin/Ads/add', // 创建活动
    adsUpdate: '/Shopadmin/Ads/update', // 创建活动
    adsStatus: '/Shopadmin/Ads/status' // 创建活动
  }
}
