import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useEffect, useState } from 'react'
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { theme } from '../theme'
import * as Progress from 'react-native-progress';
import {CalendarDaysIcon, MagnifyingGlassIcon, MapIcon} from "react-native-heroicons/outline"
import {MapPinIcon} from "react-native-heroicons/solid"
import { debounce } from 'lodash'
import { fetchWeatherApi, locationApi } from '../apis/weather'
import { weatherImages } from '../constants'

export default function HomeScreen() {

    const [showSearch,setShowSearch] = useState(false);
    const [locations,setLocation] = useState([]);
    const [weather,setWeather] = useState({});
    const [loading,setLoading] = useState(true);

    const handelLocationPress = (loc)=>{
        setLocation([]);
        setShowSearch(false);
        setLoading(true)
        fetchWeatherApi({
            cityName:loc.name,
            days:'7'
        }).then(data=>{
            setLoading(false)
            setWeather(data)
        })
    }

    const handelSearch = value=>{
        if(value.length>2){
            locationApi({cityName:value}).then(data=>{
                setLocation(data)
            })
        }
    }
    const handelTextDebounce = useCallback(debounce(handelSearch,1500),[])
    const {current,location} = weather;

    useEffect(()=>{
        let city = "Nagpur";
        handelLocationPress({name:city})
    },[])
 

  return (
    <View className="flex-1 relative">
        <StatusBar style='light' />
        <Image blurRadius={70} source={require("../assets/images/bg.png")} className="absolute h-full w-full" />

        {
            loading?<>
            <View className="flex-1 flex-row justify-center items-center">
                <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2"/>
            </View>
            </>:<>
            

        <SafeAreaView className="flex flex-1">
            <View style={{height:"7%"}} className="mx-4 relative z-50" >
                <View className="flex-row justify-end items-center rounded-full" style={{backgroundColor:(showSearch)?theme.bgWhite(0.2):"transparent"}}>  
                    {
                        showSearch?(
                            <TextInput
                            onChangeText={handelTextDebounce}
                            placeholder='Search City'
                            placeholderTextColor={'lightgray'}
                            className="pl-6 h-10 flex-1 text-base text-white"/>
                            ):null
                    }
                    <TouchableOpacity style={{backgroundColor:theme.bgWhite(0.3)}} className="rounded-full p-3 m1" onPress={()=>setShowSearch(!showSearch)}>
                        <MagnifyingGlassIcon size={20} color="white"/>
                    </TouchableOpacity>
                </View>
                {
                    (locations?.length>0 && showSearch)?(
                        <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
                            {
                                locations?.map((loc,index)=>{
                                    let showBorder = index+1 != locations?.length
                                    let borderClass = (showBorder)?"border-b-2 border-b-gray-400":"";
                                    return(
                                        <TouchableOpacity
                                        className={"flex-row items-center border-0 p-3 px-4 mb-1 "+borderClass}
                                        key={index}
                                        onPress={()=>handelLocationPress(loc)}
                                        >
                                            <MapPinIcon size={20} color="gray"/>
                                            <Text className="text-black text-lg ml-2">
                                                {loc?.name}, {loc?.country}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    ):null
                }
            </View>
            
            <View className="mx-4 flex justify-around flex-1 mb-2">
                <Text className="text-white text-center text-2xl font-bold">
                    {location?.name}{(location)?<>, </>:""}
                    <Text className="text-lg font-semibold text=gray-300">
                        {location?.country}
                    </Text>
                </Text>
                <View className="flex-row justify-center">
                    <Image source={weatherImages[current?.condition?.text]}
                    className="w-52 h-52"></Image>
                </View>
                <View className="space-y-2">
                    <Text className="text-center font-bold text-white text-6xl ml-5">
                        {current?.temp_c}{(current)?<>&#176;</>:""}
                    </Text>
                    <Text className="text-center font-bold text-white text-xl tracking-widest">
                        {current?.condition?.text}
                    </Text>
                </View>
                <View className="flex-row justify-between mx-3">
                    <View className="flex-row space-x-2 items-center">
                        <Image source={require("../assets/icons/wind.png")} className="h-6 w-6"/>
                        <Text className="text-white font-semibold text-base">
                            {current?.wind_kph}
                        </Text>
                    </View>
                    <View className="flex-row space-x-2 items-center">
                        <Image source={require("../assets/icons/drop.png")} className="h-6 w-6"/>
                        <Text className="text-white font-semibold text-base">
                            {current?.humidity}%
                        </Text>
                    </View>
                    <View className="flex-row space-x-2 items-center">
                        <Image source={require("../assets/icons/sun.png")} className="h-6 w-6"/>
                        <Text className="text-white font-semibold text-base">
                            {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                        </Text>
                    </View>
                </View>
            </View>

            <View className="mb-2 space-y-3">
                <View className="flex-row items-center mx-5 space-x-2">
                    <CalendarDaysIcon size={22} color={"white"}/>
                    <Text className="text-white text-base">Daily forcast</Text>
                </View>
                <ScrollView
                horizontal
                contentContainerStyle={{paddingHorizontal: 15}}
                showsVerticalScrollIndicator={false}>
                    {weather?.forecast?.forecastday?.map((item,index)=>{
                        let date = new Date(item.date);
                        let option = {weekday:'long'}
                        let dayName = date.toLocaleDateString('en-US',option).split(',')[0];
                        return (
                            
                            <View className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                            style={{backgroundColor:theme.bgWhite(0.15)}}>
                                <Image source={weatherImages[item?.day?.condition?.text]} className=" h-11 w-11"/>
                                <Text className="text-white">{dayName}</Text>
                                <Text className="text-white">{item?.day?.avgtemp_c}{(item!=null)?<>&#176;</>:""}</Text>

                            </View>
                        )
                    })}
                </ScrollView>
            </View>
        </SafeAreaView>
            </>
        }

    </View>
  )
}
