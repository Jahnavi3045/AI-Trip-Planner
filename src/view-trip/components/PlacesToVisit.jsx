import React from 'react'
import PlaceCardItem from './PlaceCardItem';

function PlacesToVisit({trip}) {
    const itineraryObject = trip.tripData?.itinerary;

    if (!itineraryObject || typeof itineraryObject !== "object") {
        console.error("Itinerary is not an object:", itineraryObject);
        return <p>No itinerary available.</p>;
    }
    const itineraryArray = Object.entries(itineraryObject).map(([day, details]) => ({
        day,
        ...details,
      }));

  return (
    <div>
      <h2 className='font-bold text-lg'>Places To Visit</h2>

      <div>
        {itineraryArray.map((item,index)=>(
            <div>
                <div className='mt-5'>
                    <h2 className='font-medium text-lg'>Day {index+1}</h2>
                    <div className='grid md:grid-cols-2 gap-5'>
                    {
                        item.places.map((place,key)=>(
                            <div className='my-3'>
                                <h2 className='font-medium text-sm text-orange-600'>{item.bestTimeToVisit}</h2>
                                <PlaceCardItem place={place}/>
                            </div>
                        ))
                    }
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  )
}

export default PlacesToVisit
