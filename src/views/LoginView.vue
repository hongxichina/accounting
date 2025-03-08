<!-- 登录页面 -->
<template>
  <div class="login-container">
    <div class="logo">
      <img src="@/assets/logo.svg" alt="记账App Logo" />
      <h1>记账助手</h1>
    </div>

    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="username"
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>

      <div class="form-actions">
        <van-button round block type="primary" native-type="submit">
          登录
        </van-button>
        <div class="extra-links">
          <span class="link" @click="forgotPassword">忘记密码</span>
          <span class="divider">|</span>
          <span class="link" @click="goToRegister">注册账号</span>
        </div>
      </div>
    </van-form>

    <div class="third-party-login">
      <div class="title">
        <span class="line"></span>
        <span class="text">其他登录方式</span>
        <span class="line"></span>
      </div>
      <div class="icons">
        <van-icon name="wechat" size="28" color="#07c160" @click="thirdPartyLogin('wechat')" />
        <van-icon name="weibo" size="28" color="#ee0a24" @click="thirdPartyLogin('weibo')" />
        <van-icon name="alipay" size="28" color="#1989fa" @click="thirdPartyLogin('alipay')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from '../utils/vant'

const router = useRouter()
const username = ref('')
const password = ref('')

// 登录提交
const onSubmit = () => {
  // 这里只是模拟登录过程
  showToast('登录成功')
  router.push('/')
}

// 忘记密码
const forgotPassword = () => {
  showToast('暂未实现')
}

// 去注册
const goToRegister = () => {
  showToast('暂未实现')
}

// 第三方登录
const thirdPartyLogin = (type: string) => {
  showToast(`正在跳转到${type}登录`)
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 40px 20px;
  background-color: #fff;
}

.logo {
  text-align: center;
  margin: 40px 0;
}

.logo img {
  width: 80px;
  height: 80px;
}

.logo h1 {
  margin-top: 16px;
  font-size: 24px;
  color: #323233;
}

.form-actions {
  margin: 30px 16px;
}

.extra-links {
  display: flex;
  justify-content: center;
  margin-top: 16px;
  font-size: 14px;
}

.link {
  color: #1989fa;
  cursor: pointer;
}

.divider {
  color: #ebedf0;
  margin: 0 8px;
}

.third-party-login {
  margin-top: auto;
  padding-top: 30px;
}

.third-party-login .title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.line {
  flex: 1;
  height: 1px;
  background-color: #ebedf0;
}

.text {
  padding: 0 16px;
  color: #969799;
  font-size: 14px;
}

.icons {
  display: flex;
  justify-content: space-around;
  padding: 0 40px;
}
</style> 