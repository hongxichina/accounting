<!-- 首页/仪表板页面 -->
<template>
  <div class="home-container">
    <div class="header-section">
      <div class="welcome-text">
        <h2>{{ greeting }}</h2>
        <p>{{ getCurrentDate() }}</p>
      </div>
      <div class="avatar">
        <van-image
          round
          width="50"
          height="50"
          src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
        />
      </div>
    </div>

    <div class="balance-card">
      <van-card class="custom-card">
        <template #title>
          <div class="balance-title">总资产</div>
        </template>
        <template #desc>
          <div class="balance-amount">¥{{ totalBalance.toLocaleString() }}</div>
        </template>
        <template #tags>
          <div class="balance-change">
            <span class="income">本月收入: +¥{{ monthlyIncome.toLocaleString() }}</span>
            <span class="expense">本月支出: -¥{{ monthlyExpense.toLocaleString() }}</span>
          </div>
        </template>
      </van-card>
    </div>

    <div class="quick-actions">
      <van-grid :column-num="4" :border="false">
        <van-grid-item icon="plus" text="记一笔" @click="goToAddTransaction" />
        <van-grid-item icon="chart-trending-o" text="统计" @click="goToStatistics" />
        <van-grid-item icon="bill-o" text="账单" @click="goToTransactions" />
        <van-grid-item icon="setting-o" text="设置" @click="goToSettings" />
      </van-grid>
    </div>

    <div class="recent-transactions">
      <div class="section-header">
        <h3>最近交易</h3>
        <van-button size="small" type="primary" plain @click="goToTransactions">查看全部</van-button>
      </div>
      
      <van-cell-group inset>
        <van-cell v-for="transaction in recentTransactions" :key="transaction.id">
          <template #icon>
            <van-icon :name="transaction.type === 'income' ? 'increase' : 'decrease'" 
              :class="transaction.type === 'income' ? 'income-icon' : 'expense-icon'" />
          </template>
          <template #title>
            <div class="transaction-title">{{ transaction.category }}</div>
          </template>
          <template #label>
            <div class="transaction-date">{{ transaction.date }}</div>
          </template>
          <template #right-icon>
            <div :class="['transaction-amount', transaction.type === 'income' ? 'income' : 'expense']">
              {{ transaction.type === 'income' ? '+' : '-' }}¥{{ transaction.amount.toLocaleString() }}
            </div>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <div class="budget-section">
      <div class="section-header">
        <h3>预算跟踪</h3>
      </div>
      <van-circle
        v-model="budgetProgress"
        :rate="budgetRate"
        :color="getBudgetColor"
        :text="budgetRate + '%'"
        size="120px"
      />
      <div class="budget-info">
        <p>本月支出: ¥{{ monthlyExpense.toLocaleString() }}</p>
        <p>预算: ¥{{ monthlyBudget.toLocaleString() }}</p>
      </div>
    </div>

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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'

const router = useRouter()
const activeTab = ref(0)

// 用户数据
const totalBalance = ref(0)
const monthlyIncome = ref(0)
const monthlyExpense = ref(0)
const monthlyBudget = ref(5000)
const budgetProgress = ref(0)

// 计算预算使用百分比
const budgetRate = computed(() => {
  return Math.min(100, Math.round((monthlyExpense.value / monthlyBudget.value) * 100))
})

// 根据预算使用情况返回不同颜色
const getBudgetColor = computed(() => {
  if (budgetRate.value < 60) return '#07c160'
  if (budgetRate.value < 80) return '#ff9900'
  return '#ee0a24'
})

// 模拟数据
const recentTransactions = ref([
  { id: 1, type: 'expense', category: '餐饮', amount: 108.5, date: '今天 12:30' },
  { id: 2, type: 'expense', category: '交通', amount: 23, date: '今天 10:15' },
  { id: 3, type: 'income', category: '工资', amount: 9800, date: '昨天 09:00' },
  { id: 4, type: 'expense', category: '购物', amount: 459, date: '昨天 16:40' },
  { id: 5, type: 'expense', category: '娱乐', amount: 150, date: '3月6日 20:15' }
])

// 获取问候语
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了，注意休息'
  if (hour < 12) return '早上好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

// 获取当前日期
const getCurrentDate = () => {
  const date = new Date()
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

// 导航方法
const goToAddTransaction = () => router.push('/add')
const goToStatistics = () => router.push('/statistics')
const goToTransactions = () => router.push('/transactions')
const goToSettings = () => router.push('/settings')

// 动画效果
onMounted(() => {
  // 余额数字增长动画
  gsap.from(totalBalance, { 
    value: 0, 
    duration: 2, 
    ease: "power2.out",
    onUpdate: function() {
      totalBalance.value = Math.round(totalBalance.value);
    }
  })
  
  gsap.to(totalBalance, { 
    value: 12500, 
    duration: 2, 
    ease: "power2.out",
    onUpdate: function() {
      totalBalance.value = Math.round(totalBalance.value);
    }
  })
  
  // 收入动画
  gsap.to(monthlyIncome, { 
    value: 10200, 
    duration: 1.5, 
    ease: "power1.out",
    onUpdate: function() {
      monthlyIncome.value = Math.round(monthlyIncome.value);
    }
  })
  
  // 支出动画
  gsap.to(monthlyExpense, { 
    value: 3450, 
    duration: 1.5, 
    ease: "power1.out",
    onUpdate: function() {
      monthlyExpense.value = Math.round(monthlyExpense.value);
    }
  })
  
  // 预算进度动画
  gsap.to(budgetProgress, { 
    value: 69, 
    duration: 1.5, 
    ease: "power1.inOut"
  })
})
</script>

<style scoped>
.home-container {
  padding: 16px;
  padding-bottom: 60px;
  background-color: #f7f8fa;
  min-height: 100vh;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.welcome-text h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #323233;
}

.welcome-text p {
  margin: 4px 0 0;
  font-size: 14px;
  color: #969799;
}

.balance-card {
  margin-bottom: 20px;
}

.custom-card {
  background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.balance-title {
  color: #e8e8e8;
  font-size: 14px;
}

.balance-amount {
  font-size: 28px;
  font-weight: bold;
  margin: 8px 0;
  color: white;
}

.balance-change {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 12px;
}

.income {
  color: #07c160;
}

.expense {
  color: #ee0a24;
}

.quick-actions {
  margin-bottom: 24px;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.recent-transactions {
  margin-bottom: 24px;
}

.transaction-title {
  font-size: 15px;
  font-weight: 500;
}

.transaction-date {
  color: #969799;
  font-size: 12px;
}

.transaction-amount {
  font-weight: 600;
  font-size: 15px;
}

.income-icon {
  color: #07c160;
  font-size: 20px;
  margin-right: 8px;
}

.expense-icon {
  color: #ee0a24;
  font-size: 20px;
  margin-right: 8px;
}

.budget-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.budget-info {
  margin-top: 12px;
  text-align: center;
}

.budget-info p {
  margin: 4px 0;
  color: #646566;
}
</style>
