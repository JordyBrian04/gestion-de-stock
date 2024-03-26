import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Platform, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign, FontAwesome5, Fontisto } from "@expo/vector-icons";
import axios from "axios";

const Vente = ({navigation}:any) => {

  const [mois, setMois] = useState([]);
  const [ventes, setListeVente] = useState([])
  const [detailVentes, setListeDetailVente] = useState([])
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [dateSearch, setDateSearch] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [refresh, setRefreshing] = useState(false);

  // const getMois = async () => {
  //   try {
  //     setLoading(true)
  //     const response = await axios.get("https://relationship2.000webhostapp.com/gest_stock/get_vente_mois.php");
  //     //console.log(response.data)
  //     setMois(response.data)
  //     setLoading(false)
  //   } catch (error) {
  //     console.error("Vente ", error)
  //     setLoading(false);
  //   }
  // }

  const getAllVente = async () => {
    setListeVente([])
    try {
      //setLoading(true)
      const response = await axios.get("https://relationship2.000webhostapp.com/gest_stock/get_vente.php");
      //console.log(response.data)
      setListeVente(response.data)
      //setLoading(false)
    } catch (error) {
      console.error("Vente ", error)
      //setLoading(false);
    }
  }

  const getAllDetailVente = async () => {
    setListeDetailVente([])
    try {
      const response = await axios.get("https://relationship2.000webhostapp.com/gest_stock/get_detail_vente.php");
      //console.log(response.data)
      setListeDetailVente(response.data)
    } catch (error) {
      console.error("Detail vente ", error)
    }
  }

  useEffect(() => {
    //getMois()
    getAllVente()
    getAllDetailVente()
  }, []);

//   setTimeout(() => {
//     getAllVente()
//     getAllDetailVente()
// },5000)

  const toggleDatePicker = () => {
    setShowPicker(!showPicker)
  }

  const onChange = ({type}:any, value:any) => {
    if(type === 'set'){
      const currentDate = value
      setDate(currentDate)

      if(Platform.OS === 'android'){
        toggleDatePicker()
        setDateSearch(currentDate.toLocaleDateString('fr-FR'))
      }
    }else{
      toggleDatePicker()
    }
  }

  const refreshing = () => {
    setRefreshing(true)

    getAllVente()
    getAllDetailVente()

    setTimeout(() => {
      setRefreshing(false)
    },2000)
  }

  return (
    <View className="flex-1 pt-8 pr-3 pl-3">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={refreshing}
          />
        }
      >
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="font-bold text-2xl">Liste des ventes</Text>
          <TouchableOpacity className="bg-blue-200/100 rounded-lg p-1" onPress={() => navigation.navigate('Action_vente')}>
            <AntDesign name="plus" size={28} color="black" />
          </TouchableOpacity>
        </View>

        {/* <View className="p-2">

          {showPicker && (
            <DateTimePicker
              testID="dateTimePicker"
              mode="date"
              value={date}
              onChange={onChange}
              //display="spinner"
            />
          )}

          {!showPicker && (
              <TouchableOpacity className="w-full" onPress={toggleDatePicker}>
                <TextInput
                  className="rounded-lg border-slate-300 border p-2 text-black"
                  placeholder={date.toLocaleDateString('fr-FR')}
                  value={dateSearch}
                  onChangeText={setDateSearch}
                  editable={false}
                />
              </TouchableOpacity>
          )}

        </View> */}

        <View className="p-2">

      {loading ? (
            <View className="">
              <ActivityIndicator size="large" color="#000" />
            </View>
          ) : ventes.map((vente: any) => {
    
            const currentVenteDetail = detailVentes.filter((detail:any) => detail.code_vente.includes(vente.code_vente))
    
            return (
              <View key={vente.code_vente} className="border border-slate-300 rounded-lg mb-3">
                <View className="bg-pink-500 rounded-t-lg p-2 flex-row items-center justify-between">
                  <Text className="text-white text-sm">{vente.code_vente}</Text>
                  <View className="flex-row items-center">
                    <Fontisto name="date" size={19} color="white"/>
                    <Text className="text-white text-sm ml-2">{vente.date}</Text>
                  </View>
                </View>
    
                <View className="p-3 flex-row items-center justify-between border-y-2 border-slate-300">
                  <Text>Total</Text>
                  <Text className="text-lg font-bold">{vente.prixtotal} FCFA</Text>
                </View>
    
                <View className="p-3">
                  {currentVenteDetail.map((item: any) => (
                    <View key={item.detail_vente_id} className="flex-row justify-between items-center">
                      <Text>{item.qte} x</Text>
                      <View className="w-10 h-10 rounded-full items-center justify-center bg-green-300/50 m-1">
                        <FontAwesome5 name="archive" size={18} color="black" />
                      </View>
                      <Text className="w-[80%] font-bold text-ellipsis">{item.nom_article}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}


          {/* <View className="border border-slate-300 rounded-lg mb-3">
            <View className="bg-pink-500 rounded-t-lg p-2 flex-row items-center justify-between">
              <Text className="text-white text-sm">#VENT-2025145</Text>
              <View className="flex-row items-center">
                <Fontisto name="date" size={19} color="white"/>
                <Text className="text-white text-sm ml-2">27 Mars 2024</Text>
              </View>
            </View>

            <View className="p-3 flex-row items-center justify-between border-y-2 border-slate-300">
              <Text>Total</Text>
              <Text className="text-lg font-bold">20 000 FCFA</Text>
            </View>

            <View className="p-3">

              <View className="flex-row justify-between items-center">

                <Text>2 x</Text>

                <View className="w-10 h-10 rounded-full items-center justify-center bg-green-300/50 m-1">
                  <FontAwesome5 name="archive" size={18} color="black" />
                </View>

                <Text className="w-[80%] font-bold text-ellipsis">Savon de Marseille</Text>
              </View>

              <View className="flex-row justify-between items-center">

                <Text>2 x</Text>

                <View className="w-10 h-10 rounded-full items-center justify-center bg-green-300/50 m-1">
                  <FontAwesome5 name="archive" size={18} color="black" />
                </View>

                <Text className="w-[80%] font-bold text-ellipsis">Savon de Marseille</Text>
              </View>

              <View className="flex-row justify-between items-center">

                <Text>2 x</Text>

                <View className="w-10 h-10 rounded-full items-center justify-center bg-green-300/50 m-1">
                  <FontAwesome5 name="archive" size={18} color="black" />
                </View>

                <Text className="w-[80%] font-bold text-ellipsis">Savon de Marseille</Text>
              </View>

            </View>
          </View> */}

        </View>
      </ScrollView>
    </View>
  );
};

export default Vente;


