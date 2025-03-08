<!-- 预算分类管理页面 -->
<template>
  <div class="budget-categories-container">
    <van-nav-bar
      title="预算分类管理"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />

    <div class="categories-list">
      <van-cell-group inset title="支出类别预算">
        <van-cell
          v-for="category in expenseCategories"
          :key="category.id"
          center
          :title="category.name"
          :label="`已用: ¥${category.used.toLocaleString()} / ¥${category.budget.toLocaleString()}`"
          @click="editCategoryBudget(category)"
        >
          <template #icon>
            <div class="category-icon">
              <van-icon :name="category.icon" />
            </div>
          </template>
          <template #right-icon>
            <div class="budget-progress">
              <van-progress
                :percentage="calculatePercentage(category.used, category.budget)"
                :color="getProgressColor(category.used, category.budget)"
                :pivot-text="`${calculatePercentage(category.used, category.budget)}%`"
              />
            </div>
          </template>
        </van-cell>
      </van-cell-group>

      <div class="action-buttons">
        <van-button type="primary" block @click="addCategoryBudget">
          添加类别预算
        </van-button>
      </div>
    </div>

    <!-- 编辑预算对话框 -->
    <van-dialog
      v-model="showBudgetEditor"
      :title="`设置「${currentCategory?.name || ''}」预算`"
      show-cancel-button
      @confirm="saveCategoryBudget"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from '../utils/vant'

const router = useRouter()

// 支出类别
const expenseCategories = ref([
  { id: 1, name: '餐饮', budget: 2000, used: 1280, icon: 'coupon-o' },
  { id: 2, name: '交通', budget: 800, used: 540, icon: 'logistics' },
  { id: 3, name: '购物', budget: 1000, used: 620, icon: 'cart-o' },
  { id: 4, name: '娱乐', budget: 500, used: 350, icon: 'tv-o' },
  { id: 5, name: '住房', budget: 3000, used: 3000, icon: 'home-o' }
])

// 编辑预算
const showBudgetEditor = ref(false)
const currentCategory = ref<any>(null)
const editingBudget = ref('')

// 计算使用百分比
const calculatePercentage = (used: number, budget: number) => {
  if (budget <= 0) return 0
  return Math.min(100, Math.round((used / budget) * 100))
}

// 获取进度条颜色
const getProgressColor = (used: number, budget: number) => {
  const percentage = calculatePercentage(used, budget)
  if (percentage < 50) return '#07c160'
  if (percentage < 80) return '#ff8800'
  return '#ee0a24'
}

// 编辑类别预算
const editCategoryBudget = (category: any) => {
  currentCategory.value = category
  editingBudget.value = category.budget.toString()
  showBudgetEditor.value = true
}

// 保存类别预算
const saveCategoryBudget = () => {
  if (!editingBudget.value || !currentCategory.value) return
  
  const budget = parseFloat(editingBudget.value)
  const index = expenseCategories.value.findIndex(c => c.id === currentCategory.value.id)
  
  if (index !== -1) {
    expenseCategories.value[index].budget = budget
    showToast('预算已更新')
  }
}

// 添加类别预算
const addCategoryBudget = () => {
  showToast('功能开发中')
}

// 返回
const goBack = () => router.go(-1)
</script>

<style scoped>
.budget-categories-container {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 30px;
}

.categories-list {
  padding: 16px;
}

.category-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(25, 137, 250, 0.1);
  color: #1989fa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.budget-progress {
  width: 120px;
}

.action-buttons {
  margin-top: 20px;
}

.budget-editor {
  padding: 16px;
}
</style> 