import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  MaterialIcons,
  AntDesign,
  FontAwesome5,
  Entypo,
  FontAwesome6,
  EvilIcons,
} from "@expo/vector-icons";
import axios from "axios";

const Article = ({ navigation }: any) => {
  const [showModifModal, setShowModifModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [articles, setListeArticle] = useState([]);
  const [articles1, setListeArticle1] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefreshing] = useState(false);

  const [articleData, setArtcileData] = useState({
    code_article: "",
    nom_article: "",
    desc: "",
    prix: "",
    qte: "",
    code_categ: "",
    prix_fournisseur: "",
    code_fournisseur: "",
    action: "",
  });

  const emptyArticle = () => {
    setArtcileData({...articleData,
      code_article: '',
      nom_article: '',
      prix: "",
      qte: "",
      code_categ: '',
      desc: "",
      prix_fournisseur: '',
      code_fournisseur: '',
      action: "",
    });
  };

  const getAllArticles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://relationship2.000webhostapp.com/gest_stock/get_article.php"
      );
      //setListeCategorie(response.data);
      setListeArticle(response.data);
      setListeArticle1(response.data);
      setLoading(false);
      //console.log(response.data)
    } catch (error) {
      console.log("errorHome", error);
    }
  };

  useEffect(() => {
    getAllArticles();
  }, []);

  const handleSearch = () => {
    const searchData = articles.filter(
      (article: any) =>
        article.nom_article.includes(searchTerm) ||
        article.code_article.includes(searchTerm) ||
        article.libelle.includes(searchTerm)
    );

    setListeArticle(searchData);
  };

  const refreshing = () => {
    setRefreshing(true);

    getAllArticles();

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const getArticleData = (code: any) => {
    emptyArticle()
    const nom = articles1.find(
      (a: any) => a.code_article === code
    )?.nom_article;

    const desc = articles1.find(
      (a: any) => a.code_article === code
    )?.description;

    const prix = articles1.find((a: any) => a.code_article === code)?.prix;

    const prix_four = articles1.find(
      (a: any) => a.code_article === code
    )?.prix_fournisseur;

    const qte = articles1.find((a: any) => a.code_article === code)?.qte;

    const code_cat = articles1.find(
      (a: any) => a.code_article === code
    )?.code_categorie;

    const code_four = articles1.find(
      (a: any) => a.code_article === code
    )?.code_fournisseur;

    setArtcileData({
      ...articleData,
      code_article: code,
      nom_article: nom,
      prix: prix,
      qte: qte,
      code_categ: code_cat,
      prix_fournisseur: prix_four,
      code_fournisseur: code_four,
      desc: desc
    });

    Alert.alert(
      'Confirmation',
      `Que voulez-vous faire ?`,
      [
        {
          text: 'Entrée de stock',
          onPress: async () => setShowStockModal(!showStockModal)
        },
        {
          text: 'Modifier les informations',
          onPress: () => setShowModifModal(!showModifModal)
        }
      ],
      { cancelable: false }
    );
  };

  const handleArticleStock = async () => {

      try {
        setLoading(true);

        const response = await axios.post(
          "https://relationship2.000webhostapp.com/gest_stock/action_article.php",
          {
            code_article: articleData.code_article,
            nom_article: articleData.nom_article,
            desc: articleData.desc,
            prix: articleData.prix,
            qte: articleData.qte,
            code_categorie: articleData.code_categ,
            prix_fournisseur: articleData.prix_fournisseur,
            code_fournisseur: articleData.code_fournisseur,
            action: "stock_update"
          }
        );
        if (response.data == "success") {
          setLoading(false);
          setShowStockModal(!showStockModal)
          emptyArticle()
          getAllArticles()
        }
        console.log(response.data);
      } catch (error) {
        console.log("errorAddArticle", error);
        setLoading(false);
      }

  };

  const handleArticle = async () => {

      try {
        setLoading(true);

        const response = await axios.post(
          "https://relationship2.000webhostapp.com/gest_stock/action_article.php",
          {
            code_article: articleData.code_article,
            nom_article: articleData.nom_article,
            desc: articleData.desc,
            prix: articleData.prix,
            qte: articleData.qte,
            code_categorie: articleData.code_categ,
            prix_fournisseur: articleData.prix_fournisseur,
            code_fournisseur: articleData.code_fournisseur,
          }
        );
        if (response.data == "success") {
          setLoading(false);
          setShowModifModal(!showModifModal)
          emptyArticle()
          getAllArticles()
        }
        console.log(response.data);
      } catch (error) {
        console.log("errorAddArticle", error);
        setLoading(false);
      }

  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmation',
      `Voulez-vous vraiment supprimer le produit ${articleData.nom_article} ?`,
      [
        {
          text: 'Oui',
          onPress: async () => 
          {
            try {
              setLoading(true)
              const response = await axios.post(          
              "https://relationship2.000webhostapp.com/gest_stock/action_article.php",
              {
                code_article: articleData.code_article,
                nom_article: articleData.nom_article,
                desc: articleData.desc,
                prix: articleData.prix,
                qte: articleData.qte,
                code_categorie: articleData.code_categ,
                prix_fournisseur: articleData.prix_fournisseur,
                code_fournisseur: articleData.code_fournisseur,
                action: 'delete'
              })
              console.log(response.data)
      
              if(response.data === 'success'){
                getAllArticles()
                setShowModifModal(!showModifModal)
                setLoading(!loading)
      
                emptyArticle()
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

  function renderModifModal() {
    return (
      <Modal visible={showModifModal} animationType="fade" transparent>
        <View className="flex-1 bg-black/40 items-center justify-center">
          <View className="bg-white p-2 rounded-lg w-[90%]">
            <TouchableOpacity
              className="mb-4 mt-2"
              onPress={() => setShowModifModal(!showModifModal)}
            >
              <EvilIcons name="close" size={27} color="black" />
            </TouchableOpacity>

            <View>
              <View className="mb-2">
                <Text className="font-bold">Nom du produit</Text>
                <TextInput
                  className="bg-gray-100 rounded-lg p-2 mt-2"
                  value={articleData.nom_article}
                  onChangeText={(e) =>
                    setArtcileData({ ...articleData, nom_article: e })
                  }
                />
              </View>

              <View className="mb-2">
                <Text className="font-bold">Description du produit</Text>
                <TextInput
                  className="bg-gray-100 rounded-lg p-2 mt-2"
                  value={articleData.desc}
                  onChangeText={(e) =>
                    setArtcileData({ ...articleData, desc: e })
                  }
                  multiline
                  returnKeyType="route"
                />
              </View>

              <View className="mb-2">
                <Text className="font-bold">Prix</Text>
                <TextInput
                  className="bg-gray-100 rounded-lg p-2 mt-2"
                  value={articleData.prix}
                  onChangeText={(e) =>
                    setArtcileData({ ...articleData, prix: e })
                  }
                  keyboardType="numeric"
                />
              </View>

              <View className="mb-2">
                <Text className="font-bold">Prix du fournisseur</Text>
                <TextInput
                  className="bg-gray-100 rounded-lg p-2 mt-2"
                  value={articleData.prix_fournisseur}
                  onChangeText={(e) =>
                    setArtcileData({ ...articleData, prix_fournisseur: e })
                  }
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity className="mt-2 p-2 items-center justify-center bg-green-400 rounded-lg" onPress={handleArticle}>
                {loading ? (
                  <ActivityIndicator />
                ) : (
                  <Text className="text-white font-bold">Enregistrer</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity className="mt-2 p-2 items-center justify-center bg-red-400 rounded-lg" onPress={handleDelete}>
                {loading ? (
                  <ActivityIndicator />
                ) : (
                  <Text className="text-white font-bold">Supprimer</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  function renderStockModal() {
    return (
      <Modal visible={showStockModal} animationType="fade" transparent>
        <View className="flex-1 bg-black/40 items-center justify-center">
          <View className="bg-white p-2 rounded-lg w-[90%]">
            <TouchableOpacity
              className="mb-4 mt-2"
              onPress={() => setShowStockModal(!showStockModal)}
            >
              <EvilIcons name="close" size={27} color="black" />
            </TouchableOpacity>

            <View>
              <View className="mb-2">
                <Text className="font-bold">Nom du produit</Text>
                <TextInput
                readOnly
                  className="bg-gray-100 rounded-lg p-2 mt-2"
                  value={articleData.nom_article}
                  onChangeText={(e) =>
                    setArtcileData({ ...articleData, nom_article: e })
                  }
                />
              </View>

              <View className="mb-2">
                <Text className="font-bold">Stock à ajouter</Text>
                <TextInput
                  className="bg-gray-100 rounded-lg p-2 mt-2"
                  value={articleData.qte}
                  onChangeText={(e) =>
                    setArtcileData({ ...articleData, qte: e })
                  }
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity className="mt-2 p-2 items-center justify-center bg-green-400 rounded-lg" onPress={handleArticleStock}>
                {loading ? (
                  <ActivityIndicator />
                ) : (
                  <Text className="text-white font-bold">Enregistrer</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View className="flex-1 pt-8 pr-3 pl-3 bg-pink-200">
      <View className="p-5">
        <FontAwesome6 name="boxes-stacked" size={24} color="black" />
        <Text className="text-xl font-bold mt-3">Liste des articles</Text>

        <View className="mt-2 flex-row justify-between items-center">
          <TextInput
            placeholder="Entrez un produit à rechercher"
            className="bg-white p-2 rounded-lg w-[90%]"
            onChangeText={(text) => {
              setSearchTerm(text);

              if (text.trim() !== "") {
                const searchData = articles.filter(
                  (article: any) =>
                    article.nom_article.includes(text) ||
                    article.code_article.includes(text) ||
                    article.libelle.includes(text)
                );

                setListeArticle(searchData);
              } else {
                // Si le texte est vide, réinitialisez la liste des articles à afficher
                setListeArticle(articles1);
              }
            }}
            value={searchTerm}
          />
          <TouchableOpacity className="p-2">
            <AntDesign name="search1" size={26} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="bg-white h-full rounded-t-lg p-3"
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={refreshing} />
        }
      >
        {/* <View className="h-full "> */}
        {loading ? (
          <View className="">
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : (
          articles.map((article: any) => {
            const currency = article.prix as number;
            return (
              <View
                key={article.code_article}
                className="border border-slate-300 bg-transparent m-1 rounded-lg p-2 "
              >
                <TouchableOpacity className="flex-row items-center" onPress={() => getArticleData(article.code_article)}>
                  <View className="bg-slate-200 items-center justify-center rounded-lg mr-3 p-5">
                    <FontAwesome5 name="archive" size={18} color="black" />
                  </View>
                  <View>
                    <Text className="font-bold text-xl text-ellipsis">
                      {article.nom_article}
                    </Text>
                    <Text className="font-light text-sm italic text-ellipsis">
                      {article.libelle}, {article.description}
                    </Text>
                    <View className="flex-row justify-between items-center mt-2 w-[80%]">
                      <View className="flex-row justify-between items-center">
                        <View className="w-6 h-6 items-center justify-center rounded-lg mr-2">
                          <FontAwesome5 name="boxes" size={18} color="black" />
                        </View>
                        <Text>{article.qte}</Text>
                      </View>

                      <View className="flex-row justify-between items-center">
                        <View className="w-6 h-6 items-center justify-center rounded-lg mr-2">
                          <MaterialIcons
                            name="currency-franc"
                            size={18}
                            color="black"
                          />
                        </View>
                        <Text>{currency.toLocaleString("fr-FR")} FCFA</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })
        )}
        {/* </View> */}
      </ScrollView>

      <View className="absolute bottom-0 right-0 p-2 z-10">
        <TouchableOpacity
          className="bg-blue-300/60 p-3 rounded-full flex-row justify-between items-center focus:bg-green-500"
          onPress={() => navigation.navigate("Article_action")}
        >
          <Text className="text-white mr-2">Ajouter un article</Text>
          <AntDesign name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>
      {/* <View
        className="w-full flex-row gap-4 justify-between"
        style={{ justifyContent: "flex-end" }}
      >
        <TouchableOpacity
          className="flex-row bg-blue-400 rounded-lg p-4 justify-between items-center"
          onPress={() => {setShowArticleModal(true); emptyArticle}}
        >
          <Text className="text-white font-bold">Ajouter un article</Text>
          <AntDesign name="plus" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="flex-row bg-green-300 rounded-lg p-4 justify-between items-center">
          <Text className="mr-3">Fichier excel</Text>
          <FontAwesome5 name="file-excel" size={24} color="green" />
        </TouchableOpacity>
      </View> */}
      {renderModifModal()}
      {renderStockModal()}
    </View>
  );
};

export default Article;
