<template>
  <div class="error-container">
    <div class="error-content">
      <h1 class="error-code">403</h1>
      <h2 class="error-title">没有相关权限</h2>
      <p class="error-message">很抱歉，您没有权限访问此页面</p>
      <div class="error-actions">
        <button class="btn-back" @click="goBack">返回上页</button>
        <button class="btn-home" @click="toHome">返回首页</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Forbidden",
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    toHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  text-align: center;
  background-color: #f8f9fa;
}

.error-content {
  padding: 2rem;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
}

.error-code {
  font-size: 6rem;
  font-weight: bold;
  color: #f39c12;
  margin: 0;
}

.error-title {
  font-size: 2rem;
  color: #333;
  margin: 0.5rem 0;
}

.error-message {
  color: #666;
  margin-bottom: 2rem;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.btn-back {
  background-color: #e67e22;
  color: white;
}

.btn-back:hover {
  background-color: #d35400;
}

.btn-home {
  background-color: #95a5a6;
  color: white;
}

.btn-home:hover {
  background-color: #7f8c8d;
}
</style>
