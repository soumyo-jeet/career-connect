"use client"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useContext, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ResumeInsightCard from "./ResumeInsightCard";
import Jobcontext from "@/app/contexts/Job/JobContext";
import { getResumeInsights } from "@/app/actions/AIHelps";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ApplicationContext from "@/app/contexts/Application/ApplicationContext";
import { useRouter } from "next/navigation";
import UserContext from "@/app/contexts/User/UserContext";

export default function ApplicationCard({ content, isOwner }) {
  const statusStyles = {
    approved: "bg-green-50 text-green-700",
    rejected: "bg-red-50 text-red-700",
    applied: "bg-yellow-50 text-yellow-700"
  }
  const router = useRouter()
  const [processing, setprocessing] = useState(false)
  const [statusUpdating, setstatusUpdating] = useState(false)
  const [deleteing, setdeleteing] = useState(false)
  const [insight, setinsight] = useState(null)
  const [status, setstatus] = useState(content.status)
  const [openStatus, setopenStatus] = useState(false)

  const jobContext = useContext(Jobcontext)
  const userContext = useContext(UserContext)
  const applicationContext = useContext(ApplicationContext)
  const { jobDtls } = jobContext
  const { changeApplicationStatus, deleteApplication } = applicationContext
  const { fetchUser } = userContext

  const handleResumeInsightFetch = async () => {
    setprocessing(true)
    const insight = await getResumeInsights(jobDtls, content)
    setinsight(insight)
    setprocessing(false)
  }

  const handleStatus = async () => {
    setstatusUpdating(true)
    const flag = await changeApplicationStatus(status, content._id)
    setstatusUpdating(false)
  }

  const handleDelete = async () => {
    setdeleteing(true)
    const flag = await deleteApplication(content._id)
    if(flag) fetchUser().then(() =>  setdeleteing(false))
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{content.applicant?.name || "Your Application"}</CardTitle>
            {
              content.time && (
                <CardDescription>Submitted on {new Date(content.time).toDateString() || ""}</CardDescription>
              )
            }
          </div>
          <span className={cn("inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium  ring-1 ring-inset ring-blue-700/10", statusStyles[status])}>
            {status}
          </span>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4">
        {/* Contact Information */}
        <div className="space-y-2">
          <h4 className="font-medium">Contact Information</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p>{content.applicantContact.ph || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p>{content.applicantContact.email}</p>
            </div>
            {content.applicantContact.address && (
              <div className="col-span-2">
                <p className="text-muted-foreground">Address</p>
                <p>{content.applicantContact.address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reason to Apply */}
        {content.rsnToApply && (
          <div className="space-y-2">
            <h4 className="font-medium">Reason for Applying</h4>
            <p className="text-sm">{content.rsnToApply}</p>
          </div>
        )}

        {/* Skills */}
        <div className="space-y-2">
          <h4 className="font-medium">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {content.applicantSkills?.length > 0 ? (
              content.applicantSkills.map((skill, index) => (
                <Badge
                  key={index}
                  className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No skills listed</p>
            )}
          </div>
        </div>
      </CardContent>


      {
        !isOwner ? (
          <CardFooter className="flex justify-between">
            {
              content.status === "applied" && (
                <>
                  <Button 
                  variant="outline" 
                  className="text-destructive hover:bg-destructive/10"
                  onClick={handleDelete}
                  disabled={deleteing}
                  >
                    {deleteing ? "Deleteing..." : "Delete"}
                    
                  </Button>
                </>

              )
            }
            <Dialog>
              <DialogTrigger asChild>
                <Button>View Resume</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Your Resume</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  {/* Resume Image */}
                  <img
                    src={content.resume}
                    alt="Resume Preview"
                    className="w-full h-auto border rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Scroll to view full resume
                  </p>
                </div>
              </DialogContent>
            </Dialog>

          </CardFooter>
        ) : (
          <CardFooter className="flex flex-wrap gap-4">
            {
              !openStatus && (
                <Button variant="outline" onClick={() => setopenStatus(true)}>
                  Change Status
                </Button>
              )
            }
            {
              openStatus && (
                <div className="w-full flex-col">
                  <Select
                    name="status"
                    value={status}
                    onValueChange={(value) => setstatus(value)}
                    className="w-full"
                  >
                    <SelectTrigger className="border-foreground/20">
                      <SelectValue placeholder="Select job mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="applied">applied</SelectItem>
                      <SelectItem value="approved">approved</SelectItem>
                      <SelectItem value="rejected">rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2 mt-2">
                    <Button className="bg-amber-200" disabled={statusUpdating} onClick={handleStatus}>
                      {
                        statusUpdating ? "Saving..." : "Save"
                      }
                
                    </Button>
                    <Button className="bg-red-200" onClick={() => setopenStatus(false)}>
                      Cancel
                    </Button>

                  </div>
                </div>
              )
            }

            <Dialog>
              <DialogTrigger asChild>
                <Button>View Resume</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{content.applicant?.name + "'s" || "Your"} Resume</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-6">
                  <div className="mt-4">
                    {/* Resume Image */}
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      Scroll to view full resume
                    </p>
                    <img
                      src={content.resume}
                      alt="Resume Preview"
                      className="w-full h-auto border rounded-lg"
                    />
                    <Button className="w-full mt-2"
                      onClick={handleResumeInsightFetch}
                      disabled={processing}
                    >
                      {
                        processing ? "Loading..." : "Analyse with AI"
                      }
                    </Button>
                  </div>

                  <ResumeInsightCard insight={insight} />
                </div>
              </DialogContent>
            </Dialog>

          </CardFooter>
        )
      }
    </Card>
  );
}