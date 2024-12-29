'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ActivityList from '@/components/ActivityList'
import EditableText from '@/components/EditableText'

type Activity = {
  name: string
  url?: string
  weight?: number  // 1-5, higher means more likely to be chosen
  lastUsed?: string  // ISO date string
}

type Category = {
  name: string
  activities: Activity[]
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("categories")

  useEffect(() => {
    const savedCategories = localStorage.getItem('categories')
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    } else {
      // Set default categories
      const defaultCategories: Category[] = [
        { name: 'Therapy', activities: [
          { name: 'sauna/coldplunge' },
          { name: 'Massage' },
          { name: 'Quiro' }
        ] },
        { name: 'Nature sports', activities: [
          { name: 'Bike' },
          { name: 'Hike' }
        ]},
        { name: 'Water sports', activities: [
          { name: 'Surf' },
          { name: 'Sailing' },
          { name: 'Swim' }
        ]},
        { name: 'Museums', activities: [
          { name: 'Tech Museum' },
          { name: 'Children\'s Discovery Museum' },
          { name: 'California science museum' },
          { name: 'Lawrence Hall of Science' },
          { name: 'Telescope' },
          { name: 'Deyoung Museum' },
          { name: 'MoMa' },
          { name: 'Egypt Museum' },
          { name: 'Exploratorium' },
          { name: 'USS Hornet' },
          { name: 'Monterrey aquarium' },
          { name: 'Bay Aquarium' },
          { name: 'Disney museum' },
          { name: 'Pinball Museum' },
          { name: 'Arcade Museum' }
        ]},
        { name: 'Indoor', activities: [
          { name: 'Arcades games' },
          { name: 'Bowling' },
          { name: 'go-kart' },
          { name: 'Lasermax' },
          { name: 'Sandbox VR' },
          { name: 'Minigolf/virtual' },
          { name: 'Spin Ping Pong' },
          { name: 'pingpong' },
          { name: 'Ice skate/Roller skate' }
        ]}
      ]
      setCategories(defaultCategories)
      localStorage.setItem('categories', JSON.stringify(defaultCategories))
    }
  }, [])

  const randomizeAll = () => {
    const now = new Date().toISOString()
    const ONE_DAY = 24 * 60 * 60 * 1000 // milliseconds in a day
    
    const shuffledCategories = [...categories].sort(() => Math.random() - 0.5)
    const fullyShuffled = shuffledCategories.map(category => {
      // Sort activities based on weights and last used date
      const sortedActivities = [...category.activities].sort((a, b) => {
        // Calculate time-based score (activities not used recently get higher scores)
        const aLastUsed = a.lastUsed ? new Date(a.lastUsed).getTime() : 0
        const bLastUsed = b.lastUsed ? new Date(b.lastUsed).getTime() : 0
        const aTimeFactor = aLastUsed ? (Date.now() - aLastUsed) / ONE_DAY : 7 // If never used, assume 7 days
        const bTimeFactor = bLastUsed ? (Date.now() - bLastUsed) / ONE_DAY : 7
        
        // Use weight or default to 1
        const aWeight = a.weight || 1
        const bWeight = b.weight || 1
        
        // Combine time factor and weight for final score
        const aScore = aWeight * (1 + Math.min(aTimeFactor, 7) / 7)
        const bScore = bWeight * (1 + Math.min(bTimeFactor, 7) / 7)
        
        // Add randomness to the score
        return (bScore + Math.random() * 0.5) - (aScore + Math.random() * 0.5)
      })

      // Mark the top activity as used
      if (sortedActivities.length > 0) {
        sortedActivities[0] = { ...sortedActivities[0], lastUsed: now }
      }

      return {
        ...category,
        activities: sortedActivities
      }
    })
    
    setCategories(fullyShuffled)
    localStorage.setItem('categories', JSON.stringify(fullyShuffled))
  }

  const addCategory = (name: string) => {
    const newCategories = [...categories, { name, activities: [] }]
    setCategories(newCategories)
    localStorage.setItem('categories', JSON.stringify(newCategories))
  }

  const addActivity = (categoryName: string, activityName: string, url?: string) => {
    const newCategories = categories.map(category => 
      category.name === categoryName 
        ? { ...category, activities: [...category.activities, { 
            name: activityName, 
            url,
            weight: 1, // default weight
            lastUsed: null 
          }] }
        : category
    )
    setCategories(newCategories)
    localStorage.setItem('categories', JSON.stringify(newCategories))
  }

  const deleteActivity = (categoryName: string, activityName: string) => {
    const newCategories = categories.map(category => 
      category.name === categoryName 
        ? { ...category, activities: category.activities.filter(a => a.name !== activityName) }
        : category
    )
    setCategories(newCategories)
    localStorage.setItem('categories', JSON.stringify(newCategories))
  }

  const deleteCategory = (categoryName: string) => {
    const newCategories = categories.filter(category => category.name !== categoryName)
    setCategories(newCategories)
    localStorage.setItem('categories', JSON.stringify(newCategories))
    if (selectedCategory === categoryName) {
      setSelectedCategory(null)
    }
  }

  const editCategory = (oldName: string, newName: string) => {
    const newCategories = categories.map(category =>
      category.name === oldName ? { ...category, name: newName } : category
    )
    setCategories(newCategories)
    localStorage.setItem('categories', JSON.stringify(newCategories))
    if (selectedCategory === oldName) {
      setSelectedCategory(newName)
    }
  }

  const editActivity = (categoryName: string, oldName: string, newName: string, newUrl?: string, newWeight?: number) => {
    const newCategories = categories.map(category =>
      category.name === categoryName
        ? {
            ...category,
            activities: category.activities.map(activity =>
              activity.name === oldName ? { name: newName, url: newUrl, weight: newWeight } : activity
            )
          }
        : category
    )
    setCategories(newCategories)
    localStorage.setItem('categories', JSON.stringify(newCategories))
  }

  return (
    <main className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Activities Randomizer</h1>
      <p className="mb-10 text-center">Choose the first category in the list, then click view and do the first activity in the list</p>
      <Button onClick={randomizeAll} className="w-full mb-6">Give me my next activity</Button>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>
        <TabsContent value="categories" className="mt-4">
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div 
                key={category.name} 
                className="flex items-center justify-between bg-secondary p-3 rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={() => {
                  setSelectedCategory(category.name);
                  setActiveTab("activities");
                }}
              >
                <EditableText
                  initialText={category.name}
                  onSave={(newName) => editCategory(category.name, newName)}
                  className={`${index === 0 ? "font-bold" : ""}`}
                />
                <div className="flex items-center space-x-2">
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="activities" className="mt-4">
          {selectedCategory ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Activities for {selectedCategory}</h2>
              <ActivityList 
                activities={categories.find(c => c.name === selectedCategory)?.activities || []}
                categoryName={selectedCategory}
                onDeleteActivity={(activityName) => deleteActivity(selectedCategory, activityName)}
                onEditActivity={(oldName, newName, newUrl, newWeight) => editActivity(selectedCategory, oldName, newName, newUrl, newWeight)}
              />
            </>
          ) : (
            <p className="text-center text-muted-foreground">Select a category to view activities</p>
          )}
        </TabsContent>
      </Tabs>
    </main>
  )
}
