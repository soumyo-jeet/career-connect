"use client"
import { improveJobDesc, verifyJob } from "@/app/actions/AIHelps"
import Jobcontext from "@/app/contexts/Job/JobContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Briefcase, MapPin, CalendarDays, Clock, DollarSign, Mail, Phone, User, Code, Tag, PlusCircle, X, Loader2, Sparkle, Sparkles } from "lucide-react"
import { useContext, useState } from "react"

export default function JobCreateForm() {
  const [formData, setFormData] = useState({
    title: "",
    profile: "",
    salary: "",
    compName: "",
    compAdd: "",
    jobDtls: "",
    mode: "",
    skillRequirements: [],
    applyStarts: "",
    applyEnds: "",
    ph: "",
    email: "",
    complogo: "",
    requireApplicants: 0,
    tag: []
  })
  const [currentSkill, setCurrentSkill] = useState("")
  const [currentTag, setCurrentTag] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [formShow, setformShow] = useState(false)
  const [processing, setprocessing] = useState(false)


  const jobContext = useContext(Jobcontext)
  const { createJob, fetchJobs } = jobContext

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skillRequirements.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skillRequirements: [...prev.skillRequirements, currentSkill.trim()]
      }))
      setCurrentSkill("")
    }
  }

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skillRequirements: prev.skillRequirements.filter(skill => skill !== skillToRemove)
    }))
  }

  const addTag = () => {
    if (currentTag.trim() && !formData.tag.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tag: [...prev.tag, currentTag.trim()]
      }))
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tag: prev.tag.filter(tag => tag !== tagToRemove)
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = "Title is required (min 3 chars)"
    if (!formData.profile.trim()) newErrors.profile = "Profile is required"
    if (!formData.salary.trim()) newErrors.salary = "salary is required"
    if (!formData.compName.trim()) newErrors.compName = "Company name is required"
    if (!formData.compAdd.trim()) newErrors.compAdd = "Company address is required"
    if (!formData.jobDtls.trim()) newErrors.jobDtls = "Job details is required"
    if (!formData.mode.trim()) newErrors.mode = "Job mode is required"
    if (formData.skillRequirements.length === 0) newErrors.skillRequirements = "At least one skill is required"
    if (!formData.applyStarts.trim()) newErrors.applyStarts = "Start date is required"
    if (!formData.applyEnds.trim()) newErrors.applyEnds = "End date is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


  const handleAIUrge = async () => {
    if(!validateForm()) return
    console.log("clicked")
    setprocessing(true)
    const text = await improveJobDesc(formData)
    setFormData(prev => ({ ...prev, jobDtls: text }))
    setprocessing(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    console.log(formData)
    const verified = await verifyJob(formData)
    if(!verified) {
      setLoading(false)
      return 
    }

    const flag = await createJob(formData)
    if (flag) {
      fetchJobs()
    }
    setLoading(false)
    setFormData({
      title: "",
      profile: "",
      salary: "",
      compName: "",
      compAdd: "",
      jobDtls: "",
      mode: "",
      skillRequirements: [],
      applyStarts: "",
      applyEnds: "",
      ph: "",
      email: "",
      complogo: "",
      requireApplicants: 0,
      tag: []
    })
    setformShow(false)
  }

  return (
    <Card className="border-0 shadow-lg bg-background/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create New Job Posting</CardTitle>
      </CardHeader>
      {
        !formShow ?
          <CardContent>
            <Button
              className="w-full mt-6 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-r from-primary via-yellow-500 to-secondary"
              onClick={() => setformShow(true)}
            >
              <PlusCircle className="ml-2 h-5 w-5" /> Create a new job
            </Button>
          </CardContent>
          :
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    <Briefcase className="inline h-4 w-4 mr-2" />
                    Job Title *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g. Senior Backend Developer"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="border-foreground/20"
                  />
                  {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile">
                    <User className="inline h-4 w-4 mr-2" />
                    Job Profile *
                  </Label>
                  <Input
                    id="profile"
                    name="profile"
                    placeholder="e.g. Software Engineer"
                    value={formData.profile}
                    onChange={handleInputChange}
                    className="border-foreground/20"
                  />
                  {errors.profile && <p className="text-sm text-red-500">{errors.profile}</p>}
                </div>
              </div>

              {/* salary and Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="salary">
                    <DollarSign className="inline h-4 w-4 mr-2" />
                    Salary (LPA) *
                  </Label>
                  <Input
                    id="salary"
                    name="salary"
                    placeholder="e.g. 15 LPA"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="border-foreground/20"
                  />
                  {errors.salary && <p className="text-sm text-red-500">{errors.salary}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mode">
                    <Clock className="inline h-4 w-4 mr-2" />
                    Job Mode *
                  </Label>
                  <Select
                    name="mode"
                    value={formData.mode}
                    onValueChange={(value) => setFormData({ ...formData, mode: value })}
                  >
                    <SelectTrigger className="border-foreground/20">
                      <SelectValue placeholder="Select job mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.mode && <p className="text-sm text-red-500">{errors.mode}</p>}
                </div>
              </div>

              {/* Company Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="compName">
                    <Briefcase className="inline h-4 w-4 mr-2" />
                    Company Name *
                  </Label>
                  <Input
                    id="compName"
                    name="compName"
                    placeholder="Company name"
                    value={formData.compName}
                    onChange={handleInputChange}
                    className="border-foreground/20"
                  />
                  {errors.compName && <p className="text-sm text-red-500">{errors.compName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compAdd">
                    <MapPin className="inline h-4 w-4 mr-2" />
                    Company Country *
                  </Label>
                  <Select
                    name="compAdd"
                    value={formData.compAdd}
                    onValueChange={(value) => setFormData({ ...formData, compAdd: value })}
                  >
                    <SelectTrigger className="border-foreground/20">
                      <SelectValue placeholder="Select job mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Japan">Japan</SelectItem>
                      <SelectItem value="Indonesia">Indonesia</SelectItem>
                      <SelectItem value="Brazil">Brazil</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="Italy">Italy</SelectItem>
                      <SelectItem value="Spain">Spain</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="Russia">Russia</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.compAdd && <p className="text-sm text-red-500">{errors.compAdd}</p>}
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="ph">
                    <Phone className="inline h-4 w-4 mr-2" />
                    Contact Phone
                  </Label>
                  <Input
                    id="ph"
                    name="ph"
                    placeholder="Contact number"
                    value={formData.ph}
                    onChange={handleInputChange}
                    className="border-foreground/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="inline h-4 w-4 mr-2" />
                    Contact Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Contact email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border-foreground/20"
                  />
                </div>
              </div>

              {/* Job Details */}
              <div className="space-y-2">
                <Label htmlFor="jobDtls">
                  <Briefcase className="inline h-4 w-4 mr-2" />
                  Job Details *
                </Label>
                <Textarea
                  id="jobDtls"
                  name="jobDtls"
                  placeholder="Detailed job description"
                  value={formData.jobDtls}
                  onChange={handleInputChange}
                  className="border-foreground/20 h-32"
                />
                <Button type="button" 
                className="flex justify-center gap-2" 
                variant="outline"
                disabled={!formData.jobDtls.trim() || processing}
                onClick={handleAIUrge}
                >
                  {
                    !processing ? (
                      <>Rewrite with AI <span><Sparkles className="h-4 w-4 mr-2"/></span></>
                    ) : (
                      <>Processing... <span><Loader2 className="h-4 w-4 mr-2 animate-spin"/></span></>
                    )
                  }
                </Button>
                {errors.jobDtls && <p className="text-sm text-red-500">{errors.jobDtls}</p>}
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <Label>
                  <Code className="inline h-4 w-4 mr-2" />
                  Required Skills *
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add required skill (e.g. JavaScript)"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    className="border-foreground/20"
                  />
                  <Button type="button" onClick={addSkill} variant="outline">
                    Add Skill
                  </Button>
                </div>
                {errors.skillRequirements && (
                  <p className="text-sm text-red-500">{errors.skillRequirements}</p>
                )}
                {formData.skillRequirements.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skillRequirements.map((skill) => (
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

              {/* Tags */}
              <div className="space-y-2">
                <Label>
                  <Tag className="inline h-4 w-4 mr-2" />
                  Job Tags
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag (e.g. Remote, Tech)"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    className="border-foreground/20"
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Add Tag
                  </Button>
                </div>
                {formData.tag.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tag.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-secondary/70 hover:text-secondary"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Application Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="applyStarts">
                    <CalendarDays className="inline h-4 w-4 mr-2" />
                    Application Starts *
                  </Label>
                  <Input
                    id="applyStarts"
                    name="applyStarts"
                    type="date"
                    value={formData.applyStarts}
                    onChange={handleInputChange}
                    className="border-foreground/20"
                  />
                  {errors.applyStarts && <p className="text-sm text-red-500">{errors.applyStarts}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="applyEnds">
                    <CalendarDays className="inline h-4 w-4 mr-2" />
                    Application Ends *
                  </Label>
                  <Input
                    id="applyEnds"
                    name="applyEnds"
                    type="date"
                    value={formData.applyEnds}
                    onChange={handleInputChange}
                    className="border-foreground/20"
                  />
                  {errors.applyEnds && <p className="text-sm text-red-500">{errors.applyEnds}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full mt-6 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-r from-primary via-yellow-500 to-secondary"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    Post
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
      }
    </Card>
  )
}