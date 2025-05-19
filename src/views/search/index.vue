<template>
  <div class="container mt-4">
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="sr-only">加载中...</span>
      </div>
    </div>

    <template v-else>
      <!--      <h3 v-if="isAuthorSearch">-->
      <!--        作者：{{ $route.query.author }}-->
      <!--        <small class="text-muted">(共 {{ comics.total }} 部作品)</small>-->
      <!--      </h3>-->
      <h3>
        <!--        搜索：{{ $route.query.keyword }}-->
        <small class="text-muted">(找到 {{ comics.total }} 个结果)</small>
      </h3>

      <div v-if="comics.list && comics.list.length > 0">
        <div class="row">
          <div
            class="col-md-6 mb-4"
            v-for="comic in comics.list"
            :key="comic.id"
          >
            <search-comic-card :comic="comic" />
          </div>
        </div>

        <nav-pag :pages="comics" :action="navigate" />
      </div>

      <div v-else class="text-center mt-5">
        <h4 class="text-muted">未找到相关漫画</h4>
      </div>
    </template>
  </div>
</template>

<script>
import { service } from "@/api/api";
import SearchComicCard from "@/components/ComicCard/SearchComicCard";
import NavPag from "@/components/Nav/NavPag";

export default {
  name: "SearchPage",
  components: {
    SearchComicCard,
    NavPag,
  },
  data() {
    return {
      loading: true,
      comics: {},
      isAuthorSearch: false,
    };
  },
  watch: {
    $route: "fetchData",
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.loading = true;
      const query = this.$route.query;
      const params = {
        pageNum: query.page || 1,
        pageSize: query.pageSize || 20,
      };

      if (query.keyword) {
        params.keyword = query.keyword;
      } else if (query.author) {
        params.author = query.author;
      }

      service
        .get("/api/comic/search/simple", { params })
        .then((resp) => {
          this.comics = resp.comics;
          this.isAuthorSearch = resp.isAuthorSearch;
        })
        .catch((error) => {
          console.error("搜索失败:", error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    navigate(pageNum, pageSize) {
      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          page: pageNum,
          pageSize: pageSize,
        },
      });
    },
    //   changePage(page, pageSize) {
    //     if (page < 1 || page > this.comics.pages) return;
    //
    //     const query = {
    //       ...this.$route.query,
    //       page,
    //       pageSize: pageSize || this.$route.query.pageSize,
    //     };
    //     this.$router.push({ query });
    //   },
  },
};
</script>

<style scoped>
@media (max-width: 768px) {
  .col-md-6 {
    padding-left: 5px;
    padding-right: 5px;
  }
}
</style>
