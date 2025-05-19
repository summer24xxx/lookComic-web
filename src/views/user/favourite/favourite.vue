<template>
  <div class="text-center loading-container" v-if="!comics">
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">加载中...</span>
    </div>
    <p>加载中...</p>
  </div>
  <div class="favourite-container" v-else>
    <div class="row">
      <div class="col-md-3">
        <sidebar-comic :last-record="lastRecord"></sidebar-comic>
      </div>
      <div class="col-md-9">
        <div class="content-card">
          <header class="page-header">
            <h2><i class="el-icon-collection-tag"></i> 订阅书架</h2>
          </header>

          <nav-pag :action="fetchData" :pages="comics"></nav-pag>

          <div class="comics-container">
            <div
              v-for="comic of comics.list"
              :key="comic.id"
              class="comic-item-wrapper"
            >
              <record-comic-card :comic="comic" :record="allRecords[comic.id]">
              </record-comic-card>
            </div>
          </div>

          <nav-pag :action="fetchData" :pages="comics"></nav-pag>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarComic from "@/components/Sidebar/SidebarComic";
import { service } from "@/api/api";
import NavPag from "@/components/Nav/NavPag";
import RecordComicCard from "@/components/ComicCard/RecordComicCard";
import { mapGetters } from "vuex";

export default {
  name: "favourite",
  components: { RecordComicCard, NavPag, SidebarComic },

  data() {
    return {
      lastRecord: null,
      allRecords: null,
      comics: null,
    };
  },

  computed: {
    ...mapGetters(["user"]),
  },

  created() {
    document.title = `订阅 - ${this.user.username}`;
    this.fetchData();
  },

  methods: {
    fetchData() {
      service
        .get("/api/user/favourite", {
          params: this.$route.query,
        })
        .then((resp) => {
          this.lastRecord = resp["last_record"];
          this.allRecords = resp["all_records"];
          this.comics = resp["comics"];
        });
    },
  },
};
</script>

<style scoped>
.favourite-container {
  padding: 20px 0;
}

.loading-container {
  padding: 100px 0;
}

.loading-container p {
  margin-top: 15px;
  color: #666;
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

.last-read-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: 14px;
  color: #666;
}

.last-read-label {
  color: #2f80ed;
  font-weight: 500;
  margin-right: 8px;
}

.comics-container {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10px;
}

.comic-item-wrapper {
  padding: 10px;
  width: 33.333%;
}

@media (max-width: 992px) {
  .comic-item-wrapper {
    width: 50%;
  }
}

@media (max-width: 768px) {
  .comic-item-wrapper {
    width: 100%;
  }
}
</style>
