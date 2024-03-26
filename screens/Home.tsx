import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import COULEUR from '../constantes/coleurs'
import Button from '../components/Button'

const Home = ({navigation}:any) => {

    setTimeout(() => {
        navigation.navigate("Login")
    },5000)

  return (
    <LinearGradient
        style= {{
            flex:1,
            justifyContent: 'center',
            alignItems:'center',
        }}
        colors={[COULEUR.rose, COULEUR.primaire]}
    >
        <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
            <View>
                <Image
                    source={require('../assets/icon.png')}
                    style={{
                        height: 200,
                        width: 200,
                        resizeMode: 'cover'
                    }}
                />
            </View>

            {/* <View style={{
                paddingHorizontal: 22,
                position: 'absolute',
                top: 450,
                width: '100%'
            }}>
                <Button
                    titre="Se connecter"
                    onPress={() => navigation.navigate('Login')}
                    style={{
                        marginTop: 22,
                        with: '100%'
                    }}
                />
            </View> */}
        </View>
    </LinearGradient>
  )
}

export default Home

const styles = StyleSheet.create({

})