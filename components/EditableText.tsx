'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"

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

  const handleSubmit = () => {
    if (text.trim()) {
      onSave(text.trim(), url.trim() || undefined)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <div className={`space-y-2 ${className}`}>
        <Input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit()
            if (e.key === 'Escape') {
              setText(initialText)
              setUrl(initialUrl || '')
              setIsEditing(false)
            }
          }}
          onBlur={handleSubmit}
          autoFocus
        />
        <Input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL (optional)"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit()
            if (e.key === 'Escape') {
              setText(initialText)
              setUrl(initialUrl || '')
              setIsEditing(false)
            }
          }}
          onBlur={handleSubmit}
        />
      </div>
    )
  }

  return (
    <div 
      className={`cursor-pointer ${className}`} 
      onClick={() => setIsEditing(true)}
    >
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          {text}
        </a>
      ) : (
        text
      )}
    </div>
  )
}
