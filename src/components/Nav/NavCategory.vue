<template>
  <nav id="nav-category" class="category-navigation">
    <div class="category-container">
      <div class="category-label">
        <i class="el-icon-collection-tag"></i>
        <span>分类</span>
      </div>
      <ul class="category-list">
        <li
          v-for="category of categories"
          :key="category.id"
          class="category-item"
          :class="{ active: categoryId === category.id }"
        >
          <router-link :to="`/category?categoryId=${category.id}`">
            {{ category.name }}
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavCategory",
  props: {
    categories: Array,
  },

  computed: {
    categoryId() {
      return parseInt(this.$route.query.categoryId);
    },
  },
};
</script>

<style scoped>
.category-navigation {
  margin: 0 auto 30px;
  max-width: 1200px;
  padding: 0 15px;
}

.category-container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  padding: 15px 20px;
}

.category-label {
  display: flex;
  align-items: center;
  text-align: center;
  font-weight: 600;
  color: #2f80ed;
  font-size: 16px;
  margin-right: 20px;
  white-space: nowrap;
}

.category-label i {
  margin-right: 8px;
  font-size: 18px;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
}

.category-item {
  margin: 5px 15px 5px 0;
  position: relative;
}

.category-item a {
  text-decoration: none;
  color: #5a6a85;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 20px;
  transition: all 0.3s ease;
  display: block;
}

.category-item a:hover {
  color: #2f80ed;
  background-color: rgba(47, 128, 237, 0.08);
}

.category-item.active a {
  color: #fff;
  background: linear-gradient(135deg, #56ccf2, #2f80ed);
  box-shadow: 0 2px 8px rgba(47, 128, 237, 0.4);
}

@media (max-width: 768px) {
  .category-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .category-label {
    margin-bottom: 10px;
  }

  .category-item {
    margin: 5px 8px 5px 0;
  }

  .category-item a {
    padding: 4px 8px;
    font-size: 13px;
  }
}
</style>
