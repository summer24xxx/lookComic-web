<template>
  <div class="sidebar-admin">
    <div class="sidebar-header">
      <h4><i class="el-icon-setting"></i> 管理中心</h4>
    </div>
    <ul class="nav-menu">
      <li class="nav-item">
        <router-link
          :class="{ active: $route.name === 'AdminComicLocal' }"
          class="nav-link"
          to="/admin/comic/index"
        >
          <i class="el-icon-reading"></i>
          <span>漫画管理</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link
          :class="{ active: $route.name === 'ComicLocal' }"
          class="nav-link"
          to="/admin/comic/addList"
        >
          <i class="el-icon-plus"></i>
          <span>添加漫画</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="hasRole('ROLE_LADMIN')">
        <router-link
          :class="{ active: $route.name === 'Account' }"
          class="nav-link"
          to="/admin/account/index"
        >
          <i class="el-icon-user"></i>
          <span>账号管理</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { hasPermission } from "@/api/auth";

export default {
  name: "SidebarAdmin",

  methods: {
    hasRole: (role) => hasPermission(role),
  },
};
</script>

<style scoped>
.sidebar-admin {
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
