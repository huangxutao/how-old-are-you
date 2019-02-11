import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button, Text, Picker } from '@tarojs/components'
import Logo from '../../assets/images/logo2.jpeg';

import './index.scss'

class Index extends Component {

  config = {
    navigationBarTitleText: '你多大了？'
  }

  state = {
    date: '1990-01-01'
  }

  componentWillMount () {}

  componentWillReact () {
    console.log('componentWillReact')
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleDate = (e) => {
    const date = e.target.value

    this.setState({ date })
    Taro.navigateTo({
      url: `/pages/result/index?date=${date}`
    })
  }

  onGetUserInfo = ({ detail: { userInfo } }) => {
    console.log(userInfo)
    Taro.setStorage({
      key: 'userInfo',
      data: userInfo
    })
  }

  render () {
    const { date } = this.state
    return (
      <View className='index-wrapper'>
        <View className='logo-wrapper'>
          <Image src={Logo} className='logo' />
          <Text className='text0'>为毛我妈老是把我的年龄整的那么大 😑 ? </Text>
          <Text className='text1'>你多大了，知道不 🙃 ¿ </Text>
          <Text className='text2'>什么虚岁周岁的，🙄 晕~</Text>
        </View>
        <Picker value={date} mode='date' onChange={this.handleDate}>
          <Button className='choice-date-btn' openType='getUserInfo' onGetUserInfo={this.onGetUserInfo}>选择出生日期（公历）</Button>
        </Picker>
      </View>
    )
  }
}

export default Index 
