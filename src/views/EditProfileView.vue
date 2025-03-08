<!-- 编辑个人资料页面 -->
<template>
  <div class="edit-profile-container">
    <van-nav-bar
      title="编辑个人资料"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />

    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-cell center title="头像">
          <template #right-icon>
            <van-image
              round
              width="60"
              height="60"
              src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
              @click="showAvatarPicker = true"
            />
          </template>
        </van-cell>

        <van-field
          v-model="userInfo.name"
          name="name"
          label="姓名"
          placeholder="请输入姓名"
          :rules="[{ required: true, message: '请填写姓名' }]"
        />
        
        <van-field
          v-model="userInfo.email"
          name="email"
          label="邮箱"
          placeholder="请输入邮箱"
          :rules="[{ required: true, message: '请填写邮箱' }]"
        />
        
        <van-field
          v-model="userInfo.phone"
          name="phone"
          label="手机号"
          placeholder="请输入手机号"
        />

        <van-field
          v-model="userInfo.bio"
          name="bio"
          label="个人简介"
          type="textarea"
          placeholder="请输入个人简介"
          rows="3"
          autosize
        />
      </van-cell-group>

      <div class="form-actions">
        <van-button round block type="primary" native-type="submit">
          保存
        </van-button>
      </div>
    </van-form>

    <!-- 选择头像 -->
    <van-action-sheet v-model="showAvatarPicker" title="选择头像">
      <div class="avatar-picker">
        <van-uploader :after-read="onAvatarUploaded">
          <van-button icon="photograph" type="primary">拍照</van-button>
        </van-uploader>
        <van-button icon="photo-o" type="primary" plain>从相册选择</van-button>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from '../utils/vant'

const router = useRouter()
const showAvatarPicker = ref(false)

// 用户资料
const userInfo = ref({
  name: '张三',
  email: 'zhangsan@example.com',
  phone: '13800138000',
  bio: '这是我的个人简介'
})

// 头像上传
const onAvatarUploaded = (file: any) => {
  console.log('上传头像:', file)
  showToast('头像上传成功')
  showAvatarPicker.value = false
}

// 提交表单
const onSubmit = () => {
  showToast('资料已更新')
  setTimeout(() => {
    router.go(-1)
  }, 1000)
}

// 返回
const goBack = () => router.go(-1)
</script>

<style scoped>
.edit-profile-container {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 30px;
}

.form-actions {
  margin: 30px 16px;
}

.avatar-picker {
  display: flex;
  justify-content: space-around;
  padding: 30px 20px;
}
</style> 