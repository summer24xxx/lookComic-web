<template>
  <div class="text-center loading-container" v-if="!users">
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">加载中...</span>
    </div>
    <p>加载中...</p>
  </div>
  <div class="content-container" v-else>
    <div class="row">
      <sidebar-admin></sidebar-admin>
      <div class="col">
        <div class="content-card">
          <nav-pag :action="fetchData" :pages="users"></nav-pag>
          <div class="table-responsive">
            <table class="table table-hover">
              <thead class="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">用户名</th>
                  <th scope="col">创建时间</th>
                  <th scope="col">用户角色</th>
                  <th scope="col">增加角色</th>
                  <th scope="col">移除角色</th>
                  <th scope="col">禁用/启用</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  :key="index"
                  v-for="(user, index) of users.list"
                  :class="{ 'first-user': user.id === 1 }"
                >
                  <th scope="row">{{ index + users.startRow }}</th>
                  <td>{{ user.username }}</td>
                  <td>{{ formatDate(user.createTime) }}</td>
                  <td>
                    <div class="role-tags">
                      <span
                        class="role-tag"
                        v-for="(role, roleIndex) in roles[user.id]"
                        :key="roleIndex"
                      >
                        {{ role }}
                      </span>
                    </div>
                  </td>
                  <td>
                    <select
                      @change="addRole(user.id, $event)"
                      class="form-control custom-select"
                      :disabled="user.id === 1"
                      :title="user.id === 1 ? '系统保护用户，不可修改' : ''"
                    >
                      <option disabled selected value="">选择角色...</option>
                      <option
                        :key="roleIndex"
                        :value="role"
                        v-for="(role, roleIndex) of addableRoles(
                          roles[user.id]
                        )"
                      >
                        {{ role }}
                      </option>
                    </select>
                  </td>
                  <td>
                    <select
                      @change="removeRole(user.id, $event)"
                      class="form-control custom-select"
                      :disabled="user.id === 1"
                      :title="user.id === 1 ? '系统保护用户，不可修改' : ''"
                    >
                      <option disabled selected value="">选择角色...</option>
                      <option
                        :key="roleIndex"
                        :value="role"
                        v-for="(role, roleIndex) of removableRoles(
                          roles[user.id]
                        )"
                      >
                        {{ role }}
                      </option>
                    </select>
                  </td>
                  <td>
                    <div class="custom-control custom-switch">
                      <input
                        :id="'status-' + user.id"
                        :checked="user.status"
                        @change="toggleStatus(user.id, $event)"
                        class="custom-control-input"
                        type="checkbox"
                        :disabled="user.id === 1"
                        :title="user.id === 1 ? '系统保护用户，不可修改' : ''"
                      />
                      <label
                        class="custom-control-label"
                        :for="'status-' + user.id"
                      >
                        {{ user.status ? "已启用" : "已禁用" }}
                      </label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <nav-pag :action="fetchData" :pages="users"></nav-pag>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavPag from "@/components/Nav/NavPag";
import SidebarAdmin from "@/components/Sidebar/SidebarAdmin";
import { formatDate } from "@/utils/utils";
import { hasPermission } from "@/api/auth";
import { service } from "@/api/api";
import { Message } from "element-ui";

export default {
  name: "Account",
  components: { SidebarAdmin, NavPag },
  data() {
    return {
      users: null,
      allRoles: null,
      roles: null,
    };
  },

  created() {
    this.fetchData(1, 10);
  },

  methods: {
    formatDate: (dataString) => formatDate(dataString),

    addableRoles(roles) {
      return this.allRoles.filter((role) => {
        if (!roles.includes(role)) {
          return !(role === "ROLE_ADMIN" && !hasPermission("ROLE_ADMIN"));
        }
        return false;
      });
    },

    removableRoles(roles) {
      return roles.filter(
        (role) => !(role === "ROLE_ADMIN" && !hasPermission("ROLE_ADMIN"))
      );
    },

    fetchData(pageNum, pageSize = 10) {
      const params = { ...this.$route.query };
      if (pageNum) params.pageNum = pageNum;
      if (pageSize) params.pageSize = pageSize;

      service
        .get("/api/admin/account/index", { params })
        .then((resp) => {
          this.users = resp["users"];
          this.allRoles = resp["all_roles"];
          this.roles = resp["roles"];
        })
        .catch((error) => {
          console.error("获取账号列表失败:", error);
          Message.error("获取账号列表失败");
        });
    },

    addRole(userId, event) {
      const selectedRole = event.target.value;
      this.postRequest("/api/admin/account/addRole", {
        userId,
        role: selectedRole,
      })
        .then(() => {
          this.roles[userId].push(selectedRole);
          event.target.selectedIndex = 0;
          Message.success(`成功添加角色: ${selectedRole}`);
        })
        .catch((error) => {
          console.error("添加角色失败:", error);
          Message.error("添加角色失败");
          event.target.selectedIndex = 0;
        });
    },

    removeRole(userId, event) {
      const selectedRole = event.target.value;
      this.postRequest("/api/admin/account/removeRole", {
        userId,
        role: selectedRole,
      })
        .then(() => {
          const index = this.roles[userId].findIndex((r) => r === selectedRole);
          if (index !== -1) {
            this.roles[userId].splice(index, 1);
          }
          event.target.selectedIndex = 0;
          Message.success(`成功移除角色: ${selectedRole}`);
        })
        .catch((error) => {
          console.error("移除角色失败:", error);
          Message.error("移除角色失败");
          event.target.selectedIndex = 0;
        });
    },

    toggleStatus(userId, event) {
      const isEnabled = event.target.checked;
      const url = isEnabled
        ? "/api/admin/account/enabledUser"
        : "/api/admin/account/disabledUser";

      this.postRequest(url, { userId })
        .then(() => {
          Message.success(isEnabled ? "用户已启用" : "用户已禁用");
        })
        .catch((error) => {
          console.error("更改用户状态失败:", error);
          Message.error("更改用户状态失败");
          // 恢复原始状态
          event.target.checked = !isEnabled;
        });
    },
  },
};
</script>

<style scoped>
.loading-container {
  padding: 100px 0;
}

.loading-container p {
  margin-top: 15px;
  color: #666;
}

.content-container {
  padding: 20px 0;
}

.content-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 30px;
}

.page-header {
  border-bottom: 1px solid #eef2f7;
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.page-header h2 {
  color: #2f80ed;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.page-header h2 i {
  margin-right: 10px;
}

.table {
  width: 100%;
  margin-bottom: 1.5rem;
}

.table-hover tbody tr:hover {
  background-color: rgba(47, 128, 237, 0.05);
}

.thead-light th {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 500;
}

.custom-select {
  border-radius: 4px;
  border-color: #ddd;
  font-size: 14px;
  transition: all 0.3s ease;
}

.custom-select:focus {
  border-color: #2f80ed;
  box-shadow: 0 0 0 0.2rem rgba(47, 128, 237, 0.25);
}

.custom-control-input:checked ~ .custom-control-label::before {
  background-color: #2f80ed;
  border-color: #2f80ed;
}

.role-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.role-tag {
  background: linear-gradient(135deg, #56ccf2, #2f80ed);
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
}

.first-user {
  background-color: rgba(247, 247, 247, 0.5);
}

.first-user td {
  color: #777;
}
</style>
