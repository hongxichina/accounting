<!-- 设置页面 -->
<template>
  <div class="settings-container">
    <van-nav-bar
      title="设置"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />

    <!-- 用户资料 -->
    <div class="user-profile">
      <van-cell center>
        <template #icon>
          <van-image
            round
            width="60"
            height="60"
            src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
            @click="showAvatarPicker = true"
          />
        </template>
        <template #title>
          <div class="user-name">{{ userData.name }}</div>
          <div class="user-email">{{ userData.email }}</div>
        </template>
        <template #right-icon>
          <van-button size="small" type="primary" plain @click="editProfile">编辑</van-button>
        </template>
      </van-cell>
    </div>

    <!-- 常规设置 -->
    <div class="settings-section">
      <div class="section-title">通用设置</div>
      <van-cell-group inset>
        <van-cell title="货币符号" :value="userData.currency" is-link @click="showCurrencyPicker = true" />
        <van-cell title="主题颜色">
          <template #right-icon>
            <div class="color-picker">
              <div
                v-for="(color, index) in themeColors"
                :key="index"
                :class="['color-option', selectedTheme === index ? 'active' : '']"
                :style="{ backgroundColor: color }"
                @click="selectedTheme = index"
              ></div>
            </div>
          </template>
        </van-cell>
        <van-cell title="深色模式">
          <template #right-icon>
            <van-switch v-model="darkMode" size="24" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <!-- 预算管理 -->
    <div class="settings-section">
      <div class="section-title">预算设置</div>
      <van-cell-group inset>
        <van-cell title="月度总预算" is-link @click="showBudgetEditor = true">
          <template #value>
            <span>¥{{ userData.monthlyBudget.toLocaleString() }}</span>
          </template>
        </van-cell>
        <van-cell title="类别预算管理" is-link @click="navigateTo('/budget-categories')">
          <template #value>
            <span>{{ userData.categoryBudgetsCount }}个类别</span>
          </template>
        </van-cell>
        <van-cell title="预算提醒">
          <template #right-icon>
            <van-switch v-model="userData.budgetAlerts" size="24" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <!-- 数据管理 -->
    <div class="settings-section">
      <div class="section-title">数据与同步</div>
      <van-cell-group inset>
        <van-cell title="备份数据" is-link icon="down" @click="backupData" />
        <van-cell title="恢复数据" is-link icon="upgrade" @click="restoreData" />
        <van-cell title="导出为Excel" is-link icon="description" @click="exportData" />
        <van-cell title="清除所有数据" is-link icon="delete" @click="showClearDataDialog = true" />
      </van-cell-group>
    </div>

    <!-- 其他设置 -->
    <div class="settings-section">
      <div class="section-title">其他</div>
      <van-cell-group inset>
        <van-cell title="关于我们" is-link @click="navigateTo('/about')" />
        <van-cell title="帮助与反馈" is-link @click="navigateTo('/help')" />
        <van-cell title="隐私政策" is-link @click="navigateTo('/privacy')" />
        <van-cell title="应用版本" value="v1.0.0" />
      </van-cell-group>
    </div>

    <div class="logout-btn">
      <van-button block type="danger" @click="logout">退出登录</van-button>
    </div>

    <!-- 弹出选择器 -->
    <van-action-sheet v-model="showAvatarPicker" title="选择头像">
      <div class="avatar-picker">
        <van-uploader :after-read="onAvatarUploaded">
          <van-button icon="photograph" type="primary">拍照</van-button>
        </van-uploader>
        <van-button icon="photo-o" type="primary" plain>从相册选择</van-button>
      </div>
    </van-action-sheet>

    <van-popup v-model="showCurrencyPicker" position="bottom">
      <van-picker
        title="选择货币"
        :columns="currencyOptions"
        @confirm="onCurrencyConfirm"
        @cancel="showCurrencyPicker = false"
        show-toolbar
      />
    </van-popup>

    <van-dialog
      v-model="showBudgetEditor"
      title="设置月度预算"
      show-cancel-button
      @confirm="updateBudget"
    >
      <div class="budget-editor">
        <van-field
          v-model="editingBudget"
          type="digit"
          label="预算金额"
          placeholder="请输入预算金额"
        />
      </div>
    </van-dialog>

    <van-dialog
      v-model="showClearDataDialog"
      title="清除所有数据"
      show-cancel-button
      @confirm="clearAllData"
    >
      <div class="clear-data-dialog">
        <p>您确定要清除所有数据吗？此操作不可恢复！</p>
      </div>
    </van-dialog>

    <van-tabbar v-model="activeTab" route>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="chart-trending-o" to="/statistics">统计</van-tabbar-item>
      <van-tabbar-item icon="plus" to="/add">记一笔</van-tabbar-item>
      <van-tabbar-item icon="bill-o" to="/transactions">账单</van-tabbar-item>
      <van-tabbar-item icon="setting-o" to="/settings">设置</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog } from '../utils/vant'

const router = useRouter()
const activeTab = ref(4)

// 模拟用户数据
const userData = ref({
  name: '张三',
  email: 'zhangsan@example.com',
  currency: '¥ 人民币',
  monthlyBudget: 5000,
  categoryBudgetsCount: 5,
  budgetAlerts: true
})

// 主题颜色
const themeColors = [
  '#1989fa', // 蓝色（默认）
  '#07c160', // 绿色
  '#ee0a24', // 红色
  '#ff8800', // 橙色
  '#8957e5'  // 紫色
]
const selectedTheme = ref(0)
const darkMode = ref(false)

// 弹出选择器
const showAvatarPicker = ref(false)
const showCurrencyPicker = ref(false)
const showBudgetEditor = ref(false)
const showClearDataDialog = ref(false)

// 编辑预算
const editingBudget = ref('')

// 货币选项
const currencyOptions = [
  '¥ 人民币',
  '$ 美元',
  '€ 欧元',
  '£ 英镑',
  '¥ 日元'
]

// 头像上传
const onAvatarUploaded = (file: any) => {
  // 处理头像上传
  console.log('头像上传:', file)
  showToast('头像上传成功')
  showAvatarPicker.value = false
}

// 货币选择确认
const onCurrencyConfirm = (value: string) => {
  userData.value.currency = value;
  showCurrencyPicker.value = false;
  showToast('货币设置已更新');
}

// 更新主题
watch(selectedTheme, (newValue) => {
  const color = themeColors[newValue];
  document.documentElement.style.setProperty('--theme-color', color);
  showToast('主题颜色已更新');
});

// 切换暗黑模式
watch(darkMode, (isDark) => {
  document.documentElement.classList.toggle('dark-mode', isDark);
  showToast(`已${isDark ? '开启' : '关闭'}暗黑模式`);
});

// 编辑个人资料
const editProfile = () => {
  router.push('/edit-profile')
}

// 导航到指定页面
const navigateTo = (path: string) => {
  router.push(path)
}

// 更新预算
const updateBudget = () => {
  if (editingBudget.value) {
    userData.value.monthlyBudget = parseFloat(editingBudget.value)
    showToast('预算已更新')
  }
}

// 数据操作
const backupData = () => {
  showToast('数据已备份')
}

const restoreData = () => {
  showDialog({
    title: '恢复数据',
    message: '恢复数据将覆盖当前所有数据，是否继续？',
    showCancelButton: true,
  })
  .then(() => {
    showToast('数据已恢复')
  })
  .catch(() => {
    // 取消操作
  })
}

const exportData = () => {
  showToast('数据导出中...')
  setTimeout(() => {
    showToast('数据已导出')
  }, 1500)
}

const clearAllData = () => {
  showToast('所有数据已清除')
}

// 退出登录
const logout = () => {
  showDialog({
    title: '退出登录',
    message: '确定要退出登录吗？',
    showCancelButton: true,
  })
  .then(() => {
    router.push('/login')
  })
  .catch(() => {
    // 取消操作
  })
}

// 返回上一页
const goBack = () => router.go(-1)
</script>

<style scoped>
.settings-container {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 60px;
}

.user-profile {
  margin-bottom: 16px;
}

.user-name {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 4px;
}

.user-email {
  font-size: 14px;
  color: #969799;
}

.settings-section {
  margin-bottom: 16px;
}

.section-title {
  padding: 0 16px;
  margin: 16px 0 8px;
  font-size: 14px;
  font-weight: 500;
  color: #969799;
}

.color-picker {
  display: flex;
  gap: 8px;
}

.color-option {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
}

.color-option.active {
  border-color: #fff;
  box-shadow: 0 0 0 2px #1989fa;
}

.avatar-picker {
  display: flex;
  justify-content: space-around;
  padding: 30px 20px;
}

.budget-editor {
  padding: 16px;
}

.clear-data-dialog {
  padding: 16px;
  text-align: center;
  color: #646566;
}

.logout-btn {
  padding: 16px;
  margin-top: 24px;
}
</style> 