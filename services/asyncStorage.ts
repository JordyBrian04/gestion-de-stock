import AsyncStorage from '@react-native-async-storage/async-storage';

//UserData
export const storeUserData = async (course:any) => {
    try {
      await AsyncStorage.setItem('username', JSON.stringify(course));
    } catch (error) {
      console.log('[storeUserData] error', error);
    }
};

export const getUserData = async () => {
    try {
      let userData = await AsyncStorage.getItem('username');
      const data = JSON.parse(userData as string);
      return data;
    } catch (error) {}
  };
