"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle, Briefcase, Award, Code, Heart, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import UserContext from "@/app/contexts/User/UserContext"
import Jobcontext from "@/app/contexts/Job/JobContext"

export default function ProfileCreate({ children }) {
    const userContext = useContext(UserContext)
    const jobContext = useContext(Jobcontext)
    const { user, fetchUser, createProfile } = userContext
    const { fetchFilteredJobs } = jobContext

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [skills, setSkills] = useState(user?.skills || [])
    const [interests, setInterests] = useState(user?.interests || [])
    const [currentSkill, setCurrentSkill] = useState("")
    const [currentInterest, setCurrentInterest] = useState("")
    const [formData, setFormData] = useState({
        experience: user?.experience || "",
        prof: user?.prof || "",
        worksAt: user?.worksAt || ""
    })



    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const addSkill = () => {
        if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
            setSkills([...skills, currentSkill.trim()])
            setCurrentSkill("")
        }
    }

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter(skill => skill !== skillToRemove))
    }

    const addInterest = () => {
        if (currentInterest.trim() && !interests.includes(currentInterest.trim())) {
            setInterests([...interests, currentInterest.trim()])
            setCurrentInterest("")
        }
    }

    const removeInterest = (interestToRemove) => {
        setInterests(interests.filter(interest => interest !== interestToRemove))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const flag = await createProfile(skills, interests, formData.experience, formData.prof, formData.worksAt)
        if(flag) {
            fetchUser()
            fetchFilteredJobs()
        }
        setLoading(false)
        setOpen(false)
    }


    useEffect(() => {
        if (user) {
            setSkills(user.skills || [])
            setInterests(user.interests || [])
            setFormData({
                experience: user.experience || "",
                prof: user.prof || "",
                worksAt: user.worksAt || ""
            })
        }
    }, [user])
    

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {children}

            <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur-sm">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary via-yellow-500 to-primary">
                        Build Your Professional Profile
                    </DialogTitle>
                    <DialogDescription>
                        Complete your profile to get better job recommendations and visibility to employers.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                    {/* Professional Information */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-foreground/80">
                            <Briefcase className="h-5 w-5" />
                            <h3 className="font-medium">Professional Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="prof">Profession/Title</Label>
                                <Input
                                    id="prof"
                                    name="prof"
                                    placeholder="e.g. Software Developer"
                                    value={formData.prof}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="worksAt">Current Company</Label>
                                <Input
                                    id="worksAt"
                                    name="worksAt"
                                    placeholder="Where you work"
                                    value={formData.worksAt}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="experience">Experience</Label>
                            <Input
                                id="experience"
                                name="experience"
                                type="Number"
                                placeholder="e.g. 5"
                                value={formData.experience}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-foreground/80">
                            <Code className="h-5 w-5" />
                            <h3 className="font-medium">Skills</h3>
                        </div>

                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add a skill (e.g. JavaScript)"
                                    value={currentSkill}
                                    onChange={(e) => setCurrentSkill(e.target.value)}
                                />
                                <Button type="button" onClick={addSkill} variant="outline">
                                    Add
                                </Button>
                            </div>

                            {skills.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill) => (
                                        <div
                                            key={skill}
                                            className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                                        >
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(skill)}
                                                className="text-primary/70 hover:text-primary"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Interests Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-foreground/80">
                            <Heart className="h-5 w-5" />
                            <h3 className="font-medium">Interests</h3>
                        </div>

                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add an interest (e.g. AI, Open Source)"
                                    value={currentInterest}
                                    onChange={(e) => setCurrentInterest(e.target.value)}
                                />
                                <Button type="button" onClick={addInterest} variant="outline">
                                    Add
                                </Button>
                            </div>

                            {interests.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {interests.map((interest) => (
                                        <div
                                            key={interest}
                                            className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm"
                                        >
                                            {interest}
                                            <button
                                                type="button"
                                                onClick={() => removeInterest(interest)}
                                                className="text-secondary/70 hover:text-secondary"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="px-6 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-r from-primary via-yellow-500 to-secondary"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Profile"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}