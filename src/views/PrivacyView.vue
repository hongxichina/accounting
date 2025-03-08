<!-- 隐私政策页面 -->
<template>
  <div class="privacy-container">
    <van-nav-bar
      title="隐私政策"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />

    <div class="content">
      <h1>记账助手隐私政策</h1>
      <p class="update-date">更新日期：2023年12月1日</p>

      <div class="section">
        <h2>1. 引言</h2>
        <p>感谢您使用记账助手。我们非常重视您的个人隐私和数据安全，并致力于保护您在使用我们产品和服务时提供的个人信息。本隐私政策旨在向您说明我们如何收集、使用、存储和共享您的个人信息，以及您享有的相关权利。</p>
      </div>

      <div class="section">
        <h2>2. 我们收集的信息</h2>
        <p>我们可能会收集以下类型的信息：</p>
        <ul class="list">
          <li><strong>账户信息：</strong>当您注册账户时，我们会收集您的用户名、电子邮件地址和密码等信息。</li>
          <li><strong>交易数据：</strong>包括您在应用中记录的收支信息、金额、类别、日期、备注等。</li>
          <li><strong>设备信息：</strong>我们可能会收集您使用的设备型号、操作系统版本、唯一设备标识符等信息。</li>
          <li><strong>使用数据：</strong>我们会收集您如何使用我们的应用，包括功能使用频率、浏览行为等信息。</li>
        </ul>
      </div>

      <div class="section">
        <h2>3. 信息的使用</h2>
        <p>我们使用收集的信息：</p>
        <ul class="list">
          <li>提供、维护和改进我们的服务</li>
          <li>处理您的交易和记录</li>
          <li>开发新的功能和服务</li>
          <li>提供客户支持并回应您的请求</li>
          <li>发送服务更新和管理通知</li>
          <li>防止欺诈和滥用行为</li>
        </ul>
      </div>

      <div class="section">
        <h2>4. 信息的共享</h2>
        <p>我们不会出售您的个人信息。在以下情况下，我们可能会共享您的信息：</p>
        <ul class="list">
          <li><strong>服务提供商：</strong>我们可能会与帮助我们提供服务的第三方服务提供商共享信息。</li>
          <li><strong>合规与法律义务：</strong>如法律要求，我们可能会共享您的信息。</li>
          <li><strong>安全与保护：</strong>在必要时，我们可能会共享信息以保护我们的权利、财产或安全。</li>
        </ul>
      </div>

      <div class="section">
        <h2>5. 数据安全</h2>
        <p>我们采取合理的安全措施保护您的信息不被未经授权的访问、使用或泄露。这些措施包括数据加密、安全访问控制和定期安全评估。</p>
      </div>

      <div class="section">
        <h2>6. 您的权利</h2>
        <p>根据适用的数据保护法律，您可能享有以下权利：</p>
        <ul class="list">
          <li>访问和获取您的个人信息</li>
          <li>更正不准确的个人信息</li>
          <li>删除您的个人信息</li>
          <li>限制或反对处理您的个人信息</li>
          <li>数据可携带性</li>
        </ul>
      </div>

      <div class="section">
        <h2>7. 隐私政策的变更</h2>
        <p>我们可能会不时更新本隐私政策。当我们进行重大变更时，我们会通过应用内通知、电子邮件或网站公告等方式通知您。我们鼓励您定期查阅本隐私政策以了解最新情况。</p>
      </div>

      <div class="section">
        <h2>8. 联系我们</h2>
        <p>如果您对本隐私政策有任何疑问或顾虑，请通过以下方式联系我们：</p>
        <p>电子邮件：privacy@jizhangapp.com</p>
        <p>地址：中国北京市海淀区XX大厦100号</p>
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
.privacy-container {
  min-height: 100vh;
  background-color: #fff;
  padding-bottom: 40px;
}

.content {
  padding: 16px;
  font-size: 14px;
  line-height: 1.6;
  color: #323233;
}

h1 {
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  margin: 20px 0 5px;
}

.update-date {
  font-size: 12px;
  color: #969799;
  text-align: center;
  margin-bottom: 20px;
}

.section {
  margin-bottom: 24px;
}

h2 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px;
}

p {
  margin: 0 0 12px;
}

.list {
  padding-left: 16px;
  margin: 0 0 12px;
}

.list li {
  margin-bottom: 8px;
}

strong {
  font-weight: 500;
}
</style> 