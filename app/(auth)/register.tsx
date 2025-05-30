import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Input from '@/components/Input'
import ScreenWrappper from '@/components/ScreenWrappper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import { verticalScale } from '@/utils/styling'
import { useRouter } from 'expo-router'
import * as Icons from 'phosphor-react-native'
import React, { useRef, useState } from 'react'
import { Alert, Pressable, StyleSheet, View } from 'react-native'


const Register = () => {

  const emailRef = useRef("");
  const passwordRef = useRef("");
  const nameRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register: registerUser } = useAuth();

  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      Alert.alert("Sign Up", "Please fill all the fields");
      return;
    }
    setIsLoading(true);
    const res = await registerUser(
      emailRef.current,
      passwordRef.current,
      nameRef.current
    );
    setIsLoading(false);
    console.log(res);
    if (!res.success) {
      Alert.alert("Sign Up", res.msg);
    }

  }

  return (
    <ScreenWrappper >
      <View style={styles.container}>
        <BackButton iconSize={27} />
        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight='800' >
            Let's
          </Typo>
          <Typo size={30} fontWeight='800' >
            Get Started
          </Typo>
        </View>

        {/* form */}


        <View style={styles.form}>
          <Typo size={16} color={colors.textLight} >
            Create An Account To Track Your Expenses...
          </Typo>
          <Input
            placeholder='Enter your Name'

            onChangeText={(value) => nameRef.current = value}
            icon={
              <Icons.User
                size={verticalScale(26)}
                color={colors.neutral300} weight='fill' />}
          />
          <Input
            placeholder='Enter your email'
            onChangeText={(value) => emailRef.current = value}
            icon={
              <Icons.At
                size={verticalScale(26)}
                color={colors.neutral300} weight='fill' />}
          />
          <Input
            placeholder='Enter your password'
            secureTextEntry
            onChangeText={(value) => passwordRef.current = value}
            icon={
              <Icons.Lock
                size={verticalScale(26)}
                color={colors.neutral300} weight='fill' />}
          />



          <Button loading={isLoading} onPress={handleSubmit}>
            <Typo fontWeight={700} color={colors.black} size={21} >
              Create Account

            </Typo>

          </Button>

        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <Typo size={15}>Already have an account?</Typo>
          <Pressable onPress={() => router.navigate("/(auth)/login")}>
            <Typo size={15} fontWeight={700} color={colors.primary}>Login</Typo>
          </Pressable>

        </View>

      </View>

    </ScreenWrappper>
  )
}

export default Register

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._25,
    paddingHorizontal: spacingX._15,
    //paddingTop: spacingY._35,
  },
  welcomeText: {
    fontSize: verticalScale(20),
    fontWeight: 'bold',
    color: colors.text

  },
  form: {
    gap: spacingY._20,
  },
  forgetPassword: {
    textAlign: "right",
    fontWeight: "500",
    color: colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    alignItems: "center",
  },
  footerTex: {
    textAlign: "center",
    color: colors.text,
    fontSize: verticalScale(15),
  }

})