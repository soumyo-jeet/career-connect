"use client"
import React, { useState } from 'react'
import Jobcontext from './JobContext'
import { toast } from 'sonner'

function JobState(props) {
  const [jobs, setjobs] = useState(null)
  const [filteredJobs, setfilteredJobs] = useState(null)
  const [jobDtls, setjobDtls] = useState(null)
  const [isLoading, setisLoading] = useState(false)
  const [isDtlsLoading, setisDtlsLoading] = useState(false)
  const host = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/api/job`

  const fetchJobs = async () => {
    setisLoading(true)
    try {
      const response = await fetch(`${host}/getall`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('career-connect-token')
        },
        credentials: "include"
      })

      const data = await response.json()
      console.log(data)
      setjobs(data)
    } catch (error) {
      toast.error("May be this action is not allowed or server is down. Please try again later.")
      console.log(error)
    } finally {
      setisLoading(false)
    }
  }


  const fetchFilteredJobs = async () => {
    setisLoading(true)
    try {
      const response = await fetch(`${host}/filter`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('career-connect-token')
        },
        credentials: 'include' 
      })

      const data = await response.json()
      console.log(data)
      setfilteredJobs(data)
    } catch (error) {
      toast.error("May be this action is not allowed or server is down. Please try again later.")
      console.log(error)
    } finally {
      setisLoading(false)
    }
  }

  const createJob = async (formData) => {
    try {
      const response = await fetch(`${host}/create`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('career-connect-token')
        },
        body: JSON.stringify(formData),
        credentials: 'include' 
      })

      const data = await response.json()
      console.log(data)
      return true
    } catch (error) {
      toast.error("May be this action is not allowed or server is down. Please try again later.")
      console.log(error)
    }
  }

  const likeUnlike = async (jobId) => {
    try {
      const response = await fetch(`${host}/likeUnlike/${jobId}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('career-connect-token')
        },
        credentials: 'include' 
      })

      const data = await response.json()
      console.log(data)
      return true
    } catch(error) {
      toast.error("May be this action is not allowed or server is down. Please try again later.")
      console.log(error)
      return false
    }
  }

  const deleteJob = async (jobId) => {
    try {
      const response = await fetch(`${host}/delete/${jobId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('career-connect-token')
        },
        credentials: 'include' 
      })
      
      const data = await response.json()
      console.log(data)
      return true
    } catch(error) {
      toast.error("May be this action is not allowed or server is down. Please try again later.")
      console.log(error)
      console.log(jobId)
      return false
    }
  }

  const visitJob = async (jobId) => {
    setisDtlsLoading(true)
    try {
      const response = await fetch(`${host}/clicks/${jobId}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('career-connect-token')
        },
        credentials: 'include' 
      })

      const data = await response.json()
      console.log(data)
      setjobDtls(data.job)
    } catch (error) {
      toast.error("May be this action is not allowed or server is down. Please try again later.")
      console.log(error)
    } finally {
      setisDtlsLoading(false)
    }
  }

  const applyJob = async (formData, jobId) => {
    console.log(formData, jobId)
    try {
      const response = await fetch(`${host}/apply/${jobId}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('career-connect-token')
        },
        body: JSON.stringify(formData),
        credentials: 'include' 
      })

      const data = await response.json()
      if(data.error) {
        toast.warning(data.error)
        return false
      }
      console.log(data)
      return true
    } catch (error) {
      toast.error("May be this action is not allowed or server is down. Please try again later.")
      console.log(error)
      return false
    }
  }
  


  return (
    <Jobcontext.Provider value={{ fetchJobs, createJob, applyJob, likeUnlike, deleteJob, visitJob, jobDtls, isDtlsLoading, jobs, fetchFilteredJobs, filteredJobs, isLoading }}>
      {props.children}
    </Jobcontext.Provider>
  )
}

export default JobState