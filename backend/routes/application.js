const express = require("express")
const Application = require("../models/application")
const User = require("../models/user")
const Job = require("../models/job")
const fetchUserDetails = require("../middlewares/fetchUser")
const job = require("../models/job")

const router = express.Router()

// applications to the job creator
router.get('/getall/:id', fetchUserDetails, async (req, res) => {
    const userId = req.user.id
    const user = await User.findById(userId)
    if (!user) return res.status(401).json({ error: "Authentication failed" })

    try {
        const jobId = req.params.id
        const job = await Job.findById(jobId)
        if (!job) return res.status(404).json({ error: "Job not found" })
        if (job.owner.toString() !== userId.toString()) return res.status(401).json({ error: "Authentication failed" })

        const applications = await Application.find({ job: jobId }).populate('applicant', '-password')
        return res.status(200).json(applications)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Server is not working..." })
    }
})

// details of particular application to creator
router.get('/dtls/:id', fetchUserDetails, async (req, res) => {
    const userId = req.user.id
    const user = await User.findById(userId)
    if (!user) return res.status(401).json({ error: "Authentication failed" })

    try {
        const appId = req.params.id
        const app = await Application.findById(appId).populate('applicant', '-password')
        if (!app) return res.status(404).json({ error: "Job not found" })
        if (job.owner.toString() !== userId.toString()) return res.status(401).json({ error: "Authentication failed" })

        return res.status(200).json(app)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Server is not working..." })
    }
})

// application to the applicant
router.get('/submitted/:id', fetchUserDetails, async (req, res) => {
    const userId = req.user.id
    const user = await User.findById(userId)
    if (!user) return res.status(401).json({ error: "Authentication failed" })

    try {
        const jobId = req.params.id
        const job = await Job.findById(jobId)
        if (!job) return res.status(404).json({ error: "Job not found" })

        const applications = await Application.find({ job: jobId })
        const submitted = applications.filter((app) => app.applicant.toString() === userId.toString())
        return res.status(200).json(submitted)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Server is not working..." })
    }
})


// edit application
router.put('/edit/:id', fetchUserDetails, async(req, res) => {
    const userId = req.user.id
    const user = await User.findById(userId)
    if (!user) return res.status(401).json({ error: "Authentication failed" })

    try {
        const appId = req.params.id
        const app = await Application.findById(appId)
        if (!app) return res.status(404).json({ error: "Job not found" })
        
        if(app.applicant.toString() !== userId.toString() || app.status.toString() !== "applied") 
            return res.status(401).json({ error: "You can't edit the application." })

        const data = await req.body
        app.resume = data.resume || app.resume
        app.applicantSkills = data.skills || app.applicantSkills
        app.rsnToApply = data.rsn || app.rsnToApply
        await app.save()
        return res.status(200).json({ flag: "edited successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Server is not working..." })
    }
})




// status handleing 
router.put('/status/:id', fetchUserDetails, async (req, res) => {
    const userId = req.user.id
    const user = await User.findById(userId)
    if (!user) return res.status(401).json({ error: "Authentication failed" })

    try {
        const appId = req.params.id
        const app = await Application.findById(appId).populate("job").populate("applicant", "-password")
        if (!app) return res.status(404).json({ error: "Job not found" })
        
        if(app.job.owner.toString() !== userId.toString()) 
            return res.status(401).json({ error: "Authentication failed" })

        const data = await req.body
        
        if(app.status === data.status.toLowerCase()) 
            return res.status(200).json({ flag: "status already changed" })

        app.status = data.status || app.status
        await app.save()

        if(data.status === 'approved') {
            const approvalStatement = `Your application for ${app.job?.title} offered by ${app.job?.company?.name} has been approved. Please contact ${app.job?.contact?.email} for next steps.` 
            
            if(app.applicant?.jobsSelected?.includes(appId)) return res.status(200).json({ flag: "Already approved" })

            if(app.applicant?.jobsRejected?.includes(appId)) {
                const indx = await app.applicant?.jobsRejected?.indexOf(appId)
                app.applicant?.jobsRejected?.splice(indx, 1)
                await app.applicant.save()
            }

            app.applicant?.jobsSelected?.push(appId)
            app.applicant?.inbox?.push({msg: approvalStatement, tone: 'approved'})
            await app.applicant.save()
        }

        if(data.status === 'rejected') {
            const rejectionStatement = `Your application for ${app.job?.title} offered by ${app.job?.company?.name} has been rejected.` 

            if(app.applicant?.jobsRejected?.includes(appId)) return res.status(200).json({ flag: "Already rejected" })

            if(app.applicant?.jobsSelected?.includes(appId)) {
                const indx = await app.applicant?.jobsSelected?.indexOf(appId)
                app.applicant?.jobsRejected?.splice(indx, 1)
                await app.applicant.save()
            }

            app.applicant?.jobsRejected?.push(appId)
            app.applicant?.inbox?.push({msg: rejectionStatement, tone: 'rejected'})
            await app.applicant.save()
        }

        if(data.status === 'applied') {
            if(app.applicant?.jobsSelected?.includes(appId)) {
                const indx = await app.applicant?.jobsSelected?.indexOf(appId)
                app.applicant?.jobsSelected?.splice(indx, 1)
                await app.applicant.save()
            }

            if(app.applicant?.jobsRejected?.includes(appId)) {
                const indx = await app.applicant?.jobsRejected?.indexOf(appId)
                app.applicant?.jobsRejected?.splice(indx, 1)
                await app.applicant.save()
            }
            await app.applicant.save()
        }

        return res.status(200).json({ flag: "status changed successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Server is not working..." })
    }
})


// selected or rejected applications
router.get('/select-reject/:id', fetchUserDetails, async (req, res) => {
    const userId = req.user.id
    const user = await User.findById(userId)
    if (!user) return res.status(401).json({ error: "Authentication failed" })

    try {
        const jobId = req.params.id
        const apps = await Application.find({ job: jobId})
        if (!apps) return res.status(404).json({ error: "Job not found" })
        
        let selected = apps.filter((app) => app.status === "approved")
        let rejected = apps.filter((app) => app.status === "rejected")

        return res.status(200).json({ selected, rejected })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Server is not working..." })
    }
})


// delete 
router.delete('/delete/:id', fetchUserDetails, async (req, res) => {
    const userId = req.user.id
    const user = await User.findById(userId)
    if (!user) return res.status(401).json({ error: "Authentication failed." })

    try {
        const appId = await req.params.id
        const app = await Application.findById(appId)
        if (!app) return res.status(404).json({ error: "Job not found" })

        if (app.applicant.toString() !== userId.toString())
            return res.status(401).json({ error: "Authentication failed." })
        
        if(app.status !== "applied")
            return res.status(401).json({ error: "You can't delete this application.It's already verified." })

        const deleted = await Application.findByIdAndDelete(appId)
        if (user.jobsApplied.includes(app.job)) {
            const indx = user.jobsApplied.indexOf(appId)
            user.jobsApplied.splice(indx, 1)
            await user.save()
        }

        return res.status(200).json({ flag: "deleted successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Server is not working..." })
    }
})



module.exports = router