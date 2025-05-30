import { colors, radius, spacingX } from '@/constants/theme'
import { InputProps } from '@/types'
import { verticalScale } from '@/utils/styling'
import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

const Input = (props: InputProps) => {
  return (
    <View
      style={[styles.container, props.containerStyle && props.containerStyle]}
    >
      {props.icon && props.icon}

      <TextInput
        style={[styles.input, props.inputStyle]}
        placeholderTextColor={colors.neutral400}
        ref={props.inputRef && props.inputRef}
        {...props}
      />

      {props.rightIcon && <View style={styles.rightIcon}>{props.rightIcon}</View>}
    </View>
  );
};


export default Input

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: verticalScale(58),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    borderWidth: 1,
    borderColor: colors.neutral400,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
    gap: spacingX._10,

  },
  input: {
    flex: 1,
    color: colors.white,
    fontSize: verticalScale(14)

  },
  rightIcon: {
    marginLeft: spacingX._10,
  }

})