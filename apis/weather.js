import axios from "axios";
import { apiKey } from "../constants";


const forcastEndPoint = params=> `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`

const locationEndPoint = params=> `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`

const historyEndPoint = params=> `http://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${params.cityName}&dt=${params.date}`

const futureEndPoint = params=> `http://api.weatherapi.com/v1/future.json?key=${apiKey}&q=${params.cityName}&dt=${params.date}`

const marineEndPoint = params=> `http://api.weatherapi.com/v1/marine.json?key=${apiKey}&q=${params.cityName}&days=${params.days}`


const apiCall = async (endpoint)=>{
    const option = {
        'method':'GET',
        "url":endpoint
    }
    try{
        const response = await axios.request(option);
        return response.data;
    }catch(apiError){
        console.log(apiError);
    }
}

export const fetchWeatherApi = params=>{
    return apiCall(forcastEndPoint(params))
}

export const locationApi = params=>{
    return apiCall(locationEndPoint(params))
}

export const historyApi = params=>{
    return apiCall(historyEndPoint(params))
}

export const futureApi = params=>{
    return apiCall(futureEndPoint(params))
}