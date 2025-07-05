"use client"
import React, { useState } from 'react'
import UserContext from './UserContext'
import { toast } from 'sonner'

function UserState(props) {
    const [user, setuser] = useState(null)
    const [isLoading, setisLoading] = useState(false)
    const host = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/api/user`

    const fetchUser = async () => {
        setisLoading(true)
        try {
            const response = await fetch(`${host}/datafetch`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem('career-connect-token')
                }
            })

            const data = await response.json()
            console.log(data)
            setuser(data)
        } catch (error) {
            toast.error("May be this action is not allowed or server is down. Please try again later.")
            console.log(error)
        } finally{
            setisLoading(false)
        }
    }

    const createProfile = async (skills, interests, experience, prof, worksAt) => {
        try {
            const response = await fetch(`${host}/create-profile`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem('career-connect-token')
                },
                body: JSON.stringify({skills, interests, experience, prof, worksAt})
            })

            const data = await response.json()
            console.log(data)
            return true
        } catch (error) {
            toast.error("May be this action is not allowed or server is down. Please try again later.")
            console.log(error)
            return false
        } 
    }

    const clearInbox = async (msgId) => {
        try {
            const response = await fetch(`${host}/inbox/${msgId}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem('career-connect-token')
                },
            })

            const data = await response.json()
            console.log(data)
            return true
        } catch (error) {
            toast.error("May be this action is not allowed or server is down. Please try again later.")
            console.log(error)
            return false
        } 
    }


    return (
        <UserContext.Provider value= {{fetchUser, createProfile, clearInbox, isLoading, user}}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserState