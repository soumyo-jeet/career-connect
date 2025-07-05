"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart2 } from 'lucide-react'
import React, { useContext, useEffect } from 'react'
import JobCase from './JobCase'
import Jobcontext from '@/app/contexts/Job/JobContext'
import { UserStats } from './UserStats'
import UserContext from '@/app/contexts/User/UserContext'

function Analytics() {
    const jobContext = useContext(Jobcontext)
    const userContext = useContext(UserContext)
    const { jobs } = jobContext
    const { user } = userContext

    const {
        jobsCreated,
        jobsApplied,
        jobsSelected,
        jobsRejected
    } = user

    return (
        <div className='grid grid-cols-1 gap-6'>
            <Card className="border-0 shadow-lg bg-background/90 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Analytics Dashboard</CardTitle>
                </CardHeader>
                {
                    (jobsCreated.length === 0 && jobsApplied.length === 0 && jobsSelected.length === 0 && jobsRejected.length === 0) ? (
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-12 text-foreground/60">
                                <BarChart2 className="h-12 w-12 mb-4" />
                                <p className="text-lg">No analytics data available</p>
                            </div>
                        </CardContent>
                    ) : (

                        <UserStats 
                            jobsCreated={jobsCreated.length}
                            jobsApplied={jobsApplied.length}
                            jobsSelected={jobsSelected.length}
                            jobsRejected={jobsRejected.length}
                        />
                    )
            }
            </Card>

            {/* Applied jobs */}
            <JobCase jobs={jobs?.appliedJobs} title="Jobs you applied for" />

        </div>
    )
}

export default Analytics