<template>
  <div id="comic">
    <div v-if="loading">
      <h4>加载中...</h4>
    </div>

    <div class="card" id="comic-summary" v-if="comic">
      <div class="row no-gutters mb-3">
        <div class="col-sm-3">
          <img
            :alt="comic.title || '漫画封面'"
            :src="comicImageUrl"
            @error="setDefaultImage"
            class="card-img border"
          />
        </div>
        <div class="col-8">
          <div class="card-body pt-1">
            <h2 class="card-title">{{ comic.title }}</h2>
            <div class="pb-2 text-secondary">
              <!--              <router-link :to="'/api/esComic/search?author=' + comic.author" class="muted-link"-->
              <!--                 target="_blank">-->
              {{ comic.author }}
              <!--              </router-link>-->
              <span>
                {{ new Date(comic.createTime).toLocaleDateString() }}
              </span>
            </div>
            <div class="text-muted pb-2">
              <img
                alt="/images/icons/tag.svg"
                src="/api/images/icons/tag.svg"
                style="width: 16px; height: 16px"
              />
              <span>
                <router-link
                  :key="category.id"
                  :to="`/category?categoryId=${category.id}`"
                  v-for="category in comic.categories"
                >
                  {{ category.name }}&nbsp;
                </router-link>
              </span>
            </div>
            <div class="text-muted pb-5">
              <img
                alt="/images/icons/calendar.svg"
                src="/api/images/icons/calendar.svg"
                style="width: 16px; height: 16px"
              />
              <span>
                最近更新: {{ new Date(comic.lastUpdate).toLocaleDateString() }}
              </span>
            </div>
            <div class="mt-5">
              <router-link
                :to="
                  '/chapter/' +
                  lastRecord.chapter.id +
                  '?page=' +
                  lastRecord.page
                "
                class="btn btn-outline-primary mr-3"
                target="_blank"
                v-if="lastRecord"
                >继续阅读</router-link
              >
              <router-link
                :to="'/chapter/' + firstChapter.id"
                class="btn btn-outline-primary mr-3"
                target="_blank"
                v-else-if="firstChapter"
                >开始阅读</router-link
              >
              <favourite :comic-id="comicId" :favourite="favourite"></favourite>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-3 align-self-center" id="chapters-info">
        <h4 v-if="chapters.size === 0">这本漫画暂时没有内容。。。</h4>
        <h3 v-if="chapters.size !== 0">章节列表</h3>
        <ul class="list-inline">
          <li
            :class="{ active: now === chapters.pageNum }"
            :key="now"
            class="list-inline-item"
            v-for="now in chapters.pages"
          >
            <a @click.prevent="fetchChapters(now, chapters.pageSize)">
              {{ chapters.pageSize * (now - 1) + 1 }} -
              {{ chapters.pageSize * now }}
            </a>
          </li>
        </ul>
        <div id="chapter-list">
          <div
            :key="row"
            class="chapter-line"
            v-for="row in Math.ceil(chapters.size / 5)"
          >
            <router-link
              :key="col"
              :title="
                calcIndex(row, col) +
                1 +
                ' ' +
                chapters.list[calcIndex(row, col)].title
              "
              :to="'/chapter/' + chapters.list[calcIndex(row, col)].id"
              class="btn btn-outline-info text-truncate"
              data-placement="top"
              data-toggle="tooltip"
              target="_blank"
              v-for="col in Math.min(chapters.size - (row - 1) * 5, 5)"
            >
              {{ chapters.list[calcIndex(row, col)].title }}
            </router-link>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 80px">
        <h3 v-if="isLogin()">评论</h3>
        <h4 v-if="!isLogin()">
          <router-link class="nav-link" to="/login"
            >登录以发表评论！</router-link
          >
        </h4>

        <comment-box
          :comic-id="comicId"
          v-on:addComment="addComment"
        ></comment-box>
        <hr />

        <h3>最新评论</h3>
        <div class="comments" v-if="comments">
          <comment
            :comment="comment"
            :firstReplies="repliesMap[comment.id]"
            :key="comment.id"
            v-for="comment of comments.list"
            @commentDeleted="handleCommentDeleted"
          >
          </comment>
          <div class="text-center text-muted mb-4" v-if="!comments.size">
            目前还没有评论。
          </div>
          <nav-pag :action="fetchComments" :pages="comments"></nav-pag>
        </div>

        <comment-box
          :comic-id="comicId"
          v-if="comments && comments.size > 5"
          v-on:addComment="addComment"
        >
        </comment-box>
      </div>
    </div>
  </div>
</template>

<script>
import { service } from "@/api/api";
import Favourite from "@/components/Favourite/index";
import CommentBox from "@/components/Comment/CommentBox";
import Comment from "@/components/Comment/Comment";
import NavPag from "@/components/Nav/NavPag";
import { isLogin } from "@/api/auth";

export default {
  name: "Comic",
  components: { NavPag, Comment, CommentBox, Favourite },

  data() {
    return {
      loading: false,
      comic: null,
      lastRecord: null,
      chapters: null,
      firstChapter: null,
      favourite: false,

      comments: null,
      repliesMap: null,
    };
  },

  computed: {
    comicId() {
      return this.$route.params.id;
    },
    // 计算属性用于生成图片 URL
    comicImageUrl() {
      return "/api/cover/" + encodeURIComponent(this.comic.title) + ".jpg";
    },
  },

  created() {
    this.fetchData();
  },

  watch: {
    $route: "fetchData",
  },

  methods: {
    isLogin: () => isLogin(),
    // 设置默认图片的方法
    setDefaultImage(event) {
      event.target.src = "/default-cover.png"; // 默认图片路径
    },
    fetchData() {
      this.loading = true;
      service
        .get("/api/comic/" + this.comicId, {
          params: this.$route.query,
        })
        .then((resp) => {
          this.comic = resp.comic;
          this.lastRecord = resp.last_record;
          this.chapters = resp.pages;
          this.firstChapter = resp.first_chapter;
          this.favourite = resp.favourite;
          document.title = this.comic.title;
          this.loading = false;

          this.fetchComments();
        });
    },

    fetchChapters(pageNum = 1, pageSize = 50) {
      service
        .get("/api/comic/" + this.comicId + "/chapters", {
          params: {
            pageNum,
            pageSize,
          },
        })
        .then((resp) => {
          this.chapters = resp;
        });
    },

    fetchComments(pageNum = 1, pageSize = 20) {
      service
        .get("/api/comment/" + this.comicId, {
          params: {
            pageNum,
            pageSize,
          },
        })
        .then((resp) => {
          // console.log(resp);
          this.comments = resp.comments;
          this.repliesMap = resp.repliesMap;
        });
    },

    addComment(comment) {
      // 添加新评论到列表开头
      this.comments.list.unshift(comment);

      // 初始化新评论的回复映射
      if (!this.repliesMap) {
        this.repliesMap = {};
      }

      // 为新评论创建一个空的回复列表结构
      this.repliesMap[comment.id] = {
        list: [],
        pageNum: 1,
        pageSize: 10,
        pages: 0,
        size: 0,
        isFirstPage: true,
        isLastPage: true,
      };

      // 更新评论总数
      if (this.comments) {
        this.comments.size++;
      }
    },

    calcIndex(row, col) {
      // (row - 1) * 5 + col - 1
      return 5 * row + col - 6;
    },

    handleCommentDeleted(commentId) {
      // 从评论列表中移除被删除的评论
      if (this.comments && this.comments.list) {
        const index = this.comments.list.findIndex(
          (comment) => comment.id === commentId
        );
        if (index !== -1) {
          this.comments.list.splice(index, 1);

          // 如果已删除的评论有回复，也需要从repliesMap中移除
          if (this.repliesMap && this.repliesMap[commentId]) {
            delete this.repliesMap[commentId];
          }

          // 更新评论总数
          if (this.comments.size > 0) {
            this.comments.size--;
          }
        } else {
          // 如果在当前页面找不到被删除的评论，重新获取评论列表
          this.fetchComments(this.comments.pageNum, this.comments.pageSize);
        }
      }
    },
  },
};
</script>

<style scoped>
#comic {
  position: absolute;
  width: 100%;
  /*height: 100%;*/
  /*top: 0;*/
  left: 0;
  overflow-y: auto;
  background-color: #fafafa;
}

#comic-summary {
  /*background-color: #ffffff;*/
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 30px;
  padding-left: 30px;
  /*border: 1px solid #dee2e6!important;*/
}

.list-inline-item {
  color: black;
  font-size: 12px;
  cursor: pointer;
}

.card-img {
  width: 230px;
  height: 283px;
}

.active {
  color: #007bff;
  font-weight: 700;
}

.disabled {
  cursor: default;
}

.chapter-line {
  display: flex;
  margin-bottom: 16px;
  flex-wrap: nowrap;
}

.chapter-line a {
  /*display: block;*/
  width: 200px;
  height: 48px;
  margin-right: 16px;
  line-height: 34px;
}

.user-face-reply img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}
</style>
