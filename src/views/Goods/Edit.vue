<template>
  <div class="form-wrapper">
    <el-form :model="formData" label-width="120px" :rules="formRules" ref="formData">
      <el-form-item v-for="(item, index) in formItems"
                    :label="item.label"
                    :prop="item.prop"
                    :key="index">
        <!-- 普通文本、文本域 -->
        <el-input v-if="item.type === 'text' || item.type === 'textarea'"
                  :type="item.type"
                  v-model="formData[item.prop]"
                  :placeholder="item.placeholder ? item.placeholder : '请输入内容' "
                  auto-complete="off"></el-input>
        <!-- 数字 -->
        <el-input v-else-if="item.type === 'number'"
                  v-model.number="formData[item.prop]"
                  :placeholder="item.placeholder ? item.placeholder : '请输入内容' "
                  auto-complete="off"></el-input>
        <!-- 时间段 -->
        <el-row v-else-if="item.type === 'period'">
          <el-col :span="11">
            <el-form-item :prop="item.start_prop">
              <el-date-picker v-model.date="formData[item.start_prop]"
                              align="right"
                              type="datetime"
                              placeholder="选择开始日期"
                              style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item :prop="item.end_prop">
              <el-date-picker v-model.date="formData[item.end_prop]"
                              align="right"
                              type="datetime"
                              placeholder="选择结束日期"
                              style="width: 100%"></el-date-picker>

            </el-form-item>
          </el-col>
        </el-row>
        <!-- 时间选择 -->
        <el-date-picker v-else-if="item.type === 'time'"
                        v-model.date="formData[item.prop]"
                        align="right"
                        type="datetime"
                        :placeholder="item.placeholder ? item.placeholder : '请选择时间' "
                        style="width: 100%"></el-date-picker>
        <!-- 单图片上传 -->
        <i-uploader v-else-if="item.type === 'upload'"
                    v-model="formData[item.prop]"></i-uploader>

        <!-- 选择器 -->
        <el-select v-else-if="item.type === 'select'"
                   v-model.number="formData[item.prop]"
                   :placeholder="item.placeholder ? item.placeholder : '请选择内容' ">
          <el-option :label="option[item.labelProp]"
                     :value="option[item.valueProp]"
                     :key="optionIndex"
                     v-for="(option, optionIndex) in options[item.option]"></el-option>
        </el-select>
        <!-- 经纬度 -->
        <el-row v-else-if="item.type === 'location'">
          <el-col :span="24">
            <el-row type="flex" justify="space-between">
              <el-col :span="11">
                <el-form-item prop="latitude">
                  <el-input placeholder="请输入内容" v-model.number="formData.latitude">
                    <template slot="prepend">经度</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="2">
                <el-form-item prop="longitude">
                  <el-input placeholder="请输入内容" v-model.number="formData.longitude">
                    <template slot="prepend">纬度</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <i-baidu-map :lng="formData.longitude" :lat="formData.latitude"
                         @success="locationSuccess"></i-baidu-map>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 多图片上传 -->
      <el-form-item label="其他图片" prop="thumb_url">
        <i-muti-uploader :value="formData.thumb_url" ref="album"></i-muti-uploader>
      </el-form-item>
      <!-- 富文本 -->
      <el-form-item label="图文详情" prop="content">
        <UE :defaultMsg="formData.content" ref="ue"></UE>
      </el-form-item>
      <!-- 自定义表单项目 -->
      <!-- ... -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="handleCancel">取消</el-button>
      <el-button type="primary" @click.native="formSubmit" :loading="formLoading">提交</el-button>
    </div>
  </div>
</template>

<script>
  import UE from '@/components/UEditor/UEditor'
  import Uploader from '@/components/Uploader/Uploader'
  import MutiUploader from '@/components/MutiUploader/MutiUploader'
  import BaiduMap from '@/components/BaiduMap/BaiduMap'

  const MODEL_NAME = 'Cms' // http://api.zhongjiao.kfw001.com/webadmin/控制器/方法 -> 接口控制器名称

  export default {
    data () {
      // 富文本校验
//      var validateContent = (rule, value, callback) => {
//        value = this.$refs['ue'].getUEContent()
//        if (value === '') {
//          callback(new Error('请输入内容'))
//        } else {
//          callback()
//        }
//      }
      return {
        /**
         * type 'text'(普通文本) 'number'(数值) 'textarea'(文本域)
         *      'period'(时间段)  --> start_prop / end_prop 对应 开始 / 结束 时间字段名称
         *      'time'(时间选择) 'upload'(图片上传) 'location'(经纬度)
         *      'select'(选择器)  --> option 字段对应 data 中 options 里字段名
         * prop 对应 formData 字段 和 validate 名称
         * label 对应表单名称
         * placeholder 对应提示信息
         */
        formItems: [
          //        {
//          type: 'select',
//          prop: 'category_id',
//          label: '分类名称',
//          option: 'category_id', // 下拉列表数据别名
//          labelProp: 'name', // 下拉列表数组内元素 label 别名
//          valueProp: 'id', // 下拉列表数组内元素 value 别名
//          placeholder: '请输入内容'
//        },
          {
            type: 'select',
            prop: 'type',
            label: '商品类型',
            option: 'type', // 下拉列表数据别名
            labelProp: 'label', // 下拉列表数组内元素 label 别名
            valueProp: 'value', // 下拉列表数组内元素 value 别名
            placeholder: '请输入内容'
          },
          {
            type: 'select',
            prop: 'status',
            label: '商品状态',
            option: 'status', // 下拉列表数据别名
            labelProp: 'label', // 下拉列表数组内元素 label 别名
            valueProp: 'value', // 下拉列表数组内元素 value 别名
            placeholder: '请输入内容'
          },
          {
            type: 'number',
            prop: 'sort',
            label: '排序'
          },
          {
            type: 'text',
            prop: 'title',
            label: '商品标题'
          },
          {
            type: 'upload',
            prop: 'thumb',
            label: '商品封面图'
          },
          {
            type: 'text',
            prop: 'weight',
            label: '商品重量'
          },
          {
            type: 'textarea',
            prop: 'description',
            label: '商品描述'
          },
//          {
//            type: 'text',
//            prop: 'goods_sn',
//            label: '商品编号'
//          },
//          {
//            type: 'text',
//            prop: 'product_sn',
//            label: '商品条码'
//          },
          {
            type: 'number',
            prop: 'original_price',
            label: '原价'
          },
//          {
//            type: 'number',
//            prop: 'cost_price',
//            label: '成本价'
//          },
//          {
//            type: 'select',
//            prop: 'is_point',
//            label: '是否为积分商品',
//            option: 'is_point', // 下拉列表数据别名
//            labelProp: 'label', // 下拉列表数组内元素 label 别名
//            valueProp: 'value', // 下拉列表数组内元素 value 别名
//            placeholder: '请输入内容'
//          },
//          {
//            type: 'number',
//            prop: 'offer_point',
//            label: '需要支付积分'
//          },
//          {
//            type: 'number',
//            prop: 'offer_money',
//            label: '需要支付金额'
//          },
//          {
//            type: 'number',
//            prop: 'back_point',
//            label: '可返还积分'
//          },
          {
            type: 'number',
            prop: 'stock',
            label: '库存'
          },
          {
            type: 'select',
            prop: 'stock_config',
            label: '库存状态',
            option: 'stock_config', // 下拉列表数据别名
            labelProp: 'label', // 下拉列表数组内元素 label 别名
            valueProp: 'value', // 下拉列表数组内元素 value 别名
            placeholder: '请输入内容'
          },
          {
            type: 'number',
            prop: 'sales',
            label: '已售数量'
          },
//          {
//            type: 'number',
//            prop: 'weight',
//            label: '重量(g)'
//          },
          {
            type: 'number',
            prop: 'max_buy',
            label: '用户最多购买数量'
          },
          {
            type: 'select',
            prop: 'logistic_type',
            label: '运输方式',
            option: 'logistic_type', // 下拉列表数据别名
            labelProp: 'label', // 下拉列表数组内元素 label 别名
            valueProp: 'value', // 下拉列表数组内元素 value 别名
            placeholder: '请输入内容'
          },
//          {
//            type: 'select',
//            prop: 'is_new',
//            label: '是否新品',
//            option: 'is_new', // 下拉列表数据别名
//            labelProp: 'label', // 下拉列表数组内元素 label 别名
//            valueProp: 'value', // 下拉列表数组内元素 value 别名
//            placeholder: '请输入内容'
//          },
          {
            type: 'select',
            prop: 'is_hot',
            label: '是否热门',
            option: 'is_hot', // 下拉列表数据别名
            labelProp: 'label', // 下拉列表数组内元素 label 别名
            valueProp: 'value', // 下拉列表数组内元素 value 别名
            placeholder: '请输入内容'
          },
//          {
//            type: 'select',
//            prop: 'is_discount',
//            label: '是否折扣',
//            option: 'is_discount', // 下拉列表数据别名
//            labelProp: 'label', // 下拉列表数组内元素 label 别名
//            valueProp: 'value', // 下拉列表数组内元素 value 别名
//            placeholder: '请输入内容'
//          },
//          {
//            type: 'select',
//            prop: 'is_recommand',
//            label: '是否展示到首页',
//            option: 'is_recommand', // 下拉列表数据别名
//            labelProp: 'label', // 下拉列表数组内元素 label 别名
//            valueProp: 'value', // 下拉列表数组内元素 value 别名
//            placeholder: '请输入内容'
//          },
//          {
//            type: 'select',
//            prop: 'is_time',
//            label: '是否限时卖',
//            option: 'is_time', // 下拉列表数据别名
//            labelProp: 'label', // 下拉列表数组内元素 label 别名
//            valueProp: 'value', // 下拉列表数组内元素 value 别名
//            placeholder: '请输入内容'
//          },
//          {
//            type: 'period',
//            start_prop: 'start_time',
//            end_prop: 'end_time',
//            label: '限时卖时间'
//          },
//          {
//            type: 'number',
//            prop: 'view_count',
//            label: '浏览量'
//          },
//          {
//            type: 'select',
//            prop: 'is_check',
//            label: '是否审核通过',
//            option: 'is_check', // 下拉列表数据别名
//            labelProp: 'label', // 下拉列表数组内元素 label 别名
//            valueProp: 'value', // 下拉列表数组内元素 value 别名
//            placeholder: '请输入内容'
//          }
          {
            type: 'select',
            prop: 'is_recommand',
            label: '是否显示在首页',
            option: 'is_recommand', // 下拉列表数据别名
            labelProp: 'label', // 下拉列表数组内元素 label 别名
            valueProp: 'value', // 下拉列表数组内元素 value 别名
            placeholder: '请输入内容'
          },
          {
            type: 'text',
            prop: 'address',
            label: '店铺地址'
          }
        ],
        // 下拉列表数据
        options: {
          type: [
            {value: 1, label: '实体商品'},
            {value: 2, label: '虚拟商品'},
            {value: 3, label: '门店项目'}
          ],
          status: [
            {value: 1, label: '上架'},
            {value: 0, label: '下架'},
            {value: -1, label: '删除'}
          ],
          stock_config: [
            {value: 0, label: '拍下减库存'},
            {value: 1, label: '生成订单减库存'},
            {value: 2, label: '永久不减'}
          ],
          logistic_type: [
            {value: 1, label: '自提'},
            {value: 2, label: '物流'}
          ],
          is_new: [
            {value: 1, label: '是'},
            {value: 2, label: '否'}
          ],
          is_hot: [
            {value: 1, label: '是'},
            {value: 2, label: '否'}
          ],
          is_discount: [
            {value: 1, label: '是'},
            {value: 2, label: '否'}
          ],
          is_recommand: [
            {value: 1, label: '是'},
            {value: 2, label: '否'}
          ],
          is_time: [
            {value: 1, label: '是'},
            {value: 2, label: '否'}
          ],
          is_check: [
            {value: 1, label: '是'},
            {value: 2, label: '否'}
          ]
        },
        shop_id: [],
        formLoading: false,
        formRules: {
          // sale_status: [
          //   {type: 'number', required: true, message: '请选择区域', trigger: 'blur'}
          // ],
          // cover: [{required: true, message: '请上传封面图片'}],
          // title: [{required: true, message: '请输入项目标题', trigger: 'blur'}],
          // start_time: [
          //   {type: 'date', required: true, message: '请输入开始时间', trigger: 'blur'}
          // ],
          // end_time: [
          //   {type: 'date', required: true, message: '请输入结束时间', trigger: 'blur'}
          // ],
          // avg_price: [
          //   {type: 'number', required: true, message: '请输入均价', trigger: 'blur'}
          // ],
          // latitude: [
          //   {type: 'number', required: true, message: '请选择纬度', trigger: 'blur'}
          // ],
          // longitude: [
          //   {type: 'number', required: true, message: '请选择经度', trigger: 'blur'}
          // ],
          // detail: [{validator: validateContent, trigger: 'blur'}]
        },
        // 新增界面数据
        formData: {
          //        shop_id: 2,
          category_id: 1,
          type: 1,
          status: 1,
          weight: 20,
          sort: 12,
          title: 'tets',
          thumb: 'http://kfw-mp.oss-cn-hangzhou.aliyuncs.com/system/2018-01-31/5a713ed10794d.jpg',
          description: 'fsfasd',
          // goods_sn: 2142423,
          // product_sn: 'fsddfas',
          original_price: 323,
          // cost_price: 123,
          // is_point: 1,
          // offer_point: 214,
          // offer_money: 3123,
          // back_point: 23423,
          stock: 3123,
          stock_config: 1,
          sales: 12,
          // weight: 123,
          max_buy: 432,
          logistic_type: 1,
          thumb_url: 'http://kfw-mp.oss-cn-hangzhou.aliyuncs.com/system/2018-01-31/5a713ed10794d.jpg',
          // is_new: 1,
          is_hot: 1,
          // is_discount: 1,
          is_recommand: 1,
          // is_time: 1,
          // start_time: '',
          // end_time: '',
          // view_count: 123,
          // is_check: 12,
          content: 'sfdafasdfsdadfsda',
          index_id: '',
          category_path: '',
          address: ''
        }
      }
    },
    methods: {
      // 百度地图定位成功后的回调
      locationSuccess (data) {
        this.formData.longitude = data.lng
        this.formData.latitude = data.lat
      },
      handleCancel () {
        this.$router.back()
      },
      // 显示编辑界面
      async handleEdit (index, row) {
        let params = {
          id: this.$route.params.id
        }
        const res = await this.$http.post(`goodsInfo`, params)
        if (res === null) return
        this.formData = Object.assign({}, res.param)
        // 经纬度需要数值类型，需转换
        this.formData.longitude = Number(this.formData.longitude)
        this.formData.latitude = Number(this.formData.latitude)
      },
      async getArrayData () {
        const res = await this.$http.post(`${MODEL_NAME}/array`)
        if (res === null) return
        this.shop_id = res.param
        // 搜索选项
        // this.filters.options.type = this.formateOptions(res.param)
        // this.filters.options.type.unshift({label: '全部分类', value: ''})
      },
      formateOptions (source) {
        let _data = []
        for (let key in source) {
          _data.push({label: source[key], value: key * 1})
        }
        return _data.slice(0)
      },
      // 编辑
      formSubmit () {
        this.$refs.formData.validate(valid => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(async () => {
              this.formLoading = true
              // 处理时间为时间戳
              let startTime = this.formData.start_time
              if (typeof this.formData.start_time === 'number') {
                startTime = this.formData.start_time / 1000
              } else {
                startTime = new Date(this.formData.start_time).getTime() / 1000
              }
              let endTime = this.formData.end_time
              if (typeof this.formData.end_time === 'number') {
                endTime = this.formData.end_time / 1000
              } else {
                endTime = new Date(this.formData.end_time).getTime() / 1000
              }
              let params = Object.assign({}, this.formData)
              params.start_time = startTime // 后台接收10位时间戳，需要转换
              params.end_time = endTime // 后台接收10位时间戳，需要转换
              params.content = this.getUEContent('content') // 富文本内容
              params.thumb_url = this.getImageList('album') // 多图上传
              const res = await this.$http.post(`goodsUpdate`, params)
              this.formLoading = false
              if (res === null) return
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.handleCancel()
            })
          }
        })
      },
      selsChange (sels) {
        this.sels = sels
      },
      // UEditor 获取内容，传入 ref 的值
      getUEContent (ele) {
        return this.$refs[ele].getUEContent()
      },
      // 多图上传获取内容，传入 ref 的值
      getImageList (ele) {
        return this.$refs[ele].getImageList()
      }
    },
    mounted () {
      this.handleEdit()
    },
    components: {
      UE,
      'i-uploader': Uploader,
      'i-baidu-map': BaiduMap,
      'i-muti-uploader': MutiUploader
    }
  }
</script>

<style lang="scss" scoped>

</style>
