<script setup lang="ts">
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { computed } from 'vue'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
  labels: string[]
  data: number[]
  colors?: string[]
}>()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.data,
      backgroundColor: props.colors ?? [
        '#ef4444',
        '#3b82f6',
        '#22c55e'
      ]
    }
  ]
}))

const options = {
  responsive: true,
  maintainAspectRatio: false
}
</script>

<template>
  <div style="height: 300px;">
    <Pie :data="chartData" :options="options" />
  </div>
</template>
