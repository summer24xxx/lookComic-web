<template>
  <nav
    aria-label="Page navigation"
    class="nav-pagination"
    id="nav-pag"
    v-if="pages.pages > 1"
  >
    <ul class="pagination justify-content-center">
      <!-- 上一页按钮 -->
      <li :class="{ disabled: pages.isFirstPage }" class="page-item prev-btn">
        <a
          @click.prevent="action(pages.prePage, pages.pageSize)"
          class="page-link"
          href="#"
          tabindex="-1"
        >
          <i class="el-icon-arrow-left"></i>
        </a>
      </li>

      <!-- 页码按钮 -->
      <li
        :class="{ active: index === pages.pageNum }"
        :key="index"
        class="page-item page-number"
        v-for="index in getDisplayedPages()"
      >
        <a
          @click.prevent="action(index, pages.pageSize)"
          class="page-link"
          href="#"
        >
          {{ index }}
        </a>
      </li>

      <!-- 下一页按钮 -->
      <li :class="{ disabled: pages.isLastPage }" class="page-item next-btn">
        <a
          @click.prevent="action(pages.nextPage, pages.pageSize)"
          class="page-link"
          href="#"
        >
          <i class="el-icon-arrow-right"></i>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "NavPag",
  props: {
    pages: Object,
    action: Function,
  },
  data() {
    return {
      path: this.$route.path,
    };
  },
  methods: {
    // 计算要显示的页码，显示当前页码附近的页码和首尾页码
    getDisplayedPages() {
      if (!this.pages || !this.pages.pages) return [];

      const totalPages = this.pages.pages;
      const currentPage = this.pages.pageNum;
      const MAX_VISIBLE = 7; // 最多显示页码数

      if (totalPages <= MAX_VISIBLE) {
        // 如果总页数不多，全部显示
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      // 否则显示首页、尾页和当前页附近的页码
      let displayedPages = [];
      const NEIGHBORS = 1; // 当前页左右各显示多少个页码

      // 添加首页
      displayedPages.push(1);

      // 添加当前页及其邻近页
      let startPage = Math.max(2, currentPage - NEIGHBORS);
      let endPage = Math.min(totalPages - 1, currentPage + NEIGHBORS);

      // 添加省略号
      if (startPage > 2) {
        displayedPages.push("...");
      }

      // 添加中间页码
      for (let i = startPage; i <= endPage; i++) {
        displayedPages.push(i);
      }

      // 添加省略号
      if (endPage < totalPages - 1) {
        displayedPages.push("...");
      }

      // 添加尾页
      if (totalPages > 1) {
        displayedPages.push(totalPages);
      }

      return displayedPages;
    },
  },
};
</script>

<style scoped>
.nav-pagination {
  margin: 2rem 0;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.page-item {
  margin: 0 2px;
  transition: all 0.3s ease;
}

.page-link {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 38px;
  height: 38px;
  padding: 0 12px;
  border-radius: 6px !important;
  font-weight: 500;
  color: #333;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: white;
  transition: all 0.3s ease;
}

.page-item:not(.disabled):hover .page-link {
  color: #fff;
  background-color: #3679b5;
  border-color: #2a5298;
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(42, 82, 152, 0.3);
}

.page-item.active .page-link {
  color: #fff;
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  border-color: #1e3c72;
  box-shadow: 0 2px 8px rgba(42, 82, 152, 0.4);
  font-weight: 600;
}

.page-item.disabled .page-link {
  color: #ccc;
  pointer-events: none;
  background-color: #f9f9f9;
  border-color: #eee;
}

.prev-btn .page-link,
.next-btn .page-link {
  font-size: 1em;
}

/* 响应式调整 */
@media (max-width: 576px) {
  .page-link {
    min-width: 30px;
    height: 30px;
    padding: 0 8px;
    font-size: 0.9rem;
  }

  .page-item.page-number:not(.active) {
    display: none;
  }

  .page-item.page-number.active {
    display: flex;
  }
}
</style>
