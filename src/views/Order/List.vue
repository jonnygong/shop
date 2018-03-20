<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <!--<el-form-item>-->
        <!--<el-input v-model="filters.value" placeholder="关键词"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
        <!--<el-select v-model="filters.key" placeholder="请选择搜索字段">-->
        <!--<el-option-->
        <!--v-for="(item,index) in filters.options"-->
        <!--:key="index"-->
        <!--:label="item.label"-->
        <!--:value="item.value">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
        <!--<el-button type="primary"-->
        <!--icon="search"-->
        <!--@click="getListData">搜索-->
        <!--</el-button>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button type="primary"
                     @click="getListData">刷新
          </el-button>
        </el-form-item>
        <!--<el-form-item>-->
        <!--<el-button type="primary"-->
        <!--@click="handleAdd">新增-->
        <!--</el-button>-->
        <!--</el-form-item>-->
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="list"
              highlight-current-row
              v-loading="listLoading"
              @selection-change="selsChange"
              style="width: 100%;">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <!-- 普通列表显示 -->
      <el-table-column
        v-for="(item,index) in tableColumn"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.width"
        :sortable="item.sortable">
      </el-table-column>
      <!-- 图片显示 -->
      <!-- <el-table-column prop="thumb" label="图片" width="130">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <div class="ad-img">
              <img :src="scope.row.thumb" :alt="scope.row.name" width="200" height="auto"
                   v-if="scope.row.thumb !== ''">
              <p v-else>暂无图片</p>
            </div>
            <div slot="reference" class="name-wrapper">
              <el-tag>查看图片</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column> -->
      <!-- 时间戳转日期 -->
      <el-table-column prop="create_time" label="订单创建时间" width="180" :formatter="formateTime">
      </el-table-column>
      <el-table-column prop="status" label="订单状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'warning'
            : scope.row.status === -1 ? 'success'
            : scope.row.status === -1 ? 'success'
            : scope.row.status === -1 ? 'success'
            : scope.row.status === -1 ? 'success'
            : scope.row.status === -1 ? 'danger'
            : scope.row.status === -1 ? 'success'
            : scope.row.status === -1 ? 'warning'
            : scope.row.status === -1 ? 'success'
            : 'gray'">
            {{ scope.row.status === 1 ? '待付款'
            : scope.row.status === 2 ? '已付款'
              : scope.row.status === 3 ? '已确认'
                : scope.row.status === 4 ? '已发货'
                  : scope.row.status === 5 ? '已收货'
                    : scope.row.status === 6 ? '退款申请'
                      : scope.row.status === 7 ? '退款成功'
                        : scope.row.status === 8 ? '待评价'
                          : scope.row.status === 9 ? '已评价'
                            : '无效订单' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" @click="handleOrdergoods(scope.$index, scope.row)">订单商品</el-button>
          <!-- <el-button size="small"
                     @click="statusSubmit(scope.$index, scope.row)"
                     :disabled="scope.row.status === -1">
            {{ scope.row.status === 1 ? '停用' : scope.row.status === 0 ? '启用' : '已删除' }}
          </el-button> -->
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="primary"
                 size="small"
                 @click="batchAction('pay')"
                 :disabled="this.sels.length===0">待付款
      </el-button>
      <el-button type="primary"
                 size="small"
                 @click="batchAction('paid')"
                 :disabled="this.sels.length===0">已付款
      </el-button>
      <el-button type="primary"
                 size="small"
                 @click="batchAction('confirmed')"
                 :disabled="this.sels.length===0">已确认
      </el-button>
      <el-button type="primary"
                 size="small"
                 @click="batchAction('shipped')"
                 :disabled="this.sels.length===0">已发货
      </el-button>
      <el-button type="primary"
                 size="small"
                 @click="batchAction('received')"
                 :disabled="this.sels.length===0">已收货
      </el-button>
      <el-button type="primary"
                 size="small"
                 @click="batchAction('refund')"
                 :disabled="this.sels.length===0">退款申请
      </el-button>
      <el-button type="primary"
                 size="small"
                 @click="batchAction('refunds')"
                 :disabled="this.sels.length===0">退款成功
      </el-button>
      <el-button type="primary"
                 size="small"
                 @click="batchAction('evaluate')"
                 :disabled="this.sels.length===0">待评价
      </el-button>
      <el-button type="primary"
                 size="small"
                 @click="batchAction('evaluated')"
                 :disabled="this.sels.length===0">已评价
      </el-button>
      <el-button type="danger"
                 size="small"
                 @click="batchAction('remove')"
                 :disabled="this.sels.length===0">无效订单
      </el-button>
      <el-pagination layout="prev, pager, next"
                     @current-change="handleCurrentChange"
                     :page-size="pagesize"
                     :total="total" style="float:right;"></el-pagination>
    </el-col>
  </section>
</template>

<script>
  import util from '@/utils/js'

  // const MODEL_NAME = 'Category' // API模块名

  export default {
    data () {
      return {
        // 列表表头数据
        tableColumn: [
          {
            prop: 'order_sn',
            label: '订单编号',
            width: 120,
            sortable: false
          },
          {
            prop: 'member_id',
            label: '会员编号',
            width: 120,
            sortable: false
          },
          {
            prop: 'pay_id',
            label: '交易号',
            width: 120,
            sortable: false
          },
          {
            prop: 'content',
            label: '订单内商品信息',
            width: 140,
            sortable: false
          },
          {
            prop: 'user_note',
            label: '用户备注',
            width: 120,
            sortable: false
          },
          {
            prop: 'shop_note',
            label: '商家备注',
            width: 120,
            sortable: false
          }
        ],
        // 搜索条件
        filters: {
          value: '',
          key: '',
          options: [
            {value: 'name', label: '名称'}
          ]
        },
        list: [],
        total: 0,
        page: 1,
        pagesize: 10,
        listLoading: false,
        sels: [] // 列表选中列
      }
    },
    methods: {
      // 格式化更新时间
      formateTime (row, column) {
        return ` ${util.formatDate.format(new Date(row[column.property] * 1000), 'yyyy-MM-dd hh:mm:ss')}`
      },
      handleCurrentChange (val) {
        this.page = val
        this.getListData()
      },
      // 获列表
      async getListData () {
        this.listLoading = true
        let params = {
          page: this.page,
          shop_id: sessionStorage.getItem('shop_id'),
          key: this.filters.key, // 可选参数查询
          value: this.filters.value // 可选参数查询
        }
        const res = await this.$http.post(`orderList`, params)
        this.listLoading = false
        if (res === null) return
        this.total = res.param.pages.total
        this.pagesize = res.param.pages.pagesize
        this.list = res.param.list
      },
      // 删除
      handleDel (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(async () => {
          let params = {
            id: row.id,
            status: -1
          }

          const res = await this.$http.post(`orderStatus`, params)
          if (res === null) return
          this.$message({
            message: '状态修改成功',
            type: 'success'
          })
          row.status = -1
          this.getListData()
        }).catch(() => {

        })
      },
      async handleOrdergoods (index, row) {
        console.log(this.$route.path)
        this.$router.push(`${this.$route.path}/${row.id}/ordergoods`)
      },
      // 显示编辑界面
      async handleEdit (index, row) {
        console.log(this.$route.path)
        this.$router.push(`${this.$route.path}/edit/${row.id}`)
      },
      // 显示新增界面
      handleAdd () {
        console.log(this.$route.path)
        this.$router.push(`${this.$route.path}/add`)
      },
      // 修改状态
      async statusSubmit (index, row) {
        let params = {
          id: row.id,
          status: 1 - row.status
        }

        const res = await this.$http.post(`orderStatus`, params)
        if (res === null) return
        this.$message({
          message: '状态修改成功',
          type: 'success'
        })
        row.status = 1 - row.status
      },
      selsChange (sels) {
        this.sels = sels
      },
      // 批量删除
      batchAction (action) {
        // 三种操作：remove disable active
        let ids = this.sels.map(item => item.id).toString()
        const actions = {
          'remove': {
            tip: '订单无效',
            api: `orderStatus`,
            status: -1
          },
          'pay': {
            tip: '待付款',
            api: `orderStatus`,
            status: 1
          },
          'paid': {
            tip: '已付款',
            api: `orderStatus`,
            status: 2
          },
          'confirmed': {
            tip: '已确认',
            api: `orderStatus`,
            status: 3
          },
          'shipped': {
            tip: '已发货',
            api: `orderStatus`,
            status: 4
          },
          'received': {
            tip: '已收货',
            api: `orderStatus`,
            status: 5
          },
          'refund': {
            tip: '退款申请',
            api: `orderStatus`,
            status: 6
          },
          'refunds': {
            tip: '退款成功',
            api: `orderStatus`,
            status: 7
          },
          'evaluate': {
            tip: '待评价',
            api: `orderStatus`,
            status: 8
          },
          'evaluated': {
            tip: '已评价',
            api: `orderStatus`,
            status: 9
          }
        }
        this.$confirm(`确认${actions[action].tip}选中记录吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          this.listLoading = true
          // 非批量删除，带上 status
          let params = {
            ids: ids + '',
            status: actions[action].status
          }
          const res = await this.$http.post(actions[action].api, params)
          this.listLoading = false
          if (res === null) return
          this.$message({
            message: res.info,
            type: 'success'
          })
          this.getListData()
        }).catch(() => {

        })
      }
    },
    mounted () {
      this.getListData()
    }
  }
</script>

<style lang="scss">
</style>
