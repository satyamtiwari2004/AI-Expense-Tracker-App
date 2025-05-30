import Button from '@/components/Button'
import HomeCard from '@/components/HomeCard'
import ScreenWrappper from '@/components/ScreenWrappper'
import TransactionList from '@/components/TransactionList'
import Typo from '@/components/Typo'
import { auth } from '@/config/firebase'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import useFetchData from '@/hooks/useFetchData'
import { TransactionType } from '@/types'
import { verticalScale } from '@/utils/styling'
import { useRouter } from 'expo-router'
import { signOut } from 'firebase/auth'
import { limit, orderBy, where } from 'firebase/firestore'
import * as Icons from 'phosphor-react-native'
import React from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogOut = async () => {
    await signOut(auth)
  }

  const constrainsts = [
    where("uid", "==", user?.uid),
    orderBy("date", "desc"),
    limit(25)
  ];
  const {
    data: recentTransaction,
    error,
    loading: transactionLoading
  } = useFetchData<TransactionType>("transactions", constrainsts)

  return (
    <ScreenWrappper>
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            <Typo size={21} color={colors.neutral300}>Hello👋,</Typo>
            <Typo size={28} fontWeight={"500"}>{user?.name}</Typo>
          </View>
          <TouchableOpacity onPress={() => { router.push("/(modals)/searchModal") }} style={styles.searchIcon}>
            <Icons.MagnifyingGlass
              color={colors.neutral300}
              size={verticalScale(22)}
              weight='bold'
            />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          {/* cards */}
          <View>
            <HomeCard />
          </View>

          <TransactionList data={recentTransaction} loading={transactionLoading} emptyListMessage='No Transaction added Yet!' title='Recent Transcation' />



        </ScrollView>
        <Button style={styles.floatingButton} onPress={() => { router.push("/(modals)/transactionModal") }}>
          <Icons.Plus
            color={colors.black}
            weight='bold'
            size={verticalScale(24)}
          />
        </Button>

      </View>

    </ScreenWrappper>
  )
}

export default Home

const styles = StyleSheet.create({
  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30)
  },
  searchIcon: {
    backgroundColor: colors.neutral700,
    padding: spacingX._10,
    borderRadius: 50
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10
  },
  container: {
    flex: 1,
    marginTop: verticalScale(8),
    paddingHorizontal: spacingX._20
  }

})