"use client"
import Jobcontext from '@/app/contexts/Job/JobContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { ArrowRight } from 'lucide-react'
import React, { useContext, useEffect } from 'react'
import JobCase from './JobCase'
import JobCreateForm from './JobCreateForm'

function JobCreate() {
    const jobContext = useContext(Jobcontext)
    const { jobs } = jobContext

   

    return (
        <div className='grid gid-cols-1 gap-6'>
            {/* Job Creation Form */}
            <JobCreateForm />

            { /* Created Jobs */ }
            <JobCase jobs={jobs?.createdJobs} isOwner={true} title="Jobs Created By You"/>
        </div>
    )
}

export default JobCreate