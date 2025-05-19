<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark" id="nav-top">
    <div class="container-fluid">
      <!-- 左侧Logo 名称 -->
      <div class="brand-container">
        <router-link class="navbar-brand" to="/">
          <img alt="Logo" class="logo" src="/logo.png" />
          <span class="brand-name">就看漫画</span>
        </router-link>
      </div>

      <!-- 导航链接 -->
      <div class="nav-links-container">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/category?categoryId=1">
              <i class="fas fa-list-ul"></i>
              <span>分类</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/?orderBy=lastUpdate&asc=false">
              <i class="fas fa-clock"></i>
              <span>更新</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- 搜索框 -->
      <div class="search-container">
        <search-tip></search-tip>
      </div>

      <!-- 用户操作区域 -->
      <div class="user-actions-container">
        <ul class="navbar-nav">
          <!-- 已登录用户 -->
          <template v-if="isLogin()">
            <li class="nav-item user-profile">
              <div class="user-avatar" @click="navigateToUserDetail(user.id)">
                <img :src="'/api/' + user.icon" :alt="user.nickName" />
              </div>
              <div style="margin-right: 70px">
                <div class="dropdown">
                  <a
                    href="#"
                    class="nav-link dropdown-toggle"
                    data-toggle="dropdown"
                  >
                    {{ user.nickName }}
                  </a>
                  <div class="dropdown-menu">
                    <router-link class="dropdown-item" to="/user/profile">
                      <i class="fas fa-user"></i> 个人资料
                    </router-link>
                    <router-link class="dropdown-item" to="/user/favourite">
                      <i class="fas fa-bookmark"></i> 订阅书架
                    </router-link>
                    <router-link class="dropdown-item" to="/user/record">
                      <i class="fas fa-history"></i> 历史记录
                    </router-link>
                    <div class="dropdown-divider"></div>
                    <a @click="logout" class="dropdown-item" href="#">
                      <i class="fas fa-sign-out-alt"></i> 退出登录
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <!-- 管理员选项 -->
            <li v-if="hasRole('ROLE_ADMIN')">
              <div>
                <a href="#">
                  <router-link class="dropdown-item" to="/admin/comic/index">
                    管理
                  </router-link>
                </a>
              </div>
            </li>
          </template>

          <!-- 未登录用户 -->
          <li class="nav-item" v-else>
            <router-link class="nav-link login-btn" to="/login">
              <i class="fas fa-sign-in-alt"></i> 登录
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { hasPermission, isLogin } from "@/api/auth";
import { mapGetters } from "vuex";
import SearchTip from "@/components/Search/SearchTip";

export default {
  name: "NavTop",
  components: { SearchTip },
  data() {
    return {};
  },

  computed: {
    ...mapGetters(["user"]),
  },

  methods: {
    navigateToUserDetail(userId) {
      this.$router.push({ path: `/user/${userId}/detail` });
    },
    hasRole: (role) => hasPermission(role),

    isLogin: () => isLogin(),

    logout() {
      this.$store.dispatch("Logout").then(() => {
        if (this.$route.meta.auth || this.$route.path.startsWith("/admin")) {
          this.$router.push("/");
        } else {
          location.reload();
        }
      });
    },
  },
};
</script>

<style scoped>
/* 导航栏背景和阴影 */
#nav-top {
  background-image: url("/top-bg.png") !important;
  background-size: cover;
  background-position: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  padding: 0.5rem 2rem;
  margin-bottom: 1.5rem;
  position: relative;
  height: 160px;
}

/* 容器布局 */
.container-fluid {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 品牌区域 */
.brand-container {
  display: flex;
  align-items: center;
}

.navbar-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
}

.navbar-brand:hover {
  transform: scale(1.05);
}

.logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 10px rgba(229, 16, 16, 0.5);
}

.brand-name {
  margin-left: 10px;
  font-size: 1.5rem;
  font-weight: 600;
  color: rgb(255, 255, 255);
  -webkit-text-stroke-width: 0.2px; /* 描边宽度 */
  -webkit-text-stroke-color: black; /* 描边颜色 */
  /* text-shadow: 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000,
    -2px 2px 0 #000, 1px 1px 0 #000; */
}

/* 导航链接 */
.nav-links-container {
  margin-left: -70px;
}

.navbar-nav {
  display: flex;
  align-items: center;
}

.nav-item {
  margin: 0 0.5rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.95) !important;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  text-shadow: 1px 1px 2px #000, -1px -1px 2px #000;
  font-weight: 500;
}

.nav-link i {
  margin-right: 0.5rem;
  font-size: 1rem;
}

.nav-link:hover {
  color: white !important;
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* 搜索区域 */
.search-container {
  width: 300px;
  margin: 0 2rem;
  margin-left: -30px;
}

/* 用户区域 */
.user-actions-container {
  display: flex;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
}

.user-avatar {
  margin-right: 0.5rem;
  cursor: pointer;
  position: relative;
  z-index: 2;
}

.user-avatar img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.user-avatar img:hover {
  transform: scale(1.1);
  border-color: white;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.7);
}

/* 下拉菜单样式 */
.dropdown-menu {
  min-width: 200px;
  border: none;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  padding: 0.5rem 0;
  margin-top: 0.5rem;
}

.dropdown-item {
  padding: 0.6rem 1.25rem;
  display: flex;
  align-items: center;
  color: #444;
  transition: all 0.2s ease;
}

.dropdown-item i {
  margin-right: 0.75rem;
  font-size: 0.9rem;
  width: 18px;
  text-align: center;
}

.dropdown-item:hover {
  background-color: rgba(173, 83, 137, 0.1);
  color: #ad5389;
  transform: translateX(5px);
}

.dropdown-divider {
  margin: 0.25rem 0;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

/* 登录按钮 */
.login-btn {
  background-color: rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  padding: 0.4rem 1.2rem;
  font-weight: 600;
  text-shadow: 1px 1px 2px #000, -1px -1px 2px #000;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.login-btn:hover {
  background-color: rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.5);
}

/* 响应式调整 */
@media (max-width: 992px) {
  .container-fluid {
    flex-wrap: wrap;
  }

  .nav-links-container,
  .search-container {
    order: 3;
    width: 100%;
    margin: 0.5rem 0;
  }

  .search-container {
    order: 2;
  }
}

.dropdown-toggle {
  text-shadow: 1px 1px 2px #000, -1px -1px 2px #000;
  font-weight: 500;
}
</style>
