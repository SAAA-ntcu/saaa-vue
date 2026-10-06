import { ref, watch } from 'vue'

const STORAGE_KEY = 'saaa_active_assessment_year'
const defaultYear = '115'

const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
export const globalSelectedYear = ref(stored || defaultYear)

watch(globalSelectedYear, (newVal) => {
  if (typeof localStorage !== 'undefined' && newVal) {
    localStorage.setItem(STORAGE_KEY, newVal)
  }
})

export function useAssessmentYear(availableYears = []) {
  // If global year is in available list, use it; otherwise fallback to latest available or 115
  function getValidYear() {
    if (availableYears.length > 0 && !availableYears.includes(globalSelectedYear.value)) {
      return availableYears[0]
    }
    return globalSelectedYear.value
  }

  const activeYear = ref(getValidYear())

  function setYear(year) {
    activeYear.value = year
    globalSelectedYear.value = year
  }

  watch(globalSelectedYear, (newVal) => {
    if (availableYears.length === 0 || availableYears.includes(newVal)) {
      activeYear.value = newVal
    }
  })

  return {
    activeYear,
    setYear
  }
}
