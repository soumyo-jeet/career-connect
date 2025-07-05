"use state"
import Jobcontext from "@/app/contexts/Job/JobContext"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useContext, useEffect, useState } from "react"

export function DeleteJobDialog({ children, jobId }) {
    const [flag, setflag] = useState("")
    const [open, setopen] = useState(false)
    const jobContext = useContext(Jobcontext)
    const { fetchJobs, deleteJob } = jobContext
    useEffect(() => {
      console.log(jobId)
    }, [])
    


    const handleDelete = async () => {
        const flag = await deleteJob(jobId)
        if (flag) {
            fetchJobs()
            setopen(false)
        }
    }

    
    


    return (
        <Dialog open={open} onOpenChange={setopen}>
            {children}

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Job</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. Are you sure you want to permanently
                        delete this job from our platform? If yes type "yes".
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-2">
                        <Input
                            id="link"
                            value={flag}
                            onChange={(e) => setflag(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setopen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="px-6 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-red-500"
                        disabled={flag.trim().toLowerCase() !== "yes"}
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
