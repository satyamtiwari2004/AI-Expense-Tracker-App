import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import CustomAlert from '@/components/CustomAlert';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import Input from '@/components/Input';
import ModalWrapper from '@/components/ModalWrapper';
import Typo from '@/components/Typo';
import { expenseCategories, transactionTypes } from '@/constants/data';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import useFetchData from '@/hooks/useFetchData';
import { createOrUpdateTransaction } from '@/services/transactionService';
import { TransactionType, WalletType } from '@/types';
import { scale, verticalScale } from '@/utils/styling';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { orderBy, where } from 'firebase/firestore';
import * as Icons from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
const TransactionModal = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [alertData, setAlertData] = useState({
    visible: false,
    type: '',
    message: '',
  });



  const { data: wallets, error: walletError, loading: walletLoading } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc")
  ])

  const [transaction, setTransaction] = useState<TransactionType>({
    amount: 0,
    category: "",
    date: new Date(),
    description: "",
    walletId: "",
    image: null,
    type: "expense",
  });

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || transaction.date;
    setTransaction({ ...transaction, date: currentDate })
    setShowDatePicker(Platform.OS == "ios" ? true : false);
  };

  const onSubmit = async () => {
    const { type, amount, description, category, date, walletId, image } = transaction;

    if (!walletId || !date || !amount || (type == 'expense' && !category)) {
      // Alert.alert("Transaction", "Please fill all the fields");
      setAlertData({
        visible: true,
        type: 'emptyFields',
        message: 'Please fill all the fields',
      });
      return;
    }

    let transactionData: TransactionType = {
      type,
      amount,
      description,
      category,
      date,
      walletId,
      image,
      uid: user?.uid
    }

    if (oldTransaction.id) transactionData.id = oldTransaction.id

    setLoading(true)
    const res = await createOrUpdateTransaction(transactionData);
    setLoading(false)

    if (res.success) {
      router.back();
    } else {
      Alert.alert("Transaction", res.msg);
    }
  }

  type paramType = {
    id: string;
    amount: string;
    category?: string;
    date: string;
    description?: string;
    walletId: string;
    image?: string;
    type: string;
    uid?: string;

  }
  const oldTransaction: paramType = useLocalSearchParams()


  useEffect(() => {
    if (oldTransaction?.id) {
      setTransaction({
        amount: Number(oldTransaction.amount),
        category: oldTransaction.category || "",
        date: new Date(oldTransaction.date),
        description: oldTransaction.description || "",
        walletId: oldTransaction.walletId,
        image: oldTransaction.image || null,
        type: oldTransaction.type,
      })


    }
  }, [])



  // const [formattedAmount, setFormattedAmount] = useState(
  //   transaction.amount ? transaction.amount.toLocaleString('en-IN') : ''
  // );

  // const handleAmountChange = (text: string) => {
  //   const numeric = text.replace(/,/g, '').replace(/\D/g, '');
  //   const numberValue = Number(numeric);

  //   setFormattedAmount(numberValue ? numberValue.toLocaleString('en-IN') : '');
  //   setTransaction({ ...transaction, amount: numberValue });
  // };



  return (

    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldTransaction?.id ? "Update Transction" : "New Transaction"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          {/* Type of expense dd */}
          <View style={{ gap: spacingY._10 }}>
            <Typo color={colors.neutral200} size={17}>Type</Typo>
            {/* dropdown here */}
            <Dropdown
              style={styles.dropdownContainer}
              activeColor={colors.neutral700}
              placeholderStyle={styles.dropdownPalceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              iconStyle={styles.dropdownIcon}
              data={transactionTypes}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              //placeholder={'Select item'}

              value={transaction.type}

              onChange={item => {
                setTransaction({ ...transaction, type: item.value })

              }}

            />
            {/* Wallet DropDown */}
          </View>
          <View style={{ gap: spacingY._10 }}>
            <Typo color={colors.neutral200} size={17}>Wallet</Typo>

            <Dropdown
              style={styles.dropdownContainer}
              activeColor={colors.neutral700}
              placeholderStyle={styles.dropdownPalceholder}

              selectedTextStyle={styles.dropdownSelectedText}

              iconStyle={styles.dropdownIcon}
              data={wallets.map((wallets) => ({
                label: `${wallets.name} (₹${wallets.amount})`,
                value: wallets?.id,
              }))}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              value={transaction.walletId}

              onChange={item => {
                setTransaction({ ...transaction, walletId: item.value })

              }
              }

            />

          </View>
          {/* categories expense Drop down */}
          {
            transaction.type == 'expense' &&
            (
              <View style={{ gap: spacingY._10 }}>
                <Typo color={colors.neutral200} size={17}>Expense Category</Typo>

                <Dropdown
                  style={styles.dropdownContainer}
                  activeColor={colors.neutral700}
                  placeholderStyle={styles.dropdownPalceholder}
                  selectedTextStyle={styles.dropdownSelectedText}


                  iconStyle={styles.dropdownIcon}
                  data={Object.values(expenseCategories)}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  itemTextStyle={styles.dropdownItemText}
                  itemContainerStyle={styles.dropdownItemContainer}
                  containerStyle={styles.dropdownListContainer}
                  placeholder={'Select category'}
                  value={transaction.category}

                  onChange={item => {
                    setTransaction({ ...transaction, category: item.value })
                  }}
                />
              </View>
            )
          }
          {/* data picker */}

          <View style={{ gap: spacingY._10 }}>
            <Typo color={colors.neutral200} size={17}>Date</Typo>
            {
              !showDatePicker && (
                <Pressable
                  style={styles.dataInput}
                  onPress={() => { setShowDatePicker(true) }}
                >
                  <Typo size={16}>
                    {(transaction.date as Date).toLocaleDateString()}
                  </Typo>

                </Pressable>
              )
            }
            {
              showDatePicker && (
                <View style={Platform.OS == 'ios' && styles.iosDatePicker}>
                  <DateTimePicker
                    themeVariant='dark'
                    value={transaction.date as Date}
                    textColor={colors.white}
                    mode="date"
                    display={Platform.OS == "ios" ? "spinner" : "default"}
                    onChange={onDateChange}
                  />

                  {Platform.OS == "ios" && (
                    <TouchableOpacity
                      style={styles.datePickerButton}
                      onPress={() => setShowDatePicker(false)}
                    >
                      <Typo>Ok</Typo>

                    </TouchableOpacity>
                  )}
                </View>
              )
            }
          </View>

          {/* amount */}
          <View style={{ gap: spacingY._10 }}>
            <Typo size={17}>Amount</Typo>
            <Input
              value={transaction.amount.toString()}
              keyboardType="numeric"
              onChangeText={(value) => setTransaction({ ...transaction, amount: Number(value.replace(/[^0-9]/g, "")) })}
            />
          </View>

          <View style={{ gap: spacingY._10 }}>
            <View style={styles.flexRow}>
              <Typo color={colors.neutral200} size={16}>Description</Typo>
              <Typo color={colors.neutral400} size={14}>(Optional)</Typo>
            </View>

            <Input
              value={transaction.description}
              multiline
              containerStyle={{
                flexDirection: "row",
                height: verticalScale(100),
                alignItems: "flex-start",
                paddingVertical: 15
              }}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction, description: value
                })
              }
            />
          </View>

          <View style={{ gap: spacingY._10 }}>
            <View style={styles.flexRow}>
              <Typo color={colors.neutral200} size={16}>Receipt</Typo>
              <Typo color={colors.neutral400} size={14}>(Optional)</Typo>
            </View>
            <ImageUpload
              file={transaction.image}
              onClear={() => setTransaction({ ...transaction, image: null })}
              onSelect={(file) => setTransaction({ ...transaction, image: file })}
              placeholder='Upload Receipt'
            />

          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        {oldTransaction?.id && !loading && (
          <Button
            // onPress={showDeleteAlert}
            style={{ backgroundColor: colors.rose, paddingHorizontal: spacingX._15 }}
          >
            <Icons.Trash
              color={colors.white}
              size={verticalScale(24)}
              weight='bold'
            />
          </Button>
        )}

        <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight={"700"}>
            {oldTransaction?.id ? "Update Transaction" : "Add Transaction"}
          </Typo>
        </Button>
        <Button
          style={{ paddingHorizontal: spacingX._15 }}
          onPress={() => router.push({ pathname: "../(modals)/ReceiptScannerScreen", params: { walletId: transaction?.walletId } })
          }>
          <Icons.Camera
            color={colors.neutral900}
          />
        </Button>









      </View>

      {
        alertData.visible && alertData.type === 'emptyFields' && (
          <CustomAlert
            visible={alertData.visible}
            title="Transaction"
            message={alertData.message}
            confirmText="Ok"
            style={{ backgroundColor: colors.primaryLight }}
            onConfirm={() => setAlertData({ ...alertData, visible: false })}
          />
        )
      }
    </ModalWrapper >

  )
}

export default TransactionModal

const styles = StyleSheet.create({
  iosDatePicker: {},
  dropdownIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral300
  },
  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  dropdownPalceholder: {
    color: colors.white
  },
  dropdownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: 'continuous',
    paddingVertical: spacingY._7,
    top: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  dropdownItemText: { color: colors.white },
  dropdownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14)
  },
  dropdownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: 'continuous',
  },
  datePickerButton: {
    backgroundColor: colors.neutral700,
    alignSelf: 'flex-end',
    padding: spacingY._7,
    marginRight: spacingX._7,
    borderRadius: radius._10,
    paddingHorizontal: spacingX._15,
  },
  dataInput: {
    flexDirection: 'row',
    alignItems: 'center',
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: 'continuous',
    paddingHorizontal: spacingX._15,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._5,
  },
  androidDropDown: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: 'continuous',
    color: colors.white,
    fontSize: verticalScale(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  form: {
    gap: spacingY._20,
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40,
  },
  iosDropDown: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: 'continuous',
    paddingHorizontal: spacingX._15,
    color: colors.white,
    fontSize: verticalScale(14),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  }





})