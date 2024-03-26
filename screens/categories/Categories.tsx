import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Modal, TextInput, Alert, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { Entypo, AntDesign, EvilIcons } from "@expo/vector-icons";
import axios from "axios";

const Categories = ({ navigation }: any) => {
  const [categorie, setListeCategorie] = useState([]);
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [sai_categorie, setSaiCategorie] = useState({
    code_categorie: "",
    libelle: "",
    action: ""
  })
  const [refresh, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        "https://relationship2.000webhostapp.com/gest_stock/get_categorie.php"
      );
      setListeCategorie(response.data);
      setLoading(false)
      //console.log(response.data)
    } catch (error) {
      console.log("errorHome", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleModifCategorie = (code:any, lib:any) => {
    setSaiCategorie({...sai_categorie,
      code_categorie:code,
      libelle:lib
    })

    setShowModal(!showModal)
  }

  const handleSave = async () => {
    if(sai_categorie.libelle === ""){
      Alert.alert('Erreur de saisie', "Veuillez saisir le libellé de la catégorie/particularité")
    }else{
      try {
        setLoading(true)
        const response = await axios.post('https://relationship2.000webhostapp.com/gest_stock/action_categorie.php', sai_categorie)
        console.log(response.data)

        if(response.data === 'success'){
          fetchData()
          setShowModal(!showModal)
          setLoading(!loading)

          setSaiCategorie({...sai_categorie,
            code_categorie:"",
            libelle:""
          })
        }else{
          Alert.alert("Erreur du serveur", `${response.data}`)
          setLoading(!loading)
        }
      } catch (error) {
        Alert.alert("Erreur pendant l'enregistrement", "Une erreur s'est produite, Veuillez réessayer plus tard")
        setLoading(false)
      }
    }
  }

  const handleDelete = () => {
    Alert.alert(
      'Confirmation',
      `Voulez-vous vraiment supprimer la catégorie ${sai_categorie.libelle} ?`,
      [
        {
          text: 'Oui',
          onPress: async () => 
          {
            try {
              setLoading(true)
              const response = await axios.post('https://relationship2.000webhostapp.com/gest_stock/action_categorie.php', {
                code_categorie: sai_categorie.code_categorie,
                libelle: sai_categorie.libelle,
                action: "delete"
              })
              console.log(response.data)
      
              if(response.data === 'success'){
                fetchData()
                setShowModal(!showModal)
                setLoading(!loading)
      
                setSaiCategorie({...sai_categorie,
                  code_categorie:"",
                  libelle:""
                })
              }else{
                Alert.alert("Erreur du serveur", `${response.data}`)
                setLoading(!loading)
              }
            } catch (error) {
              Alert.alert("Erreur pendant la suppression", "Une erreur s'est produite, Veuillez réessayer plus tard")
              setLoading(false)
            }
          }
        },
        {
          text: 'Non',
          onPress: () => console.log('No Pressed')
        }
      ],
      { cancelable: false }
    );
  }

  const refreshing = () => {
    setRefreshing(true)

    fetchData()

    setTimeout(() => {
      setRefreshing(false)
    },2000)
  }

  function renderModal() {
    return(
      <Modal visible={showModal} transparent animationType="fade">
        <View className="flex-1 h-full bg-black/40 items-center justify-center">
          <View className="bg-white p-3 rounded-lg w-[90%]">

            <TouchableOpacity className="mb-4 mt-2" onPress={()=>setShowModal(!showModal)}>
              <EvilIcons name="close" size={27} color="black" />
            </TouchableOpacity>

            {/* Body */}
            <View>
              <View className="mb-2">
                <Text className="font-bold">Code catégorie/particularité</Text>
                <TextInput
                  readOnly
                  className="bg-gray-100 rounded-lg p-2 mt-2"
                  value={sai_categorie.code_categorie}
                  onChangeText={(e) => setSaiCategorie({...sai_categorie, code_categorie:e})}
                />
              </View>

              <View className="mb-2">
                <Text className="font-bold">Libellé de la catégorie/particularité</Text>
                <TextInput
                  className="bg-gray-100 rounded-lg p-2 mt-2"
                  placeholder="Entrer le libellé..."
                  onChangeText={(e) => setSaiCategorie({...sai_categorie, libelle:e})}
                  value={sai_categorie.libelle}
                  multiline={true}
                  returnKeyType="next"
                />
              </View>

              <TouchableOpacity className="mt-2 p-2 items-center justify-center bg-green-400 rounded-lg" onPress={handleSave}>
                {loading ? <ActivityIndicator/> : <Text className="text-white font-bold">Enregistrer</Text>}
              </TouchableOpacity>

              {sai_categorie.code_categorie !="" &&
              
              <TouchableOpacity className="mt-2 p-2 items-center justify-center bg-red-400 rounded-lg" onPress={handleDelete}>
                {loading ? <ActivityIndicator/> : <Text className="text-white font-bold">Supprimer</Text>}
              </TouchableOpacity>
            }
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <View className="flex-1 pt-8 pr-3 pl-3 bg-pink-200">
      {/* <ScrollView className="h-full"> */}
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="left" size={20} color="black" />
          <Text>Retour</Text>
        </TouchableOpacity>

        <View className="p-7">
          <Entypo name="list" size={24} color="black" />
          <Text className="text-xl font-bold mt-3">Liste des catégories/particularités</Text>
        </View>

        <ScrollView className="bg-white h-full rounded-t-lg p-3"
                refreshControl={
                  <RefreshControl
                    refreshing={refresh}
                    onRefresh={refreshing}
                  />
                }
        >
            {loading ? (          
            <View className="">
                <ActivityIndicator size="large" color="#000" />
            </View>) :
            categorie.length === 0 ? (
                <View className="">
                    <Text className="font-bold">Aucune catégorie trouvée</Text>
                </View>
            ) :
            categorie.map((item:any) => {
                return (
                    <View key={item.key} className='p-4 border-b border-slate-300'>
                        <TouchableOpacity className=" flex-row justify-between items-center" onPress={() => handleModifCategorie(item.key,item.value)}>
                            <Text>{item.value}</Text>
                            <AntDesign name='right' size={20} color='black'/>
                        </TouchableOpacity>
                    </View>
                )
            })}
        </ScrollView>

        <View className="absolute bottom-0 right-0 p-2 z-10">
            <TouchableOpacity className="bg-blue-300 p-3 rounded-full shadow-lg flex-row justify-between items-center" onPress={()=>setShowModal(!showModal)}>
                <Text className="text-white mr-2">Ajouter une catégorie</Text>
                <AntDesign name="plus" size={20} color="white" />
            </TouchableOpacity>
        </View>
      {/* </ScrollView> */}
      {renderModal()}
    </View>
  );
};

export default Categories;
