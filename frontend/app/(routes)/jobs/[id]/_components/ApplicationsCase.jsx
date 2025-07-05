"use client"
import ApplicationContext from '@/app/contexts/Application/ApplicationContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase } from 'lucide-react'
import React, { useContext, useEffect } from 'react'
import ApplicationCard from './Application'

function ApplicationsCase({ content }) {
    const applicationContext = useContext(ApplicationContext)
    const { isLoading } = applicationContext

    useEffect(() => {
      console.log("creartor")
    }, [])
    

    return (
        <Card className="border-0 shadow-lg bg-background/90 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Applications Submitted</CardTitle>
            </CardHeader>

            <CardContent>
                {
                    isLoading ? <div>Loading...</div> : (
                        <div className="py-12 text-foreground/60">
                            {
                                content?.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center">
                                        <Briefcase className="h-12 w-12 mb-4" />
                                        <p className="text-lg">No applications to show</p>
                                    </div>
                                ) : (
                                    <div className='grid gid-col-1 gap-5'>
                                        {
                                            content?.map((app, i) => {
                                                return <ApplicationCard key={i}
                                                content={app} isOwner={true}/>
                                            }
                                            )
                                        }
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </CardContent>

        </Card>
    )
}

export default ApplicationsCase