import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet
} from "react-native";
import React, { useEffect, useState } from "react";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SelectList } from "react-native-dropdown-select-list";
import axios from "axios";
import { BarCodeScanner } from "expo-barcode-scanner";
import { CameraView, Camera } from "expo-camera/next";

const Article_action = ({ navigation }: any) => {
  const [categorie, setListeCategorie] = useState([]);
  const [fournisseur, setListeFournisseur] = useState([]);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanModal, setScanModal] = useState(false);

  // const askCameraPermission = () => {
  //   (async () => {
  //     //const { status } = await BarCodeScanner.requestPermissionsAsync();
  //     const { status } = await Camera.requestCameraPermissionsAsync();
  //     setHasPermission(status === "granted");
  //   })();
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://relationship2.000webhostapp.com/gest_stock/get_categorie.php"
        );
        setListeCategorie(response.data);
        //console.log(response.data)
      } catch (error) {
        console.log("errorHome", error);
      }
    };

    const fetchFournisseurData = async () => {
      try {
        const response = await axios.get(
          "https://relationship2.000webhostapp.com/gest_stock/get_fournisseur.php"
        );
        setListeFournisseur(response.data);
        //console.log(response.data)
      } catch (error) {
        console.log("errorHome", error);
      }
    };

    fetchData();
    fetchFournisseurData();
    // askCameraPermission();
  }, []);

  const handleBarCadeScanner = ({ type, data }: any) => {
    setScanned(true);
    Alert.alert(`data : ${data}`);
  };

  const handleScan = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");

    if (hasPermission === null) {
      console.log("Permission asked...");
    }

    setScanned(false)
  }



  // if (hasPermission === false) {
  //   askCameraPermission();
  // }

  const [articleData, setArtcileData] = useState({
    code_article: "",
    nom_article: "",
    desc: "",
    prix: 0,
    qte: 0,
    code_categ: "",
    prix_fournisseur: 0,
    code_fournisseur: "",
    action: ""
  });

  // const setCategorieCode = (val:any) => {
  //   if(val !== ""){
  //     const code_cat = categorie.find((c:any) => c.value === val)?.key
  //     setArtcileData(prev => ({
  //       ...prev,
  //       code_categ:code_cat
  //     }))
  //   }
  // }

  // const setFournisseurCode = (val:any) => {
  //   if(val !== ""){
  //     const code_four = fournisseur.find((c:any) => c.value === val)?.key
  //     setArtcileData(prev => ({
  //       ...prev,
  //       code_fournisseur:code_four
  //     }))
  //   }
  // }

  function renderModal() {
    return (
      <Modal visible={scanModal} animationType="fade" transparent={true}>
        <View
          className="flex-1 bg-transparent  justify-center items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View className="p-2 justify-end items-end float-right">
            <TouchableOpacity onPress={() => setScanModal(false)}>
              <Entypo name="circle-with-cross" size={35} color="black" />
            </TouchableOpacity>
          </View>

          <View className="items-center w-80 h-80 justify-center overflow-hidden rounded-lg bg-black/10">
            {/* <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCadeScanner}
              style={{ width: 600, height: 400 }}
            /> */}
                  <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCadeScanner}
        // barcodeScannerSettings={{
        //   barcodeTypes: ["qr", "pdf417"],
        // }}
        style={StyleSheet.absoluteFillObject}
      />
          </View>
        </View>
      </Modal>
    );
  }

  const handleArticle = async () => {
    if (
      articleData.nom_article === "" ||
      articleData.prix === 0 ||
      articleData.code_categ === "" ||
      articleData.prix_fournisseur === 0 ||
      articleData.code_fournisseur === "" ||
      articleData.desc === "" 
    ) {
      Alert.alert("Veuillez saisir les champs vides");
    } else {
      try {
        setLoading(true);

        const code_cat = categorie.find((c:any) => c.value === articleData.code_categ)?.key
        const code_four = fournisseur.find((c:any) => c.value === articleData.code_fournisseur)?.key

        const response = await axios.post(
          "https://relationship2.000webhostapp.com/gest_stock/action_article.php",
          {
            code_article: articleData.code_article,
            nom_article: articleData.nom_article,
            desc: articleData.desc,
            prix: articleData.prix,
            qte: articleData.qte,
            code_categorie: code_cat,
            prix_fournisseur: articleData.prix_fournisseur,
            code_fournisseur: code_four,
            action: articleData.action
          }
        );
        if (response.data == "success") {
          navigation.goBack();
          setLoading(false);
        }
        console.log(response.data);
      } catch (error) {
        console.log("errorAddArticle", error);
        setLoading(false);
      }
    }
  };

  return (
    <View className="flex-1 pt-8 pr-3 pl-3">
      <ScrollView>
        <View className="">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={35} color="black" />
            </TouchableOpacity>
            <Text className="text-2xl ml-2">Formulaire d'un article</Text>
          </View>

          <View>
            <View className="mt-3">
              <Text className="text-lg">Code de l'article</Text>

              <View className="flex-row items-center justify-between mt-2">
                <TextInput
                  className="bg-gray-200 h-11 rounded-lg p-2 w-[90%]"
                  placeholder=""
                  onChangeText={(e) =>
                    setArtcileData({ ...articleData, code_article: e })
                  }
                  value={articleData.code_article}
                  
                  //autoCapitalize="words"
                />

                {/* <TouchableOpacity
                  onPress={() => {
                    handleScan();
                    setScanModal(true);
                  }}
                >
                  <MaterialCommunityIcons
                    name="barcode-scan"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity> */}
              </View>
            </View>

            <View className="mt-3">
              <Text className="text-lg">Nom de l'article</Text>
              <TextInput
                className="border-2 border-gray-200 h-11 rounded-lg p-2 mt-2"
                placeholder="Savon de Marseille"
                onChangeText={(e) =>
                  setArtcileData({ ...articleData, nom_article: e })
                }
                value={articleData.nom_article}
                autoCapitalize="sentences"
              />
            </View>

            <View className="mt-3">
              <Text className="text-lg">Description de l'article</Text>
              <TextInput
                className="border-2 border-gray-200 h-[100px] rounded-lg pl-2 mt-2"
                placeholder="Description"
                onChangeText={(e) =>
                  setArtcileData({ ...articleData, desc: e })
                }
                value={articleData.desc}
                autoCapitalize="sentences"
              />
            </View>

            <View className="mt-3">
              <Text className="text-lg">Prix de l'article</Text>
              <TextInput
                className="border-2 border-gray-200 h-11 rounded-lg p-2 mt-2"
                placeholder="Prix de l'article"
                keyboardType="numeric"
                onChangeText={(e) =>
                  setArtcileData({ ...articleData, prix: parseFloat(e) || 0 })
                }
                value={articleData.prix.toString()}
              />
            </View>

            <View className="mt-3">
              <Text className="text-lg">Quantité de l'article</Text>
              <TextInput
                className="border-2 border-gray-200 h-11 rounded-lg p-2 mt-2"
                placeholder="Quantité de l'article"
                keyboardType="numeric"
                onChangeText={(e) =>
                  setArtcileData({ ...articleData, qte: parseFloat(e) || 0 })
                }
                value={articleData.qte.toString()}
              />
            </View>

            <View className="mt-3">
              <Text className="text-lg mb-2">Catégorie de l'article</Text>
              <SelectList
                setSelected={(val: any) =>
                  setArtcileData({ ...articleData, code_categ: val })
                }
                defaultOption={{
                  key: articleData.code_categ,
                  value: articleData.code_categ,
                }}
                data={categorie}
                save="value"
                placeholder="Selectonnez une catégorie"
                searchPlaceholder="Entrez une catégorie"
                notFoundText="Aucune catégorie"
              />
            </View>

            <View className="mt-3">
              <Text className="text-lg">Prix du fournisseur</Text>
              <TextInput
                className="border-2 border-gray-200 h-11 rounded-lg p-2 mt-2"
                placeholder="Prix du fournisseur"
                keyboardType="numeric"
                onChangeText={(e) =>
                  setArtcileData({
                    ...articleData,
                    prix_fournisseur: parseFloat(e) || 0,
                  })
                }
                value={articleData.prix_fournisseur.toString()}
              />
            </View>

            <View className="mt-3">
              <Text className="text-lg mb-2">Fournisseur</Text>
              <SelectList
                setSelected={(val: any) =>
                  setArtcileData({ ...articleData, code_fournisseur: val })
                }
                data={fournisseur}
                defaultOption={{
                  key: articleData.code_fournisseur,
                  value: articleData.code_fournisseur,
                }}
                save="value"
                placeholder="Sélectonnez un fournisseur"
                searchPlaceholder="Entrez le nom d'un fournisseur"
                notFoundText="Aucun fournisseur"
              />
            </View>

            <TouchableOpacity
              className="p-2 bg-green-500 mt-3 justify-center items-center rounded-lg"
              onPress={handleArticle}
            >
              {loading ? (
                <ActivityIndicator />
              ) : (
                <Text className="text-white text-lg font-semibold">
                  Enregistrer l'article
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {renderModal()}
    </View>
  );
};

export default Article_action;
