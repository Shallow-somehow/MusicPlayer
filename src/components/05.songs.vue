<template>
  <div class="songs-container">
    <div class="tab-bar">
      <span :class="{active:tag==0}" @click="tag=0" class="item">全部</span>
      <span :class="{active:tag==7}" @click="tag=7" class="item">华语</span>
      <span :class="{active:tag==96}" @click="tag=96" class="item">欧美</span>
      <span :class="{active:tag==8}" @click="tag=8" class="item">日本</span>
      <span :class="{active:tag==16}" @click="tag=16" class="item">韩国</span>
    </div>

    <table class="el-table playlit-table">
      <thead>
        <th></th>
        <th></th>
        <th>音乐标题</th>
        <th>歌手</th>
        <th>专辑</th>
        <th>时长</th>
      </thead>
      <tbody>
        <tr class="el-table__row" v-for="(item, index) in lists" :key="index">
          <td>{{index + 1}}</td>
          <td>
            <div class="img-wrap">
              <img :src="item.album.picUrl" />
              <span @click="playMusic(item.id)" class="iconfont icon-play"></span>
            </div>
          </td>
          <td>
            <div class="song-wrap">
              <div class="name-wrap">
                <span>{{ item.name }}</span>
                <span v-if='item.mvid!=0' @click="toMvDetail(item.mvid)" class="iconfont icon-mv"></span>
              </div>
              <span></span>
            </div>
          </td>
          <td>{{ item.album.artists[0].name }}</td>
          <td>{{ item.album.name }}</td>
          <td>{{ item.duration | filter}}</td>
        </tr>
      </tbody>
    </table>
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
      lists: [],
      tag: 0
    };
  },
  filters: {
    filter(val) {
      let duration = val / 1000;
      let min = parseInt(duration / 60);
      min = min < 10 ? "0" + min : min;
      let sec = parseInt(duration % 60);
      sec = sec < 10 ? "0" + sec : sec;
      return `${min}:${sec}`;
    }
  },
  watch: {
    tag() {
      this.getList();
    }
  },
  methods: {
    getList() {
      axios({
        url: "https://autumnfish.cn/top/song",
        method: "get",
        params: {
          type: this.tag
        }
      }).then(res => {
        this.lists = res.data.data;
      });
    },
    toMvDetail(id) {
      this.$router.push("/mvDetail?query=" + id);
    },
    playMusic(id) {
      axios({
        url: "https://autumnfish.cn/song/url",
        method: "get",
        params: {
          id
        }
      }).then(res => {
        let url = res.data.data[0];
        this.$parent.musicUrl = url.url;
      });
    }
  }
};
</script>

<style>
</style>