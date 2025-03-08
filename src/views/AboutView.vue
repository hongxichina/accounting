<!-- 关于我们页面 -->
<template>
  <div class="about-container">
    <van-nav-bar
      title="关于我们"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />

    <div class="content">
      <div class="app-info">
        <img src="@/assets/logo.svg" alt="记账助手Logo" class="logo" />
        <h1>记账助手</h1>
        <p class="version">版本 1.0.0</p>
      </div>

      <div class="section">
        <h2>应用介绍</h2>
        <p>记账助手是一款简单易用的个人财务管理应用，帮助您轻松记录日常收支，追踪预算，分析消费习惯，为您的财务健康保驾护航。</p>
      </div>

      <div class="section">
        <h2>主要功能</h2>
        <ul class="feature-list">
          <li>
            <van-icon name="records" class="feature-icon" />
            <div class="feature-text">
              <h3>收支记录</h3>
              <p>轻松记录日常收入和支出，支持多种收支类别</p>
            </div>
          </li>
          <li>
            <van-icon name="chart-trending-o" class="feature-icon" />
            <div class="feature-text">
              <h3>数据统计</h3>
              <p>直观图表展示收支情况，帮助您了解财务状况</p>
            </div>
          </li>
          <li>
            <van-icon name="balance-o" class="feature-icon" />
            <div class="feature-text">
              <h3>预算管理</h3>
              <p>设置月度预算和类别预算，控制支出不超标</p>
            </div>
          </li>
          <li>
            <van-icon name="down" class="feature-icon" />
            <div class="feature-text">
              <h3>数据备份</h3>
              <p>支持数据备份和恢复，确保您的财务记录安全</p>
            </div>
          </li>
        </ul>
      </div>

      <div class="section">
        <h2>关于我们</h2>
        <p>我们是一支热爱技术、专注于个人理财工具开发的团队。我们致力于创造简单易用、功能强大的财务管理工具，帮助用户更好地管理个人财务，实现财务目标。</p>
      </div>

      <div class="section">
        <h2>联系我们</h2>
        <p>官方网站：www.jizhangapp.com</p>
        <p>官方邮箱：contact@jizhangapp.com</p>
        <p>官方微信：jizhangzs</p>
      </div>

      <div class="copyright">
        <p>© 2023 记账助手 版权所有</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回上一页
const goBack = () => router.go(-1)
</script>

<style scoped>
.about-container {
  min-height: 100vh;
  background-color: #fff;
  padding-bottom: 40px;
}

.content {
  padding: 16px;
}

.app-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
}

.app-info h1 {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  color: #323233;
}

.version {
  font-size: 14px;
  color: #969799;
  margin-top: 4px;
}

.section {
  margin-bottom: 24px;
}

.section h2 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px;
  color: #323233;
  position: relative;
  padding-left: 12px;
}

.section h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  height: 16px;
  width: 4px;
  background-color: #1989fa;
  border-radius: 2px;
}

.section p {
  font-size: 14px;
  line-height: 1.6;
  color: #646566;
  margin: 0 0 12px;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
}

.feature-icon {
  font-size: 24px;
  color: #1989fa;
  margin-right: 12px;
  margin-top: 2px;
}

.feature-text h3 {
  font-size: 15px;
  font-weight: 500;
  margin: 0 0 4px;
  color: #323233;
}

.feature-text p {
  font-size: 13px;
  margin: 0;
  color: #646566;
}

.copyright {
  text-align: center;
  font-size: 12px;
  color: #969799;
  margin-top: 40px;
}

.copyright p {
  margin: 0;
}
</style>
