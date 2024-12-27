import week01 from './weeks/week01.json'
import week02 from './weeks/week02.json'
import week03 from './weeks/week03.json'

export const getWeekSchedule = (weekNumber) => {
  const weeks = {
  1: week01,
  2: week02,
  3: week03
}
  return weeks[weekNumber]
}

export const getAllWeeks = () => {
  return Object.values(weeks)
}