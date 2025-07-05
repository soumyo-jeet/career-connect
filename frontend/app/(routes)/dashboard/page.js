"use client"
import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Home,
  Mail,
  Briefcase,
  Search,
  BarChart2,
  User,
  LogOut,
  PlusCircle,
  Menu,
  Bell,
  MessageSquareWarning,
  ArrowRight,
  MenuIcon,
  MenuSquareIcon,
  SquareMenu,
  Droplet,
  LucideMenu,
} from "lucide-react"
import { useContext, useEffect, useState } from "react"
import Tabs from "./_components/Tabs"
import JobCase from "./_components/JobCase"
import JobCreate from "./_components/JobCreate"
import Analytics from "./_components/Analytics"
import Inbox from "./_components/Inbox"
import Jobcontext from '@/app/contexts/Job/JobContext'
import UserContext from '@/app/contexts/User/UserContext'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import ProfileCreate from './_components/ProfileCreate'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import MobileTabs from './_components/MobileTabs'

function Page() {
  const [activeTab, setActiveTab] = useState("findJob")
  const jobContext = useContext(Jobcontext)
  const userContext = useContext(UserContext)
  const { fetchJobs, fetchFilteredJobs, filteredJobs, jobs } = jobContext
  const { fetchUser, user } = userContext



  const tabs = [
    { id: "findJob", icon: <Search className="h-5 w-5" />, label: "Find Job" },
    { id: "createJob", icon: <PlusCircle className="h-5 w-5" />, label: "Create Job" },
    { id: "inbox", icon: <Mail className="h-5 w-5" />, label: "Inbox" },
    { id: "analytics", icon: <BarChart2 className="h-5 w-5" />, label: "Analytics" },
  ]

  useEffect(() => {
    if (!localStorage.getItem("career-connect-token")) redirect("/login")
    else {
      fetchJobs()
      fetchFilteredJobs()
      fetchUser()
    }
  }, [])

  return (
    <div className="flex h-screen w-full bg-gradient-to-r from-background to-foreground/5">
      {/* Desktop Sidebar */}

      <Tabs setActiveTab={setActiveTab} activeTab={activeTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-background/90 backdrop-blur-sm border-b border-foreground/10">
          <div className="px-6 py-4 flex gap-2">
            {/* Mobile Navbar */}
            <MobileTabs setActiveTab={setActiveTab} activeTab={activeTab} >
              <SheetTrigger asChild>
                <Button  className="md:hidden bg-gradient-to-r from-secondary via-yellow-500 to-primary">
                  <MenuIcon className='text-red-900' />
                </Button>
              </SheetTrigger>
            </MobileTabs>
            <h1 className="text-2xl font-bold">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h1>
          </div>
        </header>
        {
          (!user && !jobs) ? <div>Loading...</div> : (
            <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-background/50 to-foreground/5">
              {/* Profile Warning */}
              {
                (user?.skills?.length === 0 || user?.interests?.length === 0) && (
                  <Card className="mb-6 border-yellow-500/30 bg-yellow-500/10">
                    <CardHeader className="pb-3">
                      <div className="flex items-center">
                        <MessageSquareWarning className="h-5 w-5 text-yellow-500 mr-2" />
                        <CardTitle className="text-yellow-500">Profile Incomplete</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-yellow-500/90">
                        Please create your profile to get personalized recommendations.
                      </p>

                      <ProfileCreate>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="mt-3 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-500"
                          >
                            Create Profile
                          </Button>
                        </DialogTrigger>
                      </ProfileCreate>
                    </CardContent>
                  </Card>
                )
              }


              {/* Content Area */}
              <div className="grid gap-6">
                {activeTab === "findJob" && (
                  <div className='grid grid-cols-1 gap-5'>
                    {
                      (user?.skills?.length !== 0 && user?.interests?.length !== 0) && (
                        <>
                          <JobCase
                            jobs={filteredJobs?.skillsMatchingJobs}
                            title={filteredJobs?.skillsMatchingJobs?.length > 0 ? `${filteredJobs?.skillsMatchingJobs?.length} Jobs Matches Your Skills` : "Jobs Matches Your Skills"} />

                          <JobCase
                            jobs={filteredJobs?.interestMatchingJobs}
                            title={filteredJobs?.interestMatchingJobs?.length > 0 ? `${filteredJobs?.interestMatchingJobs?.length} Jobs Matches Your Interests` : "Jobs Matches Your Interests"} />

                          <JobCase
                            jobs={filteredJobs?.peopleMatchingJobs}
                            title={filteredJobs?.peopleMatchingJobs?.length > 0 ? `${filteredJobs?.peopleMatchingJobs?.length} People With Same Interests Also Visited` : "People With Same Interests Also Visited"} />
                        </>
                      )
                    }
                    <JobCase jobs={jobs?.otherJobs} title="Available Jobs" isOther={true} />
                  </div>
                )}

                {activeTab === "createJob" && (
                  <JobCreate />
                )}

                {activeTab === "inbox" && (
                  <Inbox />
                )}

                {activeTab === "analytics" && (
                  <Analytics />
                )}
              </div>
            </main>
          )
        }

      </div>
    </div >
  )
}

export default Page