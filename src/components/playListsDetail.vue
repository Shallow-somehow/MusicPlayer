<template>
  <div class="playlist-container">
    <div class="top-wrap">
      <div class="img-wrap">
        <img :src="playList.coverImgUrl" alt />
      </div>
      <div class="info-wrap">
        <p class="title">{{playList.name}}</p>
        <div class="author-wrap">
          <img class="avatar" :src="creatorList.avatarUrl" />
          <span class="name">{{ creatorList.nickname }}</span>
          <span class="time">{{ playList.createTime | filterTime}} 创建</span>
        </div>
        <div class="play-wrap">
          <span class="iconfont icon-circle-play"></span>
          <span class="text">播放全部</span>
        </div>
        <div class="tag-wrap">
          <span class="title">标签:</span>
          <ul>
            <li v-for="(item, index) in playList.tags" :key="index">{{item}}</li>
          </ul>
        </div>
        <div class="desc-wrap">
          <span class="title">简介:</span>
          <span class="desc">{{ playList.description }}</span>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲列表" name="1">
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
            <tr class="el-table__row" v-for="(item, index) in playList.tracks" :key="index">
              <td>{{index + 1}}</td>
              <td>
                <div class="img-wrap">
                  <img :src="item.al.picUrl" />
                  <span class="iconfont icon-play" @click="playMusic(item.id)"></span>
                </div>
              </td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{item.name}}</span>
                    <span v-if="item.mv!=0" class="iconfont icon-mv" @click="toMvDetail(item.mv)"></span>
                  </div>
                </div>
              </td>
              <td>{{ item.ar[0].name }}</td>
              <td>{{ item.al.name }}</td>
              <td>{{ item.dt | filter }}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane :label="`评论(${total})`" name="2">
        <!-- 热门评论 -->
        <div class="comment-wrap">
          <p class="title">
            热门评论
            <span class="number">({{ hotCommentsCount }})</span>
          </p>
          <div class="comments-wrap">
            <div class="item" v-for="(item, index) in hotComments" :key="index">
              <div class="icon-wrap">
                <img :src="item.user.avatarUrl" alt />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{item.user.nickname}}：</span>
                  <span class="comment">{{item.content}}</span>
                </div>
                <div class="re-content" v-if="item.beReplied.length != 0">
                  <span class="name">{{item.beReplied[0].user.nickname}}:</span>
                  <span class="comment">{{item.beReplied[0].content}}</span>
                </div>
                <div class="date">{{item.time | filterTime}}</div>
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
                <img :src="item.user.avatarUrl" alt />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{item.user.nickname}}：</span>
                  <span class="comment">{{item.content}}</span>
                </div>
                <div class="re-content" v-if="item.beReplied.length != 0">
                  <span class="name">{{item.beReplied[0].user.nickname}}：</span>
                  <span class="comment">{{item.beReplied[0].content}}</span>
                </div>
                <div class="date">{{item.time | filterTime}}</div>
              </div>
            </div>
          </div>
        </div>
        <el-pagination
          @current-change="handleCurrentChange"
          background
          layout="prev, pager, next"
          :total="total"
          :current-page="1"
          :page-size="5"
        ></el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from "axios";
export default {
  created() {
    axios({
      url: "https://autumnfish.cn/playlist/detail",
      method: "get",
      params: {
        id: this.$route.query.query
      }
    }).then(res => {
      this.playList = res.data.playlist;
      this.creatorList = res.data.playlist.creator;
    });

    // 热门评论
    axios({
      url: "https://autumnfish.cn/comment/hot",
      method: "get",
      params: {
        id: this.$route.query.query,
        //   歌单type为2
        type: 2
      }
    }).then(res => {
      this.hotComments = res.data.hotComments;
      this.hotCommentsCount = res.data.total;
    });

    // 最新评论
    axios({
      url: "https://autumnfish.cn/comment/playlist",
      method: "get",
      params: {
        id: this.$route.query.query,
        limit: 10,
        offset: 0
      }
    }).then(res => {
      this.total = res.data.total;
      this.comments = res.data.comments;
    });
  },
  data() {
    return {
      activeIndex: "1",
      playList: {},
      creatorList: {},
      hotComments: [],
      hotCommentsCount: 0,
      comments: {},
      total: 0,
      page: 0
    };
  },
  filters: {
    filterTime(val) {
      var date = new Date(val);
      return (
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
      );
    },
    filter(val) {
      let duration = val / 1000;
      let min = parseInt(duration / 60);
      min = min < 10 ? "0" + min : min;
      let sec = parseInt(duration % 60);
      sec = sec < 10 ? "0" + sec : sec;
      return `${min}:${sec}`;
    }
  },
  methods: {
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
    },
    handleCurrentChange(val) {
      this.page = val;
      axios({
        url: "https://autumnfish.cn/comment/playlist",
        method: "get",
        params: {
          id: this.$route.query.query,
          limit: 10,
          offset: (this.page - 1) * 10
        }
      }).then(res => {
        console.log(res);
        this.total = res.data.total;
        this.comments = res.data.comments;
      });
    },
    toMvDetail(id) {
      this.$router.push("/mvDetail?query=" + id);
    }
  }
};
</script>

<style>
</style>