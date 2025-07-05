"use client"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Briefcase, MapPin, Clock, CalendarDays, Heart, Mail, Phone, ArrowRight, Trash, Trash2 } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import Jobcontext from "@/app/contexts/Job/JobContext"
import { useRouter } from "next/navigation"
import { DeleteJobDialog } from "@/components/DeleteJobDialog"
import { DialogTrigger } from "@/components/ui/dialog"
import ApplicationCard from "./Application"
import ApplicationContext from "@/app/contexts/Application/ApplicationContext"
import ApplicationsCase from "./ApplicationsCase"

export default function JobDetails({ job, user }) {
  const {
    title,
    profile,
    package: salaryPackage,
    company,
    jobDtls,
    mode,
    skillRequirements,
    applyStarts,
    applyEnds,
    owner,
    contact,
    clicks,
    likes,
    applications,
    time,
    requireApplicants = 100,
    _id
  } = job

  const { _id: userId, jobsApplied } = user



  const jobContext = useContext(Jobcontext)
  const applicationContext = useContext(ApplicationContext)

  const { likeUnlike } = jobContext
  const { fetchApplicationForApplicant, fetchAllApplications, isLoading, application, allApplications } = applicationContext

  const [isLiked, setisLiked] = useState(false)
  const [isOwner, setisOwner] = useState(false)
  const [applied, setapplied] = useState(false)
  const [tlikes, settlikes] = useState(likes.length)
  const router = useRouter()



  const formattedDate = new Date(time).toDateString()
  const applicationProgress = requireApplicants > 0
    ? Math.min(100, (applications.length / requireApplicants) * 100)
    : 0



  const handleLikeUnlike = async () => {
    const flag = await likeUnlike(_id)
    if (flag) {
      const newLikedState = !isLiked
      setisLiked(newLikedState)
      settlikes(newLikedState ? tlikes + 1 : tlikes - 1)
    }
  }

  useEffect(() => {
    console.log(_id)
    console.log(user)
    if (likes.includes(userId)) setisLiked(true)

    if (owner?._id === userId) {
      setisOwner(true)
      fetchAllApplications(_id)
    }

    if(jobsApplied?.includes(_id)) {
      setapplied(true)
      fetchApplicationForApplicant(_id)
    }
  }, [])


  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-background to-muted/20 py-12 px-4 sm:px-6">
    {
      isLoading ? <div>Loading...</div> : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content - 8 cols */}
          <div className="lg:col-span-8 space-y-6">
            {/* Job Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span className="capitalize">{mode}</span>
                </Badge>
                <div className="flex gap-2">
                  {
                    isOwner ? (
                      <DeleteJobDialog jobId={_id}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-5 w-5 text-red-500" />
                          </Button>
                        </DialogTrigger>
                      </DeleteJobDialog>
                    ) : (
                      <Button variant="ghost" size="icon" onClick={handleLikeUnlike}>
                        {
                          isLiked ?
                            <Heart fill="red" className="h-5 w-5 text-red-500" /> :
                            <Heart className="h-5 w-5 text-red-500" />
                        }
                      </Button>
                    )
                  }
  
                </div>
              </div>
  
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {title}
                <span className="ml-3 text-2xl font-semibold text-muted-foreground">
                  {profile}
                </span>
              </h1>
  
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{company.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>{company.address}</span>
                </div>
              </div>
  
              <div className="pt-2">
                <Badge className="px-4 py-1.5 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-r from-primary via-yellow-500 to-secondary">
                  {salaryPackage}
                </Badge>
              </div>
            </div>
  
            {/* Job Description */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p>{jobDtls}</p>
                </div>
              </CardContent>
            </Card>
  
            {/* Skills & Requirements */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skillRequirements.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1 text-sm font-medium"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
  
            {/* Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Application Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <CalendarDays className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Starts</p>
                      <p className="font-medium">{applyStarts}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-secondary/10">
                      <CalendarDays className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ends</p>
                      <p className="font-medium">{applyEnds}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
  
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {applications.length} applied
                      </span>
                      {requireApplicants > 0 && (
                        <span className="font-medium">
                          {requireApplicants} positions
                        </span>
                      )}
                    </div>
                    {requireApplicants > 0 && (
                      <Progress value={applicationProgress} className="h-2" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
  
          {/* Sidebar - 4 cols */}
          <div className="lg:col-span-4 space-y-6">
            {/* Apply CTA */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                {
                  isOwner ? (
                    <ApplicationsCase content={allApplications}/>
                  ) : !applied ? (
                    <Button
                      className="w-full h-14 px-6 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-r from-primary via-yellow-500 to-secondary"
                      onClick={() => router.push(`/jobs/apply/${_id}`)}
                    >
                      Apply Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  ) : (
                    <ApplicationCard content={application[0]}/>
                  )
                }
                <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                  <span>{clicks.length} views</span>
                  <span>{tlikes} likes</span>
                </div>
              </CardContent>
            </Card>
  
            {/* Recruiter Profile */}
            {
              !isOwner ? (
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">About the Recruiter</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14">
                        <AvatarFallback className="px-6 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-r from-primary via-yellow-500 to-secondary">
                          {owner?.name?.charAt(0)?.toUpperCase() || 'R'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{owner?.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {owner?.prof || 'Recruiter'} at {company.name}
                        </p>
                      </div>
                    </div>
  
                    {owner?.skills?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {owner.skills.slice(0, 6).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
  
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Contact</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <a
                            href={`mailto:${contact?.email || owner?.email}`}
                            className="text-sm hover:underline"
                          >
                            {contact?.email || owner?.email}
                          </a>
                        </div>
                        {contact?.ph && (
                          <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                            <a
                              href={`tel:${contact.ph}`}
                              className="text-sm hover:underline"
                            >
                              {contact.ph}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                null
              )
            }
  
            {/* Posted Info */}
            <div className="text-sm text-muted-foreground">
              Posted on {formattedDate}
            </div>
          </div>
        </div>

      )
    }
    </div>
  )
}