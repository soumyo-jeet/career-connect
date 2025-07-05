"use client"
import React, { useState } from 'react'
import { toast } from 'sonner'
import ApplicationContext from './ApplicationContext'

function ApplicationState(props) {
    const [application, setapplication] = useState(null)
    const [allApplications, setallApplications] = useState(null)
    const [isLoading, setisLoading] = useState(false)
    const host = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/api/application`


    const fetchApplicationForApplicant = async (jobId) => {
        setisLoading(true)
        try {
            const response = await fetch(`${host}/submitted/${jobId}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem('career-connect-token')
                },
                credentials: 'include' 
            })

            

            const data = await response.json()
            console.log(data)
            setapplication(data)
        } catch (error) {
            toast.error("May be this action is not allowed or server is down. Please try again later.")
            console.log(error)
        } finally {
            setisLoading(false)
        }
    }


    const fetchAllApplications = async (jobId) => {
        setisLoading(true)
        try {
            const response = await fetch(`${host}/getAll/${jobId}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem('career-connect-token')
                },
                credentials: 'include' 
            })

            const data = await response.json()
            if(data.error) {
                toast.error(data.error)
                console.log(data)
                return
            }
            console.log(data)
            setallApplications(data)
        } catch (error) {
            toast.error("May be this action is not allowed or server is down. Please try again later.")
            console.log(error)
        } finally {
            setisLoading(false)
        }
    }


    const changeApplicationStatus = async (status, appId) => {
        try {
            const response = await fetch(`${host}/status/${appId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem('career-connect-token')
                },
                credentials: 'include' ,
                body: JSON.stringify({ status: status })
            })

            const data = await response.json()
            if(data.error) {
                toast.error(data.error)
                console.log(data)
                return null
            }
            console.log(data)
            return data
        } catch (error) {
            toast.error("May be this action is not allowed or server is down. Please try again later.")
            console.log(error)
        }
    }

    const deleteApplication = async (appId) => {
        try {
            const response = await fetch(`${host}/delete/${appId}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem('career-connect-token')
                },
                credentials: 'include' 
            })

            const data = await response.json()
            if(data.error) {
                toast.error(data.error)
                console.log(data)
                return null
            }
            console.log(data)
            return data
        } catch (error) {
            toast.error("May be this action is not allowed or server is down. Please try again later.")
            console.log(error)
        }
    }

    return (
        <ApplicationContext.Provider value={{ fetchApplicationForApplicant, fetchAllApplications, allApplications, changeApplicationStatus, deleteApplication, isLoading, application }}>
            {props.children}
        </ApplicationContext.Provider>
    )
}

export default ApplicationState