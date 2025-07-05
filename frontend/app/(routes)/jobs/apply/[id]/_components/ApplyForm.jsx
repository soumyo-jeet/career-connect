"use client"
import Jobcontext from "@/app/contexts/Job/JobContext"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { UploadCloud, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useContext, useState } from "react"
import { toast } from "sonner"
import generateImgUrl from "@/app/actions/ImageUrl"

export default function ApplyForm({ user }) {
    const [formData, setFormData] = useState({
        resume: "",
        email: user?.email || "",
        ph: "",
        add: "",
        rsn: "",
        skills: user?.skills || []
    })
    const [errors, setErrors] = useState({})
    const [currentSkill, setCurrentSkill] = useState("")
    const [resumeFile, setresumeFile] = useState(null)
    const [processing, setprocessing] = useState(false)
    const jobContext = useContext(Jobcontext)
    const { applyJob } = jobContext
    const router = useRouter()


    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    }


    const validateForm = () => {
        const newErrors = {}
        if (!formData.email.trim()) newErrors.email = "Email is required"
        else if (!validateEmail(formData.email.trim())) newErrors.email = "Please enter a valid email"

        if (!formData.rsn.trim()) newErrors.rsn = "Reason for applying is required"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const validateResume = () => {
        const newError = {}
        const file = resumeFile
        if (!file) {
            newError.resume = "Resume is required"
        } else if (file.size > 2 * 1024 * 1024) {
            newError.resume = "File size should not be larger than 2 MB"
        }
        setErrors(prev => ({ ...prev, ...newError }))
        return Object.keys(newError).length === 0
    }


    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }))
        }
    }


    const handleResumeUpload = (e) => {
        const file = e.target.files?.[0] || null
        setresumeFile(file)
    }

    const addSkill = () => {
        if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, currentSkill.trim()]
            }))
            setCurrentSkill("")
        }
    }

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!(validateForm() && validateResume())) return
        setprocessing(true)

        try {
            const url = await generateImgUrl(resumeFile)
            if (!url) {
                toast.error("Something went wrong please try again later")
                return
            }

            const updatedFormData = {
                ...formData,
                resume: url
            }

            const pathParts = window.location.pathname.split("/")
            const jobId = pathParts[pathParts.length - 1]
            console.log(jobId)
            const flag = await applyJob(updatedFormData, jobId)
            if (flag) router.push('/dashboard')
        } catch (error) {
            console.log(error)
        } finally {
            setprocessing(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Job Application</CardTitle>
                    <CardDescription>
                        Please fill out this form to apply for the position
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Resume Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="resume" className="flex items-center gap-2">
                                <UploadCloud className="h-5 w-5" />
                                <span>Resume *</span>
                            </Label>
                            <Input
                                id="resume"
                                type="file"
                                accept=".jpg,.jpeg"
                                className="border-foreground/20"
                                onChange={handleResumeUpload}
                            />
                            {errors.resume ? (
                                <p className="text-sm text-red-500">{errors.resume}</p>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Upload your resume (JPEG, JPG up to 2MB)
                                </p>
                            )}
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h3 className="font-medium text-lg">Contact Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        placeholder="your@email.com"
                                        className="border-foreground/20"
                                        onChange={handleInputChange}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">{errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ph">Phone Number</Label>
                                    <Input
                                        id="ph"
                                        name="ph"
                                        value={formData.ph}
                                        type="tel"
                                        className="border-foreground/20"
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    name="add"
                                    value={formData.add}
                                    placeholder="Your current address"
                                    className="border-foreground/20"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="space-y-2">
                            <Label>Your Skills</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add skill (e.g. JavaScript)"
                                    value={currentSkill}
                                    onChange={(e) => setCurrentSkill(e.target.value)}
                                    className="border-foreground/20"
                                />
                                <Button type="button" onClick={addSkill} variant="outline">
                                    Add Skill
                                </Button>
                            </div>

                            {formData.skills.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.skills.map((skill, index) => (
                                        <div
                                            key={index}
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

                        {/* Reason for Applying */}
                        <div className="space-y-2">
                            <Label htmlFor="rsn">Reason for Applying *</Label>
                            <Textarea
                                id="rsn"
                                name="rsn"
                                value={formData.rsn}
                                placeholder="Why are you a good fit for this position?"
                                className="border-foreground/20 min-h-[120px]"
                                onChange={handleInputChange}
                            />
                            {errors.rsn && (
                                <p className="text-sm text-red-500">{errors.rsn}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-r from-primary to-secondary"
                                disabled={processing}
                            >
                                {
                                    processing ? "Submitting..." : "Submit Application"
                                }

                            </Button>
                        </div>


                    </form>
                </CardContent>
            </Card>
        </div>
    )
}