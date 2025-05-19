<template>
  <div class="card img-card" v-if="record">
    <router-link :to="'/comic/' + comic.id" target="_blank">
      <img
        :alt="`/api/cover/${comic.title}.jpg`"
        @error="setDefaultImage"
        :src="`/api/mangadm5/${comic.title}/${record.chapter.title}/${record.page}${record.chapter.suffix}`"
        class="img-thumbnail card-img-top comic-content"
      />
    </router-link>
    <div class="card-body">
      <span
        :title="comic.title"
        class="card-text text-center text-truncate"
        data-placement="top"
        data-toggle="tooltip"
      >
        {{ comic.title }}
      </span>
      <router-link
        :title="`CH.${record.chapter.title} ${record.page}页`"
        :to="`/chapter/${record.chapter.id}?page=${record.page}`"
        class="btn btn-outline-danger float-right btn-sm"
        data-placement="top"
        data-toggle="tooltip"
        target="_blank"
      >
        最新章节</router-link
      >
    </div>
  </div>
  <comic-card :comic="comic" v-else></comic-card>
</template>

<script>
import ComicCard from "@/components/ComicCard/index";

export default {
  name: "RecordComicCard",
  components: { ComicCard },
  props: {
    record: Object,
    comic: Object,
  },
  methods: {
    // 设置默认图片的方法
    setDefaultImage(event) {
      event.target.src = "/default-cover.png"; // 默认图片路径
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
}
</style>
