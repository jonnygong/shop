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
        <el-form-item>
          <el-button @click="handleBack">返回
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
      <!-- 普通列表显示 -->
      <el-table-column
        v-for="(item,index) in tableColumn"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.width"
        :sortable="item.sortable">
      </el-table-column>
      <!-- 时间戳转日期 -->
      <!-- <el-table-column prop="update_time" label="更新时间" width="180" :formatter="formateTime">
      </el-table-column> -->
      <!-- 图片显示 -->
      <el-table-column prop="img" label="分类图片" width="130">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <div class="ad-img">
              <img :src="scope.row.img" :alt="scope.row.name" width="200" height="auto"
                   v-if="scope.row.img !== ''">
              <p v-else>暂无图片</p>
            </div>
            <div slot="reference" class="name-wrapper">
              <el-tag>查看图片</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="is_show" label="是否展示" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_show === 1 ? 'success' :  'warning'">
            {{ scope.row.is_show === 1 ? '展示' : '不展示' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : scope.row.status === -1 ? 'gray' : 'danger'">
            {{ scope.row.status === 1 ? '可用' : scope.row.status === -1 ? '已删除' : '不可用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button size="small" @click="handleIndex(scope.$index, scope.row)">关键词</el-button> -->
          <el-button size="small"
                     @click="statusSubmit(scope.$index, scope.row)"
                     :disabled="scope.row.status === -1">
            {{ scope.row.status === 1 ? '停用' : scope.row.status === 0 ? '启用' : '已删除' }}
          </el-button>
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger"
                 @click="batchAction('remove')"
                 :disabled="this.sels.length===0">批量删除
      </el-button>
      <el-button type="warning"
                 @click="batchAction('disable')"
                 :disabled="this.sels.length===0">批量禁用
      </el-button>
      <el-button type="primary"
                 @click="batchAction('active')"
                 :disabled="this.sels.length===0">批量启用
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
          {
            prop: 'name',
            label: '分类名称',
            width: 120,
            sortable: false
          }
          // {
          //   prop: 'pid',
          //   label: '父级分类',
          //   width: 120,
          //   sortable: false
          // },
          // {
          //   prop: 'shop_id',
          //   label: '所属商铺',
          //   width: 120,
          //   sortable: false
          // }
        ],
        // 搜索条件
        filters: {
          value: '',
          key: '',
          options: [
            {value: 'name', label: '名称'}
          ]
        },
        is_show: [
          {value: 1, label: '展示'},
          {value: 2, label: '不展示'}
        ],
        list: [],
        shop_list: [],
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
          pid: this.$route.params.category_id,
          shop_id: sessionStorage.getItem('shop_id')
          // key: this.filters.key, // 可选参数查询
          // value: this.filters.value // 可选参数查询
        }
        const res = await this.$http.post(`categoryList`, params)
        this.listLoading = false
        if (res === null) return
        this.total = res.param.pages.total
        this.pagesize = res.param.pages.pagesize
        this.list = res.param.list
      },
      // 获列表
      async getShopListData () {
        this.listLoading = true
        let params = {
          shop_id: sessionStorage.getItem('shop_id')
        }
        const res = await this.$http.post(`categoryArray`, params)
        this.listLoading = false
        if (res === null) return
        this.shop_list = res.param.list
        this.getListData()
      },
      // 删除
      handleDel (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(async () => {
          let params = {
            ids: row.id,
            status: -1
          }
          const res = await this.$http.post(`categoryStatus`, params)
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
      async handleIndex (index, row) {
        console.log(`${this.$route.path}/${row.id}/categoryindex`)
        this.$router.push(`${this.$route.path}/${row.id}/categoryindex`)
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
      handleBack () {
        this.$router.back()
      },
      // 修改状态
      async statusSubmit (index, row) {
        let params = {
          ids: row.id,
          status: 1 - row.status
        }
        const res = await this.$http.post(`categoryStatus`, params)
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
            tip: '删除',
            api: `categoryStatus`,
            status: -1
          },
          'disable': {
            tip: '停用',
            api: `categoryStatus`,
            status: 0
          },
          'active': {
            tip: '启用',
            api: `categoryStatus`,
            status: 1
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
      // this.getShopListData()
      this.getListData()
    }
  }
</script>

<style lang="scss">
</style>
