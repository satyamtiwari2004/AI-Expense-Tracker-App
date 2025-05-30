import BackButton from '@/components/BackButton'
import Header from '@/components/Header'
import Input from '@/components/Input'
import ModalWrapper from '@/components/ModalWrapper'
import TransactionList from '@/components/TransactionList'
import { colors, spacingY } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import useFetchData from '@/hooks/useFetchData'
import { TransactionType } from '@/types'
import { useRouter } from 'expo-router'
import { limit, orderBy, where } from 'firebase/firestore'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'


const SearchModal = () => {

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const { user } = useAuth();
  const router = useRouter();

  const constrainsts = [
    where("uid", "==", user?.uid),
    orderBy("date", "desc"),
    limit(30)
  ];
  const {
    data: allTransactions,
    error,
    loading: transactionLoading
  } = useFetchData<TransactionType>("transactions", constrainsts)

  const filtredTransactions = allTransactions.filter((item) => {
    if (search.length > 1) {
      if (
        item.category?.toLowerCase()?.includes(search?.toLowerCase()) ||
        item.type?.toLowerCase()?.includes(search?.toLowerCase()) ||
        item.description?.toLowerCase()?.includes(search?.toLowerCase())

      ) {
        return true
      }
      return false


    }
    return true
  })


  return (
    <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
      <View style={styles.container}>
        <Header title={"Search     "} leftIcon={<BackButton />} style={{ marginBottom: spacingY._17 }} />

        {/* form */}
        <ScrollView contentContainerStyle={styles.form}>


          <View style={styles.inputContainer}>

            <Input
              placeholder='Search Transactions......'
              value={search}
              onChangeText={(value) => setSearch(value)}
              placeholderTextColor={colors.neutral300}
              containerStyle={{ backgroundColor: colors.neutral700 }}

            />
          </View>
          <View>
            <TransactionList
              loading={transactionLoading}
              data={filtredTransactions}
              emptyListMessage="No transaction match your search"
            />
          </View>



        </ScrollView>

      </View>


    </ModalWrapper>

  )
};

export default SearchModal


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    paddingHorizontal: spacingY._20
  }, form: {
    gap: spacingY._30,
    marginTop: spacingY._15
  },
  inputContainer: {
    gap: spacingY._10
  }

})



