<template>
  <div class="about-container">
    <el-card class="about-card">
      <h1>网站声明</h1>

      <h2>一、关于我们</h2>
      <p>欢迎访问我们的漫画分享平台！我们致力于为用户提供丰富多样的漫画资源，并严格遵守相关法律法规。</p>

      <h2>二、漫画来源说明</h2>
      <p>本网站展示的所有漫画来源于我们通过爬虫技术从公开及允许爬取的资源中收集。我们会仔细审查每个数据源的使用条款和robots.txt文件，确保只从明确许可或默认允许爬取的站点获取内容。</p>
      <p>请注意，尽管我们尽力确保所有内容的合法性，但鉴于网络环境的复杂性，我们无法保证每一份内容都完全符合版权要求。</p>

      <h2>三、版权与侵权处理</h2>
      <p>尊重知识产权是我们服务的基本原则之一。如果您认为本网站上的任何内容侵犯了您的版权，请立即联系我们，我们将迅速采取措施进行核实并在确认侵权后立即删除相关内容。</p>
      <p>为了帮助我们快速处理您的请求，请在通知中提供以下信息：
        <ul>
          <li>版权所有者的信息以及授权代表（如适用）的相关联系信息；</li>
          <li>涉嫌侵权的具体描述和位置；</li>
          <li>证明材料，表明您拥有对该内容的权利或您是版权所有者的代理人。</li>
        </ul>
      </p>

      <h2>四、用户责任</h2>
      <p>用户应当对在本网站上发布的内容负责，不得上传未经授权的受版权保护的作品。我们保留删除任何违反本声明或法律法规内容的权利。</p>

      <h2>五、联系我们</h2>
      <p>如果您有任何疑问或需要报告可能的版权侵权行为，请通过以下方式联系我们：<br>
      邮箱: summer_xzh24@sina.com<br>
      </p>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style scoped>
.about-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.about-card {
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

h2 {
  margin-top: 20px;
  margin-bottom: 15px;
}

p {
  line-height: 1.6;
  margin-bottom: 15px;
}

ul {
  padding-left: 20px;
}

li {
  margin-bottom: 10px;
}
</style> 