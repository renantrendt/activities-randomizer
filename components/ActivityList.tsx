'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Trash2 } from 'lucide-react'
import EditableText from './EditableText'

type Activity = {
  name: string
  url?: string
  weight?: number
  lastUsed?: string
}

type ActivityListProps = {
  activities: Activity[]
  categoryName: string
  onDeleteActivity: (activityName: string) => void
  onEditActivity: (oldName: string, newName: string, newUrl?: string, newWeight?: number) => void
}

export default function ActivityList({ activities, categoryName, onDeleteActivity, onEditActivity }: ActivityListProps) {
  const [shuffledActivities, setShuffledActivities] = useState(activities)

  useEffect(() => {
    setShuffledActivities(activities)
  }, [activities])

  if (activities.length === 0) {
    return <p className="text-center text-muted-foreground">No activities in this category yet.</p>
  }

  const formatLastUsed = (lastUsed: string | undefined) => {
    if (!lastUsed) return 'Never used'
    const date = new Date(lastUsed)
    const days = Math.floor((Date.now() - date.getTime()) / (24 * 60 * 60 * 1000))
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    return `${days} days ago`
  }

  return (
    <div className="space-y-2">
      {shuffledActivities.map((activity, index) => (
        <div 
          key={activity.name} 
          className={`flex items-center justify-between bg-secondary p-3 rounded-lg ${
            index === 0 ? "ring-2 ring-primary" : ""
          }`}
        >
          <div className="flex-grow">
            <EditableText
              initialText={activity.name}
              initialUrl={activity.url}
              onSave={(newName, newUrl) => onEditActivity(activity.name, newName, newUrl, activity.weight)}
              className="mr-2"
            />
          </div>
        </div>
      ))}
    </div>
  )
}
