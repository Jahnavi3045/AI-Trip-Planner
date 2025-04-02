import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../service/firebaseConfig';
import InfoSection from '../components/infoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';

function ViewTrip() {
    const {tripId}=useParams();
    const [trip,setTrip]=useState([]);
    useEffect(()=>{
        tripId&&getTripData();
    },[tripId])
    const getTripData=async()=>{
        const docRef=doc(db,'AITrips',tripId)
        const docSnap=await getDoc(docRef)

        if(docSnap.exists()){
            console.log("document:",docSnap.data())
            setTrip(docSnap.data());
        }
        else{
            console.log("no document")
            toast('NO trip found!')
        }
    }
  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
      <InfoSection trip={trip}/>
      <Hotels trip={trip}/>
      <PlacesToVisit trip={trip}/>
      <Footer trip={trip}/>
    </div>
  )
}

export default ViewTrip
