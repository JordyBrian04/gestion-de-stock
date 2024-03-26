import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { Entypo } from '@expo/vector-icons';

const Sidebar = ({props, navigation}:any) => {

  const numCol = 2;
  const ListeMenu = [
    {
      id: '1' ,
      titre: 'Accueil',
      img: require('../img/home.png'),
      page: 'Menu'
    },
    {
      id: '2' ,
      titre: 'Articles',
      img: require('../img/package.png'),
      page: 'Menu'
    },
    {
      id: '3' ,
      titre: 'Fournisseurs',
      img: require('../img/delivery-man.png'),
      page: 'Menu'
    },
    {
      id: '4' ,
      titre: 'Comptabilité',
      img: require('../img/budget.png'),
      page: 'Menu'
    },
    {
      id: '5' ,
      titre: 'Stock',
      img: require('../img/boxes.png'),
      page: 'Menu'
    },
    {
      id: '6' ,
      titre: 'Paramètres',
      img: require('../img/settings.png'),
      page: 'Menu'
    },
  ]


  return (
    <View className='absolute z-20 flex-1 top-0 bottom-0 left-3 w-full h-full pt-8' style={{justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <View className='w-full bg-white rounded-lg'>
            <View className='p-2 justify-end items-end'>
              <TouchableOpacity>
                <Entypo name="circle-with-cross" size={35} color="black" />
              </TouchableOpacity>
            </View>
            <Text className='text-lg font-bold text-center'>Menu</Text>
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
  )
}

export default Sidebar

const styles = StyleSheet.create({})