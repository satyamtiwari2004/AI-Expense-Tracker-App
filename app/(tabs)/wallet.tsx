import Loading from '@/components/Loading'
import ScreenWrappper from '@/components/ScreenWrappper'
import Typo from '@/components/Typo'
import WalletListItem from '@/components/WalletListItem'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import useFetchData from '@/hooks/useFetchData'
import { WalletType } from '@/types'
import { verticalScale } from '@/utils/styling'
import { router, useRouter } from 'expo-router'
import { orderBy, where } from 'firebase/firestore'
import * as Icons from 'phosphor-react-native'
import React from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'

const Wallet = () => {
  const getTotalBalance = () =>
    wallet.reduce((total, item) => {
      total = total + (item.amount || 0);
      return total;
    }, 0)


  const route = useRouter();
  const { user } = useAuth();

  
  const { data: wallet, error, loading } = useFetchData<WalletType>("wallets", [
    where("uid", '==', user?.uid),
    orderBy("created", "desc"),
  ])

  return (
    <ScreenWrappper style={{ backgroundColor: colors.black }}>
      <View style={styles.container}>
        <View style={styles.balanceView}>
          <View style={{ alignItems: "center" }}>
            <Typo size={45} fontWeight={500}>

              ₹{getTotalBalance()?.toFixed(2)}
            </Typo>
            <Typo size={16} color={colors.neutral300}>
              Total Balance
            </Typo>

          </View>

        </View>
        <View style={styles.wallest}>
          <View style={styles.flexRow}>
            <Typo size={20} fontWeight={500}>
              My Wallets
            </Typo>
            <TouchableOpacity onPress={() => { route.push("/walletModal") }}>
              <Icons.PlusCircle
                weight='fill'
                color={colors.primary}
                size={verticalScale(33)}
              />
            </TouchableOpacity>

          </View>

          {loading && <Loading />}
          <FlatList
            data={wallet}
            renderItem={({ item, index }) => {
              return (<WalletListItem item={item} index={index} router={router} />
              )
            }}

            contentContainerStyle={styles.listStyle}
          />

        </View>


      </View>



    </ScreenWrappper>


  )
}

export default Wallet

const styles = StyleSheet.create({
  listStyle: {
    paddingVertical: spacingY._25,
    paddingTop: spacingY._15
  },
  wallest: {
    flex: 1,
    backgroundColor: colors.neutral900,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    padding: spacingX._20,
    paddingTop: spacingX._25
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10
  },
  balanceView: {
    height: verticalScale(160),
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.black,
  }
})