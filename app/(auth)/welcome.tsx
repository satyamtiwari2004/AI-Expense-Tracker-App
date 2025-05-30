import Button from '@/components/Button'
import ScreenWrappper from '@/components/ScreenWrappper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'

const Welcome = () => {
  const route = useRouter()

  return (
    <ScreenWrappper>
      <View style={styles.container}>
        {/* login button & image */}
        <View>
          <TouchableOpacity style={styles.logicButton} onPress={() => route.push("/(auth)/login")}>
            <Typo fontWeight={"500"} style={styles.btn}>Sign in</Typo>
          </TouchableOpacity>
          <Animated.Image
            entering={FadeIn.duration(1500)}
            source={require("../../assets/images/welcome.png")}
            style={styles.welcomeImage}
            resizeMode='contain'
          />
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Animated.View
            entering={FadeInDown.duration(1000).springify().damping(12)}
            style={{ alignItems: "center" }}
          >
            <Typo size={30} fontWeight={800}>Always Take Control</Typo>
            <Typo size={30} fontWeight={800}>Of Your Finances.</Typo>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000).delay(150).springify().damping(12)}
            style={{ alignItems: 'center', gap: 2 }}
          >
            <Typo size={17} color={colors.textLight}>Finances must be managed,</Typo>
            <Typo size={17} color={colors.textLight}>not just spent.</Typo>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000).delay(300).springify().damping(12)}
            style={styles.buttonContainer}
          >
            <Button onPress={() => route.navigate("/(auth)/register")}>
              <Typo size={22} color={colors.neutral900} fontWeight={600}>Get Started</Typo>
            </Button>
          </Animated.View>
        </View>
      </View>
    </ScreenWrappper>
  )
}

// 👇 Hides the white top header
export const options = {
  headerShown: false,
}

export default Welcome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacingY._7,
  },
  welcomeImage: {
    width: "100%",
    height: verticalScale(300),
    alignSelf: "center",
  },
  logicButton: {
    alignSelf: "flex-end",
    marginRight: spacingX._20,
  },
  footer: {
    backgroundColor: colors.neutral800,
    alignItems: "center",
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(45),
    gap: spacingY._20,
    shadowColor: "white",
    shadowOffset: { width: 0, height: -10 },
    elevation: 10,
    shadowRadius: 25,
    shadowOpacity: 0.15,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacingX._25,
  },
  btn: {
    backgroundColor: colors.neutral700,
    paddingVertical: verticalScale(10),
    paddingHorizontal: spacingX._15,
    borderRadius: 43,
  }
})
