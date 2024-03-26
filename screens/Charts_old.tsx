import { View, Text } from "react-native";
import React from "react";
import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';


const Charts = () => {

  const data = [
    { value: 10, label: 'Jan' },
    { value: 20, label: 'Feb' },
    { value: 30, label: 'Mar' },
    { value: 40, label: 'Apr' },
    { value: 50, label: 'May' },
    { value: 60, label: 'Jun' },
    { value: 70, label: 'Jul' },
    { value: 80, label: 'Aug' },
    { value: 90, label: 'Sep' },
    { value: 100, label: 'Oct' },
    { value: 110, label: 'Nov' },
    { value: 120, label: 'Dec' },
  ];
  
  const joursAbreviations = {
    'Lundi': 'Lun',
    'Mardi': 'Mar',
    'Mercredi': 'Mer',
    'Jeudi': 'Jeu',
    'Vendredi': 'Ven',
    'Samedi': 'Sam',
    'Dimanche': 'Dim',
  };
  
  const abreviationJour = (jour) => {
    return joursAbreviations[jour];
  };

  const longueurMax = Math.max(...data.filter(item => item.day).map((item) => abreviationJour(item.day).length));


  return (
    <View style={{ flex: 1, padding: 10, flexDirection: 'row' }}>
        <YAxis
            data={data}
            yAccessor={({ item }) => item.value}
            contentInset={{ top: 30, bottom: 40 }}
            svg={{ fontSize: 10, fill: 'black' }}
            numberOfTicks={10}
            formatLabel={(value) => `${value}`}
        />
        <View style={{ flex: 1 }}>
            <BarChart
                style={{ height: 200 }}
                data={data}
                yAccessor={({ item }) => item.value}
                svg={{ fill: 'rgba(17, 170, 247, 0.8)', borderRadius: 5 }}
                contentInset={{ top: 30, bottom: 30 }}
                gridMin={0}
            >
                <Grid />
            </BarChart>
            <XAxis
                data={data}
                formatLabel={(value, index) => data[index].label}
                contentInset={{ left: 10, right: 10}}
                svg={{ fontSize: 10, fill: 'black', rotation: -90, height: 50 }}
            />
        </View>
    </View>

  )

  // return (
  //   <View style={{ flex: 1, flexDirection: 'row', height: 300 }}>
  //   <YAxis
  //     data={data.map((item) => item.value)}
  //     contentInset={{ top: 20, bottom: 20 }}
  //     svg={{ fill: 'black', fontSize: 13 }}
  //     numberOfTicks={10}
  //   />
  //   <View style={{ flex: 1 }}>
  //     <BarChart
  //       style={{ flex: 1 }}
  //       data={data.map((item) => item.value)}
  //       svg={{ fill: '#3b82f6', cornerRadius: 105 }}
  //       contentInset={{ top: 20, bottom: 20 }}
  //       spacingInner={0.5}
  //       spacingOuter={0.1}
  //     >
  //       <Grid />
  //     </BarChart>
  //     <XAxis
  //       style={{ marginHorizontal: -10 }}
  //       data={data}
  //       formatLabel={(value, index) => abreviationJour(data[index].day)}
  //       contentInset={{ left: 10, right: 10 }}
  //       svg={{ fontSize: 13, fill: 'black' }}
  //     />
  //   </View>
  // </View>
  // );
};

export default Charts;
