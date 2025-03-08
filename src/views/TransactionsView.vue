<!-- 账单/交易历史页面 -->
<template>
  <div class="transactions-container">
    <van-nav-bar
      title="账单明细"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />

    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <van-search
        v-model="searchText"
        placeholder="搜索交易"
        shape="round"
      />
      <van-dropdown-menu>
        <van-dropdown-item v-model="timeFilter" :options="timeOptions" />
        <van-dropdown-item v-model="typeFilter" :options="typeOptions" />
      </van-dropdown-menu>
    </div>

    <!-- 交易总览 -->
    <div class="transactions-summary">
      <div class="summary-item">
        <span class="summary-label">总收入</span>
        <span class="summary-value income">¥{{ filteredIncome.toLocaleString() }}</span>
      </div>
      <div class="divider"></div>
      <div class="summary-item">
        <span class="summary-label">总支出</span>
        <span class="summary-value expense">¥{{ filteredExpense.toLocaleString() }}</span>
      </div>
      <div class="divider"></div>
      <div class="summary-item">
        <span class="summary-label">净收益</span>
        <span class="summary-value" :class="netIncome >= 0 ? 'income' : 'expense'">
          ¥{{ Math.abs(netIncome).toLocaleString() }}
        </span>
      </div>
    </div>

    <!-- 按日期分组的交易列表 -->
    <div class="transactions-list">
      <van-index-bar sticky :index-list="dateIndices">
        <div v-for="group in groupedTransactions" :key="group.date">
          <van-index-anchor :index="group.date">
            <div class="date-summary">
              <span class="date">{{ group.date }}</span>
              <span class="date-amount">收入: <span class="income">¥{{ group.totalIncome.toLocaleString() }}</span> 支出: <span class="expense">¥{{ group.totalExpense.toLocaleString() }}</span></span>
            </div>
          </van-index-anchor>

          <van-cell-group>
            <van-swipe-cell
              v-for="transaction in group.transactions"
              :key="transaction.id"
              :disabled="!isEditable"
            >
              <van-cell>
                <template #icon>
                  <div class="transaction-icon" :class="transaction.type">
                    <van-icon :name="getCategoryIcon(transaction)" />
                  </div>
                </template>
                <template #title>
                  <div class="transaction-info">
                    <div class="transaction-category">{{ transaction.category }}</div>
                    <div class="transaction-time">{{ transaction.time }}</div>
                  </div>
                </template>
                <template #right-icon>
                  <div class="transaction-amount" :class="transaction.type">
                    <span>{{ transaction.type === 'income' ? '+' : '-' }}</span>¥{{ transaction.amount.toLocaleString() }}
                  </div>
                </template>
                <template #label>
                  <div class="transaction-note" v-if="transaction.note">{{ transaction.note }}</div>
                </template>
              </van-cell>

              <template #right>
                <div class="delete-button">
                  <van-button
                    square
                    type="danger"
                    text="删除"
                    @click="confirmDelete(transaction)"
                  />
                </div>
                <div class="edit-button">
                  <van-button
                    square
                    type="primary"
                    text="编辑"
                    @click="editTransaction(transaction)"
                  />
                </div>
              </template>
            </van-swipe-cell>
          </van-cell-group>
        </div>
      </van-index-bar>
    </div>

    <!-- 编辑模式开关 -->
    <div class="edit-mode-toggle">
      <van-switch v-model="isEditable" size="24px" />
      <span class="edit-mode-text">{{ isEditable ? '编辑模式' : '查看模式' }}</span>
    </div>

    <!-- 无数据提示 -->
    <van-empty
      v-if="groupedTransactions.length === 0"
      description="没有找到交易记录"
    />

    <van-tabbar v-model="activeTab" route>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="chart-trending-o" to="/statistics">统计</van-tabbar-item>
      <van-tabbar-item icon="plus" to="/add">记一笔</van-tabbar-item>
      <van-tabbar-item icon="bill-o" to="/transactions">账单</van-tabbar-item>
      <van-tabbar-item icon="setting-o" to="/settings">设置</van-tabbar-item>
    </van-tabbar>

    <!-- 删除确认对话框 -->
    <van-dialog
      v-model="showDeleteDialog"
      title="确认删除"
      show-cancel-button
      @confirm="deleteTransaction"
    >
      <p class="delete-dialog-content">确定要删除这笔交易记录吗？此操作不可恢复。</p>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from '../utils/vant'

// 定义交易和分组类型
interface Transaction {
  id: number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  time: string;
  note?: string;
}

interface TransactionGroup {
  date: string;
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
}

const router = useRouter()
const activeTab = ref(3)

// 搜索和筛选
const searchText = ref('')
const timeFilter = ref(0)
const typeFilter = ref(0)

const timeOptions = [
  { text: '全部时间', value: 0 },
  { text: '本月', value: 1 },
  { text: '上月', value: 2 },
  { text: '最近三个月', value: 3 }
]

const typeOptions = [
  { text: '全部类型', value: 0 },
  { text: '收入', value: 1 },
  { text: '支出', value: 2 }
]

// 编辑模式
const isEditable = ref(false)

// 删除确认
const showDeleteDialog = ref(false)
const transactionToDelete = ref<Transaction | null>(null)

// 示例交易数据
const transactions = ref<Transaction[]>([
  { id: 1, type: 'expense', category: '餐饮', amount: 108.5, date: '2023-03-08', time: '12:30', note: '午餐' },
  { id: 2, type: 'expense', category: '交通', amount: 23, date: '2023-03-08', time: '10:15', note: '公交车' },
  { id: 3, type: 'income', category: '工资', amount: 9800, date: '2023-03-07', time: '09:00', note: '3月工资' },
  { id: 4, type: 'expense', category: '购物', amount: 459, date: '2023-03-07', time: '16:40', note: '超市购物' },
  { id: 5, type: 'expense', category: '娱乐', amount: 150, date: '2023-03-06', time: '20:15', note: '电影票' },
  { id: 6, type: 'expense', category: '餐饮', amount: 85, date: '2023-03-06', time: '19:00', note: '晚餐' },
  { id: 7, type: 'expense', category: '住房', amount: 2200, date: '2023-03-05', time: '10:00', note: '房租' },
  { id: 8, type: 'income', category: '兼职', amount: 400, date: '2023-03-05', time: '15:30', note: '翻译兼职' },
  { id: 9, type: 'expense', category: '通讯', amount: 100, date: '2023-03-04', time: '11:20', note: '手机充值' },
  { id: 10, type: 'expense', category: '医疗', amount: 250, date: '2023-03-03', time: '14:45', note: '买药' },
  { id: 11, type: 'income', category: '理财', amount: 120, date: '2023-03-02', time: '00:00', note: '利息收入' },
  { id: 12, type: 'expense', category: '教育', amount: 300, date: '2023-03-01', time: '09:15', note: '课程费用' }
])

// 类别图标映射
const categoryIcons = {
  '餐饮': 'coupon-o',
  '交通': 'logistics',
  '购物': 'cart-o',
  '娱乐': 'tv-o',
  '住房': 'home-o',
  '通讯': 'phone-o',
  '医疗': 'bookmark-o',
  '教育': 'notes-o',
  '工资': 'gold-coin-o',
  '奖金': 'gift-o',
  '理财': 'balance-o',
  '兼职': 'smile-o',
  '其他': 'more-o'
}

// 根据筛选条件过滤交易
const filteredTransactions = computed(() => {
  return transactions.value.filter(transaction => {
    // 搜索过滤
    if (searchText.value && 
        !transaction.category.includes(searchText.value) &&
        !transaction.note?.includes(searchText.value)) {
      return false
    }
    
    // 时间过滤
    if (timeFilter.value !== 0) {
      const now = new Date()
      const transDate = new Date(transaction.date)
      const monthDiff = (now.getFullYear() - transDate.getFullYear()) * 12 + now.getMonth() - transDate.getMonth()
      
      if (timeFilter.value === 1 && monthDiff !== 0) return false // 本月
      if (timeFilter.value === 2 && monthDiff !== 1) return false // 上月
      if (timeFilter.value === 3 && monthDiff > 3) return false // 最近三个月
    }
    
    // 类型过滤
    if (typeFilter.value === 1 && transaction.type !== 'income') return false // 仅收入
    if (typeFilter.value === 2 && transaction.type !== 'expense') return false // 仅支出
    
    return true
  })
})

// 按日期分组的交易
const groupedTransactions = computed<TransactionGroup[]>(() => {
  const groups: TransactionGroup[] = []
  const dateGroups: Record<string, TransactionGroup> = {}
  
  filteredTransactions.value.forEach(transaction => {
    const date = transaction.date
    if (!dateGroups[date]) {
      dateGroups[date] = {
        date: formatDate(date),
        transactions: [],
        totalIncome: 0,
        totalExpense: 0
      }
      groups.push(dateGroups[date])
    }
    
    dateGroups[date].transactions.push(transaction)
    
    if (transaction.type === 'income') {
      dateGroups[date].totalIncome += transaction.amount
    } else {
      dateGroups[date].totalExpense += transaction.amount
    }
  })
  
  return groups.sort((a, b) => {
    const dateA = new Date(b.date.replace(/年|月|日/g, '-'))
    const dateB = new Date(a.date.replace(/年|月|日/g, '-'))
    return Number(dateA) - Number(dateB)
  })
})

// 日期索引
const dateIndices = computed(() => {
  return groupedTransactions.value.map(group => group.date)
})

// 总收入和支出
const filteredIncome = computed(() => {
  return filteredTransactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
})

const filteredExpense = computed(() => {
  return filteredTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
})

const netIncome = computed(() => {
  return filteredIncome.value - filteredExpense.value
})

// 格式化日期
function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

// 获取类别图标
function getCategoryIcon(transaction: Transaction) {
  return categoryIcons[transaction.category as keyof typeof categoryIcons] || 'more-o'
}

// 编辑交易
function editTransaction(transaction: Transaction) {
  router.push(`/edit-transaction/${transaction.id}`)
}

// 确认删除
function confirmDelete(transaction: Transaction) {
  transactionToDelete.value = transaction
  showDeleteDialog.value = true
}

// 删除交易
function deleteTransaction() {
  if (!transactionToDelete.value) return
  
  const index = transactions.value.findIndex(t => t.id === transactionToDelete.value!.id)
  if (index !== -1) {
    transactions.value.splice(index, 1)
    showToast('交易记录已删除')
  }
  
  transactionToDelete.value = null
}

// 返回上一页
const goBack = () => router.go(-1)
</script>

<style scoped>
.transactions-container {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 60px;
}

.search-filter {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #fff;
}

.transactions-summary {
  display: flex;
  padding: 12px 16px;
  background-color: #fff;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.summary-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.summary-label {
  font-size: 12px;
  color: #646566;
  margin-bottom: 4px;
}

.summary-value {
  font-size: 16px;
  font-weight: 500;
}

.divider {
  width: 1px;
  background-color: #ebedf0;
  margin: 0 8px;
}

.income {
  color: #07c160;
}

.expense {
  color: #ee0a24;
}

.date-summary {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 14px;
}

.date {
  font-weight: 500;
}

.date-amount {
  font-size: 12px;
  color: #646566;
}

.transaction-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.transaction-icon.income {
  background-color: rgba(7, 193, 96, 0.1);
  color: #07c160;
}

.transaction-icon.expense {
  background-color: rgba(238, 102, 102, 0.1);
  color: #ee0a24;
}

.transaction-info {
  display: flex;
  flex-direction: column;
}

.transaction-category {
  font-weight: 500;
}

.transaction-time {
  font-size: 12px;
  color: #969799;
  margin-top: 2px;
}

.transaction-amount {
  font-weight: 600;
}

.transaction-note {
  font-size: 12px;
  color: #969799;
  margin-top: 4px;
}

.delete-button {
  height: 100%;
}

.edit-button {
  height: 100%;
}

.edit-mode-toggle {
  position: fixed;
  right: 16px;
  bottom: 70px;
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 6px 12px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.edit-mode-text {
  font-size: 12px;
  margin-left: 6px;
}

.delete-dialog-content {
  padding: 16px;
  text-align: center;
  color: #646566;
}
</style> 