import React, { useContext, useState } from 'react'
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
    ArrowRight
} from "lucide-react"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import ProfileCreate from './ProfileCreate'
import { DialogTrigger } from '@radix-ui/react-dialog'
import UserContext from '@/app/contexts/User/UserContext'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

function MobileTabs({ children, setActiveTab, activeTab }) {
    const router = useRouter()
    const [profileOptions, setprofileOptions] = useState(false)
    const userContext = useContext(UserContext)
    const { user } = userContext

    const logOut = async () => {
        await localStorage.removeItem("career-connect-token")
        router.push('/')
    }

    const tabs = [
        { id: "findJob", icon: <Search className="h-5 w-5" />, label: "Find Job" },
        { id: "createJob", icon: <PlusCircle className="h-5 w-5" />, label: "Create Job" },
        { id: "inbox", icon: <Mail className="h-5 w-5" />, label: "Inbox" },
        { id: "analytics", icon: <BarChart2 className="h-5 w-5" />, label: "Analytics" },
    ]

    return (
        <Sheet>
            {children}
            <SheetContent className="flex-col w-64 border-r border-foreground/10 bg-background/90 backdrop-blur-sm">
                <SheetHeader className="flex h-16 items-center px-6 border-b border-foreground/10">
                    <SheetTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary via-yellow-500 to-primary">
                        CareerConnect
                    </SheetTitle>
                </SheetHeader>


                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="space-y-1 px-4">
                        {tabs.map((tab) => (
                            <Button
                                key={tab.id}
                                variant={activeTab === tab.id ? "secondary" : "ghost"}
                                className={`w-full justify-start ${activeTab === tab.id ? "bg-secondary/50" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.icon}
                                <span className="ml-3">{tab.label}</span>
                                {/*{tab.id === "inbox" && unreadMessages && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-primary"></span>
                )}*/}
                            </Button>
                        ))}
                    </nav>
                </div>

                <div className="p-4 border-t border-foreground/10">
                    <div className="relative group">
                        <Button variant="ghost" className="w-full justify-start" onClick={() => setprofileOptions(!profileOptions)}>
                            <User className="h-5 w-5" />
                            <span className="ml-3">{user?.name?.split(" ")[0]}</span>
                        </Button>
                        <div className={`absolute bottom-full left-0 mb-2 w-full ${profileOptions ? "block" : "hidden"} bg-background rounded-md shadow-lg z-10 border border-foreground/10`}>
                            <ProfileCreate>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" className="w-full justify-start rounded-b-none">
                                        <User className="h-5 w-5" />
                                        <span className="ml-3">Create Profile</span>
                                    </Button>
                                </DialogTrigger>
                            </ProfileCreate>
                            <Button variant="ghost" className="w-full justify-start rounded-t-none" onClick={logOut}>
                                <LogOut className="h-5 w-5" />
                                <span className="ml-3">Log Out</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </SheetContent>

        </Sheet>
    )
}

export default MobileTabs