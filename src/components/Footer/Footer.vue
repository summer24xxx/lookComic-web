<template>
  <div>
    <div class="footer-placeholder"></div>
    <footer>
      <div id="footer">
        <div>欢迎来到就看漫画网</div>
        <div class="copyright">
          © {{ currentYear }} 就看漫画网 -
          本网站漫画源自可爬取资源，若涉侵权，请速联系并提供证明，我们将立即处理。

          <router-link to="/about">关于本站</router-link>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "Footer",
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },
};
</script>

<style scoped>
.footer-placeholder {
  height: 60px;
  width: 100%;
}

#footer {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #0e0d0d;
  width: 100%;
  height: 60px;
  background-color: powderblue;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.copyright {
  font-size: 12px;
  margin-top: 8px;
  color: #555;
}
</style>
