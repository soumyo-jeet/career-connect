"use client"
import UserContext from '@/app/contexts/User/UserContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail } from 'lucide-react'
import React, { useContext, useEffect } from 'react'
import { MessageCard } from './MessageCard'

function Inbox() {
    const userContext = useContext(UserContext)
    const { user, isLoading: userLoading } = userContext

    

    return (
        <Card className="border-0 shadow-lg bg-background/90 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Your Messages</CardTitle>
            </CardHeader>
            <CardContent>
                {
                    userLoading ? <div>Loading...</div> :
                        user.inbox.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-foreground/60">
                                <Mail className="h-12 w-12 mb-4" />
                                <p className="text-lg">No messages to show</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 space-y-6">
                                {
                                    user.inbox.slice().reverse().map((el, i) => {
                                        return(
                                        <MessageCard key={i} msg={el.msg} type={el.tone || "default"} id={el._id}/>
                                        )
                                    })
                                }
                            </div>
                        )
                }
            </CardContent>
        </Card>
    )
}

export default Inbox