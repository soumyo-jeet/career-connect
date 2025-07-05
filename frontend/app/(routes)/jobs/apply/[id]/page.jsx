"use client"
import React, { useContext, useEffect, useState } from 'react'
import ApplyForm from './_components/applyForm'
import UserContext from '@/app/contexts/User/UserContext'

function page() {
  const userContext = useContext(UserContext)
  const { user, fetchUser, isLoading } = userContext
  const [done, setdone] = useState(false)
  useEffect(() => {
    fetchUser().then(() => setdone(true))
  }, [])
  
  return (
    <div>
      {
        (isLoading || !done) ? <div>Loading...</div> :
        <ApplyForm user={user}/>
      }
    </div>
  )
}

export default page