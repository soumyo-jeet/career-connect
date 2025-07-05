"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TrashIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useContext } from "react"
import UserContext from "@/app/contexts/User/UserContext"

export function MessageCard({ msg, type, id }) {
  const userContext = useContext(UserContext)
  const { clearInbox, fetchUser } = userContext

  const typeStyles = {
    approved: "bg-emerald-50 border-emerald-200",
    applied: "bg-amber-50 border-amber-200",
    rejected: "bg-red-50 border-red-200",
    default: "bg-gray-50 border-gray-200"
  }

  const textStyles = {
    approved: "text-emerald-800",
    applied: "text-amber-800",
    rejected: "text-red-800",
    default: "text-gray-800"
  }

  const handleDelete = async () => {
    const flag = await clearInbox(id)
    if(flag) fetchUser()
  }

  return (
    <Card className={cn(
      "border rounded-lg shadow-sm overflow-hidden",
      typeStyles[type]
    )}>
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className={cn("flex-1 text-sm", textStyles[type])}>
          {msg}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-white/50"
          onClick={handleDelete}
        >
          <X className="h-4 w-4 text-red-600" />
        </Button>
      </CardContent>
    </Card>
  )
}