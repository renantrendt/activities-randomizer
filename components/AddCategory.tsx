'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type AddCategoryProps = {
  onAdd: (name: string) => void
}

export default function AddCategory({ onAdd }: AddCategoryProps) {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onAdd(name.trim())
      setName('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2 mt-4">
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New category name"
      />
      <Button type="submit" className="w-full">Add Category</Button>
    </form>
  )
}

