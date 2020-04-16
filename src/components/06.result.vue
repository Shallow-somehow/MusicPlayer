<template>
  <div class="result-container">
    <div class="title-wrap">
      <h2 class="title">{{$route.query.query}}</h2>
      <span class="sub-title">找到{{count}}个结果</span>
    </div>
    <!-- 列表 -->
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲" name="songs">
        <table class="el-table">
          <thead>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr
              class="el-table__row"
              v-for="(item, index) in songList"
              :key="index"
              @dblclick="playMusic(item.id)"
            >
              <td>{{index + 1}}</td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{ item.name }}</span>
                    <span v-if="item.mvid!=0" class="iconfont icon-mv"></span>
                  </div>
                  <span v-if="item.alias.length!=0">{{ item.alias[0] }}</span>
                </div>
              </td>
              <td>{{ item.artists[0].name }}</td>
              <td>{{ item.album.name }}</td>
              <td>{{ item.duration | filter}}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane label="歌单" name="lists">
        <div class="items">
          <div class="item" v-for="(item, index) in playList" :key="index" @click="toPlayListDetail(item.id)">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{ item.playCount | filterCount}}</span>
              </div>
              <img :src="item.coverImgUrl" />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{ item.name }}</p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="MV" name="mv">
        <div class="items mv">
          <div class="item" v-for="(item, index) in mvList" :key="index" @click="toMvDetail(item.id)">
            <div class="img-wrap">
              <img :src="item.cover" />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{item.playCount | filterCount}}</div>
              </div>
              <span class="time">{{ item.duration | filter}}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{ item.name }}</div>
              <div class="singer">{{ item.artistName }}</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>



<script>
import axios from "axios";

export default {
  created() {
    axios({
      url: "https://autumnfish.cn/search",
      method: "get",
      params: {
        //type: 歌曲:1 歌单： 1000， MV：1004  默认为1
        keywords: this.$route.query.query,
        type: 1,
        limit: 15
      }
    }).then(res => {
      this.songList = res.data.result.songs;
      this.count = res.data.result.songCount;
    });
  },
  data() {
    return {
      activeIndex: "songs",
      songList: [],
      playList: [],
      mvList: [],
      count: ""
    };
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
    toPlayListDetail(id) {
      this.$router.push('/playListsDetail?query=' + id);
    },
    toMvDetail(id) {
      this.$router.push('/mvDetail?query=' + id);
    }
  },
  watch: {
    activeIndex() {
      let type = 1;
      let limit = 10;
      switch (this.activeIndex) {
        case "songs":
          type = 1;
          limit = 15;
          break;
        case "lists":
          type = 1000;
          break;
        case "mv":
          type = 1004;
          limit = 8;
          break;

        default:
          break;
      }
      axios({
        url: "https://autumnfish.cn/search",
        method: "get",
        params: {
          //type: 歌曲:1 歌单： 1000， MV：1004  默认为1
          keywords: this.$route.query.query,
          type,
          limit
        }
      }).then(res => {
        if (type == 1) {
          //结果为歌曲
          this.songList = res.data.result.songs;
          this.count = res.data.result.songCount;
        } else if (type == 1000) {
          this.playList = res.data.result.playlists;
          this.count = res.data.result.playlistCount;
        } else if (type == 1004) {
          this.mvList = res.data.result.mvs;
          this.count = res.data.result.mvCount;
        }
      });
    }
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
    filterCount(val) {
      return (val = val > 100000 ? parseInt(val / 10000) + "万" : val);
    }
  }
};
</script>

<style>
</style>