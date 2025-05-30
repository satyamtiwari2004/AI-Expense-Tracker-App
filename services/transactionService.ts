import { firestore } from "@/config/firebase";
import { colors } from "@/constants/theme";
import { ResponseType, TransactionType, WalletType } from "@/types";
import { getLast12Months, getLast7Days, getYearsRange } from "@/utils/common";
import { scale } from "@/utils/styling";
import { collection, doc, getDoc, getDocs, orderBy, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";

export const createOrUpdateTransaction = async (
  transactionDate: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    const { id, type, walletId, image, amount } = transactionDate;
    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, msg: "Invaild Transaction Data" };
    }
    if (id) {
      
     }
    else {
      //update wallet for new transaction
      let res = await updateWalletForNewTransaction(
        walletId!,
        Number(amount!),
        type
      );
      if (!res.success) {
        return res;
      }
    }

    if (image) {
      const imageUplaodRes = await uploadFileToCloudinary(
        image,
        "transaction"
      )
      if (!imageUplaodRes.success) {
        return {
          success: false,
          msg: "Failed to upload the receipt"
        }
      }
      transactionDate.image = imageUplaodRes.data;
    }

    const transactionRef = id ? doc(firestore, "transactions", id) : doc(collection(firestore, "transactions"));

    await setDoc(transactionRef, transactionDate, { merge: true });

    return { success: true, data: { ...transactionDate, id: transactionRef.id } }
  } catch (error: any) {
    console.log("Error Creating or updateing Transaction", error)
    return { success: false, msg: error.message };

  }

}

export const updateWalletForNewTransaction = async (
  walletId: string,
  amount: number,
  type: string
) => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);
    const walletSnapshot = await getDoc(walletRef);
    if (!walletSnapshot.exists()) {
      console.log("Error updating wallet for the new transaction")
      return { success: false, msg: "Wallet Not found" }
    }

    const walletData = walletSnapshot.data() as WalletType;
    if (type == 'expense' && walletData.amount! - amount < 0) {
      return { success: false, msg: "Selected Wallet Don't have sufficent Balance" };
    }

    const updateType = type == 'income' ? "totalIncome" : "totalExpenses"
    const updateWalletAmount = type == "income" ? Number(walletData.amount) + amount : Number(walletData.amount) - amount;

    const updateTotal = type == "income" ? Number(walletData.totalIncome) + amount : Number(walletData.totalExpenses) + amount;

    await updateDoc(walletRef, {
      amount: updateWalletAmount,
      [updateType]: updateTotal
    })

    return { success: true, msg: "Wallet updated" };

  } catch (error: any) {
    console.log("Error updating wallet for the new transaction : ", error)
    return { success: false, msg: error.message }


  }

}

export const fetchWeeklyData = async (
  uid: string
): Promise<ResponseType> => {
  try {
    const db = firestore;
    const today = new Date();
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 7);

    const transactionQuery = query(
      collection(db, "transactions"),
      where("date", ">=", Timestamp.fromDate(sevenDaysAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      orderBy("date", "desc"),
      where("uid", "==", uid)
    );

    const querySnapshort = await getDocs(transactionQuery);
    const weeklyData = getLast7Days();

    const transactions: TransactionType[] = [];

    querySnapshort.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);


      const transactionDate = (transaction.date as Timestamp).toDate().toISOString().split("T")[0];

      const dayData = weeklyData.find((day) => day.date == transactionDate);

      if (dayData) {
        if (transaction.type == "income") {
          dayData.income += transaction.amount;
        } else if (transaction.type == "expense") {
          dayData.expense += transaction.amount
        }
      }
    });

    const stats = weeklyData.flatMap((day) => [
      {
        value: day.income,
        label: day.day,
        spacing: scale(4),
        labelWidth: scale(30),
        frontColor: colors.primary
      },
      { value: day.expense, frontColor: colors.rose }
    ]);
    return {
      success: true,
      data: {
        stats,
        transactions
      }
    };

  } catch (error: any) {
    console.log("error fetching weekly data: ", error)
    return { success: false, msg: error.message }

  }

}

export const fetchMonthlyData = async (
  uid: string

): Promise<ResponseType> => {
  try {
    const db = firestore;
    const today = new Date()
    const twelveMonthAgo = new Date(today);
    twelveMonthAgo.setMonth(today.getMonth() - 12);


    const transactionQuery = query(
      collection(db, "transactions"),
      where("date", ">=", Timestamp.fromDate(twelveMonthAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      orderBy("date", "desc"),
      where("uid", "==", uid)
    );

    const querySnapshort = await getDocs(transactionQuery);
    const monthlyData = getLast12Months();
    const transactions: TransactionType[] = [];

    querySnapshort.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);


      const transactionDate = (transaction.date as Timestamp).toDate();
      const monthName = transactionDate.toLocaleString("default", {
        month: "short"
      })

      const shortYear = transactionDate.getFullYear().toString().slice(-2);

      const monthData = monthlyData.find(
        (month) => month.month === `${monthName} ${shortYear}`
      )



      if (monthData) {
        if (transaction.type == "income") {
          monthData.income += transaction.amount;
        } else if (transaction.type == "expense") {
          monthData.expense += transaction.amount
        }
      }
    });

    const stats = monthlyData.flatMap((day) => [
      {
        value: day.income,
        label: day.month,
        spacing: scale(4),
        labelWidth: scale(46),
        frontColor: colors.primary
      },
      { value: day.expense, frontColor: colors.rose }
    ]);
    return {
      success: true,
      data: {
        stats,
        transactions
      }
    };


  } catch (error: any) {
    console.log("Error in fetching the Monthly data:", error);
    return { success: false, msg: error.message }

  }

}


export const fetchYearlyData = async (
  uid: string

): Promise<ResponseType> => {
  try {
    const db = firestore;



    const transactionQuery = query(
      collection(db, "transactions"),
      orderBy("date", "desc"),
      where("uid", "==", uid)
    );

    const querySnapshort = await getDocs(transactionQuery);
    const transactions: TransactionType[] = [];

    const firstTransaction = querySnapshort.docs.reduce((earliest, doc) => {
      const transactionDate = doc.data().date.toDate();
      return transactionDate < earliest ? transactionDate : earliest;
    }, new Date());


    const firstyear = firstTransaction.getFullYear();
    const currentYear = new Date().getFullYear();

    const yearlyData = getYearsRange(firstyear, currentYear)



    querySnapshort.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);


      const transactionYear = (transaction.date as Timestamp).toDate().getFullYear();




      const yearData = yearlyData.find(
        (item: any) => item.year === transactionYear.toString()
      );



      if (yearData) {
        if (transaction.type == "income") {
          yearData.income += transaction.amount;
        } else if (transaction.type == "expense") {
          yearData.expense += transaction.amount
        }
      }
    });

    const stats = yearlyData.flatMap((year: any) => [
      {
        value: year.income,
        label: year.year,
        spacing: scale(4),
        labelWidth: scale(35),
        frontColor: colors.primary
      },
      { value: year.expense, frontColor: colors.rose }
    ]);
    return {
      success: true,
      data: {
        stats,
        transactions
      }
    };


  } catch (error: any) {
    console.log("Error in fetching the Yearly transaction:", error);
    return { success: false, msg: error.message }

  }

}