import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import COULEUR from '../constantes/coleurs';

const Button = (props:any) => {

    const filledBgColor = props.color || COULEUR.primaire;
    const outlinedColor = COULEUR.blanc;
    const bgColor = props.filled ? filledBgColor : outlinedColor;
    const textColor = props.filled ? COULEUR.blanc : COULEUR.primaire

  return (
    <TouchableOpacity 
        style={{
            ...styles.button, 
            ...{backgroundColor: bgColor}, 
            ...props.style
        }}
        onPress={props.onPress}
        disabled={props.disabled}
    >
        <Text style={{...styles.textBtn, ...{color: textColor}}}>{props.titre}</Text>
    </TouchableOpacity>
  );
}

export default Button

const styles = StyleSheet.create({
    button:{
        paddingBottom: 16,
        paddingVertical: 10,
        borderColor: COULEUR.primaire,
        borderWidth: 2,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textBtn: {
        fontSize: 18,
    }
})