'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type AddActivityProps = {
  onAdd: (name: string, url?: string) => void
}

export default function AddActivity({ onAdd }: AddActivityProps) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onAdd(name.trim(), url.trim() || undefined)
      setName('')
      setUrl('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2 mt-4">
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New activity name"
      />
      <Input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Activity URL (optional)"
      />
      <Button type="submit" className="w-full">Add Activity</Button>
    </form>
  )
}

