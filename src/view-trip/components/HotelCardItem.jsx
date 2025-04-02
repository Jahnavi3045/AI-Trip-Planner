import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GetPlaceDetails, PHOTO_REF_URL } from '../../service/GlobalAPI';

function HotelCardItem({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState();
  useEffect(() => {
    hotel && GetPlacePhoto();
  }, [hotel])

  const GetPlacePhoto = async () => {
    const data = { textQuery: hotel.hotelName };

    console.log("Sending request with data:", data);

    try {
      const result = await GetPlaceDetails(data);
      console.log("API Response:", result);

      const photoName = result?.data?.places?.[0]?.photos?.[4]?.name;

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
    <Link to={'https://www.google.com/maps/search/?api=1&query=' + hotel.hotelName + ',' + hotel?.hotelAddress} target='_blank'>
      <div className='hover:scale-110 transition-all cursor-pointer'>
        <img src={photoUrl ? photoUrl : '/placeHolder.png'} key={photoUrl} className='rounded-xl h-[180px] w-full object-cover' />
        <div className='my-2 flex flex-col gap-2'>
          <h2 className='font-medium'>{hotel.hotelName}</h2>
          <h2 className='text-xs text-gray-500'>📍{hotel?.hotelAddress}</h2>
          <h2 className='text-sm'>💰{hotel?.price} currency</h2>
          <h2 className='text-sm'>⭐{hotel?.ratings}</h2>
        </div>
      </div>
    </Link>
  )
}

export default HotelCardItem
