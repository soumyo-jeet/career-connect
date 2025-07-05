"use client"
import Jobcontext from '@/app/contexts/Job/JobContext'
import React, { useContext, useEffect, useState } from 'react'
import JobDetails from './_components/JobDtls'
import UserContext from '@/app/contexts/User/UserContext'
import { useRouter } from 'next/navigation'

function page() {
    const jobContext = useContext(Jobcontext)
    const {jobDtls, isDtlsLoading, visitJob, jobs} = jobContext
    const userContext = useContext(UserContext)
    const { isLoading, fetchUser, user } = userContext
    const router = useRouter()
    
    const [done, setdone] = useState(false)

    useEffect(() => {
        const pathParts = window.location.pathname.split("/")
        const id = pathParts[pathParts.length - 1]
        fetchUser()
        visitJob(id).then(() => setdone(true)).catch((error) => console.log(error))
    }, [])

    useEffect(() => {
        if(!jobDtls) router.push("/dashboard")
    }, [jobs])
    

        return (
    <div>{
        (isDtlsLoading || isLoading || !done || !user) ? 
        <div>Loading...</div> : !jobDtls ? 
        <div>Job Not Found</div> : 
        <JobDetails job={jobDtls} user={user}/>
    }</div>
  )
}

export default page