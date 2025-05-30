import { colors } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { user } = useAuth();


  useEffect(() => {
    setTimeout(() => {


      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/welcome');
      }
    }, 2000);


  }, [user]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/splashImage.png')}
        resizeMode="contain"
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral900,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 100,
    width: 100,
  },
});
