<template>
  <div class="mv-container">
    <div class="mv-wrap">
      <h3 class="title">mv详情</h3>
      <!-- MV -->
      <div class="video-wrap">
        <video controls :src="url"></video>
      </div>
      <!-- mv信息 -->
      <div class="info-wrap">
        <div class="singer-info">
          <div class="avatar-wrap">
            <img :src="singerInfo" />
          </div>
          <span class="name">{{ mvInfo.artistName }}</span>
        </div>
        <div class="mv-info">
          <h2 class="title">{{mvInfo.name}}</h2>
          <span class="date">发布：{{mvInfo.publishTime}}</span>
          <span class="number">播放：{{ mvInfo.playCount }}次</span>
          <p class="desc">{{ mvInfo.desc }}</p>
        </div>
      </div>
      <!-- 热门评论 -->
      <div class="comment-wrap">
        <p class="title">
          最新评论
          <span class="number">({{hotComments.length}})</span>
        </p>
        <div class="comments-wrap">
          <div class="item" v-for="(item, index) in hotComments" :key="index">
            <div class="icon-wrap">
              <img :src="item.user.avatarUrl" />
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{ item.user.nickname }}：</span>
                <span class="comment">{{ item.content}}</span>
              </div>
              <div class="re-content" v-if="item.beReplied.length != 0">
                <span class="name">{{item.beReplied[0].user.nickname}}：</span>
                <span class="comment">{{item.beReplied[0].content}}</span>
              </div>
              <div class="date">{{ item.time | filterTime }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 最新评论 -->
      <div class="comment-wrap">
        <p class="title">
          最新评论
          <span class="number">({{total}})</span>
        </p>
        <div class="comments-wrap">
          <div class="item" v-for="(item, index) in comments" :key="index">
            <div class="icon-wrap">
              <img :src="item.user.avatarUrl" />
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{ item.user.nickname }}:</span>
                <span class="comment">{{ item.content }}</span>
              </div>
              <div class="re-content" v-if="item.beReplied.length != 0">
                <span class="name">{{item.beReplied[0].user.nickname}}：</span>
                <span class="comment">{{item.beReplied[0].content}}</span>
              </div>
              <div class="date">{{ item.time | filterTime }}</div>
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
        :limit="limit"
      ></el-pagination>
    </div>
    <div class="mv-recommend">
      <div class="title">相关推荐</div>
      <div class="mvs">
        <div class="items">
          <div class="item" v-for="(item, index) in simi" :key="index" @click="toMvDetail(item.id)">
            <div class="img-wrap">
              <img :src="item.cover" alt />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{ item.playCount | filterMv}}</div>
              </div>
              <span class="time">{{ item.duration | filter}}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{ item.name }}</div>
              <div class="singer">{{item.artistName}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  created() {
    axios({
      url: "https://autumnfish.cn/mv/url",
      method: "get",
      params: {
        id: this.$route.query.query
      }
    }).then(res => {
      //   console.log(res);
      this.url = res.data.data.url;
    });

    // 相似推荐
    axios({
      url: "https://autumnfish.cn/simi/mv",
      method: "get",
      params: {
        mvid: this.$route.query.query
      }
    }).then(res => {
      this.simi = res.data.mvs;
    });

    // 歌手信息
    axios({
      url: "https://autumnfish.cn/mv/detail",
      method: "get",
      params: {
        mvid: this.$route.query.query
      }
    }).then(res => {
      this.mvInfo = res.data.data;
      //获取歌手头像
      axios({
        url: "https://autumnfish.cn/artists",
        method: "get",
        params: {
          id: this.mvInfo.artists[0].id
        }
      }).then(res => {
        this.singerInfo = res.data.artist.picUrl;
      });
    });

    // 评论
    axios({
      url: "https://autumnfish.cn/comment/mv",
      method: "get",
      params: {
        id: this.$route.query.query,
        limit: this.limit,
        offset: (this.page - 1) * 10
      }
    }).then(res => {
      console.log(res);
      this.total = res.data.total;
      this.hotComments = res.data.hotComments;
      this.comments = res.data.comments;
    });
  },
  data() {
    return {
      total: 0,
      page: 1,
      limit: 10,
      url: "",
      simi: [],
      mvInfo: {},
      singerInfo: {},
      hotComments: [],
      comments: []
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
    },
    filterMv(val) {
      return (val = val > 100000 ? parseInt(val / 10000) + "万" : val);
    },
    filterTime(val) {
      var date = new Date(val);
      return (
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
      );
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      axios({
        url: "https://autumnfish.cn/comment/mv",
        method: "get",
        params: {
          id: this.$route.query.query,
          limit: this.limit,
          offset: (this.page - 1) * 10
        }
      }).then(res => {
        this.comments = res.data.comments;
      });
    },
    toMvDetail(id) {
      this.$router.push("/mvDetail?query=" + id);
      axios({
        url: "https://autumnfish.cn/mv/url",
        method: "get",
        params: {
          id: this.$route.query.query
        }
      }).then(res => {
        //   console.log(res);
        this.url = res.data.data.url;
      });

      // 相似推荐
      axios({
        url: "https://autumnfish.cn/simi/mv",
        method: "get",
        params: {
          mvid: this.$route.query.query
        }
      }).then(res => {
        this.simi = res.data.mvs;
      });

      // 歌手信息
      axios({
        url: "https://autumnfish.cn/mv/detail",
        method: "get",
        params: {
          mvid: this.$route.query.query
        }
      }).then(res => {
        this.mvInfo = res.data.data;
        //获取歌手头像
        axios({
          url: "https://autumnfish.cn/artists",
          method: "get",
          params: {
            id: this.mvInfo.artists[0].id
          }
        }).then(res => {
          this.singerInfo = res.data.artist.picUrl;
        });
      });

      // 评论
      axios({
        url: "https://autumnfish.cn/comment/mv",
        method: "get",
        params: {
          id: this.$route.query.query,
          limit: this.limit,
          offset: (this.page - 1) * 10
        }
      }).then(res => {
        console.log(res);
        this.total = res.data.total;
        this.hotComments = res.data.hotComments;
        this.comments = res.data.comments;
      });
    }
  }
};
</script>

<style>
</style>