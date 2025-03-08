<!-- 交易表单内容组件 -->
<template>
  <div class="transaction-form-content">
    <van-form @submit="onSubmit">
      <!-- 金额输入 -->
      <div class="amount-input">
        <span class="currency">¥</span>
        <van-field
          v-model="amount"
          type="digit"
          placeholder="0.00"
          :rules="[{ required: true, message: '请输入金额' }]"
          class="amount-field"
        />
      </div>

      <!-- 类别选择 -->
      <div class="category-section">
        <div class="section-title">类别</div>
        <div class="category-grid">
          <div
            v-for="category in categories"
            :key="category.id"
            :class="['category-item', selectedCategory && selectedCategory.id === category.id ? 'active' : '']"
            @click="selectedCategory = category"
          >
            <van-icon :name="category.icon" class="category-icon" />
            <div class="category-name">{{ category.name }}</div>
          </div>
        </div>
      </div>

      <!-- 日期选择 -->
      <div class="form-item">
        <van-cell title="日期" :value="formattedDate" is-link @click="showDatePicker = true" />
        <van-popup v-model="showDatePicker" position="bottom">
          <van-date-picker
            title="选择日期"
            :min-date="minDate"
            :max-date="maxDate"
            :value="selectedDate"
            @confirm="onConfirmDate"
            @cancel="showDatePicker = false"
          />
        </van-popup>
      </div>

      <!-- 时间选择 -->
      <div class="form-item">
        <van-cell title="时间" :value="formattedTime" is-link @click="showTimePicker = true" />
        <van-popup v-model="showTimePicker" position="bottom">
          <van-time-picker
            title="选择时间"
            :value="selectedTime"
            @confirm="onConfirmTime"
            @cancel="showTimePicker = false"
          />
        </van-popup>
      </div>

      <!-- 备注 -->
      <div class="form-item">
        <van-field
          v-model="note"
          label="备注"
          placeholder="添加备注（可选）"
          autosize
          type="textarea"
          maxlength="50"
          show-word-limit
        />
      </div>

      <!-- 提交按钮 -->
      <div class="submit-btn">
        <van-button round block type="primary" native-type="submit" :disabled="!isFormValid">
          保存
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { showToast } from '../utils/vant'

// 定义类别类型接口
interface Category {
  id: number;
  name: string;
  icon: string;
}

// 定义组件属性
const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value: string) => ['income', 'expense'].includes(value)
  },
  categories: {
    type: Array as () => Category[],
    required: true
  }
})

// 定义事件
const emit = defineEmits(['submit'])

// 表单数据
const amount = ref('')
const selectedCategory = ref<Category | null>(null)
const note = ref('')

// 日期时间选择
const selectedDate = ref(new Date())
const selectedTime = ref([new Date().getHours(), new Date().getMinutes()])
const showDatePicker = ref(false)
const showTimePicker = ref(false)

// 日期范围
const minDate = new Date(new Date().getFullYear() - 1, 0, 1)
const maxDate = new Date()

// 格式化后的日期和时间显示
const formattedDate = computed(() => {
  const date = selectedDate.value
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
})

const formattedTime = computed(() => {
  const [hours, minutes] = selectedTime.value
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
})

// 表单是否有效
const isFormValid = computed(() => {
  return amount.value && selectedCategory.value
})

// 日期选择确认
const onConfirmDate = (value: Date) => {
  selectedDate.value = value
  showDatePicker.value = false
}

// 时间选择确认
const onConfirmTime = (value: number[]) => {
  selectedTime.value = value
  showTimePicker.value = false
}

// 提交表单
const onSubmit = () => {
  if (!isFormValid.value) {
    showToast('请填写完整信息')
    return
  }

  // 构建交易数据
  const transactionData = {
    type: props.type,
    amount: parseFloat(amount.value),
    category: selectedCategory.value,
    date: selectedDate.value,
    time: selectedTime.value,
    note: note.value,
    timestamp: new Date().getTime()
  }

  // 触发提交事件
  emit('submit', transactionData)
}
</script>

<style scoped>
.transaction-form-content {
  padding: 16px 0;
}

.amount-input {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px 0;
  position: relative;
}

.currency {
  font-size: 30px;
  font-weight: bold;
  padding-right: 10px;
}

.amount-field {
  font-size: 30px;
  font-weight: bold;
  margin-top: -6px;
}

:deep(.amount-field .van-field__body) {
  flex-direction: row-reverse;
}

:deep(.amount-field .van-field__control) {
  text-align: left;
  font-size: 30px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  margin-top: 24px;
  color: #323233;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-item.active {
  background-color: rgba(25, 137, 250, 0.1);
}

.category-icon {
  font-size: 24px;
  margin-bottom: 4px;
  color: #323233;
}

.category-item.active .category-icon {
  color: #1989fa;
}

.category-name {
  font-size: 12px;
  color: #646566;
}

.category-item.active .category-name {
  color: #1989fa;
  font-weight: 500;
}

.form-item {
  margin-top: 16px;
}

.submit-btn {
  margin-top: 30px;
  padding: 0 16px;
}
</style> 