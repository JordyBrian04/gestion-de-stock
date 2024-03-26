import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  ActivityIndicator
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import COULEUR from "../constantes/coleurs";
import { TextInput } from "react-native-gesture-handler";
import Checkbox from "expo-checkbox";
import Button from "../components/Button";
import axios from "axios";
import { storeUserData } from "../services/asyncStorage";


const Login = ({navigation}:any) => {
  const [userAuthentificate, setUserAuthentificate] = useState({
    username: "",
    password: "",
  });

  const [secureTextEntry, setSecureTextEntry] = useState(true)
  const [loading, setLoading] = useState(false)


  const handleLogin = async () => {
    if (userAuthentificate.username === "" || userAuthentificate.password === ""){
        Alert.alert("Veuillez saisir les champs vides")
    }else{
        try {
            setLoading(true)
            //
            const response = await axios.post('https://relationship2.000webhostapp.com/gest_stock/login.php', {
                username: userAuthentificate.username,
                password: userAuthentificate.password
            });
            
            if(response.data === 'success'){

                storeUserData(userAuthentificate.username)

                setUserAuthentificate({
                    username:'',
                    password:''
                })
                
                setLoading(false)
                navigation.navigate("Tabs")
            }else{
              Alert.alert(response.data)
              setLoading(false)
            }
            console.log(response.data);
          } catch (error) {
            setLoading(false)
            Alert.alert("Erreur de connexion.", "Une erreur s'est produite veuillez vérifier votre connexion internet et réessayer.")
            console.error(error);
          }
    }
  }

  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: COULEUR.rose }}>
      <SafeAreaView className="flex">
        {/* <View className="flex-row justify-start">
          <TouchableOpacity></TouchableOpacity>
        </View> */}

        <View className="flex-row justify-center">
          <Image
            source={require("../img/key.png")}
            style={{ width: 150, height: 150 }}
          />
        </View>
      </SafeAreaView>
      <View
        className="flex-1 bg-white px-4 pt-8"
        style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
      >
        <View className="form space-y-2">
          <Text className="text-gray-700 ml-4">Nom d'utilisateur</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
            placeholder="admin"
            onChangeText={(e) =>
              setUserAuthentificate({ ...userAuthentificate, username: e })
            }
            value={userAuthentificate.username}
          />
          <Text className="text-gray-700 ml-4">Mot de passe</Text>
          <View className="bg-gray-100 rounded-2xl flex-row justify-between p-4 mb-4">
            <TextInput
              className="text-gray-700 w-[90%]"
              placeholder="******"
              onChangeText={e =>
                setUserAuthentificate({...userAuthentificate, password: e})
              }
              value={userAuthentificate.password}
              secureTextEntry={secureTextEntry}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setSecureTextEntry((prev) => !prev)}>
              {secureTextEntry ? <Feather name="eye" size={24} color="black" /> : <FontAwesome name="eye-slash" size={24} color="black" />}
            </TouchableOpacity>
          </View>

          {/* <View className="flex-row items-center justify-between px-4 mb-8">
            <View className="flex-row">
                <Checkbox value={isChecked} onValueChange={() => {setChecked((prev) => !prev); setSecureTextEntry((prev) => !prev)}} />
                <Text className="ml-2">Afficher le mot de passe</Text>
            </View>
          </View> */}

          <Button 
            titre={loading == false ? "Se connecter" : <ActivityIndicator/>}
            onPress={handleLogin}
            disabled={loading}
          />
        </View>
      </View>
    </View>
  );
};

export default Login;
