"use client"
import { Button } from "@/components/ui/button"
import { Briefcase, MapPin, CalendarDays, Clock, Trash2, ExternalLink, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useContext, useEffect, useState } from "react"
import UserContext from "@/app/contexts/User/UserContext"
import Jobcontext from "@/app/contexts/Job/JobContext"
import { useRouter } from "next/navigation"
import { DeleteJobDialog } from "@/components/DeleteJobDialog"
import { DialogTrigger } from "@/components/ui/dialog"

export default function JobCard({ job, isOwner, isOther }) {
  const router = useRouter()
  const [isLiked, setisLiked] = useState(false)
  const {
    title,
    profile,
    tag,
    skillRequirements,
    time,
    company,
    applyStarts,
    applyEnds,
    mode,
    likes,
    _id
  } = job

  const userContext = useContext(UserContext)
  const jobContext = useContext(Jobcontext)
  const { user } = userContext
  const { likeUnlike, fetchJobs, visitJob, deleteJob } = jobContext


  const handleLikeUnlike = async () => {
    const flag = await likeUnlike(_id)
    if(flag) {
      setisLiked(!isLiked)
    }
  }

  
  const handleVisit = async () => {
    router.push(`/jobs/${_id}`)
    visitJob(_id)
  }

  useEffect(() => {
    if(likes.includes(user?._id)) setisLiked(true)
  }, [])

  // Format the creation date
  const createdAt = new Date(time).toLocaleDateString()
  const endsAt = new Date(applyEnds).toLocaleDateString()

  return (
    <div className="border border-foreground/10 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-background/90 backdrop-blur-sm">
      <div className="p-6">
        {/* Job Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center">
              {company.logo ? (
                <Image 
                  src={company.logo} 
                  alt={company.name} 
                  width={56} 
                  height={56}
                  className="rounded-lg"
                />
              ) : (
                <Briefcase className="h-6 w-6 text-primary" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary via-yellow-500 to-primary">
                {title}
              </h3>
              <p className="text-foreground/80">{profile}</p>
            </div>
          </div>
          
          {isOwner ? (
            <DeleteJobDialog jobId={_id}>
              <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10" >
              <Trash2 className="h-5 w-5" />
            </Button>
              </DialogTrigger>

            </DeleteJobDialog>
          )
          :
          isOther ? (
            <Button variant="ghost" size="icon" className="hover:bg-red-500/10" onClick={handleLikeUnlike}>
              {
                isLiked ? 
                <Heart fill="red" className="h-5 w-5 text-red-500" />
                :
                <Heart className="h-5 w-5 text-red-500" />
              }
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="hover:bg-red-500/10" onClick={handleVisit}>
              <ExternalLink className="h-5 w-5" />
            </Button>
          )
        }
        </div>

        {/* Company Info */}
        <div className="mt-4 flex items-center gap-2 text-sm text-foreground/70">
          <span>{company.name}</span>
          <span className="h-1 w-1 rounded-full bg-foreground/30"></span>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{company.address}</span>
          </div>
           <span className="h-1 w-1 rounded-full bg-foreground/30"></span>
            <span>{mode}</span>
        </div>

        {/* Tags and Skills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {tag?.length > 0 && tag.map((t, i) => (
            <span 
              key={i} 
              className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
            >
              {t}
            </span>
          ))}
          
          {skillRequirements?.length > 0 && skillRequirements.map((skill, i) => (
            <span 
              key={i} 
              className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-300 text-secondary"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Timeline Info */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-foreground/70">
            <CalendarDays className="h-4 w-4" />
            <span>Posted: {createdAt}</span>
          </div>
          <div className="flex items-center gap-2 text-foreground/70">
            <Clock className="h-4 w-4" />
            <span>Apply by: {endsAt}</span>
          </div>
        </div>

        {/* Apply Button */}
        <div className="mt-6">
          <Button
            className="w-full px-6 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-r from-primary via-yellow-500 to-secondary"
            onClick={handleVisit}
          >
              View Details <ExternalLink className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}