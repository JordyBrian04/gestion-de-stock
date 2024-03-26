import React, { useState, useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
//import { PieChart } from "react-native-svg-charts";
import axios from "axios";
import { ProgressChart } from "react-native-chart-kit";

type Props = {
  refresh: boolean;
};

export const StockDonut = ({ refresh }: Props) => {
  const [dataPie, setDataPie] = useState([]);

  const getAllArticles = async () => {
    try {
      const response = await axios.get(
        "https://relationship2.000webhostapp.com/gest_stock/get_article.php"
      );
      //setListeCategorie(response.data);
      const stock = response.data.filter((detail: any) => detail.qte <= 10);
      const articlesToShow = stock.slice(0, 10);
      //console.log(articlesToShow)
      setDataPie(
        response.data.map((article: any) => ({
          value: article.qte,
          label: article.nom_article,
        }))
      );
    } catch (error) {
      console.log("errorDonutData", error);
    }
  };
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    getAllArticles();
  }, []);

  if (refresh) {
    getAllArticles();
  }

  // const dataPie = [
  //   { value: 50, label: "Label 1" },
  //   { value: 10, label: "Label 2" },
  //   { value: 40, label: "Label 3" },
  //   { value: 95, label: "Label 4" },
  //   // Ajoutez d'autres valeurs avec leurs étiquettes ici
  // ];

  const randomColor = () =>
    ("#" + ((Math.random() * 0xffffff) << 0).toString(16) + "000000").slice(
      0,
      7
    );

  // const pieData = dataPie
  //   .filter((data:any) => parseInt(data.value) > 0)
  //   .map((data:any, index) => ({
  //     value: parseInt(data.value),
  //     svg: {
  //       fill: randomColor(),
  //       onPress: () => console.log("press", index),
  //       label: data.label.toString(), // Utilisez la propriété label de chaque objet dans dataPie comme étiquette
  //     },
  //     key: `pie-${index}`,
  //   }));
  // const pieData = {
  //   labels: dataPie
  //     .filter((data:any) => parseInt(data.value) > 0)
  //     .map((data:any) => data.label.toString()), // Utilisez la propriété label de chaque objet dans dataPie comme étiquette
  //   data: dataPie
  //     .filter((data:any) => parseInt(data.value) > 0)
  //     .map((data:any) => parseInt(data.value))
  // };

  // const data = {
  //   labels: dataPie.map((data) => data.label.toString()),
  //   data: dataPie.map((data) => parseInt(data.value)/100),
  // };

  // const legendData = dataPie.map((data:any, index) => ({
  //   color: pieData[index].svg.fill,
  //   label: data.label,
  //   value: parseInt(data.value),
  // }));

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#ffffff",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(255, 0, 152, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  return (
    <View className="flex-1">
      {dataPie
        .filter((item: any) => parseInt(item.value) > 0)
        .sort((a, b) => parseInt(b.value) - parseInt(a.value))
        .map((item: any) => {
          return (
            <View
              key={item.label}
              className="flex-row bg-white p-3 mb-2 rounded-lg justify-between items-center"
            >
              <Text className="text-black">{item.label}</Text>
              <View className="w-[50%] justify-between items-end h-[15] flex-row ">
                <View
                  className=" p-1 h-full rounded-r-md rounded-l-md"
                  style={{ width: `${Math.min(item.value, 85)}%`, backgroundColor: item.value > 10 ? 'rgb(96 165 250)' : 'rgb(220 38 38)' }}
                ></View>
                <View className="items-end justify-end text-right ">
                  <Text className="right-0 bottom-1" style={{color: item.value > 10 ? '#3b82f6' : 'rgb(220 38 38)'}}>
                    {item.value}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}

      {/* <PieChart
        data={pieData}
        style={{ height: 200 }}
        innerRadius={"50%"}
        outerRadius={"70%"}
        labelRadius={"75%"}
      /> */}
      {/* <ProgressChart
  data={data}
  width={screenWidth}
  height={220}
  strokeWidth={16}
  radius={32}
  chartConfig={chartConfig}
  hideLegend={false}
  
/> */}
      <View>
        {/* {legendData.map((item, index) => (
          <View key={index} className="flex-row items-center mt-2">
            <View
              className="w-6 h-6 mr-2"
              style={{ backgroundColor: item.color }}
            />
            <Text>
              {item.label} (En Stock : {item.value})
            </Text>
          </View>
        ))} */}
      </View>
    </View>
  );
};
