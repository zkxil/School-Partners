import React from 'react'
import { View, Text } from '@tarojs/components'
import { AtSlider } from 'taro-ui'
import { observer } from 'mobx-react-lite'

import { useStore } from '../../../store/index'

import './index.scss'
import 'taro-ui/dist/style/components/flex.scss';


const Status: React.FC = observer(() => {
  const handleSettingClick = (): void => {
    const { exerciseStore: { toggleSettingOpened } } = useStore();
    toggleSettingOpened()
  }

  const handleSliderChange = (value: number): void => {
    const { exerciseStore: { setFontSize } } = useStore();
    setFontSize(value - 1);
  }

  const handleThemeChange = (themeId: number): void => {
    const { exerciseStore: { themeList, setTheme } } = useStore();
    setTheme(themeList[themeId].theme)
  }

  const handleTouchMove = (e: React.TouchEvent): void => {
    e.stopPropagation()
  }

  const { exerciseStore: { fontSizeId, theme, themeList, currentPage, totalPage, settingOpened } } = useStore();

  return (
    <View>
      <View className={`float-layout-overlay ${settingOpened ? 'setting-mass' : ''} `} onClick={handleSettingClick} />
      <View className={`exam-status ${theme} ${settingOpened ? 'setting-open' : ''}`} onTouchMove={handleTouchMove}>
        <View className='exam-footer'>
          <View className='star'>
            <View className='iconfont icon-star'></View>
            <Text className='tag'>收藏</Text>
          </View>
          <View className='setting' onClick={handleSettingClick}>
            <View className='iconfont icon-setting'></View>
            <Text className='tag'>设置</Text>
          </View>
          <View className='progress'>
            <View className='iconfont icon-list'></View>
            <Text className='tag'>{currentPage + 1}</Text>/{totalPage}
          </View>
        </View>
        <View className='exam-setting'>
          <View className='font-setting at-row'>
            <View className='font-size at-col at-col-2'>A-</View>
            <View className='at-col at-col-8'>
              <AtSlider value={fontSizeId + 1} min={1} max={5}
                onChange={handleSliderChange}
                onChanging={handleSliderChange}
                activeColor='#66a6ff'
              />
            </View>
            <View className='font-size at-col at-col-2'>A+</View>
          </View>
          <View className='theme-setting'>
            {themeList.map((item, index) => {
              const { theme, title, icon } = item;
              return (
                <View className={`theme-wrap ${theme === themeList[index].theme ? 'active' : ''}`} key={index} onClick={() => handleThemeChange(index)}>
                  <View className={`theme-icon`}>
                    <View className={`${icon} iconfont`}></View>
                  </View>
                  <View>{title}</View>
                </View>
              )
            })}
          </View>
        </View>
      </View>
    </View>
  )
})

export default Status
