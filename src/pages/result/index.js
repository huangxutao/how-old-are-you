import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import { calculateFullAge, calculateBigAge, getPassedDays, getLunarInfo, filterDateNum } from '../../helper/utils';
import Logo from '../../assets/images/logo.jpeg'

import './index.scss'

class Result extends Component {

  config = {
    navigationBarTitleText: '查看结果'
  }

  componentWillMount () {
    // console.log(this.$router.params)
  }

  componentWillReact () {
    console.log('componentWillReact')
  }

  componentDidMount () {
    const birthday = this.$router.params.date

    this.setState({ birthday })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onShareAppMessage () {
    return {
      title: '咦，这样的吗？',
      path: '/pages/index/index',
      success: function (res) {
        console.log(res);
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }

  handleBack = () => {
    Taro.navigateBack()
  }

  renderWords (birthday, fullAge) {
    if (fullAge < 0) {
      return '瞅啥瞅，赶紧造人去吧！'
    }

    if (fullAge > 100) {
      return `您老身体可真好 😄`
    }

    const now = new Date()
    const days = getPassedDays(birthday, now) + 1
    const currDate = filterDateNum(now)
    const { month, day } = filterDateNum(new Date(birthday))
    const nextBirthdayYear = (currDate.month > month || (currDate.month === month && currDate.day > day)) ? currDate.year + 1 : currDate.year;
    const nextBirthday = new Date(`${nextBirthdayYear}/${month}/${day}`)
    const nextBirthdayDays = getPassedDays(now, nextBirthday)
    const nextBirthdayData = filterDateNum(nextBirthday)

    if (nextBirthdayDays > 10) {
      return `今天是您蹦跶在这个世界上的第 ${days} 天，不如吃顿好的庆祝下吧， 毕竟距离下一次生日 🎂 (${nextBirthdayYear}年 ${month}月 ${day}日）还有 ${nextBirthdayDays} 天呢，那天是周${nextBirthdayData.weekDay}哦 ~`
    }

    if (nextBirthdayDays === 0) {
      return `生日快乐呀！！！今天是您蹦跶在这个世界上的第 ${days} 天呢 ~`
    }

    return `哎呀！再蹦跶 ${nextBirthdayDays} 天就是生日了呢，不容易不容易已经蹦跶了 ${days} 天了，那天是周${nextBirthdayData.weekDay}哦~`
  }

  render () {
    const userInfo = Taro.getStorageSync('userInfo')
    const { birthday } = this.state
    const { lYear, monthCn, dayCn, gzYear, gzMonth, gzDay, animal, cYear, cMonth, cDay } = getLunarInfo(birthday)
    const fullAge = calculateFullAge(birthday)

    return (
      <View className='result-wrapper'>
        <View className='main-content'>
          <View className='title'>
            {fullAge < 0 ? '尼玛，这是个没出生的娃啊 😂' : '💋 真相只有一个！'}
          </View>
          <Image className='avator' src={userInfo.avatarUrl || Logo} />
          <View className='row'>
            周岁: {fullAge}
            <View className='sub-info'>周岁算法：每过一个生日就长一岁。</View>
          </View>
          <View className='row'>
            虚岁: {calculateBigAge(birthday)}
            <View className='sub-info'>虚岁算法：一出生就是一岁，然后，每过一个春节就长一岁。</View>
          </View>
          <View className='row'>
            生肖: {animal}
          </View>
          <View className='row'>
            公历生日: {cYear}年 {cMonth}月 {cDay}日 
          </View>
          <View className='row'>
            农历生日: {lYear}年 {monthCn} {dayCn} （{gzYear}年 {gzMonth}月 {gzDay}日）
          </View>
          <View className='some-words'>
            <View className='words-title'>
              To: {userInfo.nickName || 'you'}
            </View>
            <View className='words-content'>{this.renderWords(birthday, fullAge)}</View>
          </View>
        </View>
        <View className='footer-bnts'>
          <Button className='btn1' onClick={this.handleBack}>返回</Button>
          <Button className='btn2' openType='share' on>分享</Button>
        </View>
      </View>
    )
  }
}

export default Result 
