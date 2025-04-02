import React from 'react'
import {Button} from '../ui/button'
import {Link} from 'react-router-dom'

function Hero() {
  return (
    <div className='flex flex-col items-center gap-9 mx-56'>
      <h1 className='font-extrabold text-[50px] text-center mt-16'>
        <span className='text-[#f56551]'>Discover Your Next Adventure with AI:</span>Personalised Iterinaries At Your FingerTips
      </h1>
      <p className='text-xl text-center text-gray-500'>
        Your personal trip plannernad travel curator,creasing custom iterinaries tailored to your interests and budget.
      </p>
      <Link to={'/create-trip'}>
        <Button>Get Started, it's free</Button>
      </Link>

      <img src='/landingPage.png' className='-mt-20'/>
    </div>
  )
}

export default Hero
