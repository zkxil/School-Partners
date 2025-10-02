import React, { useState } from 'react'
import { View } from '@tarojs/components'
import { observer } from 'mobx-react-lite'
import Taro from '@tarojs/taro'

import { useStore } from '../../../store/index'

import './index.scss'

const { prefix } = require('../../../config/common')

interface IProps {
  number: number
}

const Options: React.FC<IProps> = observer(({ number }) => {
  const { exerciseStore } = useStore() // 使用 context 替代 inject
  const [uploadImg, setUploadImg] = useState('')

  const formatNumber = (number: number) => String.fromCharCode(number + 65)

  const onOptionClick = (number: number, index: number) => {
    exerciseStore.handleOptionClick(number, index)
  }

  const onConfirmClick = () => {
    exerciseStore.handleConfirmClick()
  }

  const handleImageUpload = () => {
    const { exerciseId } = exerciseStore

    Taro.chooseImage({
      count: 1,
      success: (res) => {
        const filePath = res.tempFilePaths[0]
        const openid = Taro.getStorageSync('openid')

        setUploadImg(filePath)

        Taro.uploadFile({
          url: `${prefix}/upload`,
          filePath,
          name: 'files',
          formData: {
            openid,
            exerciseId,
            exerciseIndex: number
          },
          success: (res) => console.log(res)
        })
      }
    })
  }

  const { topicList, optionStatus, fontSize, isFinished, isSubmitted } = exerciseStore
  if (!optionStatus[number] || !topicList[number]) return null
  const { topicOptions, isUpload = false } = topicList[number]

  const buttonClassName: string =
    isUpload || optionStatus[number].some(_ => _ === 1) && !isSubmitted
      ? 'confirm'
      : 'confirm hide'
  const buttonName: string = isFinished ? '完成答题' : '下一题'

  const optionClassNames: Record<string, string> = {
    '-2': 'number error',
    '-1': 'number omit',
    '0': 'number',
    '1': 'number active',
    '2': 'number correct'
  }

  return (
    <View className='exam-options'>
      {!isUpload ? (
        topicOptions.map((topicOption, index) => {
          const { option } = topicOption
          const optionClassName = optionClassNames[optionStatus[number][index]]
          return (
            <View className='wrap' key={index} onClick={() => onOptionClick(number, index)}>
              <View className={optionClassName}>{formatNumber(index)}</View>
              <View className={`content ${fontSize}`}>{option}</View>
            </View>
          )
        })
      ) : (
        <View className='uploader__container'>
          请在此上传图片:
          <View className='uploader__wrapper' onClick={handleImageUpload}>
            {!uploadImg ? (
              <View className='uploader__icon'>+</View>
            ) : (
              <View
                className='uploader__icon uploader__img'
                style={{ backgroundImage: `url(${uploadImg})` }}
              />
            )}
          </View>
        </View>
      )}
      <View className={buttonClassName} onClick={onConfirmClick}>
        {buttonName}
      </View>
    </View>
  )
})

export default Options
