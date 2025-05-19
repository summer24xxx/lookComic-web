<template>
  <div class="user-detail-container">
    <div class="card user-info-card" v-if="userData">
      <div class="user-header">
        <div class="avatar">
          <img :src="'/api/' + userData.icon" alt="用户头像" />
        </div>
        <div class="user-basic-info">
          <h3 class="username">{{ userData.username }}</h3>
          <p class="email" v-if="userData.email">邮箱：{{ userData.email }}</p>
          <p class="note" v-if="userData.note">个性签名：{{ userData.note }}</p>
        </div>
      </div>

      <!-- 订阅漫画列表展示 -->
      <div class="card mt-4">
        <div class="card-header">
          <h4 class="mb-0">{{ userData ? userData.username : "" }} 的订阅</h4>
        </div>
        <div class="card-body">
          <div v-if="!comicsData">
            <p class="text-center">加载中...</p>
          </div>
          <div v-else>
            <nav-pag :action="fetchComicsPage" :pages="comicsData"></nav-pag>
            <div class="row justify-content-center">
              <div
                v-for="comic in comicsData.list"
                :key="comic.id"
                class="mt-3 ml-4"
              >
                <comic-card :comic="comic"></comic-card>
              </div>
            </div>
            <nav-pag :action="fetchComicsPage" :pages="comicsData"></nav-pag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { service } from "@/api/api";
import { Message } from "element-ui";
import NavPag from "@/components/Nav/NavPag";
import ComicCard from "@/components/ComicCard/index";
import { getInfo } from "@/api/login"; // 导入获取用户信息的API
import { mapGetters } from "vuex"; // 导入vuex工具

export default {
  name: "UserDetail",
  components: { NavPag, ComicCard },

  data() {
    return {
      userId: null,
      userData: {
        id: null,
        username: "",
        email: "",
        icon: "",
        note: "",
      },
      favoriteList: null,
      comicsData: null,
      loading: false,
    };
  },

  computed: {
    ...mapGetters([
      "user", // 获取当前登录用户信息
    ]),
    // 添加计算属性，判断是否查看的是当前登录用户的详情
    isCurrentUser() {
      return (
        this.user &&
        this.userId &&
        this.user.id.toString() === this.userId.toString()
      );
    },
  },

  created() {
    this.userId = this.$route.params.id;
    this.fetchData();
  },

  methods: {
    setDefaultImage(event) {
      event.target.src = "default-avatar.png"; // 修改默认图片路径，去掉开头的斜杠
    },

    fetchData() {
      this.loading = true;

      // 如果是查看当前登录用户的详情页，直接使用store中的用户信息
      if (this.isCurrentUser) {
        // 直接从store获取当前用户完整信息
        getInfo()
          .then((response) => {
            this.userData = response;

            // 获取用户订阅漫画
            service
              .get(`/api/user/${this.userId}/favourite`)
              .then((response) => {
                this.comicsData = response.comics;
                // 设置页面标题
                document.title = `用户详情 - ${this.userData.username}`;
              })
              .catch((error) => {
                console.error("获取用户订阅失败", error);
                Message({
                  message: "获取用户订阅失败",
                  type: "error",
                });
              })
              .finally(() => {
                this.loading = false;
              });
          })
          .catch((error) => {
            console.error("获取用户信息失败", error);
            Message({
              message: "获取用户信息失败",
              type: "error",
            });
            this.loading = false;
          });
      } else {
        // 获取其他用户信息
        service
          .get(`/api/user/${this.userId}/favourite`)
          .then((response) => {
            // 从favourite接口获取用户信息和收藏列表
            this.userData = response.user;
            this.favoriteList = {
              list: response.comics.list,
              pageNum: response.comics.pageNum,
              pageSize: response.comics.pageSize,
              pages: response.comics.pages,
              isFirstPage: response.comics.isFirstPage,
              isLastPage: response.comics.isLastPage,
              prePage: response.comics.prePage,
              nextPage: response.comics.nextPage,
            };

            // 同时设置comics数据用于底部订阅展示
            this.comicsData = response.comics;

            // 设置页面标题
            document.title = `用户详情 - ${this.userData.username}`;
          })
          .catch((error) => {
            console.error("获取用户信息失败", error);
            Message({
              message: "获取用户信息失败",
              type: "error",
            });
            // 导航到404页面
            this.$router.replace("/404");
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },

    fetchComicsPage(pageNum = 1, pageSize = 12) {
      this.loading = true;
      service
        .get(`/api/user/${this.userId}/favourite`, {
          params: {
            pageNum,
            pageSize,
          },
        })
        .then((response) => {
          this.comicsData = response.comics;
        })
        .catch((error) => {
          console.error("获取订阅漫画失败", error);
          Message({
            message: "获取订阅漫画失败",
            type: "error",
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
.user-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.card-header {
  background-color: transparent;
  border-bottom: 1px solid #eee;
  padding: 10px 0 15px 0;
  margin-bottom: 20px;
}

.card-body {
  padding: 0;
}

.user-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.avatar {
  margin-right: 20px;
}

.avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.user-basic-info {
  flex: 1;
}

.username {
  margin: 0 0 10px 0;
  font-size: 24px;
}

.email {
  color: #666;
  margin: 0 0 5px 0;
}

.note {
  margin: 10px 0 0 0;
  color: #666;
  font-style: italic;
}

.section-title {
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.comic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}

.comic-item {
  transition: transform 0.3s;
}

.comic-item:hover {
  transform: translateY(-5px);
}

.comic-cover {
  height: 200px;
  overflow: hidden;
  border-radius: 4px;
  margin-bottom: 8px;
}

.comic-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.comic-title {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

.list-inline {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

.list-inline-item {
  margin: 0 5px;
  cursor: pointer;
  padding: 5px 10px;
}

.list-inline-item.active {
  color: #007bff;
  font-weight: bold;
}

.list-inline-item.disabled {
  color: #ccc;
  cursor: not-allowed;
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
  justify-content: center;
}

@media (max-width: 768px) {
  .user-header {
    flex-direction: column;
    text-align: center;
  }

  .avatar {
    margin-right: 0;
    margin-bottom: 20px;
  }

  .comic-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style>
