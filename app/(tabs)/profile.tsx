import CustomAlert from '@/components/CustomAlert'
import Header from '@/components/Header'
import ScreenWrappper from '@/components/ScreenWrappper'
import Typo from '@/components/Typo'
import { auth } from '@/config/firebase'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import { getProfileImage } from '@/services/imageService'
import { accountOptionType } from '@/types'
import { verticalScale } from '@/utils/styling'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { signOut } from 'firebase/auth'
import * as Icons from 'phosphor-react-native'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

const Profile = () => {
  const { user } = useAuth()
  const route = useRouter()
  const [showLogoutModal, setShowLogoutModal] = React.useState(false)

  const accountOptions: accountOptionType[] = [
    {
      title: "Edit Profile",
      icon: <Icons.User size={26} color={colors.white} weight='fill' />,
      routeName: "/(modals)/profileModal",
      bgColor: '#6366f1'
    },
    {
      title: "Setting",
      icon: <Icons.GearSix size={26} color={colors.white} weight='fill' />,
      bgColor: '#059669'
    },
    {
      title: "Privacy Policy",
      icon: <Icons.Lock size={26} color={colors.white} weight='fill' />,
      bgColor: colors.neutral600
    },
    {
      title: "Logout",
      icon: <Icons.Power size={26} color={colors.white} weight='fill' />,
      bgColor: '#e11d48'
    },
  ]

  const handleLogout = async () => {
    await signOut(auth)
    setShowLogoutModal(false)
  }

  const handlePress = (item: accountOptionType) => {
    if (item.title === 'Logout') {
      setShowLogoutModal(true);
    } else if (item.routeName) {
      route.push(item.routeName);
    }
  }




  return (
    <ScreenWrappper>
      <View style={styles.container}>
        <Header title='Profile' style={{ marginVertical: spacingY._10 }} />

        {/* user info */}
        <View style={styles.userInfo}>
          <Image source={getProfileImage(user?.image)} style={styles.avatar} contentFit='cover' transition={100} />
          <View style={styles.nameContainer}>
            <Typo size={24} fontWeight="600" color={colors.neutral200}>{user?.name}</Typo>
            <Typo size={15} color={colors.neutral400}>{user?.email}</Typo>
          </View>
        </View>

        {/* account options */}
        <View style={styles.accountOptions}>
          {accountOptions.map((item, index) => (
            <View key={index.toString()} style={styles.listItem}>
              <TouchableOpacity style={styles.flexRow} onPress={() => handlePress(item)}>
                <Animated.View
                  entering={FadeInDown.delay(index * 50).springify().damping(14)}
                  style={[styles.listIcon, { backgroundColor: item.bgColor }]}
                >
                  {item.icon}
                </Animated.View>
                <Typo size={16} style={{ flex: 1 }} fontWeight="500">{item.title}</Typo>
                <Icons.CaretRight size={verticalScale(20)} weight='bold' color={colors.white} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Custom Alert for Logout */}
        <CustomAlert
          visible={showLogoutModal}
          title="Confirm"
          message="Are you sure you want to Logout?"
          confirmText="Logout"
          cancelText="Cancel"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      </View>
    </ScreenWrappper>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20
  },
  userInfo: {
    marginTop: verticalScale(30),
    alignItems: "center",
    gap: spacingY._15
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200
  },
  nameContainer: {
    gap: verticalScale(4),
    alignItems: "center"
  },
  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    backgroundColor: colors.neutral500,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius._15
  },
  listItem: {
    marginBottom: verticalScale(17)
  },
  accountOptions: {
    marginTop: spacingY._35
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
})
