import { colors } from '@/constants/theme'
import { ScreenWrapperProps } from '@/types'
import React from 'react'
import { Dimensions, Platform, StatusBar, StyleSheet, View } from 'react-native'

const { height } = Dimensions.get("window")

const ScreenWrappper = ({ style, children }: ScreenWrapperProps) => {
  let paddingTop = Platform.OS === "ios" ? height * 0.06 : 0;
  return (
    <View style={[
      {
        paddingTop,
        flex: 1,
        backgroundColor: colors.neutral900
      },
      style,
    ]}>
      <StatusBar barStyle={"light-content"} backgroundColor={colors.neutral900} />
      {children}
    </View>
  )
}

export default ScreenWrappper

const styles = StyleSheet.create({})