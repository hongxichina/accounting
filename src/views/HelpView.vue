<!-- 帮助与反馈页面 -->
<template>
  <div class="help-container">
    <van-nav-bar
      title="帮助与反馈"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />

    <div class="content">
      <van-collapse v-model="activeNames">
        <van-collapse-item title="如何添加交易记录？" name="1">
          <p>点击底部导航栏中的"记一笔"按钮或首页的"记一笔"快捷方式，选择收入或支出类型，填写金额、选择类别、日期和时间，添加备注（可选），然后点击"保存"按钮即可添加一笔交易记录。</p>
        </van-collapse-item>
        
        <van-collapse-item title="如何设置预算？" name="2">
          <p>进入"设置"页面，在"预算设置"部分可以设置月度总预算。点击"月度总预算"可以修改预算金额；点击"类别预算管理"可以为具体的支出类别设置单独的预算。</p>
        </van-collapse-item>
        
        <van-collapse-item title="如何查看统计报表？" name="3">
          <p>点击底部导航栏中的"统计"按钮，可以查看收入和支出的分类统计和趋势图表。您可以选择不同的时间范围（本月、上月、近三个月、今年）来查看对应时期的统计数据。</p>
        </van-collapse-item>
        
        <van-collapse-item title="如何备份和恢复数据？" name="4">
          <p>进入"设置"页面，在"数据与同步"部分，点击"备份数据"可以将您的记账数据备份；点击"恢复数据"可以从以前的备份中恢复数据。数据也可以导出为Excel格式。</p>
        </van-collapse-item>
      </van-collapse>

      <div class="feedback-section">
        <h3>问题反馈</h3>
        <van-form @submit="submitFeedback">
          <van-field
            v-model="feedback.type"
            is-link
            readonly
            name="反馈类型"
            label="反馈类型"
            placeholder="请选择反馈类型"
            @click="showFeedbackTypePicker = true"
          />
          <van-popup v-model="showFeedbackTypePicker" position="bottom">
            <van-picker
              title="选择反馈类型"
              :columns="feedbackTypes"
              @confirm="onFeedbackTypeConfirm"
              @cancel="showFeedbackTypePicker = false"
              show-toolbar
            />
          </van-popup>
          
          <van-field
            v-model="feedback.content"
            name="反馈内容"
            label="反馈内容"
            type="textarea"
            placeholder="请详细描述您遇到的问题或建议"
            :rules="[{ required: true, message: '请填写反馈内容' }]"
            rows="4"
            autosize
          />
          
          <van-field
            v-model="feedback.contact"
            name="联系方式"
            label="联系方式(选填)"
            placeholder="请留下您的邮箱或手机号，方便我们联系您"
          />
          
          <div style="margin: 16px;">
            <van-button round block type="primary" native-type="submit">
              提交反馈
            </van-button>
          </div>
        </van-form>
      </div>

      <div class="contact-info">
        <h3>联系我们</h3>
        <p>客服邮箱：support@jizhangapp.com</p>
        <p>客服电话：400-123-4567（工作日 9:00-18:00）</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from '../utils/vant'

const router = useRouter()
const activeNames = ref(['1'])

// 反馈相关
const feedback = ref({
  type: '',
  content: '',
  contact: ''
})
const showFeedbackTypePicker = ref(false)
const feedbackTypes = ref(['功能建议', '操作问题', '数据问题', '界面优化', '其他问题'])

// 选择反馈类型
const onFeedbackTypeConfirm = (value: string) => {
  feedback.value.type = value
  showFeedbackTypePicker.value = false
}

// 提交反馈
const submitFeedback = () => {
  showToast('感谢您的反馈，我们会尽快处理')
  feedback.value = {
    type: '',
    content: '',
    contact: ''
  }
}

// 返回上一页
const goBack = () => router.go(-1)
</script>

<style scoped>
.help-container {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 20px;
}

.content {
  padding: 16px;
}

.feedback-section {
  margin-top: 24px;
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
}

.feedback-section h3 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 500;
  color: #323233;
}

.contact-info {
  margin-top: 24px;
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
}

.contact-info h3 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 500;
  color: #323233;
}

.contact-info p {
  margin: 8px 0;
  font-size: 14px;
  color: #646566;
  line-height: 1.5;
}
</style> 