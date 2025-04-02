import React, { useEffect, useState } from 'react'
import { GetPlaceDetails, PHOTO_REF_URL } from '../../service/GlobalAPI';
import { Link } from 'react-router-dom';

function UserTripCardItem({ trip }) {
    const [photoUrl, setPhotoUrl] = useState();
    useEffect(() => {
        if (trip && !photoUrl) {
            const delay = setTimeout(() => {
                GetPlacePhoto();
            }, 500); // 500ms delay before calling API

            return () => clearTimeout(delay);
        }
    }, [trip])

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
        <Link to={'/view-trip/'+trip?.id} >
            <div className='hover:scale-105 transition-all hover:shadow-md'>
                <img src={photoUrl?photoUrl:'/placeHolder.png'} className="object-cover rounded-xl h-[220px] w-full" />

                <div>
                    <h2 className='font-bold text-lg'>{trip?.userSelection?.location?.formatted_address}</h2>
                    <h2 className='text-sm text-gray-500'>{trip?.userSelection?.noOfDays} Days trip with {trip?.userSelection?.budget} budget</h2>
                </div>
            </div>
        </Link>
    )
}

export default UserTripCardItem
