import { View, Text, ScrollView, Modal, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import React, {useState, useEffect} from "react";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { SelectList } from "react-native-dropdown-select-list";
import axios from "axios";

interface Article {
  code_article: string,
  article: string,
  prix: string,
  qte: string,
  prix_total: string,
}

const Action_vente = ({ navigation }: any) => {

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [articles, setListeArticle] = useState([]);
  const [detailVente, setDetailVente] = useState<Article[]>([]);
  const [prixTotal, setPrixTotal] = useState(0)
  const [stockDispo, setStockDispo] = useState(0)
  const [articleData, setArtcileData] = useState({
    code_article: "",
    article: "",
    prix: "0",
    qte: "0",
    prix_total: "0",
  });
  


  const getAllArticles = async () => {
    try {
      const response = await axios.get(
        "https://relationship2.000webhostapp.com/gest_stock/get_article.php"
      );
      setListeArticle(response.data.map((article:any) => ({
        key: article.code_article,
        value: article.nom_article,
        prix: article.prix,
        quant: article.qte
      })))
      //console.log(response.data);
    } catch (error) {
      console.log("errorHome", error);
    }
  }

  useEffect(() => {
    getAllArticles();
  }, []);

    const handleValideVente = async () => {
      try {
        setLoading(true)
        const response = await axios.post("https://relationship2.000webhostapp.com/gest_stock/action_vente.php", {detailVente, prixTotal});
        console.log(response.data)

        if(response.data === 'success') {
          setLoading(false)
          navigation.navigate('Vente')
        }else{
          Alert.alert(
            "Erreur du serveur",
            `${response.data}`
          )
          setLoading(false)
        }
      } catch (error) {
        Alert.alert(
          "Erreur de validation de la vente",
          "Une erreur s'est produite veuillez réessayer plus tard."
        )
        setLoading(false)
        console.error(error)
      }

        //navigation.navigate('Vente')
    }

    const setSelectValue = (val:any) => {
      if(val !== "" && val !== undefined) {
        const prix = articles.find((a:any) => a.value === val)?.prix;
        const code_article = articles.find((a:any) => a.value === val)?.key;
        const stock = articles.find((a:any) => a.value === val)?.quant;
        setArtcileData(prev => ({
          ...prev, 
          prix: prix.toLocaleString('fr-FR'),
          code_article: code_article
        }))
        setPrixValue(articleData.qte)
        setStockDispo(stock)
      }
    }

    const setPrixValue = (val:any) => {
      if(val !== '' && val !== undefined){
        const qte = parseInt(val)
        const prix = parseInt(articleData.prix)

        const prix_total = prix*qte
        setArtcileData(prev => ({
          ...prev, prix_total: prix_total.toLocaleString('fr-FR')
        }))
      }else{
        setArtcileData(prev => ({
          ...prev, prix_total: "0"
        }))
      }
      
    }

    const handleAjoutDetail = () => {
      if(articleData.article === "" || articleData.code_article === "" || articleData.qte === "" || articleData.prix === "" || articleData.prix_total === ""){
        Alert.alert('Veuillez remplir les champs')
      }else{

        if(stockDispo < parseInt(articleData.qte)){
          Alert.alert(
            "Erreur de stock",
            `Le stock du produit ${articleData.article} est de ${stockDispo}. Veuillez saisir une valeur inférieur à cette valeur.`
          )
          return
        }
        //Pour demain : 
        //Qua,d on clique sur ajouter on parcours les données de detailVente si la donnée existe, on la modifie avant de faire setDetailVente
        //Si elle n'existe pas on ajoute avec setDetailVente(prev => [...prev, newData])
        let updated = false;
        let newQte = 0
        let newPrixTotal = 0

        if (detailVente.length == 0){
          const newDetail: Article = {
            code_article: articleData.code_article,
            article: articleData.article,
            prix: articleData.prix,
            qte: articleData.qte,
            prix_total: articleData.prix_total,
          }

          setDetailVente(prev => [...prev, newDetail])
        }else{
          setDetailVente(prev => prev.map((detail:any) => {
            if(detail.code_article === articleData.code_article){
              newQte = parseInt(detail.qte) + parseInt(articleData.qte)
              newPrixTotal = parseInt(detail.prix_total.replace(/\s/g,''), 10) + parseInt(articleData.prix_total.replace(/\s/g,''), 10)

              updated = true
              //setDetailVente(detail => [...detail, qte: newQte, prix_total: newPrixTotal.toLocaleString('fr-FR')]);
              return {...detail, qte: newQte, prix_total: newPrixTotal.toLocaleString('fr-FR')}
            }
            return detail;
          }))
          // setDetailVente(detail => [...detail, updatedData])

          //console.log(updatedData)

          let newData : Article

          if(!updated){
            newData = {
              code_article: articleData.code_article,
              article: articleData.article,
              prix: articleData.prix,
              qte: articleData.qte,
              prix_total: articleData.prix_total,
            }
            setDetailVente(prev => [...prev, newData])
          }

        }

        const value = parseInt(articleData.prix_total.replace(/\s/g,''), 10)
        setPrixTotal(prev => prev+value)
        //console.log(prixTotal, value)

        setArtcileData({
            code_article: '',
            article: '',
            prix: '0',
            qte: '0',
            prix_total: '0',
        });
        
        setShowModal(false)


        // const newDetail: Article = {
        //   code_article: articleData.code_article,
        //   article: articleData.article,
        //   prix: articleData.prix,
        //   qte: articleData.qte,
        //   prix_total: articleData.prix_total,
        // }

        // setDetailVente(prev => 
        //   {
        //     let updated = false
        //     const newData = prev.map((item) => {
        //     if(item.code_article === newDetail.code_article){
        //       updated = true
        //       const newQte = parseInt(item.qte) + parseInt(articleData.qte)
        //       const newPrixTotal = parseInt(item.prix_total.replace(/\s/g,''), 10) + parseInt(articleData.prix_total.replace(/\s/g,''), 10)

        //       const modifDetail: Article = {
        //         code_article: articleData.code_article,
        //         article: articleData.article,
        //         prix: articleData.prix,
        //         qte: newQte.toLocaleString(),
        //         prix_total: newPrixTotal.toLocaleString('fr-FR'),
        //       }
        //       return modifDetail

        //     }else{
        //       return newDetail
        //     }
        //   })

        //   if(!updated){
        //     newData.push(newDetail)
        //   }

        //   return newData
        // })

        // const value = parseInt(articleData.prix_total.replace(/\s/g,''), 10)
        // setPrixTotal(prev => prev+value)
        // console.log(prixTotal, value)

        // setArtcileData({
        //     code_article: '',
        //     article: '',
        //     prix: '0',
        //     qte: '0',
        //     prix_total: '0',
        // });
        
        // setShowModal(false)
      }
    }


    useEffect(() => {
      console.log(detailVente)
    },[detailVente])

    function renderModal() {
      return (
        <Modal visible={showModal} animationType="fade" transparent={true}>
          <View
            className="flex-1 bg-transparent justify-center items-center"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <View className="bg-white p-3 rounded-lg w-[80%]">
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Entypo name="cross" size={35} color="black" />
              </TouchableOpacity>

              <View>
                <View className="mt-3">
                  <Text className="text-lg">Article</Text>
                  <SelectList
                    setSelected={(val: any) =>
                      [setArtcileData({ ...articleData, article: val }), setSelectValue(val)]
                    }
                    defaultOption={{
                      key: articleData.article,
                      value: articleData.article,
                    }}
                    data={articles}
                    save="value"
                    placeholder="Selectonnez un article"
                    searchPlaceholder="Entrez un article"
                    notFoundText="Aucun article"
                  />
                </View>

                <View className="mt-3">
                  <Text className="text-lg">Prix de l'article</Text>
                  <TextInput
                    className="border-2 border-gray-200 h-11 rounded-lg p-2 mt-2"
                    placeholder="Prix de l'article"
                    keyboardType="numeric"
                    onChangeText={(e) =>
                      setArtcileData({ ...articleData, prix:e })
                    }
                    value={articleData.prix}
                    readOnly
                  />
                </View>

                <View className="mt-3">
                  <Text className="text-lg">Quantité de l'article</Text>
                  <TextInput
                    className="border-2 border-gray-200 h-11 rounded-lg p-2 mt-2"
                    placeholder="Quantité de l'article"
                    keyboardType="numeric"
                    onChangeText={(e) =>
                      [setArtcileData({ ...articleData, qte:e }), setPrixValue(e)]
                    }
                    value={articleData.qte}
                  />
                </View>

                <View className="mt-3">
                  <Text className="text-lg">Prix total</Text>
                  <TextInput
                    className="border-2 border-gray-200 h-11 rounded-lg p-2 mt-2"
                    placeholder="Prix total"
                    onChangeText={(e) =>
                      setArtcileData({ ...articleData, prix_total: e })
                    }
                    value={articleData.prix_total}
                    readOnly
                  />
                </View>

                <TouchableOpacity className="mt-3 p-3 bg-green-500 rounded-lg items-center" onPress={() => handleAjoutDetail()}>
                  <Text className="text-white text-[15px]">Ajouter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
      </Modal>
      )
    }
  return (
    <View className="flex-1 pt-8 pr-3 pl-3">
      <ScrollView>
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={35} color="black" />
          </TouchableOpacity>
          <Text className="text-xl ml-2">Enregistrer une vente</Text>
        </View>

        <View className="p-2">
            <View className="flex-row justify-between items-center">
                <Text className="text-[17px]">Liste des articles</Text>
                <TouchableOpacity className="bg-blue-300/100 p-2 rounded-lg flex-row justify-between items-center" onPress={() => setShowModal(true)}>
                    <Text className="text-white text-sm mr-1">Ajouter un article</Text>
                    <AntDesign name="plus" size={14} color="white" />
                </TouchableOpacity>
            </View>

            {/* Table */}
            <View className="border border-slate-300 mb-2 mt-2">
                <View className="flex-row border-b border-slate-300">
                    <Text className="flex p-1 text-left font-bold border-r-2 border-slate-300 w-[45%]">Nom de produit</Text>
                    <Text className="flex p-1 text-center font-bold border-r-2 border-slate-300 w-[20%]">Prix</Text>
                    <Text className="flex p-1 text-center font-bold border-r-2 border-slate-300 w-[10%]">qte</Text>
                    <Text className="flex p-1 text-center font-bold">Prix total</Text>
                </View>

                {detailVente.map((detail) => {
                  return (
                    <View key={detail.code_article} className="flex-row border-b border-slate-300">
                      <Text className="flex p-1 text-left font-light border-r-2 border-slate-300 w-[45%]">{detail.article}</Text>
                      <Text className="flex p-1 text-center font-light border-r-2 border-slate-300 w-[20%] items-center justify-center">{detail.prix}</Text>
                      <Text className="flex p-1 text-center font-light border-r-2 w-[10%] border-slate-300 items-center justify-center">{detail.qte}</Text>
                      <Text className="flex p-1 text-center font-light items-center justify-center">{detail.prix_total}</Text>
                    </View>
                  )
                })}
            </View>

        </View>
        
      </ScrollView>
      <View className="bg-slate-300 p-2 w-full rounded-t-lg">
        <View className="p-1 flex-row items-center justify-between">
            <Text>Total</Text>
            <Text className="text-lg font-bold">{prixTotal.toLocaleString('fr-FR')} FCFA</Text>
        </View>

        <TouchableOpacity className="p-2 bg-green-500 rounded-lg items-center mt-2" onPress={() => handleValideVente()}>
          {loading ? <ActivityIndicator/> : <Text className="text-white text-lg">Valider</Text>}
        </TouchableOpacity>
      </View>

      {renderModal()}
    </View>
  );
};

export default Action_vente;
