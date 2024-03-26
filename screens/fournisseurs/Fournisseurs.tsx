import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Modal, Alert, TextInput, RefreshControl } from "react-native";
import React, {useEffect, useState} from "react";
import { MaterialCommunityIcons, AntDesign, EvilIcons } from "@expo/vector-icons";
import axios from "axios";

const Fournisseurs = ({ navigation }: any) => {

  const [fournisseurs, setListeFournisseur] = useState([]);
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [sai_fournisseur, setSaiFournisseur] = useState({
    code_fournisseur: "",
    nom_complet: "",
    tel: "",
    societe: "",
    adr_email: "",
    action: "",
  })
  const [refresh, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        "https://relationship2.000webhostapp.com/gest_stock/get_fournisseur.php"
      );
      setListeFournisseur(response.data);
      setLoading(false)
      //console.log(response.data)
    } catch (error) {
      console.log("errorHome", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const empty = () => {
    setSaiFournisseur({...sai_fournisseur,
      code_fournisseur: "",
      nom_complet:"",
      tel: "",
      societe: "",
      adr_email: "",
      action: "",
    })
  }

  const handleModifFournisseur = (code:any) => {
    const lib = fournisseurs.find((f:any) => f.key === code)?.value
    const tel = fournisseurs.find((f:any) => f.key === code)?.tel
    const societe = fournisseurs.find((f:any) => f.key === code)?.societe
    const email = fournisseurs.find((f:any) => f.key === code)?.adr_email
    setSaiFournisseur({...sai_fournisseur,
      code_fournisseur: code,
      nom_complet:lib,
      tel: tel,
      societe: societe,
      adr_email: email
    })

    setShowModal(!showModal)
  }

  const handleSave = async () => {
    if(sai_fournisseur.nom_complet === ""){
      Alert.alert('Erreur de saisie', "Veuillez saisir le nom complet du fournisseur")
    }else{
      try {
        setLoading(true)
        const response = await axios.post('https://relationship2.000webhostapp.com/gest_stock/action_fournisseur.php', sai_fournisseur)
        console.log(response.data)

        if(response.data === 'success'){
          fetchData()
          setShowModal(!showModal)
          setLoading(!loading)

          empty()
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
      `Voulez-vous vraiment supprimer le fournisseur ${sai_fournisseur.nom_complet} ?`,
      [
        {
          text: 'Oui',
          onPress: async () => 
          {
            try {
              setLoading(true)
              const response = await axios.post('https://relationship2.000webhostapp.com/gest_stock/action_fournisseur.php', {
                code_fournisseur: sai_fournisseur.code_fournisseur,
                nom_complet: sai_fournisseur.nom_complet,
                tel: sai_fournisseur.tel,
                societe: sai_fournisseur.societe,
                adr_email: sai_fournisseur.adr_email,
                action: "delete"
              })
              console.log(response.data)
      
              if(response.data === 'success'){
                fetchData()
                setShowModal(!showModal)
                setLoading(!loading)
      
                empty()
              }else{
                Alert.alert("Erreur du serveur", `${response.data}`)
                setLoading(!loading)
              }
            } catch (error) {
              Alert.alert("Erreur pendant l'enregistrement", "Une erreur s'est produite, Veuillez réessayer plus tard")
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
              <View className="mb-2 hidden">
                <Text className="font-bold">Code fournisseur</Text>
                <TextInput
                  readOnly
                  className="bg-gray-100 rounded-lg p-2 mt-2"
                  value={sai_fournisseur.code_fournisseur}
                  onChangeText={(e) => setSaiFournisseur({...sai_fournisseur, code_fournisseur:e})}
                />
              </View>

              <View className="mb-2">
                <Text className="font-bold">Nom & prénoms du fournisseur</Text>
                <TextInput
                  className="bg-gray-100 rounded-lg p-2 mt-2"
                  placeholder="Nom & prénoms"
                  onChangeText={(e) => setSaiFournisseur({...sai_fournisseur, nom_complet:e})}
                  value={sai_fournisseur.nom_complet}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>

              <View className="mb-2">
                <Text className="font-bold">Numéro de téléphone</Text>
                <TextInput
                  className="bg-gray-100 rounded-lg p-2 mt-2"
                  placeholder="07xxxxxxxx"
                  keyboardType="phone-pad"
                  onChangeText={(e) => setSaiFournisseur({...sai_fournisseur, tel:e})}
                  value={sai_fournisseur.tel}
                  returnKeyType="next"
                />
              </View>

              <View className="mb-2">
                <Text className="font-bold">Email</Text>
                <TextInput
                  className="bg-gray-100 rounded-lg p-2 mt-2"
                  placeholder="xyz@domaine.com"
                  keyboardType="email-address"
                  onChangeText={(e) => setSaiFournisseur({...sai_fournisseur, adr_email:e})}
                  value={sai_fournisseur.adr_email}
                  returnKeyType="next"
                />
              </View>

              <View className="mb-2">
                <Text className="font-bold">Société</Text>
                <TextInput
                  className="bg-gray-100 rounded-lg p-2 mt-2"
                  placeholder="Société d'origine"
                  onChangeText={(e) => setSaiFournisseur({...sai_fournisseur, societe:e})}
                  value={sai_fournisseur.societe}
                />
              </View>

              <TouchableOpacity className="mt-2 p-2 items-center justify-center bg-green-400 rounded-lg" onPress={handleSave}>
                {loading ? <ActivityIndicator/> : <Text className="text-white font-bold">Enregistrer</Text>}
              </TouchableOpacity>

              {sai_fournisseur.code_fournisseur !="" &&
              
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
    //
    <View className="flex-1 pt-8 pr-3 pl-3 bg-pink-200">
      <TouchableOpacity
        className="flex-row items-center"
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="left" size={20} color="black" />
        <Text>Retour</Text>
      </TouchableOpacity>

      <View className="p-7">
        <MaterialCommunityIcons
          name="truck-delivery-outline"
          size={20}
          color="black"
        />
        <Text className="text-xl font-bold mt-3">
          Liste des fournisseurs
        </Text>
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
            fournisseurs.length === 0 ? (
                <View className="">
                    <Text className="font-bold">Aucun fournisseur trouvé</Text>
                </View>
            ) :
            fournisseurs.map((item:any) => {
                return (
                    <View key={item.key} className='p-4 border-b border-slate-300'>
                        <TouchableOpacity className=" flex-row justify-between items-center" onPress={() => handleModifFournisseur(item.key)}>
                            <Text>{item.value}</Text>
                            <AntDesign name='right' size={20} color='black'/>
                        </TouchableOpacity>
                    </View>
                )
            })}
      </ScrollView>

      <View className="absolute bottom-0 right-0 p-2 z-10">
            <TouchableOpacity className="bg-blue-300 p-3 rounded-full shadow-lg flex-row justify-between items-center" onPress={()=>[setShowModal(!showModal), empty()]}>
                <Text className="text-white mr-2">Ajouter un fournisseur</Text>
                <AntDesign name="plus" size={20} color="white" />
            </TouchableOpacity>
        </View>

      {renderModal()}
    </View>
  );
};

export default Fournisseurs;
