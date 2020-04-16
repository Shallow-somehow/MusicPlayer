<template>
  <div class="playlists-container">
    <!-- 顶部卡片 -->
    <div class="top-card">
      <div class="icon-wrap">
        <img :src="topList.coverImgUrl" />
      </div>
      <div class="content-wrap">
        <div class="tag">精品歌单</div>
        <div class="title">{{topList.name}}</div>
        <div class="info">{{topList.description}}</div>
      </div>
      <!-- 模糊背景 -->
      <img :src="topList.coverImgUrl" class="bg" />
      <div class="bg-mask"></div>
    </div>

    <!-- 下面容器 -->
    <div class="tab-container">
      <!-- 顶部选项 -->
      <div class="tab-bar">
        <span class="item" @click="tag='全部'" :class="{active:tag=='全部'}">全部</span>
        <span class="item" @click="tag='欧美'" :class="{active:tag=='欧美'}">欧美</span>
        <span class="item" @click="tag='华语'" :class="{active:tag=='华语'}">华语</span>
        <span class="item" @click="tag='流行'" :class="{active:tag=='流行'}">流行</span>
        <span class="item" @click="tag='说唱'" :class="{active:tag=='说唱'}">说唱</span>
        <span class="item" @click="tag='摇滚'" :class="{active:tag=='摇滚'}">摇滚</span>
        <span class="item" @click="tag='民谣'" :class="{active:tag=='民谣'}">民谣</span>
        <span class="item" @click="tag='电子'" :class="{active:tag=='电子'}">电子</span>
        <span class="item" @click="tag='轻音乐'" :class="{active:tag=='轻音乐'}">轻音乐</span>
        <span class="item" @click="tag='影视原声'" :class="{active:tag=='影视原声'}">影视原声</span>
        <span class="item" @click="tag='ACG'" :class="{active:tag=='ACG'}">ACG</span>
        <span class="item" @click="tag='怀旧'" :class="{active:tag=='怀旧'}">怀旧</span>
        <span class="item" @click="tag='治愈'" :class="{active:tag=='治愈'}">治愈</span>
        <span class="item" @click="tag='旅行'" :class="{active:tag=='旅行'}">旅行</span>
      </div>
      <!-- 内容区 -->
      <div class="tab-content">
        <div class="items">
          <div class="item" v-for="(item, index) in list" :key="index">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{item.playCount}}</span>
              </div>
              <img :src="item.coverImgUrl" @click="toPlayListDetail(item.id)" />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{item.name}}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <!-- 
      total: 总数
      current-page: 当前页（偏移
      page-size 每页容量
    -->
    <el-pagination
      @current-change="handleCurrentChange"
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="page"
      :page-size="10"
    ></el-pagination>
  </div>
</template>

<script>
import axios from "axios";

export default {
  created() {
    this.topData();
    this.listData();
  },
  data() {
    return {
      total: 0,
      page: 1,
      topList: {},
      list: [],
      tag: "全部"
    };
  },
  watch: {
    tag() {
      this.topData();
      this.listData();
      this.page = 1;
    }
  },
  methods: {
    topData() {
      axios({
        url: "https://autumnfish.cn/top/playlist/highquality",
        method: "get",
        params: {
          limit: 1,
          cat: this.tag
        }
      }).then(res => {
        this.topList = res.data.playlists[0];
      });
    },

    listData() {
      axios({
        url: "https://autumnfish.cn/top/playlist/",
        method: "get",
        params: {
          limit: 10,
          offset: (this.page - 1) * 10,
          cat: this.tag
        }
      }).then(res => {
        this.total = res.data.total;
        this.list = res.data.playlists;
      });
    },

    handleCurrentChange(val) {
      this.page = val;

      this.listData();
    },

    toPlayListDetail(id) {
      this.$router.push("/playListsDetail?query=" + id);
    }
  }
};
</script>

<style>
</style>