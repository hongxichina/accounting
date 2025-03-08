<!-- 添加交易页面 -->
<template>
  <div class="add-transaction-container">
    <van-nav-bar
      title="记一笔"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />

    <div class="transaction-form">
      <van-tabs v-model="activeTab" animated swipeable>
        <van-tab title="支出">
          <transaction-form-content
            type="expense"
            :categories="expenseCategories"
            @submit="handleSubmit"
          />
        </van-tab>
        <van-tab title="收入">
          <transaction-form-content
            type="income"
            :categories="incomeCategories"
            @submit="handleSubmit"
          />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TransactionFormContent from '../components/TransactionFormContent.vue'
import { showToast } from '../utils/vant'

const router = useRouter()
const activeTab = ref(0)

// 支出分类
const expenseCategories = [
  { id: 1, name: '餐饮', icon: 'coupon-o' },
  { id: 2, name: '交通', icon: 'logistics' },
  { id: 3, name: '购物', icon: 'cart-o' },
  { id: 4, name: '娱乐', icon: 'tv-o' },
  { id: 5, name: '住房', icon: 'home-o' },
  { id: 6, name: '通讯', icon: 'phone-o' },
  { id: 7, name: '医疗', icon: 'bookmark-o' },
  { id: 8, name: '教育', icon: 'notes-o' },
  { id: 9, name: '其他', icon: 'more-o' }
]

// 收入分类
const incomeCategories = [
  { id: 1, name: '工资', icon: 'gold-coin-o' },
  { id: 2, name: '奖金', icon: 'gift-o' },
  { id: 3, name: '理财', icon: 'balance-o' },
  { id: 4, name: '兼职', icon: 'smile-o' },
  { id: 5, name: '其他', icon: 'more-o' }
]

// 提交交易记录
const handleSubmit = (data: any) => {
  console.log('提交交易记录:', data)
  showToast({
    type: 'success',
    message: '记账成功',
    duration: 1500
  })
  setTimeout(() => {
    router.push('/')
  }, 1500)
}

// 返回上一页
const goBack = () => router.go(-1)
</script>

<style scoped>
.add-transaction-container {
  min-height: 100vh;
  background-color: #f7f8fa;
  display: flex;
  flex-direction: column;
}

.transaction-form {
  flex: 1;
  padding: 16px;
  padding-top: 0;
}
</style> 