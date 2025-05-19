<template>
  <div class="comment pr-4 border-bottom">
    <div class="user-face pr-4">
      <img
        :alt="'/api/' + comment.user.icon"
        :src="'/api/' + comment.user.icon"
        @error="setDefaultImage($event)"
        @click="navigateToUserDetail(comment.user.id)"
        class="clickable-avatar"
      />
    </div>
    <div class="comment-details">
      <div class="mb-2">
        <router-link
          :to="'/user/' + comment.user.id + '/detail'"
          class="username"
        >
          {{ comment.user.username }}
        </router-link>
      </div>
      <div class="mb-1">{{ comment.text }}</div>
      <div class="text-muted reply-info">
        <span>{{ formatData(comment.createTime) }}</span>
        <span @click="replyClick(null)" class="ml-3 btn-reply-wrap">
          回复
        </span>
        <span
          @click="deleteComment('/api/comment/delete/', comment.id)"
          class="ml-3 btn-delete-wrap"
          v-if="hasRole('ROLE_ADMIN')"
        >
          删除
        </span>
      </div>

      <template v-if="replies">
        <div :key="reply.id" class="reply" v-for="reply of replies.list">
          <div class="user-face-reply pr-2">
            <img
              :alt="'/api/' + reply.user.icon"
              :src="'/api/' + reply.user.icon"
              @error="setDefaultImage($event)"
              @click="navigateToUserDetail(reply.user.id)"
              class="clickable-avatar"
            />
          </div>
          <div>
            <div class="mb-1">
              <span class="pr-2">
                <router-link
                  :to="'/user/' + reply.user.id + '/detail'"
                  class="username"
                >
                  {{ reply.user.username }}
                </router-link>
              </span>
              <span v-if="reply.reply">
                回复
                <router-link :to="'/user/' + reply.reply.user.id + '/detail'">
                  {{ reply.reply.user.username }}
                </router-link>
                <span>:&nbsp;{{ reply.text }}</span>
              </span>
              <span v-else>{{ reply.text }}</span>
            </div>
            <div class="text-muted reply-info">
              <span>{{ formatData(reply.createTime) }}</span>
              <span @click="replyClick(reply)" class="ml-3 btn-reply-wrap">
                回复
              </span>
              <span
                @click="deleteComment('/api/comment/delete/reply/', reply.id)"
                class="ml-3 btn-delete-wrap"
                v-if="hasRole('ROLE_ADMIN')"
              >
                删除
              </span>
            </div>
          </div>
        </div>

        <ul class="list-inline justify-content-end" v-if="replies.pages > 1">
          <li
            :class="{ disabled: replies.isFirstPage }"
            class="list-inline-item"
          >
            <span
              @click="fetchRepliesDebounced(replies.prePage, replies.pageSize)"
            >
              上一页
            </span>
          </li>
          <li
            :class="{ active: now === replies.pageNum }"
            :key="now"
            class="list-inline-item"
            v-for="now in replies.pages"
          >
            <span @click="fetchRepliesDebounced(now, replies.pageSize)">
              {{ now }}
            </span>
          </li>
          <li
            :class="{ disabled: replies.isLastPage }"
            class="list-inline-item"
          >
            <span
              @click="fetchRepliesDebounced(replies.nextPage, replies.pageSize)"
            >
              下一页
            </span>
          </li>
        </ul>
        <!--输入框-->
        <template v-if="commentBoxSeen">
          <div class="comment-area" v-if="isLogin()">
            <div class="user-face pr-4">
              <img
                :alt="'/api/' + user.icon"
                :src="'/api/' + user.icon"
                @error="setDefaultImage($event)"
              />
            </div>
            <textarea
              autocomplete="off"
              class="form-control comment-text mr-4"
              cols="8"
              maxlength="500"
              placeholder="写下你的评论..."
              required
              rows="2"
              v-model.lazy="commentTxt"
            ></textarea>
            <button
              @click="replyComment"
              class="btn btn-primary btn-comment align-self-center"
            >
              评论
            </button>
          </div>
          <div class="comment-area" v-else></div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import { service } from "@/api/api";
import { mapGetters } from "vuex";
import { isLogin } from "@/api/auth";
import { formatDate } from "@/utils/utils";
import { MessageBox, Message } from "element-ui";
import { hasPermission } from "@/api/auth";

export default {
  name: "Comment",

  props: {
    comment: Object,
    firstReplies: Object,
  },

  data() {
    return {
      reply: null,
      commentBoxSeen: false,
      commentTxt: "",
      replies: this.firstReplies,
      loading: false,
    };
  },

  computed: {
    ...mapGetters(["user"]),
  },

  methods: {
    hasRole: (role) => hasPermission(role),

    isLogin: () => isLogin(),

    setDefaultImage(event) {
      event.target.src = "default-avatar.png"; // 修改默认头像路径，去掉开头的斜杠
    },

    deleteComment(url, commentId) {
      if (this.loading) return;

      this.loading = true;
      MessageBox.confirm("确定要删除这条评论吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          service
            .delete(`${url}${commentId}`)
            .then((response) => {
              if (response.code === "200") {
                Message({
                  message: "删除成功",
                  type: "success",
                });

                // 向父组件发送删除成功的事件
                this.$emit("commentDeleted", commentId);

                // 如果是回复评论的删除，刷新当前回复列表
                if (url.includes("reply")) {
                  this.fetchReplies(1, 10);
                }
                this.fetchReplies(1, this.replies ? this.replies.pageSize : 10);
              } else {
                Message({
                  message: response.data.message || "删除失败",
                  type: "error",
                });
              }
            })
            .catch((error) => {
              Message({
                message: error.message || "请求出错",
                type: "warning",
              });
              console.error("删除评论失败", error);
            })
            .finally(() => {
              this.loading = false;
            });
        })
        .catch(() => {
          this.loading = false;
          Message({
            message: "已取消删除",
            type: "info",
          });
        });
    },

    fetchReplies(pageNum = 1, pageSize = 10) {
      // 设置加载状态
      this.loading = true;

      console.log(`获取评论ID ${this.comment.id} 的回复，页码：${pageNum}`);

      // 先确保replies对象存在
      if (!this.replies) {
        this.replies = {
          list: [],
          pageNum: pageNum,
          pageSize: pageSize,
          pages: 0,
          size: 0,
          isFirstPage: true,
          isLastPage: true,
        };
      }

      service
        .get("/api/comment/" + this.comment.id + "/replies", {
          params: {
            pageNum,
            pageSize,
          },
        })
        .then((resp) => {
          console.log("获取回复成功:", resp);
          if (resp && typeof resp === "object") {
            this.replies = resp;
          } else {
            console.error("回复数据格式不正确:", resp);
            // 创建一个空的回复列表结构
            this.replies = {
              list: [],
              pageNum: pageNum,
              pageSize: pageSize,
              pages: 0,
              size: 0,
              isFirstPage: true,
              isLastPage: true,
            };
          }
        })
        .catch((error) => {
          console.error("获取评论回复失败", error);
          Message({
            message: "获取评论回复失败",
            type: "error",
          });

          // 发生错误时确保replies对象存在
          if (!this.replies) {
            this.replies = {
              list: [],
              pageNum: pageNum,
              pageSize: pageSize,
              pages: 0,
              size: 0,
              isFirstPage: true,
              isLastPage: true,
            };
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    debounce(fn, delay = 300) {
      let timer = null;
      return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          fn.apply(this, args);
        }, delay);
      };
    },

    replyClick(reply) {
      console.log("点击回复按钮", reply ? `回复ID: ${reply.id}` : "回复主评论");

      // 设置当前回复对象
      this.reply = reply;

      // 先检查是否已登录
      if (!isLogin()) {
        Message({
          message: "请先登录再回复评论",
          type: "warning",
        });
        return;
      }

      // 如果已经是显示状态，并且点击的是同一个回复，则隐藏输入框
      if (
        this.commentBoxSeen &&
        ((reply === null && this.reply === null) ||
          (reply && this.reply && reply.id === this.reply.id))
      ) {
        this.commentBoxSeen = false;
        return;
      }

      // 显示评论框
      this.commentBoxSeen = true;

      // 设置占位符文本
      const placeholder = reply
        ? `回复 ${reply.user.username}: `
        : "写下你的评论...";

      // 确保评论框可见后再聚焦
      this.$nextTick(() => {
        const textarea = this.$el.querySelector(".comment-text");
        if (textarea) {
          textarea.placeholder = placeholder;
          textarea.focus();
        }
      });
    },

    replyComment() {
      if (this.loading || !this.commentTxt || !this.commentTxt.length) return;

      this.loading = true;
      service
        .put("/api/comment/reply", {
          reply: this.reply ? { id: this.reply.id } : null,
          comment: { id: this.comment.id },
          text: this.commentTxt,
        })
        .then((response) => {
          // 调试输出，检查响应
          console.log("回复评论响应:", response);

          // 先执行"成功"操作
          // 清空输入框
          this.commentTxt = "";

          // 确保隐藏评论框
          this.commentBoxSeen = false;

          // 显示成功消息
          Message({
            message: "回复成功",
            type: "success",
          });

          // 无论响应如何，都重新获取回复列表以确保UI同步
          this.fetchReplies(1, this.replies ? this.replies.pageSize : 10);
        })
        .catch((error) => {
          console.error("回复评论失败", error);
          Message({
            message: error.message || "回复失败",
            type: "error",
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },

    formatData: (data) => formatDate(data),

    navigateToUserDetail(userId) {
      this.$router.push({ path: `/user/${userId}/detail` });
    },
  },

  created() {
    this.fetchRepliesDebounced = this.debounce(this.fetchReplies);
  },
};
</script>

<style scoped>
.comment-area,
.comment,
.reply {
  max-width: 900px;
  display: flex;
  padding-top: 0.5rem !important;
  margin-bottom: 1.5rem !important;
}

.reply {
  margin-bottom: 0.5rem !important;
}

.reply-info {
  font-size: 14px;
}

.user-face img,
.user-face-reply img {
  border-radius: 50%;
}

.user-face img {
  width: 48px;
  height: 48px;
}

.user-face-reply img {
  width: 24px;
  height: 24px;
}

.clickable-avatar {
  cursor: pointer;
  transition: transform 0.2s;
}

.clickable-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.username {
  color: #6d757a;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  text-decoration: none;
}

.comment-text {
  width: 700px;
  resize: none;
}

.btn-comment {
  width: 60px;
  height: 40px;
}

.btn-reply-wrap {
  cursor: pointer;
}

.btn-reply-wrap:hover {
  font-weight: 700;
  text-decoration: underline;
}

.list-inline-item {
  color: black;
  font-size: 12px;
  cursor: pointer;
}

.active {
  color: #007bff;
  font-weight: 700;
}

.disabled {
  cursor: default;
}

@media (max-width: 768px) {
  .comment-area {
    flex-direction: column;
  }

  .comment-text {
    width: 100%;
  }
}
</style>
