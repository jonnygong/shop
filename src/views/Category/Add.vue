<template>
  <div class="form-wrapper">
    <el-form :model="formData" label-width="120px" :rules="formRules" ref="formData" style="margin-top: 20px;">
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
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item :prop="item.end_prop">
              <el-date-picker v-model.date="formData[item.end_prop]"
                              align="right"
                              type="datetime"
                              placeholder="选择结束日期"
                              style="width: 100%;"></el-date-picker>

            </el-form-item>
          </el-col>
        </el-row>
        <!-- 时间选择 -->
        <el-date-picker v-else-if="item.type === 'time'"
                        v-model.date="formData[item.prop]"
                        align="right"
                        type="datetime"
                        :placeholder="item.placeholder ? item.placeholder : '请选择时间' "
                        style="width: 100%;"></el-date-picker>
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

//  const MODEL_NAME = 'Cms' // http://api.zhongjiao.kfw001.com/webadmin/控制器/方法 -> 接口控制器名称

  export default {
    data () {
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
          // {
          //   type: 'select',
          //   prop: 'pid',
          //   label: '父级分类',
          //   option: 'pid', // 下拉列表数据别名
          //   labelProp: 'label', // 下拉列表数组内元素 label 别名
          //   valueProp: 'value', // 下拉列表数组内元素 value 别名
          //   placeholder: '请输入内容'
          // },
          {
            type: 'text',
            prop: 'name',
            label: '分类名称'
          },
          {
            type: 'upload',
            prop: 'img',
            label: '分类图片'
          },
          {
            type: 'radio',
            prop: 'is_show',
            label: '是否展示',
            option: 'is_show', // 下拉列表数据别名
            labelProp: 'label', // 下拉列表数组内元素 label 别名
            valueProp: 'value' // 下拉列表数组内元素 value 别名
          }
        ],
        // 下拉列表数据
        options: {
          is_show: [
            {value: 1, label: '展示'},
            {value: 2, label: '不展示'}
          ],
          type: []
        },
        formLoading: false,
        formRules: {
          // sale_status: [
          //   {type: 'number', required: true, message: '请选择区域', trigger: 'blur'}
          // ],
          // cover: [
          //   {required: true, message: '请上传封面图片'}
          // ],
          // title: [
          //   {required: true, message: '请输入项目标题', trigger: 'blur'}
          // ],
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
          // detail: [
          //   {validator: validateContent, trigger: 'blur'}
          // ]
        },
        // 新增界面数据
        formData: {
          name: '',
          pid: 0,
          img: '',
          path: '',
//          shop_id: 2,
          is_show: ''
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
      async getArrayData () {
        let params = {
          shop_id: sessionStorage.getItem('shop_id')
        }
        const res = await this.$http.post(`categoryArray`, params)
        if (res === null) return
        this.array = res.param
        // 搜索选项
        this.filters.options.type = this.formateOptions(res.param.type)
        this.filters.options.type.unshift({label: '全部分类', value: ''})
      },
      formateOptions (source) {
        let _data = []
        for (let key in source) {
          _data.push({label: source[key], value: key * 1})
        }
        return _data.slice(0)
      },
      // 新增
      formSubmit () {
        this.$refs.formData.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(async () => {
              this.formLoading = true

              let params = Object.assign({
                shop_id: sessionStorage.getItem('shop_id')
              }, this.formData)
              // params.detail = this.getUEContent('detail') // 富文本内容
              // params.images = this.getImageList('album') // 多图上传
              const res = await this.$http.post(`categoryAdd`, params)
              this.formLoading = false
              if (res === null) return
              this.$message({
                message: '新建成功',
                type: 'success'
              })
              this.handleCancel()
            })
          }
        })
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
      // this.getArrayData()
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
