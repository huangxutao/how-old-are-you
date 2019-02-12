import Taro from '@tarojs/taro'

const filterDateNum = (date) => {
  if (!date) return {}

  const cnDay = ['天', '一', '二', '三', '四', '五', '六']

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
		switch(i){
			case 1:
			case 3:
			case 5:
			case 7:
			case 8:
			case 10:
			case 12:
        count += 31
        break;
			case 2:
        count += 28
         break;
			default: 
        count += 30
    }
  }

  if (_isLeapYear(currDate.year) && currDate.month > 2) {
    count += 1
    count += currDate.day
  }

  return count
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
  if (!birthdayDate) return '';

  if (typeof birthdayDate === 'string') {
    birthdayDate = new Date(birthdayDate)
  }

  const now = new Date()
  const birthdayObj = filterDateNum(birthdayDate)
  const nowObj = filterDateNum(now)
  const baseAge = nowObj.year - birthdayObj.year

  // 本年没过生日
  if (birthdayObj.month < nowObj.month || ((birthdayObj.month === nowObj.month) && (birthdayObj.day > nowObj.day))) {
    return baseAge
  }

  return baseAge - 1
}


/**
 * 虚岁算法：一出生就是一岁，然后，每过一个春节就长一岁。
 * @param {Date} birthday
 */
const calculateBigAge = (fullAge, birthday) => {
  if (!birthday) return '';

  if (typeof birthday === 'string') {
    birthday = new Date(birthday)
  }

  const now = new Date()
  const birthdayObj = filterDateNum(birthday)
  const nowObj = filterDateNum(now)

  // 本年没过生日
  if (birthdayObj.month < nowObj.month || ((birthdayObj.month === nowObj.month) && (birthdayObj.day > nowObj.day))) {
    return fullAge + 1
  }

  return fullAge + 2
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
  calculateFullAge,
  getPassedDays,
  filterDateNum,
  get,
  postJSON
}
