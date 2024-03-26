import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons' 

const Parametre = ({navigation}:any) => {

  const params = [
    {
      key: 1,
      name: 'Liste des catégories',
      page: 'Categories'
    },
    {
      key: 2,
      name: 'Liste des fournisseurs',
      page: 'Fournisseurs'
    },
  ]

  return (
    <View className='flex-1 pt-8 pr-3 pl-3 bg-pink-200'>

      <View className='p-7'>
        <Ionicons name='settings' size={24} color="black"/>
        <Text className='text-xl font-bold mt-3'>Paramètres</Text>
      </View>



      <View className='bg-white h-full rounded-t-lg p-3'>
        {params.map(param => {
          return (
            <View key={param.key} className='p-4 border-b border-slate-300'>
              <TouchableOpacity className='flex-row justify-between items-center' onPress={() => navigation.navigate(`${param.page}`)}>
                <Text className='text-[13px] font-semibold'>{param.name}</Text>
                <AntDesign name='right' size={20} color='black'/>
              </TouchableOpacity>
            </View>
          )
        })}

        {/* <View className='justify-center items-center p-2 mt-8'>
          <TouchableOpacity className='p-3 bg-red-400/70 w-full items-center rounded-lg'>
            <Text className='text-white text-[14px] font-bold'>Se deconnecter</Text>
          </TouchableOpacity>
        </View> */}
      </View>


    </View>
  )
}

export default Parametre