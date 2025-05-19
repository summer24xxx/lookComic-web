<template>
  <div>
    <header class="text-center"></header>
    <div class="text-center" v-if="loading">
      <h4>加载中...</h4>
    </div>
    <template v-if="pages">
      <nav-pag :pages="pages" :action="navigate"></nav-pag>
      <div class="row justify-content-center" id="cards">
        <div :key="comic.id" class="mt-3 ml-4" v-for="comic in pages.list">
          <favourite-comic-card
            :comic="comic"
            :favourite="favourites ? favourites[comic.id] : null"
            class="custom-card"
          >
          </favourite-comic-card>
        </div>
      </div>
      <nav-pag :pages="pages" :action="navigate"></nav-pag>
    </template>
  </div>
</template>

<script>
import { service } from "@/api/api";
import NavPag from "@/components/Nav/NavPag";
import FavouriteComicCard from "@/components/ComicCard/FavouriteComicCard";
// import Favourite from "@/components/Favourite/index";
export default {
  name: "Home",
  components: { FavouriteComicCard, NavPag },

  data() {
    return {
      loading: false,
      pages: null,
      favourites: null,
    };
  },

  created() {
    if (!this.pages) this.fetchData();
  },

  watch: {
    $route: "fetchData",
  },

  methods: {
    navigate(pageNum, pageSize) {
      this.$router.push({
        path: this.$route.path,
        query: {
          pageNum: pageNum,
          pageSize: pageSize,
        },
      });
    },

    fetchData() {
      this.loading = true;
      service
        .get("/api/index", {
          params: this.$route.query,
        })
        .then((resp) => {
          // console.log(resp);
          this.pages = resp.pages;
          this.favourites = resp.favourites;
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
#mb-4 {
  font-size: 14px;
}

.custom-card {
  transition: transform 0.2s;
}

.custom-card:hover {
  transform: scale(1.05);
}

#cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.card {
  margin: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
