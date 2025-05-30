import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import React from 'react'
import { Modal, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'

type CustomAlertProps = {
  visible: boolean
  title: string
  message?: string
  confirmText?: string      // Defaults to "OK" or "Confirm" based on usage
  cancelText?: string       // Optional
  onConfirm: () => void
  onCancel?: () => void
  style?: ViewStyle;   // Optional
}

const CustomAlert = ({
  visible,
  title,
  message,
  confirmText = "OK",
  cancelText,
  onConfirm,
  onCancel,
  style
}: CustomAlertProps) => {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel || onConfirm}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Typo size={24} fontWeight="600" color={colors.black}>{title}</Typo>
          <Typo size={19} color={colors.neutral800} style={{ marginVertical: 16 }}>
            {message}
          </Typo>
          <View style={styles.buttonsRow}>
            {cancelText && onCancel && (
              <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                <Typo color={colors.white} size={16} fontWeight="600">{cancelText}</Typo>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.confirmBtn, style]} onPress={onConfirm}>
              <Typo color={colors.white} size={16} fontWeight="600">{confirmText}</Typo>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default CustomAlert

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: radius._20,
    width: '85%',
    elevation: 6,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacingX._15,
  },
  cancelBtn: {
    backgroundColor: colors.neutral700,
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._20,
    borderRadius: radius._12,
  },
  confirmBtn: {
    backgroundColor: colors.rose,
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._20,
    borderRadius: radius._12,
  },
})
