<template>
  <div class="form-wrapper">
    <el-form :model="formData" label-width="120px" :rules="formRules" ref="formData" style="margin-top: 20px;" empty-text="无">
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
        <!--单选框-->
        <el-radio-group v-if="item.type === 'radio'" v-model="formData[item.prop]">
          <el-radio :label="option[item.valueProp]"
                    :key="optionIndex"
                    v-for="(option, optionIndex) in options[item.option]">{{ option[item.labelProp] }}</el-radio>
        </el-radio-group>
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
      <el-form-item label="订单内商品信息" prop="content">
        <template>
          <el-card class="box-card" v-for="(item, index) in formData.content" :key="index" style="margin: 5px 0;">
            <p style="line-height: 10px;  padding: 0;">商品名称：{{ item.good_id }}</p>
            <p style="line-height: 10px; padding: 0;">商品规格：{{ item.spec_id }}</p>
            <p style="line-height: 10px;  padding: 0;">购买总量：{{ item.buy_sum }}</p>
          </el-card>
        </template>
      </el-form-item>
      <!-- 富文本 -->
      <!--<el-form-item label="订单内商品信息" prop="content">-->
        <!--<UE :defaultMsg="formData.content" ref="ue"></UE>-->
      <!--</el-form-item>-->
      <!-- 自定义表单项目 -->
      <!-- ... -->
    </el-form>
    <!-- <div slot="footer" class="dialog-footer">
      <el-button @click.native="handleCancel">取消</el-button>
      <el-button type="primary" @click.native="formSubmit" :loading="formLoading">提交</el-button>
    </div> -->
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
          {
            type: 'text',
            prop: 'order_sn',
            label: '订单编号'
          },
//          {
//            type: 'select',
//            prop: 'shop_id',
//            label: '所属商家',
//            option: 'shop_id', // 下拉列表数据别名
//            labelProp: 'label', // 下拉列表数组内元素 label 别名
//            valueProp: 'value', // 下拉列表数组内元素 value 别名
//            placeholder: '请输入内容'
//          },
          {
            type: 'number',
            prop: 'member_id',
            label: '会员编号'
          },
          {
            type: 'radio',
            prop: 'status',
            label: '订单状态',
            option: 'status', // 下拉列表数据别名
            labelProp: 'label', // 下拉列表数组内元素 label 别名
            valueProp: 'value' // 下拉列表数组内元素 value 别名
          },
          {
            type: 'radio',
            prop: 'type',
            label: '订单类型',
            option: 'type', // 下拉列表数据别名
            labelProp: 'label', // 下拉列表数组内元素 label 别名
            valueProp: 'value' // 下拉列表数组内元素 value 别名
          },
          {
            type: 'number',
            prop: 'total_money',
            label: '订单总价'
          },
          {
            type: 'number',
            prop: 'total_point',
            label: '消费积分'
          },
          {
            type: 'number',
            prop: 'cut_money',
            label: '优惠金额'
          },
          {
            type: 'number',
            prop: 'cut_point',
            label: '积分减免'
          },
          {
            type: 'radio',
            prop: 'logistic_type',
            label: '运输方式',
            option: 'logistic_type', // 下拉列表数据别名
            labelProp: 'label', // 下拉列表数组内元素 label 别名
            valueProp: 'value' // 下拉列表数组内元素 value 别名
          },
          {
            type: 'number',
            prop: 'logistic_money',
            label: '运费'
          },
          {
            type: 'number',
            prop: 'offer_money',
            label: '真实需支付'
          },
          {
            type: 'number',
            prop: 'offer_point',
            label: '需要支付积分'
          },
          {
            type: 'number',
            prop: 'rebate_money',
            label: '回扣金额'
          },
          {
            type: 'number',
            prop: 'rebate_point',
            label: '回扣积分'
          },
          {
            type: 'radio',
            prop: 'pay_type',
            label: '支付类型',
            option: 'pay_type', // 下拉列表数据别名
            labelProp: 'label', // 下拉列表数组内元素 label 别名
            valueProp: 'value' // 下拉列表数组内元素 value 别名
          },
          {
            type: 'text',
            prop: 'pay_id',
            label: '交易号'
          },
          {
            type: 'time',
            prop: 'pay_time',
            label: '支付时间'
          },
          {
            type: 'textarea',
            prop: 'user_note',
            label: '用户备注'
          },
          {
            type: 'textarea',
            prop: 'shop_note',
            label: '商家备注'
          },
          {
            type: 'time',
            prop: 'end_time',
            label: '订单完成时间'
          },
          {
            type: 'time',
            prop: 'create_time',
            label: '订单创建时间'
          },
          {
            type: 'time',
            prop: 'update_time',
            label: '订单更新时间'
          }
        ],
        // 下拉列表数据
        options: {
          status: [
            {value: 1, label: '待付款'},
            {value: 2, label: '已付款'},
            {value: 3, label: '已确认'},
            {value: 4, label: '已发货'},
            {value: 5, label: '已收货'},
            {value: 6, label: '退款申请'},
            {value: 7, label: '退款成功'},
            {value: 8, label: '待评价'},
            {value: 9, label: '已评价'},
            {value: -1, label: '无效订单'}
          ],
          type: [
            {value: 1, label: '现金'},
            {value: 2, label: '积分'},
            {value: 3, label: '项目订单'}
          ],
          logistic_type: [
            {value: 1, label: '虚拟'},
            {value: 2, label: '自提'},
            {value: 3, label: '物流'}
          ],
          pay_type: [
            {value: 1, label: '支付宝'},
            {value: 2, label: '微信'},
            {value: 3, label: '银联'}
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
          order_sn: '',
          shop_id: '',
          member_id: '',
          status: '',
          type: '',
          total_money: '',
          total_point: '',
          cut_money: '',
          cut_point: '',
          logistic_type: '',
          logistic_money: '',
          offer_money: '',
          offer_point: '',
          rebate_money: '',
          rebate_point: '',
          pay_type: '',
          pay_id: '',
          pay_time: '',
          user_note: '',
          shop_note: '',
          end_time: '',
          content: []
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
        const res = await this.$http.post(`orderInfo`, params)
        if (res === null) return
        this.formData = Object.assign({}, res.param)
        this.formData.pay_time = this.formData.pay_time * 1000
        this.formData.end_time = this.formData.end_time * 1000
        this.formData.create_time = this.formData.create_time * 1000
        this.formData.update_time = this.formData.update_time * 1000
        this.formData.content = JSON.parse(this.formData.content)
        console.log(this.formData.content)
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
              // let _next_open_ = this.formData.next_open
              // if (typeof this.formData.next_open === 'number') {
              //   _next_open_ = this.formData.next_open / 1000
              // } else {
              //   _next_open_ = new Date(this.formData.next_open).getTime() / 1000
              // }
              let params = Object.assign({}, this.formData)
              // params.next_open = _next_open_ // 后台接收10位时间戳，需要转换
              params.detail = this.getUEContent('ue') // 富文本内容
              params.images = this.getImageList('album') // 多图上传
              const res = await this.$http.post(`${MODEL_NAME}/update`, params)
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
.box-card {
  padding:0;
}
</style>
