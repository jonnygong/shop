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
        <el-form-item>
          <el-button type="primary"
                     @click="handleAdd">新增
          </el-button>
        </el-form-item>
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
      <el-table-column prop="order_id" label="订单编号" width="120">
      </el-table-column>
      <el-table-column prop="goods_type" label="商品类型" width="120">
        <template slot-scope="scope">
          {{ goods_type[scope.row.goods_type] }}
        </template>
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
      <el-table-column prop="goods_logo" label="商品图片" width="130">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <div class="ad-img">
              <img :src="scope.row.goods_logo" :alt="scope.row.name" width="200" height="auto"
                   v-if="scope.row.goods_logo !== ''">
              <p v-else>暂无图片</p>
            </div>
            <div slot="reference" class="name-wrapper">
              <el-tag>查看图片</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!-- 时间戳转日期 -->
      <el-table-column prop="create_time" label="订单创建时间" width="180" :formatter="formateTime">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
            {{ scope.row.status === 1 ? '正常' : '退货' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240" fixed="right">
        <template slot-scope="scope">
          <el-button size="small"
                     @click="statusSubmit(scope.$index, scope.row)"
                     :disabled="scope.row.status === -1">
            {{ scope.row.status === 1 ? '退货' : '正常' }}
          </el-button>
          vv
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger"
                 @click="batchAction('remove')"
                 :disabled="this.sels.length===0">批量退货
      </el-button>
      <el-button type="primary"
                 @click="batchAction('active')"
                 :disabled="this.sels.length===0">批量正常
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

  //  const MODEL_NAME = 'Category' // API模块名

  export default {
    data () {
      return {
        // 列表表头数据
        tableColumn: [
          // {
          //   prop: 'order_id',
          //   label: '订单编号',
          //   width: 120,
          //   sortable: false
          // },
          // {
          //   prop: 'goods_type',
          //   label: '商品类型',
          //   width: 120,
          //   sortable: false
          // },
          {
            prop: 'goods_id',
            label: '商品编号',
            width: 120,
            sortable: false
          },
          {
            prop: 'goods_title',
            label: '商品标题',
            width: 120,
            sortable: false
          },
          {
            prop: 'goods_price',
            label: '商品价格',
            width: 120,
            sortable: false
          },
          {
            prop: 'goods_sum',
            label: '商品数量',
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
        goods_type: [
          {id: 1, name: '实物'},
          {id: 2, name: '积分'},
          {id: 3, name: '项目'}
        ],
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
          order_id: this.$route.params.id,
          key: this.filters.key, // 可选参数查询
          value: this.filters.value // 可选参数查询
        }
        const res = await this.$http.post(`ordergoodsList`, params)
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

          const res = await this.$http.post(`ordergoodsStatus`, params)
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
      // 显示编辑界面
      async handleEdit (index, row) {
        console.log(this.$route.path)
        this.$router.push(`${this.$route.path}/${this.$route.params.order_id}/edit/${row.id}`)
      },
      // 显示新增界面
      handleAdd () {
        console.log(this.$route.path)
        this.$router.push(`${this.$route.path}/${this.$route.params.order_id}/add`)
      },
      // 修改状态
      async statusSubmit (index, row) {
        let params = {
          id: row.id,
          status: 1 - row.status
        }

        const res = await this.$http.post(`ordergoodsStatus`, params)
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
            tip: '退货',
            api: `ordergoodsStatus`,
            status: 1
          },
          'active': {
            tip: '正常',
            api: `ordergoodsStatus`,
            status: 2
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
