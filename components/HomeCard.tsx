import { colors, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import useFetchData from '@/hooks/useFetchData'
import { WalletType } from '@/types'
import { scale, verticalScale } from '@/utils/styling'
import { orderBy, where } from 'firebase/firestore'
import * as Icons from 'phosphor-react-native'
import React from 'react'
import { ImageBackground, StyleSheet, View } from 'react-native'
import Typo from './Typo'

const HomeCard = () => {
  const { user } = useAuth();

  const {
    data: wallet,
    error,
    loading: walletLoading
  } = useFetchData<WalletType>("wallets", [
    where("uid", '==', user?.uid),
    orderBy("created", "desc"),
  ])

  type Totals = {
    balance: number;
    income: number;
    expense: number;
  };

  const getTotals = () => {
    return wallet.reduce<Totals>((totals, item) => {
      totals.balance += Number(item.amount ?? 0);
      totals.income += Number(item.totalIncome ?? 0);
      totals.expense += Number(item.totalExpenses ?? 0);
      return totals;
    }, { balance: 0, income: 0, expense: 0 });
  };

  const totals = getTotals();



  return (
    <ImageBackground
      source={require('../assets/images/card.png')}
      resizeMode="stretch"
      style={styles.bgImage}
    >
      <View style={styles.container}>
        <View style={styles.totalBalanceRow}>
          <Typo color={colors.neutral800} size={17} fontWeight={'500'}> Total Balance </Typo>
          <Icons.DotsThreeOutline
            size={verticalScale(23)}
            color={colors.black}
            weight='fill'
          />
        </View>
        <View>
          {walletLoading ? (
            <View
              style={{
                width: 120,
                height: 35,
                backgroundColor: "#eee",
                borderRadius: 8
              }}
            />
          ) : (
            <Typo color={colors.black} size={30} fontWeight={"bold"}>
              {`₹${totals?.balance?.toFixed(2)}`}
            </Typo>
          )}
        </View>
        {/* total expense and income */}
        <View style={styles.stats}>
          {/* income */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Icons.ArrowDown
                  size={verticalScale(15)}
                  color={colors.black}
                  weight='bold'
                />
              </View>
              <Typo size={16} color={colors.neutral700} fontWeight={"500"}>
                Income
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>


              {walletLoading ? (
                <View style={{ width: 60, height: 20, backgroundColor: "#eee", borderRadius: 5 }} />
              ) : (
                <Typo size={17} color={colors.green}>
                  {`₹${totals?.income?.toFixed(2)}`}
                </Typo>
              )}

            </View>
          </View>

          {/* expense */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Icons.ArrowUp
                  size={verticalScale(15)}
                  color={colors.black}
                  weight='bold'
                />
              </View>
              <Typo size={16} color={colors.neutral700} fontWeight={"500"}>
                Expense
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              {walletLoading ? (
                <View style={{ width: 60, height: 20, backgroundColor: "#eee", borderRadius: 5 }} />
              ) : (
                <Typo size={17} color={colors.rose}>
                  {`₹${totals?.expense?.toFixed(2)}`}
                </Typo>
              )}
            </View>
          </View>


        </View>
      </View>

    </ImageBackground>
  )
}

export default HomeCard

const styles = StyleSheet.create({
  bgImage: {
    height: scale(210),
    width: "100%"
  },
  container: {
    padding: spacingX._20,
    paddingHorizontal: scale(23),
    height: "87%",
    width: "100%",
    justifyContent: "space-between"
  },
  totalBalanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._5
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  statsIcon: {
    backgroundColor: colors.neutral350,
    padding: spacingY._5,
    borderRadius: 50
  },
  incomeExpense: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingY._7
  }

})