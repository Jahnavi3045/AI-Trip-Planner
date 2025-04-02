import React, { useEffect, useState } from 'react'
import { FaMapLocationDot } from "react-icons/fa6";
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom'
import { GetPlaceDetails, PHOTO_REF_URL } from '../../service/GlobalAPI';

function PlaceCardItem({ place }) {
  const [photoUrl, setPhotoUrl] = useState();
  useEffect(() => {
    if (place && !photoUrl) {
      const delay = setTimeout(() => {
        GetPlacePhoto();
      }, 500); // 500ms delay before calling API
  
      return () => clearTimeout(delay);
    }
  }, [place])

  const GetPlacePhoto = async () => {
    const data = { textQuery: place.placeName};

    console.log("Sending request with data:", data);

    try {
      const result = await GetPlaceDetails(data);
      console.log("API Response:", result);

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
    <Link to={'https://www.google.com/maps/search/?api=1&query=' + place.placeName} target='_blank'>
      <div className='border rounded-xl p-3 mt-2 flex gap-5 hover:scale-110 transition-all shadow-md cursor-pointer'>
      <img 
        src={photoUrl ? photoUrl : '/placeHolder.png'} 
        onError={(e) => e.target.src = '/placeHolder.png'} // Set placeholder if image fails
        key={photoUrl} 
        className='w-[130px] h-[130px] rounded-xl object-cover' 
      />
        <div>
          <h2 className='font-bold text-lg'>{place.placeName}</h2>
          <p className='text-sm text-gray-400'>{place.placeDetails}</p>
          <h2 className='mt-2'>⌚{place.travelTimeFromPrevious}</h2>

        </div>
      </div>
    </Link>
  )
}

export default PlaceCardItem
