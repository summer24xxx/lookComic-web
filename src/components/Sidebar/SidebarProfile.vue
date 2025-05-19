<template>
  <div class="sidebar-profile">
    <div class="sidebar-header">
      <h4><i class="el-icon-user"></i> 个人中心</h4>
    </div>
    <ul class="nav-menu">
      <li class="nav-item">
        <router-link
          :class="{ active: url === 'Profile' }"
          class="nav-link"
          to="/user/profile"
        >
          <i class="el-icon-document"></i>
          <span>基本信息</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link
          :class="{ active: url === 'ProfileSafety' }"
          class="nav-link"
          to="/user/profile/safety"
        >
          <i class="el-icon-lock"></i>
          <span>账号安全</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "SidebarProfile",

  computed: {
    url() {
      return this.$route.name;
    },
  },
};
</script>

<style scoped>
.sidebar-profile {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 30px;
}

.sidebar-header {
  background: linear-gradient(135deg, #56ccf2, #2f80ed);
  color: white;
  padding: 15px;
  text-align: center;
}

.sidebar-header h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.sidebar-header i {
  margin-right: 8px;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  border-bottom: 1px solid #eef2f7;
}

.nav-item:last-child {
  border-bottom: none;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: #5a6a85;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-link i {
  font-size: 18px;
  margin-right: 10px;
  width: 24px;
  text-align: center;
}

.nav-link:hover {
  background-color: #f8fafc;
  color: #2f80ed;
  padding-left: 25px;
}

.nav-link.active {
  background: rgba(47, 128, 237, 0.1);
  color: #2f80ed;
  font-weight: 600;
  border-left: 4px solid #2f80ed;
}
</style>
