<!-- 统计分析页面 -->
<template>
  <div class="statistics-container">
    <van-nav-bar
      title="统计分析"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />

    <van-tabs v-model="activeTab" sticky animated>
      <van-tab title="支出">
        <div class="chart-container">
          <div class="time-selector">
            <van-dropdown-menu>
              <van-dropdown-item v-model="timeRange" :options="timeOptions" />
            </van-dropdown-menu>
          </div>

          <div class="total-amount">
            <div class="amount-title">{{ timeRangeText }}总支出</div>
            <div class="amount-value">¥{{ totalExpense.toLocaleString() }}</div>
          </div>

          <!-- 饼图 -->
          <div class="pie-chart-wrapper" ref="pieChartEl"></div>

          <!-- 类别详情列表 -->
          <div class="category-list">
            <van-cell-group inset>
              <van-cell v-for="(item, index) in expenseCategoryData" :key="index">
                <template #icon>
                  <div class="category-icon" :style="{ backgroundColor: categoryColors[index % categoryColors.length] }">
                    <van-icon :name="item.icon" size="16" color="#fff" />
                  </div>
                </template>
                <template #title>
                  <div class="category-title">{{ item.name }}</div>
                </template>
                <template #label>
                  <div class="category-percent">{{ item.percent }}%</div>
                </template>
                <template #right-icon>
                  <div class="category-amount">¥{{ item.amount.toLocaleString() }}</div>
                </template>
              </van-cell>
            </van-cell-group>
          </div>
        </div>
      </van-tab>

      <van-tab title="收入">
        <div class="chart-container">
          <div class="time-selector">
            <van-dropdown-menu>
              <van-dropdown-item v-model="timeRange" :options="timeOptions" />
            </van-dropdown-menu>
          </div>

          <div class="total-amount">
            <div class="amount-title">{{ timeRangeText }}总收入</div>
            <div class="amount-value income-color">¥{{ totalIncome.toLocaleString() }}</div>
          </div>

          <!-- 饼图 -->
          <div class="pie-chart-wrapper" ref="incomeChartEl"></div>

          <!-- 类别详情列表 -->
          <div class="category-list">
            <van-cell-group inset>
              <van-cell v-for="(item, index) in incomeCategoryData" :key="index">
                <template #icon>
                  <div class="category-icon" :style="{ backgroundColor: incomeColors[index % incomeColors.length] }">
                    <van-icon :name="item.icon" size="16" color="#fff" />
                  </div>
                </template>
                <template #title>
                  <div class="category-title">{{ item.name }}</div>
                </template>
                <template #label>
                  <div class="category-percent">{{ item.percent }}%</div>
                </template>
                <template #right-icon>
                  <div class="category-amount income-color">¥{{ item.amount.toLocaleString() }}</div>
                </template>
              </van-cell>
            </van-cell-group>
          </div>
        </div>
      </van-tab>

      <van-tab title="趋势">
        <div class="trend-chart-container">
          <div class="time-selector">
            <van-dropdown-menu>
              <van-dropdown-item v-model="trendTimeRange" :options="trendTimeOptions" />
            </van-dropdown-menu>
          </div>

          <!-- 趋势图 -->
          <div class="trend-chart-wrapper" ref="trendChartEl"></div>

          <!-- 汇总信息 -->
          <div class="summary-cards">
            <van-card class="summary-card income-card">
              <template #title>
                <div class="summary-title">总收入</div>
              </template>
              <template #price>
                <div class="summary-amount">¥{{ totalIncome.toLocaleString() }}</div>
              </template>
            </van-card>

            <van-card class="summary-card expense-card">
              <template #title>
                <div class="summary-title">总支出</div>
              </template>
              <template #price>
                <div class="summary-amount">¥{{ totalExpense.toLocaleString() }}</div>
              </template>
            </van-card>

            <van-card class="summary-card balance-card">
              <template #title>
                <div class="summary-title">结余</div>
              </template>
              <template #price>
                <div class="summary-amount">¥{{ (totalIncome - totalExpense).toLocaleString() }}</div>
              </template>
            </van-card>
          </div>
        </div>
      </van-tab>
    </van-tabs>

    <van-tabbar v-model="activeTabbar" route>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="chart-trending-o" to="/statistics">统计</van-tabbar-item>
      <van-tabbar-item icon="plus" to="/add">记一笔</van-tabbar-item>
      <van-tabbar-item icon="bill-o" to="/transactions">账单</van-tabbar-item>
      <van-tabbar-item icon="setting-o" to="/settings">设置</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import gsap from 'gsap'
import { showToast } from '../utils/vant'

const router = useRouter()
const activeTab = ref(0)
const activeTabbar = ref(1)

// 时间范围选择
const timeRange = ref(0)
const timeOptions = [
  { text: '本月', value: 0 },
  { text: '上月', value: 1 },
  { text: '近三个月', value: 2 },
  { text: '今年', value: 3 }
]

// 趋势图时间范围
const trendTimeRange = ref(0)
const trendTimeOptions = [
  { text: '最近7天', value: 0 },
  { text: '最近30天', value: 1 },
  { text: '最近90天', value: 2 },
  { text: '最近一年', value: 3 }
]

// 时间范围文本
const timeRangeText = computed(() => {
  return timeOptions[timeRange.value].text
})

// 图表元素引用
const pieChartEl = ref<HTMLElement | null>(null)
const incomeChartEl = ref<HTMLElement | null>(null)
const trendChartEl = ref<HTMLElement | null>(null)

// 颜色配置
const categoryColors = [
  '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
  '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
]

const incomeColors = [
  '#91cc75', '#5470c6', '#fac858', '#73c0de', '#ee6666'
]

// 模拟数据
const totalExpense = ref(0)
const totalIncome = ref(0)

// 支出类别数据
const expenseCategoryData = [
  { name: '餐饮', amount: 1280, percent: 37, icon: 'coupon-o' },
  { name: '交通', amount: 540, percent: 16, icon: 'logistics' },
  { name: '购物', amount: 620, percent: 18, icon: 'cart-o' },
  { name: '娱乐', amount: 350, percent: 10, icon: 'tv-o' },
  { name: '其他', amount: 660, percent: 19, icon: 'more-o' }
]

// 收入类别数据
const incomeCategoryData = [
  { name: '工资', amount: 9500, percent: 93, icon: 'gold-coin-o' },
  { name: '理财', amount: 450, percent: 4, icon: 'balance-o' },
  { name: '其他', amount: 250, percent: 3, icon: 'more-o' }
]

// 趋势数据
const trendData = {
  dates: ['3/1', '3/2', '3/3', '3/4', '3/5', '3/6', '3/7'],
  income: [0, 0, 9800, 0, 200, 0, 200],
  expense: [150, 320, 450, 280, 600, 700, 950]
}

// 返回上一页
const goBack = () => router.go(-1)

onMounted(() => {
  // 确保DOM已经渲染
  setTimeout(() => {
    // 初始化饼图 - 支出
    if (pieChartEl.value) {
      const pieChart = echarts.init(pieChartEl.value);
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '支出类别',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: expenseCategoryData.map((item, index) => ({
              value: item.amount,
              name: item.name,
              itemStyle: {
                color: categoryColors[index % categoryColors.length]
              }
            }))
          }
        ]
      };
      pieChart.setOption(option);
      
      // 动画效果
      setTimeout(() => {
        pieChart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: 0
        });
      }, 1000);
    }

    // 初始化饼图 - 收入
    if (incomeChartEl.value) {
      const incomeChart = echarts.init(incomeChartEl.value);
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '收入类别',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: incomeCategoryData.map((item, index) => ({
              value: item.amount,
              name: item.name,
              itemStyle: {
                color: incomeColors[index % incomeColors.length]
              }
            }))
          }
        ]
      };
      incomeChart.setOption(option);
      
      // 动画效果
      setTimeout(() => {
        incomeChart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: 0
        });
      }, 1000);
    }

    // 初始化趋势图
    if (trendChartEl.value) {
      const trendChart = echarts.init(trendChartEl.value);
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['收入', '支出']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: trendData.dates
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '收入',
            type: 'bar',
            stack: 'Total',
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              color: '#91cc75'
            },
            data: trendData.income
          },
          {
            name: '支出',
            type: 'bar',
            stack: 'Total',
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              color: '#ee6666'
            },
            data: trendData.expense
          }
        ]
      };
      trendChart.setOption(option);
    }
  }, 100); // 给DOM渲染一点时间

  // 数字增长动画
  gsap.to(totalExpense, {
    value: 3450,
    duration: 1.5,
    ease: "power1.out",
    onUpdate: function() { 
      totalExpense.value = Math.round(totalExpense.value);
    }
  });

  gsap.to(totalIncome, {
    value: 10200,
    duration: 1.5,
    ease: "power1.out",
    onUpdate: function() { 
      totalIncome.value = Math.round(totalIncome.value);
    }
  });
});
</script>

<style scoped>
.statistics-container {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 50px;
}

.chart-container, .trend-chart-container {
  padding: 16px;
}

.time-selector {
  margin-bottom: 16px;
}

.total-amount {
  text-align: center;
  margin-bottom: 20px;
}

.amount-title {
  font-size: 14px;
  color: #666;
}

.amount-value {
  font-size: 30px;
  font-weight: bold;
  color: #ee6666;
}

.income-color {
  color: #07c160;
}

.pie-chart-wrapper, .trend-chart-wrapper {
  height: 260px;
  margin: 16px 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.category-list {
  margin-top: 20px;
}

.category-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.category-title {
  font-size: 15px;
  font-weight: 500;
}

.category-percent {
  color: #969799;
  font-size: 12px;
}

.category-amount {
  font-weight: 600;
  font-size: 15px;
  color: #ee6666;
}

.summary-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.summary-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.income-card {
  background-color: rgba(7, 193, 96, 0.1);
}

.expense-card {
  background-color: rgba(238, 102, 102, 0.1);
}

.balance-card {
  background-color: rgba(25, 137, 250, 0.1);
}

.summary-title {
  font-size: 14px;
  color: #323233;
}

.summary-amount {
  font-size: 20px;
  font-weight: bold;
  color: #323233;
}
</style> 