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

//  const MODEL_NAME = 'Article' // http://api.zhongjiao.kfw001.com/webadmin/控制器/方法 -> 接口控制器名称

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
          //   prop: 'category_id',
          //   label: '分类名称',
          //   option: 'category_id', // 下拉列表数据别名
          //   labelProp: 'name', // 下拉列表数组内元素 label 别名
          //   valueProp: 'id', // 下拉列表数组内元素 value 别名
          //   placeholder: '请输入内容'
          // },
          {
            type: 'text',
            prop: 'name',
            label: '搜索词'
          }
        ],
        // 下拉列表数据
        options: {
          c_id: [],
          type: [
            {value: 1, label: '原创'},
            {value: 2, label: '转载'},
            {value: 3, label: '外链'}
          ],
          is_show: [{value: 0, label: '否'}, {value: 1, label: '是'}],
          news_time: [],
          category_id: []
        },
        cat: [],
        list: [],
        formLoading: false,
        formRules: {
          // p_id: [
          //   {
          //     type: 'number',
          //     required: true,
          //     message: '请选择父级名称',
          //     trigger: 'blur'
          //   }
          // ],
          // c_name: [{ required: true, message: '请输入内容', trigger: 'blur' }]
        },
        // 新增界面数据
        formData: {
          // category_id: '',
          name: ''
//          shop_id: 2
        }
      }
    },
    methods: {
      handleCancel () {
        this.$router.back()
      },
      async getArrayData () {
        const res = await this.$http.post(`categoryArray`, {
          shop_id: sessionStorage.getItem('shop_id')
        })
        if (res === null) return
        // this.options.category_id = this.formateCategory(res.param.list)
        this.options.category_id = res.param
        // 搜索选项
        // this.filters.options.type = this.formateOptions(res.param.type)
        // this.filters.options.type.unshift({label: '全部分类', value: ''})
      },
      formateOptions (source) {
        let _data = []
        for (let key in source) {
          _data.push({label: source[key], value: key * 1})
        }
        return _data.slice(0)
      },
      /**
       *  处理分类层级，传入 data <层级数组>
       *  返回层级数据
       * */
      formateCategory (data) {
        // 层级数据处理
        let select = []
        data.forEach((item, index) => {
          let _tag = '| -- '
          // 根据不同的层级 dep 数值，添加横线
          for (let i = 0; i < item.dep; i++) {
            _tag = _tag + '| -- '
          }
          let tempObj = {
            id: item.id,
            // pid: item.id,
            c_name: _tag + item.c_name
          }
          select.push(tempObj)
        })
        return select.slice(0)
      },
      // 新增
      formSubmit () {
        this.$refs.formData.validate(valid => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(async () => {
              this.formLoading = true
              let params = Object.assign({
                category_id: this.$route.params.category_id,
                shop_id: sessionStorage.getItem('shop_id')
              }, this.formData)
              // 处理时间为时间戳
              // let newsTime = this.formData.news_time
              // if (typeof this.formData.news_time === 'number') {
              //   newsTime = this.formData.news_time
              // } else {
              //   newsTime = new Date(this.formData.news_time).getTime()
              // }
              // params.news_time = newsTime // 后台接收10位时间戳，需要转换
              // params.content = this.getUEContent('ue') // 富文本内容
              const res = await this.$http.post(`categoryindexAdd`, params)
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
      }
    },
    mounted () {
      this.getArrayData()
    },
    components: {
      UE,
      'i-uploader': Uploader,
      'i-baidu-map': BaiduMap,
      'i-muti-uploader': MutiUploader
    }
  }
</script>

<style lang='scss' scoped>

</style>
