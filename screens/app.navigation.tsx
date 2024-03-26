import { View, Text } from "react-native";
import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from '@expo/vector-icons';

import Home from "./Home";
import Login from "./Login";
import Menu from "./Menu";
import Article from "./Article";
import Vente from "./Vente";
import Parametre from "./Parametre";
import Statistique from "./Statistique";
import Article_action from "./article_action";
import Action_vente from "./action_vente";
import Categories from "./categories/Categories";
import Fournisseurs from "./fournisseurs/Fournisseurs";

const Stack = createStackNavigator();
const TabStack = createBottomTabNavigator()

const screenOptions = ({route}:any) => ({
  tabBarIcon : ({focused}:any) => {
    let icon: any = null;
    const size = 24
    const color = focused ? "#3b82f6" : "#5C5E5F";
  
    switch (route.name) {
      case "Menu":
        icon = "home";
        break;
      case "Article":
        icon = "archive";
        break;
      case "Vente":
        icon = "cart-arrow-down";
        break;
      case "Statistique":
        icon = "chart-bar";
        break;
      case "Parametre":
        icon = "tools";
        break;
    }
  
    return <FontAwesome5 name={icon} size={24} color={color} />;
  }, 

  tabBarActiveTintColor: '#3b82f6',
  tabBarInactiveTintColor: '#5C5E5F',
  tabBarLabelStyle: {
    fontSize: 13,
    display: 'none'
  },
  tabBarStyle: {
    backgroundColor: "#ffffff",
    width: 'full',
    height: 45,
  },
})

const TabStackScreens = () => {
  return (
    <TabStack.Navigator screenOptions={screenOptions}>
      <TabStack.Screen options={{ headerShown: false }} name="Menu" component={Menu} />
      <TabStack.Screen options={{ headerShown: false }} name="Article" component={Article} />
      <TabStack.Screen options={{ headerShown: false }} name="Vente" component={Vente} />
      <TabStack.Screen options={{ headerShown: false }} name="Statistique" component={Statistique} />
      <TabStack.Screen options={{ headerShown: false }} name="Parametre" component={Parametre} />
    </TabStack.Navigator>
  )
}

const Appnavigation = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen options={{headerShown: false}} name="Home" component={Home} />
      <Stack.Screen options={{headerShown: false}} name="Login" component={Login} />
      <Stack.Screen options={{headerShown: false}} name="Tabs" component={TabStackScreens}/>
      <Stack.Screen options={{headerShown: false}} name="Article_action" component={Article_action} />
      <Stack.Screen options={{headerShown: false}} name="Action_vente" component={Action_vente} />
      <Stack.Screen options={{headerShown: false}} name="Categories" component={Categories} />
      <Stack.Screen options={{headerShown: false}} name="Fournisseurs" component={Fournisseurs} />
    </Stack.Navigator>
  </NavigationContainer>
  );
};

export default Appnavigation;
