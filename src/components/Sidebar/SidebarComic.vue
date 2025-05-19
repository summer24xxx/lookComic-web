<template>
  <div class="sidebar-comic">
    <div class="sidebar-header">
      <h4><i class="el-icon-reading"></i> 阅读记录</h4>
    </div>
    <div class="recent-content" v-if="lastRecord">
      <div class="comic-cover">
        <router-link
          :to="'/chapter/' + lastRecord.chapter.id + '?page=' + lastRecord.page"
          target="_blank"
        >
          <img
            :alt="getAltText()"
            :src="lastReadPage()"
            @error="setDefaultImage"
            class="cover-image"
          />
          <div class="hover-overlay">
            <span><i class="el-icon-view"></i> 继续阅读</span>
          </div>
        </router-link>
      </div>
      <div class="comic-info">
        <h5 class="comic-title">{{ lastRecord.comic.title }}</h5>
        <p class="chapter-info">
          {{ lastRecord.chapter.title }}
          <span class="page-badge">第{{ lastRecord.page }}页</span>
        </p>
      </div>
    </div>
    <div class="no-record" v-else>
      <i class="el-icon-notebook-2"></i>
      <p>暂无阅读记录</p>
    </div>
  </div>
</template>

<script>
import { isLogin } from "@/api/auth";

export default {
  name: "SidebarComic",
  props: {
    lastRecord: Object,
  },

  data() {
    return {
      hasError: false,
    };
  },

  methods: {
    getAltText() {
      if (!this.lastRecord || !this.lastRecord.chapter) {
        return "最近阅读";
      }

      const title = this.lastRecord.chapter.title || "";
      const page = this.lastRecord.page || "";

      return `${title} - 第${page}页`;
    },

    lastReadPage() {
      console.log(this.lastRecord, "lastrecords   =====");
      // 检查lastRecord是否包含所有需要的属性
      if (
        !this.lastRecord ||
        !this.lastRecord.comic ||
        !this.lastRecord.chapter
      ) {
        console.error("最近阅读记录不完整", this.lastRecord);
        return "/default-cover.png"; // 返回默认封面图，确保路径以斜杠开头
      }

      // 确保suffix属性存在
      const suffix =
        this.lastRecord.suffix || this.lastRecord.chapter.suffix || "jpg";

      try {
        return (
          "/api/" +
          encodeURIComponent(this.lastRecord.comic.title) +
          "/" +
          encodeURIComponent(this.lastRecord.chapter.title) +
          "/" +
          encodeURIComponent(this.lastRecord.page) +
          "." +
          suffix
        );
      } catch (error) {
        console.error("构建最近阅读图片路径失败", error);
        return "/default-cover.png"; // 返回默认封面图，确保路径以斜杠开头
      }
    },

    setDefaultImage(event) {
      if (this.hasError) {
        // 已经尝试过设置默认图片，但仍然失败
        console.warn("默认图片也无法加载，停止尝试");
        return;
      }

      console.log("图片加载失败，使用默认图片");
      this.hasError = true;
      event.target.src = "/default-cover.png"; // 确保路径以斜杠开头
    },

    isLogin: () => isLogin(),
  },
};
</script>

<style scoped>
.sidebar-comic {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 30px;
  width: 60%;
  margin-left: auto;
  margin-right: auto;
}

.sidebar-header {
  background: linear-gradient(135deg, #56ccf2, #2f80ed);
  color: white;
  padding: 10px;
  text-align: center;
}

.sidebar-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.sidebar-header i {
  margin-right: 6px;
  font-size: 14px;
}

.recent-content {
  padding: 10px;
}

.comic-cover {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 10px;
}

.cover-image {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(30, 144, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.hover-overlay span {
  color: white;
  font-weight: 500;
  display: flex;
  align-items: center;
  font-size: 12px;
}

.hover-overlay i {
  margin-right: 4px;
  font-size: 14px;
}

.comic-cover:hover .cover-image {
  transform: scale(1.05);
}

.comic-cover:hover .hover-overlay {
  opacity: 1;
}

.comic-info {
  padding: 0 5px;
}

.comic-title {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chapter-info {
  font-size: 12px;
  color: #666;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-badge {
  background: linear-gradient(135deg, #56ccf2, #2f80ed);
  color: white;
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 500;
}

.no-record {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 10px;
  color: #999;
}

.no-record i {
  font-size: 32px;
  margin-bottom: 10px;
  color: #ccc;
}

.no-record p {
  margin: 0;
  font-size: 12px;
}
</style>
