<template>
  <div class="text-center loading-container" v-if="!comics">
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
          <nav-pag :action="fetchData" :pages="comics"></nav-pag>
          <div class="table-responsive">
            <table class="table table-hover">
              <thead class="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">漫画名</th>
                  <th scope="col">章节数</th>
                  <th scope="col">作者</th>
                  <th scope="col">分类</th>
                  <th scope="col">章节管理</th>
                  <th scope="col">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  :key="comic.id"
                  class="comic-info"
                  v-for="(comic, index) of comics.list"
                >
                  <th scope="row">{{ index + comics.startRow }}</th>
                  <td>
                    <router-link
                      :to="`/admin/comic/${comic.id}`"
                      class="comic-title"
                    >
                      {{ comic.title }}
                    </router-link>
                  </td>
                  <td>{{ comicsMap[comic.id] }}</td>
                  <td>
                    {{ comic.author }}
                    <a
                      @click.prevent="editAuthor(comic)"
                      href="#"
                      v-if="hasRole('ROLE_ADMIN')"
                      class="edit-icon"
                    >
                      <i class="el-icon-edit"></i>
                    </a>
                  </td>
                  <td>
                    <div class="category-tags" v-if="comicCategories[comic.id]">
                      <span
                        class="category-tag"
                        v-for="(cat, catIndex) in comicCategories[comic.id]"
                        :key="catIndex"
                      >
                        {{ cat.name }}
                      </span>
                      <a
                        @click.prevent="editCategory(comic)"
                        href="#"
                        v-if="hasRole('ROLE_ADMIN')"
                        class="edit-icon"
                      >
                        <i class="el-icon-edit"></i>
                      </a>
                    </div>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <router-link
                        :to="`/admin/comic/${comic.id}`"
                        v-if="hasRole('ROLE_ADMIN')"
                        class="btn btn-sm btn-outline-primary mr-2"
                      >
                        <i class="el-icon-folder"></i> 本地章节
                      </router-link>
                      <button
                        @click.prevent="updateComic(comic)"
                        v-if="hasRole('ROLE_ADMIN')"
                        class="btn btn-sm btn-outline-info"
                      >
                        <i class="el-icon-refresh"></i> 刷新章节
                      </button>
                    </div>
                  </td>
                  <td>
                    <button
                      @click.prevent="confirmDelete(comic.id, index)"
                      class="btn btn-sm btn-danger"
                    >
                      <i class="el-icon-delete"></i> 删除
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <nav-pag :action="fetchData" :pages="comics"></nav-pag>
        </div>
      </div>
    </div>

    <!-- 编辑作者对话框 -->
    <el-dialog title="编辑作者" :visible.sync="authorDialogVisible" width="30%">
      <el-input v-model="tempAuthor" placeholder="请输入作者名称"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="authorDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateAuthor">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="categoryDialogVisible"
      width="30%"
    >
      <el-checkbox-group v-model="selectedCategories">
        <el-checkbox
          v-for="cat in allCategories"
          :key="cat.id"
          :label="cat.id"
          >{{ cat.name }}</el-checkbox
        >
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="categoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { service } from "@/api/api";
import NavPag from "@/components/Nav/NavPag";
import SidebarAdmin from "@/components/Sidebar/SidebarAdmin";
import { hasPermission } from "@/api/auth";
import { MessageBox, Message } from "element-ui";

export default {
  name: "AdminComic",
  components: { SidebarAdmin, NavPag },
  data() {
    return {
      comics: null,
      comicsMap: null,
      authorDialogVisible: false,
      tempAuthor: "",
      currentComic: null,
      comicCategories: {},
      allCategories: [],
      categoryDialogVisible: false,
      selectedCategories: [],
      addComicDialogVisible: false,
      newComic: {
        title: "",
        author: "",
        categoryIds: [],
      },
    };
  },

  created() {
    this.fetchData();
    this.fetchAllCategories();
  },

  methods: {
    hasRole: (role) => hasPermission(role),

    navigate(pageNum, pageSize) {
      this.$router.push({
        path: this.$route.path,
        query: {
          pageNum: pageNum,
          pageSize: pageSize,
        },
      });
    },

    fetchData(pageNum, pageSize) {
      const params = {};
      if (pageNum) params.pageNum = pageNum;
      if (pageSize) params.pageSize = pageSize;

      service
        .get("/api/admin/comic/index", { params })
        .then((resp) => {
          this.comics = resp.comics;
          this.comicsMap = resp.comicsMap;

          // 获取每个漫画的分类信息
          if (this.comics && this.comics.list) {
            this.comics.list.forEach((comic) => {
              this.fetchComicCategories(comic.id);
            });
          }
        })
        .catch((error) => {
          console.error("获取漫画列表失败:", error);
          Message.error("获取漫画列表失败");
        });
    },

    fetchAllCategories() {
      service.get("/api/category/all").then((resp) => {
        this.allCategories = resp;
      });
    },

    fetchComicCategories(comicId) {
      service.get(`/api/category/comic/${comicId}`).then((resp) => {
        this.$set(this.comicCategories, comicId, resp);
      });
    },

    updateComic(comic) {
      service
        .put(
          `/api/admin/comic/refreshChapters?id=${comic.id}&title=${comic.title}`
        )
        .then((resp) => {
          // 更新章节数
          this.comicsMap[comic.id] = resp;
          Message.success(`刷新章节成功，共找到 ${resp} 个章节`);
        })
        .catch((error) => {
          console.error("刷新章节失败:", error);
          Message.error("刷新章节失败");
        });
    },

    confirmDelete(comicId, index) {
      MessageBox.confirm("此操作将永久删除该漫画, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteComic(comicId, index);
        })
        .catch(() => {});
    },

    deleteComic(comicId, index) {
      service
        .delete(`/api/admin/comic/delete?id=${comicId}`)
        .then(() => {
          this.comics.list.splice(index, 1);
          Message.success("删除成功");
        })
        .catch(() => {
          Message.error("删除失败");
        });
    },

    editAuthor(comic) {
      this.currentComic = comic;
      this.tempAuthor = comic.author;
      this.authorDialogVisible = true;
    },

    updateAuthor() {
      if (!this.tempAuthor.trim()) {
        Message.warning("作者名称不能为空");
        return;
      }

      service
        .post("/api/admin/comic/updateAuthor", null, {
          params: {
            id: this.currentComic.id,
            author: this.tempAuthor,
          },
        })
        .then(() => {
          this.currentComic.author = this.tempAuthor;
          this.authorDialogVisible = false;
          Message.success("更新作者成功");
        })
        .catch(() => {
          Message.error("更新作者失败");
        });
    },

    editCategory(comic) {
      this.currentComic = comic;
      this.selectedCategories = [];

      // 设置已选分类
      if (this.comicCategories[comic.id]) {
        this.selectedCategories = this.comicCategories[comic.id].map(
          (cat) => cat.id
        );
      }

      this.categoryDialogVisible = true;
    },

    updateCategory() {
      // 将选中的分类ID用/连接成字符串
      const categoryIdsString = this.selectedCategories.join("/");

      service
        .post("/api/category/comic/update", null, {
          params: {
            comicId: this.currentComic.id,
            categoryIds: categoryIdsString,
          },
        })
        .then(() => {
          // 重新获取该漫画的分类
          this.fetchComicCategories(this.currentComic.id);
          this.categoryDialogVisible = false;
          Message.success("更新分类成功");
        })
        .catch(() => {
          Message.error("更新分类失败");
        });
    },

    showAddComicDialog() {
      this.newComic = {
        title: "",
        author: "佚名",
        categoryIds: [13],
      };
      this.addComicDialogVisible = true;
    },

    addComic() {
      if (!this.newComic.title.trim()) {
        Message.warning("漫画名称不能为空");
        return;
      }

      const author = this.newComic.author.trim() || "佚名";

      service
        .put(
          `/api/admin/comic/add?title=${this.newComic.title}&author=${author}`
        )
        .then((resp) => {
          const comicId = resp.id;

          const categoryIds =
            this.newComic.categoryIds && this.newComic.categoryIds.length > 0
              ? this.newComic.categoryIds
              : [13];

          const categoryIdsString = categoryIds.join("/");

          service
            .post("/api/category/comic/update", null, {
              params: {
                comicId: comicId,
                categoryIds: categoryIdsString,
              },
            })
            .then(() => {
              this.addComicDialogVisible = false;
              this.fetchData();
              Message.success("添加漫画成功");
            })
            .catch(() => {
              Message.error("添加分类失败");
            });
        })
        .catch(() => {
          Message.error("添加漫画失败");
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

.comic-title {
  color: #2f80ed;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.comic-title:hover {
  color: #1e3c72;
  text-decoration: none;
}

.edit-icon {
  color: #2f80ed;
  margin-left: 8px;
  font-size: 14px;
}

.edit-icon:hover {
  color: #1e3c72;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-outline-primary {
  color: #2f80ed;
  border-color: #2f80ed;
}

.btn-outline-primary:hover {
  background-color: #2f80ed;
  color: white;
}

.btn-outline-info {
  color: #56ccf2;
  border-color: #56ccf2;
}

.btn-outline-info:hover {
  background-color: #56ccf2;
  color: white;
}

.btn-danger {
  background-color: #eb5757;
  border-color: #eb5757;
  color: white;
}

.btn-danger:hover {
  background-color: #d32f2f;
  border-color: #d32f2f;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 4px;
}

.category-tag {
  background: linear-gradient(135deg, #56ccf2, #2f80ed);
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
}
</style>
