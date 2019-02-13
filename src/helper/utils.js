import Taro from '@tarojs/taro'
import solarlunar from 'solarlunar'

const filterDateNum = (date) => {
  if (!date) return {}

  const cnDay = ['日', '一', '二', '三', '四', '五', '六']

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    weekDay: cnDay[date.getDay()]
  }
}

/**
 * 是否是闰年
 */
const _isLeapYear = (year) => {
  return year%400 === 0||(year%100 !== 0 && year%4 === 0)
}

/**
 * 计算当前在该年是第几天
 */
const _daysInYear = (date = new Date()) => {
  let count = 0
  const currDate = filterDateNum(date)

  for (let i = 1; i < currDate.month; i++) {
    if ([1, 3, 5, 7, 8, 10, 12].includes(i)) {
      count += 31
    } else if (i === 2) {
      count += 28
    } else {
      count += 30
    }
  }

  if (_isLeapYear(currDate.year) && currDate.month > 2) {
    count += 1
    count += currDate.day
  }

  return count + currDate.day
}

/**
 * 计算两段时间的天数
 * @param {Date} startDate
 * @param {Date} endData
 */
const getPassedDays = (startDate, endDate) => {
  if (typeof startDate === 'string') {
    startDate = new Date(startDate)
  }

  if (typeof endDate === 'string') {
    endDate = new Date(endDate)
  }

  let count = 0
  const startData = filterDateNum(startDate)
  const endData = filterDateNum(endDate)

  for (let i = startData.year; i < endData.year; i ++) {
    count += (_isLeapYear(i) ? 366 : 365)
  }

  count += _daysInYear(endDate)
  count -= _daysInYear(startDate)

  return count
}

/**
 * 周岁算法：每过一个生日就长一岁。
 * @param {Date} birthdayDate
 */
const calculateFullAge = (birthdayDate) => {
  let fullAge = 0
  if (!birthdayDate) return '';

  if (typeof birthdayDate === 'string') {
    birthdayDate = new Date(birthdayDate)
  }

  const now = new Date()
  const birthdayObj = filterDateNum(birthdayDate)
  const nowObj = filterDateNum(now)
  const baseAge = nowObj.year - birthdayObj.year

  fullAge = baseAge

  // 本年没过生日
  if (birthdayObj.month > nowObj.month || ((birthdayObj.month === nowObj.month) && (birthdayObj.day > nowObj.day))) {
    fullAge = baseAge - 1
  }

  if (fullAge === 0) {
    const dayCount = getPassedDays(birthdayDate, now)
    const weekCount = parseInt(dayCount/7)

    console.log(birthdayDate, now, dayCount)


    fullAge = weekCount > 0 ? `小宝宝满 ${weekCount} 周了` : `满 ${dayCount} 天`
  }

  return fullAge
}

/**
 * 虚岁算法：一出生就是一岁，然后，每过一个春节就长一岁。
 * @param {Date} birthday
 */
const calculateBigAge_old = (fullAge, birthday) => {
  if (!birthday) return ''

  if (typeof fullAge === 'string') {
    return fullAge
  }

  if (typeof birthday === 'string') {
    birthday = new Date(birthday)
  }

  const now = new Date()
  const birthdayObj = filterDateNum(birthday)
  const nowObj = filterDateNum(now)

  // 本年没过生日
  if (birthdayObj.month > nowObj.month || ((birthdayObj.month === nowObj.month) && (birthdayObj.day > nowObj.day))) {
    return fullAge + 2
  }

  return fullAge + 1
}

/**
 * 虚岁算法：一出生就是一岁，然后，每过一个春节就长一岁。
 * @param {Date} birthday
 */
const calculateBigAge = (birthday) => {
  const birthdayObj = getLunarInfo(birthday)
  const nowObj = getLunarInfo(new Date())

  return nowObj.lYear - birthdayObj.lYear + 1
}

const getLunarInfo = (solarDate) => {
  if (typeof solarDate === 'string') {
    solarDate = new Date(solarDate)
  }

  const { year, month, day } = filterDateNum(solarDate)

  return solarlunar.solar2lunar(year, month, day)
}

const get = (url, data) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url,
      method: 'GET',
      data,
      success: res => {
        resolve(res.data)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

const postJSON = (url, data) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url,
      method: 'POST',
      data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        resolve(res.data)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

export {
  calculateBigAge,
  calculateBigAge_old,
  calculateFullAge,
  getPassedDays,
  filterDateNum,
  getLunarInfo,
  get,
  postJSON
}
