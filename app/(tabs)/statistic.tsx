import Header from '@/components/Header'
import Loading from '@/components/Loading'
import ScreenWrappper from '@/components/ScreenWrappper'
import TransactionList from '@/components/TransactionList'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import { fetchMonthlyData, fetchWeeklyData, fetchYearlyData } from '@/services/transactionService'
import { scale, verticalScale } from '@/utils/styling'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'
import { BarChart } from "react-native-gifted-charts"


const Statistic = () => {
  const [activeWindow, setActiveWindow] = useState(0);
  const [chartData, setChartData] = useState([])
  const [chartLoading, setChartLoading] = useState(false)
  const { user } = useAuth()
  const [transactions, setTransaction] = useState([])

  useEffect(() => {
    if (activeWindow == 0) {
      getWeeklyStats();
    }
    if (activeWindow == 1) {
      getMonthlyStats()
    }
    if (activeWindow == 2) {
      getYearlyStats();
    }
  }, [activeWindow])

  const getWeeklyStats = async () => {
    setChartLoading(true);
    let res = await fetchWeeklyData(user?.uid as string)
    setChartLoading(false);

    if (res.success) {
      setChartData(res?.data?.stats);
      setTransaction(res?.data?.transactions);
    } else {
      Alert.alert("Error", res.msg);
    }

  }

  const getMonthlyStats = async () => {
    setChartLoading(true)

    let res = await fetchMonthlyData(user?.uid as string)
    setChartLoading(false)

    if (res.success) {
      setChartData(res.data.stats);
      setTransaction(res.data.transactions);
    } else {
      Alert.alert("Error", res.msg);

    }

  }

  const getYearlyStats = async () => {
    setChartLoading(true);

    let res = await fetchYearlyData(user?.uid as string)
    setChartLoading(false)

    if (res.success) {
      setChartData(res?.data?.stats);
      setTransaction(res?.data?.transactions);
    } else {
      Alert.alert("Error", res.msg || "Failed to fetch data.");
      setChartData([]); // Set empty array to avoid length error
      setTransaction([]);
    }


  }


  return (
    <ScreenWrappper >
      <View style={styles.container}>
        <View style={styles.header}>
          <Header title="Statistic" />
        </View>
        <ScrollView
          contentContainerStyle={{
            gap: spacingY._20,
            paddingTop: spacingY._5,
            paddingBottom: verticalScale(100)
          }}
          showsVerticalScrollIndicator={false}
        >
          <SegmentedControl
            values={['Weekly', 'Monthly', 'Yearly']}
            selectedIndex={activeWindow}
            onChange={(event) => {
              setActiveWindow(event.nativeEvent.selectedSegmentIndex)
            }}
            tintColor={colors.neutral200}
            backgroundColor={colors.neutral800}
            appearance="dark"
            activeFontStyle={styles.segmentFontStyle}
            style={styles.segmentStyle}
            fontStyle={{ ...styles.segmentFontStyle, color: colors.white }}
          />

          <View style={styles.chartContainer}>
            {
              chartData.length > 0 ? (
                <BarChart
                  data={chartData}
                  barWidth={scale(12)}
                  spacing={[1, 2].includes(activeWindow) ? scale(25) : scale(16)}
                  roundedTop
                  roundedBottom
                  hideRules
                  yAxisLabelPrefix='₹'
                  yAxisThickness={0}
                  xAxisThickness={0}
                  yAxisLabelWidth={[1, 2].includes(activeWindow) ? scale(60) : scale(55)}
                  yAxisTextStyle={{ color: colors.neutral400 }}
                  xAxisLabelTextStyle={{
                    color: colors.neutral400,
                    fontSize: verticalScale(16)
                  }}
                  noOfSections={5}
                  minHeight={6}
                //maxValue={1000}
                // isAnimated={true}
                // animationDuration={1000}
                />
              ) : (
                <View style={styles.noChart} />


              )
            }
            {
              chartLoading && (
                <View style={styles.chartLoadingContainer}>
                  <Loading color={colors.white} />
                </View>
              )
            }
          </View>
          <View>
            <TransactionList
              title='Transaction'
              emptyListMessage='No transactions found'
              data={transactions}
            />
          </View>


        </ScrollView>

      </View>

    </ScreenWrappper>

  )
}

export default Statistic

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._5,
    gap: spacingY._10
  },
  segmentFontStyle: {
    fontSize: verticalScale(13),
    fontWeight: "bold",
    color: colors.black
  },
  segmentStyle: {
    height: scale(37)
  },
  searchIcon: {
    backgroundColor: colors.neutral700,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    height: verticalScale(35),
    width: verticalScale(35),
    borderCurve: "continuous"
  },
  noChart: {
    backgroundColor: "rgba(0,0,0,0.6)",
    height: verticalScale(210)
  },
  header: {},
  chartLoadingContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: radius._12,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  chartContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center"
  }

})