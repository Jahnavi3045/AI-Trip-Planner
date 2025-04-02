import React, { useEffect, useState } from 'react'
// import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { GoogleMap, useLoadScript, Autocomplete } from '@react-google-maps/api';
import {Input} from '../components/ui/input.jsx'
import {Button} from '../components/ui/button.jsx'
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList } from '../constants/options.jsx';
import { toast } from 'sonner';
import { chatSession } from '../service/AIModal.jsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../service/firebaseConfig.jsx';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate} from 'react-router-dom';

function CreateTrip() {
  // const [place,setPlace]=useState();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
    libraries: ['places']
  });

  const [autocomplete, setAutocomplete] = useState(null);
  const [openDialog,setOpenDialog]=useState(false);
  const [loading,setLoading]=useState(false);

  const navigate=useNavigate();

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      console.log('Selected Place:', place);
      handleInputChange('location',place)
    }
  };

  const [formData,setFormData]=useState({});
  const handleInputChange=(name,value)=>{
    console.log(`Updating ${name} to`, value);
      setFormData((formData)=>({
        ...formData,
        [name]:value
      }))
  }
  useEffect(()=>{
    console.log(formData)
  },[formData])

  const login=useGoogleLogin({
    onSuccess:(codeResp)=>getUserProfile(codeResp),
    onError:(err)=>console.log(err)
  })

  const onGenerateTrip=async()=>{

    const user=localStorage.getItem('user')
    if(!user){
      setOpenDialog(true);
      return;
    }
    if(formData?.noOfDays>5 && !formData?.location || !formData?.budget || !formData?.traveller){
      toast("Please fill all the details!!!")
      return;
    }

    setLoading(true);

    const FINAL_PROMPT=AI_PROMPT
    .replace('{location}',formData?.location?.formatted_address)
    .replace('{totalDays}',formData?.noOfDays)
    .replace('{traveller}',formData?.traveller)
    .replace('{budget}',formData?.budget)
    .replace('{totalDays}',formData?.noOfDays)

    console.log(FINAL_PROMPT)

    const result=await chatSession.sendMessage(FINAL_PROMPT)
    console.log(result?.response?.text())
    setLoading(false);
    saveAITrip(result?.response?.text())
  }

  const saveAITrip=async(tripData)=>{
    setLoading(true);
    const user=JSON.parse(localStorage.getItem('user'));
    const docID=Date.now().toString();

    let sanitizedFormData = JSON.parse(JSON.stringify(formData));

    if (sanitizedFormData.location?.geometry?.location) {
      sanitizedFormData.location.geometry.location = {
        lat: sanitizedFormData.location.geometry.location?.lat||null, 
        lng: sanitizedFormData.location.geometry.location?.lng || null,
      };
    }
    if (sanitizedFormData.location?.geometry?.viewport) {
      sanitizedFormData.location.geometry.viewport = {
        northeast: {
          lat: sanitizedFormData.location.geometry.viewport.getNorthEast?.lat||null,
          lng: sanitizedFormData.location.geometry.viewport.getNorthEast?.lng||null,
        },
        southwest: {
          lat: sanitizedFormData.location.geometry.viewport.getSouthWest?.lat||null,
          lng: sanitizedFormData.location.geometry.viewport.getSouthWest?.lng||null,
        },
      };
    }
    try {
      await setDoc(doc(db, "AITrips", docID), {
        userSelection: sanitizedFormData, // Use the sanitized version
        tripData: JSON.parse(tripData),
        userEmail: user?.email,
        id: docID,
      });
  
      console.log("Trip saved successfully!");
    } catch (error) {
      console.error("Error saving trip:", error);
    }
    // await setDoc(doc(db, "AITrips", docID), {
    //   userSelection:sanitizedFormData,
    //   tripData:JSON.parse(tripData),
    //   userEmail:user?.email,
    //   id:docID
    // });
    setLoading(false);
    navigate('/view-trip/'+docID)
  }

  const getUserProfile=(tokenInfo)=>{
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,{
      headers:{
        Authorization:`Bearer ${tokenInfo?.access_token}`,
        Accept:'Application/json'
      }
    }).then((resp)=>{
      console.log(resp)
      localStorage.setItem('user',JSON.stringify(resp.data))
      setOpenDialog(false);
      onGenerateTrip()
    })
  }
  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>Tell us your travel preferences🏕️🌴</h2>
      <p className='mt-3 text-gray-500 text-xl'> Just provide us some basic information, and our trip planner will generate a customised iterinary based on your preferences.</p>


      <div className='mt-20'>
        <div>
          <h2 className='text-xl my-3 font-medium'>What is the destination of choice?</h2>
          
          {isLoaded ? (
          <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged} >
            <input
              type="text"
              placeholder="Enter your destination"
              className="border rounded-md p-2 w-full"
            />
          </Autocomplete>
        ) : (
          <p>Loading Maps...</p>
        )}
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>How many days are you planning for the trip?</h2>
          <Input placeholder={'Ex:3'} type="number" onChange={(e)=>handleInputChange('noOfDays',e.target.value)}/>
        </div>
      </div>

      <div>
        <h2 className='text-xl my-3 font-medium'>What is your Budget?</h2>
        <div className='grid grid-cols-3 gap-5 mt-5'>
          {SelectBudgetOptions.map((item,index)=>(
            <div key={index} 
              onClick={()=>handleInputChange('budget',item.title)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${formData?.budget==item.title && 'shadow-lg border-black'}`}
              >
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='font-bold text-lg'>{item.title}</h2>
              <h2 className='text-sm text-gray-500'>{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className='text-xl my-3 font-medium'>Who do you plan on tarvelling with on your next adventure?</h2>
        <div className='grid grid-cols-3 gap-5 mt-5'>
          {SelectTravelesList.map((item,index)=>(
            <div key={index} 
              onClick={()=>handleInputChange('traveller',item.people)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${formData?.traveller==item.people && 'shadow-lg border-black'}`}
              >
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='font-bold text-lg'>{item.title}</h2>
              <h2 className='text-sm text-gray-500'>{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className='my-10 justify-end flex'>
          <Button onClick={onGenerateTrip} disabled={loading}>
            {loading?<AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' />
            :'Generate Trip'}
          </Button>
      </div>

      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src='/logo.svg'/>
              <h2 className='font-bold text-lg mt-7'>Sign In With Google</h2>
              <p>Sign in to the app with google authentication securely.</p>

              <Button 
                onClick={login} 
                className="w-full mt-5 flex gap-4 items-center"
              >                  
                <FcGoogle className='h-8 w-8'/>
                Sign In With Google  
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
    
  )
}

export default CreateTrip


{/* <GooglePlacesAutocomplete
            apiKey="import.meta.env.VITE_GOOGLE_PLACE_API_KEY"
            selectProps={{
              place,
              onChange:(val)=>{setPlace(val);handleInputChange('location',val)}
            }}
          /> */}
