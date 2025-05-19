<template>
  <div class="text-center loading-container" v-if="!comicsMap">
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
          <!-- <header class="page-header">
            <h2><i class="el-icon-plus"></i> 添加漫画</h2>
          </header> -->

          <nav-pag
            v-if="paginatedComics && paginatedComics.pages > 1"
            :action="changePage"
            :pages="paginatedComics"
          ></nav-pag>

          <div class="table-responsive">
            <table class="table table-hover">
              <thead class="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">漫画名</th>
                  <th scope="col">章节数</th>
                  <th scope="col">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(comic, index) in displayedComics" :key="index">
                  <th scope="row">{{ getRowNumber(index) }}</th>
                  <td>{{ comic.name }}</td>
                  <td>{{ comic.chapters }}</td>
                  <td>
                    <button
                      @click="addComic(comic.name, $event)"
                      class="btn btn-sm btn-action"
                      :disabled="comic.added"
                    >
                      {{ comic.added ? "已添加" : "添加" }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <nav-pag
            v-if="paginatedComics && paginatedComics.pages > 1"
            :action="changePage"
            :pages="paginatedComics"
          ></nav-pag>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { service } from "@/api/api";
import SidebarAdmin from "@/components/Sidebar/SidebarAdmin";
import NavPag from "@/components/Nav/NavPag";
import { Message } from "element-ui";

export default {
  name: "ComicLocal",
  components: { SidebarAdmin, NavPag },
  data() {
    return {
      comicsMap: null,
      comicsList: [], // 转换后的列表数据
      paginatedComics: null, // 分页对象
      currentPage: 1,
      pageSize: 10,
    };
  },

  computed: {
    displayedComics() {
      if (!this.comicsList) return [];
      return this.comicsList.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    },
  },

  created() {
    this.fetchData();
  },

  methods: {
    fetchData() {
      service.get("/api/admin/comic/addList").then((resp) => {
        this.comicsMap = resp;
        this.prepareComicsList();
      });
    },

    prepareComicsList() {
      if (!this.comicsMap) return;

      // 将对象转换为数组以便分页
      const list = Object.entries(this.comicsMap).map(([name, chapters]) => ({
        name,
        chapters,
        added: false,
      }));

      this.comicsList = list;
      this.updatePagination();
    },

    updatePagination() {
      const total = this.comicsList.length;
      const pages = Math.ceil(total / this.pageSize);

      // 构建分页对象，格式与 NavPag 组件使用的一致
      this.paginatedComics = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        pages: pages,
        total: total,
        isFirstPage: this.currentPage === 1,
        isLastPage: this.currentPage === pages,
        nextPage: this.currentPage < pages ? this.currentPage + 1 : pages,
        prePage: this.currentPage > 1 ? this.currentPage - 1 : 1,
        startRow: (this.currentPage - 1) * this.pageSize + 1,
        endRow: Math.min(this.currentPage * this.pageSize, total),
      };
    },

    changePage(pageNum, pageSize) {
      this.currentPage = pageNum;
      this.pageSize = pageSize;
      this.updatePagination();
    },

    getRowNumber(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },

    addComic(title, event) {
      const button = event.target;
      button.disabled = true;

      service
        .put(`/api/admin/comic/add?title=${encodeURIComponent(title)}`)
        .then((resp) => {
          // 获取添加成功后返回的漫画id
          const comicId = resp.id;

          // 设置默认分类为"未分类"(id=13)
          service
            .post("/api/category/comic/update", null, {
              params: {
                comicId: comicId,
                categoryIds: "13",
              },
            })
            .then(() => {
              // 更新状态
              const index = this.comicsList.findIndex(
                (comic) => comic.name === title
              );
              if (index !== -1) {
                this.comicsList[index].added = true;
              }

              Message.success("添加漫画成功");
              button.innerHTML = "已添加";
              button.classList.add("added");
            })
            .catch((error) => {
              console.error("设置默认分类失败:", error);
              button.disabled = false;
              Message.error("设置默认分类失败");
            });
        })
        .catch((error) => {
          console.error("添加漫画失败:", error);
          button.disabled = false;
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

.btn-action {
  background: linear-gradient(135deg, #56ccf2, #2f80ed);
  color: white;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.btn-action:hover:not(:disabled) {
  background: linear-gradient(135deg, #2f80ed, #1e3c72);
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(42, 82, 152, 0.3);
}

.btn-action:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-action.added {
  background: #6fcf97;
}
</style>
