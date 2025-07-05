const express = require('express')
const User = require('../models/user')
const Job = require('../models/job')
const Application = require('../models/application')
const fetchUserDetails = require('../middlewares/fetchUser')
const { body, validationResult } = require('express-validator')
const router = express.Router()

// fetch all jobs
router.get('/getall', fetchUserDetails, async (req, res) => {
    const userId = req.user.id
    const user = await User.findById(userId)
    if (!user) return res.status(401).json({ jobDtlsError: "Authentication failed." })

    try {
        const jobs = await Job.find({})
        // created jobs
        const createdJobs = await Job.find({ owner: userId })
        // applied jobs
        const appliedJobs = await jobs.filter((job) => user.jobsApplied?.includes(job._id))
        // others
        const otherJobs = await jobs.filter((job) => ((job.owner.toString() !== userId.toString()) && !(user.jobsApplied?.includes(job._id))))

        return res.status(200).json({ otherJobs: otherJobs, createdJobs: createdJobs, appliedJobs: appliedJobs })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ jobDtlsError: "Server is not working..." })
    }
})

// filtered jobs
router.get('/filter', fetchUserDetails, async (req, res) => {
    const userId = req.user.id
    const user = await User.findById(userId)
    if (!user) return res.status(401).json({ jobDtlsError: "Authentication failed." })

    try {
        const jobs = await Job.find({}).populate("clicks")
        const otherJobs = jobs.filter((job) => ((job.owner.toString() !== userId.toString()) && !(user.appliedJobs?.includes(job._id))))
        let interestMatchingJobs =[]  
        let peopleMatchingJobs=[]
        let skillsMatchingJobs = []

        if( user.interests.length ) {
            // interest match
            interestMatchingJobs = otherJobs.filter((job) => user.interests.includes(job.profile))
            // people match
            peopleMatchingJobs = otherJobs.filter((job) => 
            user.interests.some(interest => job.clicks?.interests?.includes(interest)))
        }
        // skills match
        if( user.skills.length ) {
            skillsMatchingJobs = otherJobs.filter((job) => 
            user.skills.some(skill => job.skillRequirements?.includes(skill)))
        }

        return res.status(200).json({ interestMatchingJobs, peopleMatchingJobs, skillsMatchingJobs })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ jobDtlsError: "Server is not working..." })
    }
})

// job post
router.post('/create', fetchUserDetails,
    [
        body('title', 'Entre a valid title.').isLength({ min: 3 }),
        body('salary', 'Package is required.').notEmpty(),
        body('compName', 'company name is required.').notEmpty(),
        body('compAdd', 'company address is required.').notEmpty(),
        body('jobDtls', 'job details is required.').notEmpty(),
        body('mode', 'job mode is required.').notEmpty(),
        body('skillRequirements', 'skill is required.').notEmpty(),
        body('applyStarts', 'date is required.').notEmpty(),
        body('applyEnds', 'date is required.').notEmpty(),
        body('profile', 'job profile is required.').notEmpty(),

    ],
    async (req, res) => {
        const userId = req.user.id
        const user = await User.findById(userId)
        if (!user) return res.status(401).json({ error: "Authentication failed." })

        try {
            //checking if any feild has invalid value.
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const data = await req.body
            const newJob = new Job({
                title: data.title,
                owner: userId,
                tag: data.tag || [],
                profile: data.profile,
                contact: { ph: data.ph || "", email: data.email || user.email },
                mode: data.mode,
                package: data.salary,
                jobDtls: data.jobDtls,
                skillRequirements: data.skillRequirements,
                company: { name: data.compName, logo: data.complogo || "" , address: data.compAdd},
                requireApplicants: data.requireApplicants || 0,
                applyStarts: data.applyStarts,
                applyEnds: data.applyEnds
            })

            await newJob.save()

            user.jobsCreated.push(newJob)
            await user.save()

            return res.status(200).json({ flag: "Job created successfully." })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Server is not working..." })
        }

})

// visit handle
router.get('/clicks/:id', fetchUserDetails, async (req, res) => {
    const userId = req.user.id
    const user = await User.findById(userId)
    if (!user) return res.status(401).json({ jobDtlsError: "Authentication failed." })

    try {
        const jobId = await req.params.id
        const job = await Job.findById(jobId).populate("owner", "-password")
        if (!job) return res.status(404).json({ error: "Job not found" })


        if (job.clicks.includes(userId) || job.owner._id.toString() === userId.toString())
            return res.status(201).json({ flag: "visit is not to register.", job })

        job.clicks.push(userId)
        await job.save()
        return res.status(200).json({ flag: "visit registered", job })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ jobDtlsError: "Server is not working..." })
    }

})

// like unlike handle
router.get('/likeUnlike/:id', fetchUserDetails, async (req, res) => {
    const userId = req.user.id
    const user = await User.findById(userId)
    if (!user) return res.status(401).json({ error: "Authentication failed." })

    try {
        const jobId = req.params.id
        const job = await Job.findById(jobId)
        if (!job) return res.status(404).json({ error: "Job not found" })


        if (job.likes.includes(userId)) {
            const indx = job.likes.indexOf(userId)
            job.likes.splice(indx, 1)
            await job.save()
            return res.status(200).json({ flag: "Unliked successfully" })
        }

        job.likes.push(userId)
        await job.save()
        return res.status(200).json({ flag: "liked successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Server is not working..." })
    }

})

// apply 
router.post('/apply/:id', fetchUserDetails,
    [
        body('resume', 'Resume is requiered.').notEmpty()
    ],
    async (req, res) => {
        const userId = req.user.id
        const user = await User.findById(userId)
        if (!user) return res.status(401).json({ jobDtlsError: "Authentication failed." })

        try {
            //checking if any feild has invalid value.
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const jobId = req.params.id
            const job = await Job.findById(jobId)
            if (!job) return res.status(404).json({ error: "Job not found" })

            if (job.owner.toString() === userId.toString()) return res.status(401).json({ error: "Apply is not possible " })
            if (user.jobsApplied.includes(jobId)) return res.status(401).json({ error: "Already applied" })

            const data = await req.body
            const newApplication = new Application({
                applicant: userId,
                job: jobId,
                resume: data.resume,
                applicantContact: { ph: data.ph || "", email: data.email || user.email, address: data.add || "" },
                applicantSkills: data.skills || user.skills || [],
                rsnToApply: data.rsn || "",
                status: "applied"
            })

            await newApplication.save()

            job.applications.push(newApplication)
            await job.save()

            const jobApplyStatement = `Your application for ${job?.title} offered by ${job?.company?.name} has been applied. Stay tuned for further notification.`
            user.inbox.push({ msg: jobApplyStatement, tone: "applied" })
            user.jobsApplied.push(jobId)
            await user.save()

            return res.status(200).json({ flag: "Your application is confirmed." })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ jobDtlsError: "Server is not working..." })
        }
    })



    // delete
router.delete('/delete/:id', fetchUserDetails, async (req, res) => {
    const userId = req.user.id
    const user = await User.findById(userId)
    if (!user) return res.status(401).json({ error: "Authentication failed." })

    try {
        const jobId = await req.params.id
        const job = await Job.findById(jobId)
        if (!job) return res.status(404).json({ error: "Job not found" })


        if (job.owner.toString() !== userId.toString())
            return res.status(401).json({ error: "Authentication failed." })

        const deleted = await Job.findByIdAndDelete(jobId)
        if (user.jobsCreated.includes(jobId)) {
            const indx = user.jobsCreated.indexOf(jobId)
            user.jobsCreated.splice(indx, 1)
            await user.save()
        }

        return res.status(200).json({ flag: "deleted successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Server is not working..." })
    }
})


module.exports = router