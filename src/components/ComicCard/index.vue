<template>
  <div class="card img-card">
    <router-link :to="'/comic/' + comic.id" target="_blank">
      <img
        :alt="comic.title || '漫画封面'"
        :src="comicImageUrl"
        @error="setDefaultImage"
        class="img-thumbnail card-img-top"
      />
    </router-link>

    <div class="card-body">
      <span
        :title="comic.title"
        class="card-text text-center text-truncate"
        data-placement="top"
        data-toggle="tooltip"
      >
        {{ truncateTitle(comic.title) }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComicCard",
  props: {
    comic: Object,
  },
  computed: {
    // 计算属性用于生成图片 URL
    comicImageUrl() {
      return "/api/cover/" + encodeURIComponent(this.comic.title) + ".jpg";
    },
  },
  methods: {
    // 设置默认图片的方法
    setDefaultImage(event) {
      event.target.src = "/default-cover.png"; // 默认图片路径
    },

    // 截断标题，限制为12个字符
    truncateTitle(title) {
      if (!title) return "";
      if (title.length <= 12) return title;
      return title.substring(0, 12) + "...";
    },
  },
};
</script>

<style scoped>
.img-card {
  width: 230px;
}
.card-img-top {
  height: 283px;
  object-fit: cover; /* 确保图片按照指定的高度和宽度显示 */
}
</style>
