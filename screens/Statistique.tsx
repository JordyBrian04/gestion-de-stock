import { View, Text, ScrollView, Dimensions, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';

const Statistique = () => {
  const [articles, setArticle] = useState([]);
  const [data, setData] = useState();
  const [refresh, setRefreshing] = useState(false);

  const getAllArticles = async () => {
    try {
      const response = await axios.get("https://relationship2.000webhostapp.com/gest_stock/get_article_vendu.php");
      setArticle(response.data);
      //console.log(response.data)
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error)
    }
  }

  const getMois = async () => {
    try {
      const response = await axios.get("https://relationship2.000webhostapp.com/gest_stock/get_vente_mois.php");
      setData(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  useEffect(() => {
    getMois()
    getAllArticles()
  }, [])

  const refreshing = () => {
    setRefreshing(true)

    getAllArticles()
    getMois()

    setTimeout(() => {
      setRefreshing(false)
    },2000)
  }


  // const chartData = {
  //   labels: moisLabel,
  //   datasets: [
  //     {
  //       data: [
  //         2000/10000
  //       ]
  //     }
  //   ]
  // };

  //console.log(data.datasets)

  return (
    <View className="flex-1 pt-8 pr-3 pl-3 bg-slate-50">
      <Text className='text-center text-lg font-bold'>Statistique</Text>

      <ScrollView className='p-2 mt-3'
                refreshControl={
                  <RefreshControl
                    refreshing={refresh}
                    onRefresh={refreshing}
                  />
                }
      >
        {/* Vente pas moi */}
        <View className='mb-3'>
          <Text className='text-[18px]'>Ventes par mois</Text>
          <View className='bg-white rounded-lg p-2 mt-3'>
            {data && 
                    <LineChart
                      data={data}
                      width={Dimensions.get("window").width}
                      height={300}
                      formatYLabel={(value) => parseInt(value).toFixed(0)}
                      //fromZero={true}
                      chartConfig={{
                        backgroundGradientFrom: "#ffffff",
                        backgroundGradientTo: "#ffffff",
                        color: (opacity = 1) => `rgba(81, 150, 244, ${opacity})`,
                        labelColor: () => 'rgba(0, 0, 0, 0.8)',
                        strokeWidth: 3,
                      }}
                      bezier
                    />
            }

          </View>
        </View>

        <View className='mb-3'>
          <Text className='text-[18px]'>Articles les plus vendus</Text>
          <View className='bg-white rounded-lg p-2 mt-3'>
            {articles.map((item:any) => {
              return (
                <View key={item.nom_article} className="flex-row bg-white p-3 mb-2 rounded-lg justify-between items-center">
                  <Text className="text-black">{item.nom_article}</Text>
                  <View className="w-[50%] justify-between items-end h-[15] flex-row ">
                        <View className="bg-blue-400 p-1 h-full rounded-r-md rounded-l-md" style={{width:`${Math.min(item.nombre, 85)}%`}}></View>
                        <View className="items-end justify-end text-right ">
                          <Text className="text-[#3b82f6] right-0 bottom-1">{item.nombre}</Text>
                        </View>
                      </View>
                </View>
              )
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Statistique