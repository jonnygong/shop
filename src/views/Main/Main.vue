<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
        {{collapsed ? '' : sysName}}
      </el-col>
      <el-col :span="1">
        <div class="tools" @click.prevent="collapse">
          <i class="fa fa-align-justify"></i>
        </div>
      </el-col>
      <el-col :span="12">
        <el-tooltip content="点击可切换公众号" placement="right" effect="light" style="cursor: pointer">
          <span @click="handleChange('wechat')">当前公众号：{{ curWechat }}</span>
        </el-tooltip>
        <span style="margin: 0 10px">|</span>
        <el-tooltip content="点击可切换项目" placement="right" effect="light" style="cursor: pointer">
          <span @click="handleChange('project')">当前项目：{{ curProject }}</span>
        </el-tooltip>
      </el-col>
      <el-col :span="4" class="userinfo">
        <el-dropdown trigger="hover">
                    <span class="el-dropdown-link userinfo-inner"><img
                      :src="this.sysUserAvatar"/> {{sysUserName}}</span>
          <el-dropdown-menu slot="dropdown">
            <!--<el-dropdown-item>我的消息</el-dropdown-item>-->
            <!--<el-dropdown-item>设置</el-dropdown-item>-->
            <!--<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>-->
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
        <!--导航菜单-->
        <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen"
                 @close="handleclose" @select="handleselect" :collapse="collapsed"
                 unique-opened router>
          <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
            <el-submenu :index="index+''" v-if="!item.leaf">
              <template slot="title">
                <i :class="['icon',item.iconCls]"></i>
                <span slot="title">{{item.name}}</span>
              </template>

              <el-menu-item-group>
                <span slot="title">{{item.name}}</span>
                <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path"
                              v-if="!child.hidden">{{child.name}}
                </el-menu-item>
              </el-menu-item-group>

            </el-submenu>

            <el-menu-item v-if="item.leaf&&item.children.length>0"
                          :index="item.children[0].path">
              <i :class="['icon',item.iconCls]"></i>
              <span slot="title">{{item.children[0].name}}</span>
            </el-menu-item>

          </template>
        </el-menu>

      </aside>
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="breadcrumb-container">
            <strong class="title">{{$route.name}}</strong>
            <el-breadcrumb separator="/" class="breadcrumb-inner">
              <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                {{ item.name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    data () {
      return {
        sysName: '互动通用后台',
        collapsed: false,
        sysUserName: '',
        sysUserAvatar: '',
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    computed: {
      curProject () {
        return window.sessionStorage.getItem('PROJECT_NAME') === null
          ? '未选择项目'
          : window.sessionStorage.getItem('PROJECT_NAME')
      },
      curWechat () {
        return window.sessionStorage.getItem('WECHAT_NAME') === null
          ? '未选择公众号'
          : window.sessionStorage.getItem('WECHAT_NAME')
      }
    },
    methods: {
      handleChange (type) {
        if (type === 'project') {
          window.sessionStorage.removeItem('PROJECT_ID')
          window.sessionStorage.removeItem('PROJECT_NAME')
          window.location.replace('/admin/#/project')
        } else {
          window.sessionStorage.removeItem('WECHAT_ID')
          window.sessionStorage.removeItem('WECHAT_NAME')
          window.location.replace('/admin/#/')
        }
      },
      handleopen () {
        // console.log('handleopen');
      },
      handleclose () {
        // console.log('handleclose');
      },
      handleselect (a, b) {},
      // 退出登录
      logout () {
//        let _this = this
        this.$confirm('确认退出吗?', '提示', {
          // type: 'warning'
        })
          .then(() => {
            this.$store.dispatch('login_out')
            window.location.href = '/admin/'
          })
          .catch(() => {})
      },
      // 折叠导航栏
      collapse () {
        this.collapsed = !this.collapsed
      }
    },
    mounted () {
      this.sysUserName = sessionStorage.getItem('USER_NAME') || ''
      this.sysUserAvatar = require('@/assets/images/loggeduser.png')
    }
  }
</script>

<style lang="scss">
  @import "Main";
</style>
