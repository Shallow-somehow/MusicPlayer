<template>
  <div class="mvs-container">
    <!-- 顶部导航 -->
    <div class="filter-wrap">
      <div class="seciton-wrap">
        <span class="section-type">地区：</span>
        <ul class="tabs=wrap">
          <li class="tab">
            <span :class="{active:area=='全部'}" @click="area='全部'" class="title">全部</span>
          </li>
          <li class="tab">
            <span :class="{active:area=='内地'}" @click="area='内地'" class="title">内地</span>
          </li>
          <li class="tab">
            <span :class="{active:area=='港台'}" @click="area='港台'" class="title">港台</span>
          </li>
          <li class="tab">
            <span :class="{active:area=='欧美'}" @click="area='欧美'" class="title">欧美</span>
          </li>
          <li class="tab">
            <span :class="{active:area=='日本'}" @click="area='日本'" class="title">日本</span>
          </li>
          <li class="tab">
            <span :class="{active:area=='韩国'}" @click="area='韩国'" class="title">韩国</span>
          </li>
        </ul>
      </div>
      <div class="type-wrap">
        <span class="type-type">类型:</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span @click="type='全部'" :class="{active:type=='全部'}" class="title">全部</span>
          </li>
          <li class="tab">
            <span @click="type='官方版'" :class="{active:type=='官方版'}" class="title">官方版</span>
          </li>
          <li class="tab">
            <span @click="type='原声'" :class="{active:type=='原声'}" class="title">原声</span>
          </li>
          <li class="tab">
            <span @click="type='现场版'" :class="{active:type=='现场版'}" class="title">现场版</span>
          </li>
          <li class="tab">
            <span @click="type='网易出品'" :class="{active:type=='网易出品'}" class="title">网易出品</span>
          </li>
        </ul>
      </div>
      <div class="order-wrap">
        <span class="order-type">排序:</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span @click="order='上升最快'" :class="{active:order=='上升最快'}" class="title">上升最快</span>
          </li>
          <li class="tab">
            <span @click="order='最热'" :class="{active:order=='最热'}" class="title">最热</span>
          </li>
          <li class="tab">
            <span @click="order='最新'" :class="{active:order=='最新'}" class="title">最新</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- mv容器 -->
    <div class="mvs">
      <div class="items">
        <div class="item" v-for="(item, index) in list" :key="index" @click="toMvDetail(item.id)">
          <div class="img-wrap">
            <img :src="item.cover" />
            <div class="num-wrap">
              <div class="iconfont icon-play"></div>
              <div class="num">{{ item.playCount | filter}}</div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="name">{{ item.name }}</div>
            <div class="singer">{{ item.artistName }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <el-pagination
      @current-change="handleCurrentChange"
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="page"
      :page-size="5"
      :limit="limit"
    ></el-pagination>
  </div>
</template>

<script>
import axios from "axios";
export default {
  created() {
    this.getList();
  },
  data() {
    return {
      list: [],
      total: 20,
      page: 1,
      limit: 8,
      area: "全部",
      type: "全部",
      order: "上升最快"
    };
  },
  methods: {
    getList() {
      axios({
        url: "https://autumnfish.cn/mv/all",
        method: "get",
        params: {
          area: this.area,
          type: this.type,
          order: this.order,
          limit: this.limit,
          offset: (this.page - 1) * this.limit
        }
      }).then(res => {
        this.list = res.data.data;
        if (res.data.count) {
          this.total = res.data.count;
        }
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    toMvDetail(id) {
      this.$router.push("/mvDetail?query=" + id);
    }
  },
  filters: {
    filter(val) {
      return (val = val > 100000 ? parseInt(val / 10000) + "万" : val);
    }
  },
  watch: {
    area() {
      this.getList();
      this.page = 1;
    },
    type() {
      this.getList();
      this.page = 1;
    },
    order() {
      this.getList();
      this.page = 1;
    }
  }
};
</script>

<style>
</style>