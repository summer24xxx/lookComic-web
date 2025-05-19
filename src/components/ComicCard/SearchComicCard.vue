<template>
  <div class="card h-100">
    <div class="row no-gutters">
      <div class="col-md-4">
        <router-link :to="`/comic/${comic.id}`">
          <img
            :src="comicImageUrl"
            @error="setDefaultImage"
            class="card-img"
            :alt="comic.title"
          />
        </router-link>
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title text-truncate">
            <router-link :to="`/comic/${comic.id}`" class="text-dark">
              {{ comic.title }}
            </router-link>
          </h5>
          <p class="card-text">
            <small class="text-muted"> 作者： {{ comic.author }} </small>
          </p>
          <p class="card-text description">
            {{ comic.description || "暂无简介" }}
          </p>
          <p class="card-text">
            <small class="text-muted">最后更新：{{ comic.lastUpdate }}</small>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchComicCard",
  props: {
    comic: {
      type: Object,
      required: true,
    },
  },
  methods: {
    setDefaultImage(event) {
      event.target.src = "/default-cover.png";
    },
  },
  computed: {
    comicId() {
      return this.$route.params.id;
    },
    // 计算属性用于生成图片 URL
    comicImageUrl() {
      return "/api/cover/" + encodeURIComponent(this.comic.title) + ".jpg";
    },
  },
};
</script>

<style scoped>
.card {
  transition: transform 0.2s;
  height: 100%;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.card-img {
  height: 200px;
  object-fit: cover;
}
.description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 3em;
}
.card-title {
  margin-bottom: 0.5rem;
}
</style>
