"use client"
import Jobcontext from '@/app/contexts/Job/JobContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase } from 'lucide-react'
import React, { useContext, useEffect } from 'react'
import JobCard from './JobCard'

function JobCase({ jobs, title, isOwner, isOther }) {
    const jobContext = useContext(Jobcontext)
    const { isLoading } = jobContext

    return (
        <Card className="border-0 shadow-lg bg-background/90 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent>
                {
                    isLoading ? <div>Loading...</div> : (
                        <div className="py-12 text-foreground/60">
                            {
                                jobs?.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center">
                                        <Briefcase className="h-12 w-12 mb-4" />
                                        <p className="text-lg">No jobs to show</p>
                                    </div>
                                ) : (
                                    <div className='grid gid-col-1 md:grid-cols-2 gap-5'>
                                        {
                                            jobs?.map((job, i) => {
                                                return <JobCard key={i} job={job} isOwner={isOwner} isOther={isOther} />
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

export default JobCase