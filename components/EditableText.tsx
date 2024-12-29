'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Check, X } from 'lucide-react'

type EditableTextProps = {
  initialText: string
  initialUrl?: string
  onSave: (newText: string, newUrl?: string) => void
  className?: string
}

export default function EditableText({ initialText, initialUrl, onSave, className }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(initialText)
  const [url, setUrl] = useState(initialUrl || '')

  const handleSave = () => {
    onSave(text, url || undefined)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setText(initialText)
    setUrl(initialUrl || '')
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className={`flex flex-col space-y-2 ${className}`}>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Activity name"
        />
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL (optional)"
        />
        <div className="flex justify-end space-x-2">
          <Button onClick={handleSave} variant="outline" size="sm">
            <Check size={16} className="mr-2" /> Save
          </Button>
          <Button onClick={handleCancel} variant="ghost" size="sm">
            <X size={16} className="mr-2" /> Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-between w-full ${className}`}>
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          {text}
        </a>
      ) : (
        <span>{text}</span>
      )}
    </div>
  )
}

