import React, { useEffect, useState } from 'react'
import { Button } from '../../components/ui/button'
import { IoIosSend } from "react-icons/io";
import { GetPlaceDetails } from '../../service/GlobalAPI';

const PHOTO_REF_URL='https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key='+import.meta.env.VITE_GOOGLE_PLACE_API_KEY;
function InfoSection({trip}) {
  const [photoUrl,setPhotoUrl]=useState();
  useEffect(()=>{
    if (trip && !photoUrl) {
      const delay = setTimeout(() => {
        GetPlacePhoto();
      }, 500); // 500ms delay before calling API
  
      return () => clearTimeout(delay);
    }
  },[trip])

  const GetPlacePhoto = async () => {
    const data = { textQuery: trip?.userSelection?.location?.formatted_address };
  
    console.log("Sending request with data:", data);
  
    try {
      const result = await GetPlaceDetails(data);
      console.log("API Response:", result);
      
      // const photoName = result?.data?.places?.[0]?.photos?.[0]?.name;
      const photoArray = result?.data?.places?.[0]?.photos;
      const photoName = photoArray?.length ? photoArray[0].name : null;
      
      if (photoName) {
        const generatedPhotoUrl = PHOTO_REF_URL.replace("{NAME}", photoName);
        console.log("Generated Photo URL:", generatedPhotoUrl);
        setPhotoUrl(generatedPhotoUrl);
      } else {
        console.error("No photo found in response");
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };
  
  return (
    <div>
      <img src={photoUrl?photoUrl:'/placeHolder.png'} key={photoUrl} className='h-[340px] w-full object-cover rounded-xl'/>

      <div className='flex justify-between items-center'>
        <div className='flex flex-col gap-2 my-5'>
            <h2 className='font-bold text-2xl'>{trip?.userSelection?.location?.formatted_address}</h2>
            <div className='flex gap-5'>
                <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>📅{trip?.userSelection?.noOfDays} Day</h2>
                <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>💰{trip?.userSelection?.budget} Budget</h2>
                <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>🥂No.of travellers: {trip?.userSelection?.traveller} </h2>
            </div>
        </div>
        
        <Button>
            <IoIosSend />
        </Button>
      </div>
    </div>
  )
}

export default InfoSection



// const GetPlacePhoto=async()=>{
  //   const data={
  //     textQuery:trip?.userSelection?.location?.formatted_address
  //   }

  //   const result=await GetPlaceDetails(data).then(resp=>{
  //     console.log(resp.data.places[0].photos[4].name);

  //     const photoUrl=PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[4].name)
  //     console.log(photoUrl)
  //     setPhotoUrl(photoUrl)
  //   })
  // }
