import {
  ScrollView,
  StyleSheet,
  Text,
  Image,
  View,
  Modal,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import React, { useEffect, useState } from "react";
import { getUserData } from "../services/asyncStorage";
import { FontAwesome5 } from '@expo/vector-icons';
import { FlatList } from "react-native-gesture-handler";
import { Entypo } from "@expo/vector-icons";
import { StockDonut } from "./Charts";
import { PieChart } from 'react-native-svg-charts';
import axios from "axios";

const Menu = ({ navigation }: any) => {
  const [username, setUsername] = useState("");
  const [solde, setSolde] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [articles, setListeArticle] = useState([]);
  const [stockDispo, setStockDispo] = useState(0)
  const [refresh, setRefreshing] = useState(false);

  const getAllArticles = async () => {
    try {
      setListeArticle([])
      const response = await axios.get(
        "https://relationship2.000webhostapp.com/gest_stock/get_article.php"
      );
      //setListeCategorie(response.data);
      setListeArticle(response.data)

      response.data.map((item:any) => {
        //console.log(item.qte)
        const value = parseInt(item.qte)
        setStockDispo(prev => prev+value)
      })
    } catch (error) {
      console.log("errorHome", error);
    }
  }

  const getSoldeJour = async () => {
    setSolde(0)
    try {
      const currentDate = new Date()
      let year = currentDate.getFullYear()
      let month = currentDate.getMonth() + 1
      let day = currentDate.getDate()

      const dateJour = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`

      const response = await axios.get(`https://relationship2.000webhostapp.com/gest_stock/get_solde_jour.php?date=${dateJour}`)

      setSolde(response.data)
    } catch (error) {
      console.log("getSoldeError", error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserData();
        //console.log(data)
        setUsername(data);
      } catch (error) {
        console.log("errorHome", error);
      }
    };

    fetchData();
    getSoldeJour();
    getAllArticles()
  }, []);

//   setTimeout(() => {
//     getAllArticles()
//     getSoldeJour()
// },5000)

  const data = [
    {
      id: "1",
      nom_article: "Savon de Marseille",
      qte: 20,
    },
    {
      id: "2",
      nom_article: "Savon de Marseille",
      qte: 20,
    },
    {
      id: "3",
      nom_article: "Savon de Marseille",
      qte: 20,
    },
    {
      id: "4",
      nom_article: "Savon de Marseille",
      qte: 20,
    },
    {
      id: "5",
      nom_article: "Savon de Marseille",
      qte: 20,
    },
    {
      id: "6",
      nom_article: "Savon de Marseille",
      qte: 20,
    },
    {
      id: "7",
      nom_article: "Savon de Marseille",
      qte: 20,
    },
    {
      id: "8",
      nom_article: "Savon de Marseille",
      qte: 20,
    },
    {
      id: "9",
      nom_article: "Savon de Marseille",
      qte: 20,
    },
    {
      id: "10",
      nom_article: "Savon de Marseille",
      qte: 20,
    },
    {
      id: "11",
      nom_article: "Savon de Marseille",
      qte: 20,
    },
    {
      id: "12",
      nom_article: "Savon de Marseille",
      qte: 20,
    },
  ];

  const numCol = 2;
  const ListeMenu = [
    {
      id: "1",
      titre: "Accueil",
      img: require("../img/home.png"),
      page: "Menu",
    },
    {
      id: "2",
      titre: "Articles",
      img: require("../img/package.png"),
      page: "Article",
    },
    {
      id: "3",
      titre: "Fournisseurs",
      img: require("../img/delivery-man.png"),
      page: "Menu",
    },
    {
      id: "4",
      titre: "Comptabilité",
      img: require("../img/budget.png"),
      page: "Menu",
    },
    {
      id: "5",
      titre: "Stock",
      img: require("../img/boxes.png"),
      page: "Menu",
    },
    {
      id: "6",
      titre: "Paramètres",
      img: require("../img/settings.png"),
      page: "Menu",
    },
  ];

  function renderModal() {
    return (
      <Modal visible={showModal} animationType="fade" transparent={true}>
        <View
          className="flex-1 bg-transparent justify-center items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View className="w-[90%] bg-white rounded-lg">
            <View className="p-2 justify-end items-end">
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Entypo name="circle-with-cross" size={35} color="black" />
              </TouchableOpacity>
            </View>
            <Text className="text-lg font-bold text-center">Menu</Text>
            <View>
              <FlatList
                data={ListeMenu}
                keyExtractor={item => item.id}
                renderItem={({item, index}) => {
                  return <View className='p-6 flex-row'>
                    <TouchableOpacity 
                      className='bg-gray-200 p-4 rounded-lg justify-center items-center w-[120px]'
                      onPress={()=>navigation.navigate(item.page)}
                    >
                      <Image className='w-10 h-10 mb-2' source={item.img}/>
                      <Text>{item.titre}</Text>
                    </TouchableOpacity>
                  </View>
                }}
                numColumns={numCol}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  const refreshing = () => {
    setRefreshing(true)

    getAllArticles()
    getSoldeJour()

    setTimeout(() => {
      setRefreshing(false)
    },2000)
  }

  return (
    <View className="bg-gray-100 flex-1 pt-8 pr-3 pl-3">
      {/* <View className="mb-3">
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <AntDesign name="home" size={32} color="black" />
        </TouchableOpacity>
      </View> */}

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={refreshing}
          />
        }
      >
        <View className="flex-row w-full justify-between items-center p-1">
          <View className="p-6 bg-pink-500 rounded-lg shadow-lg shadow-slate-800">
            <View className="bg-white w-8 h-8 justify-center items-center rounded-full mb-2">
              <FontAwesome5 name="archive" size={18} color="black" />
            </View>
            <Text className="text-white font-bold text-2xl">{articles.length}</Text>
            <Text className="text-[16px] font- text-white">Produit(s)</Text>
          </View>

          <View className="p-6 bg-pink-700 rounded-lg shadow-lg shadow-slate-800">
            <View className="bg-white w-8 h-8 justify-center items-center rounded-full mb-2">
              <FontAwesome5 name="boxes" size={18} color="black" />
            </View>
            <Text className="text-white font-bold text-2xl">{stockDispo}</Text>
            <Text className="text-[16px] font-thin text-white">Stock disponible</Text>
          </View>

        </View>

        <View className="bg-blue-400 rounded-lg p-3 mt-2 shadow-lg shadow-slate-800">
          
          <Text className="text-xl font-light text-white">Revenu du jour</Text>
          <Text className="text-2xl font-bold text-white">{solde.toLocaleString('fr-FR')} FCFA</Text>
        </View>

        <View className="bg-white p-2 rounded-lg mt-3">
          <Text className="text-2xl font-bold mb-2">Article en stock</Text>
          <StockDonut refresh={refresh}/>
        </View>
      </ScrollView>
      {/* <Sidebar navigation={navigation} show={true}/> */}
      {renderModal()}
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({});
