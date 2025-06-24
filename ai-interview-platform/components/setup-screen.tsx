"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Code,
  Palette,
  TrendingUp,
  Users,
  Briefcase,
  Heart,
  ArrowRight,
  Clock,
  Target,
  CheckCircle,
} from "lucide-react"
import type { InterviewConfig } from "@/app/page"

interface SetupScreenProps {
  onComplete: (config: InterviewConfig) => void
}

const skills = [
  { id: "frontend", name: "Frontend Development", icon: Code, color: "bg-blue-500" },
  { id: "backend", name: "Backend Development", icon: Code, color: "bg-green-500" },
  { id: "fullstack", name: "Full Stack Development", icon: Code, color: "bg-purple-500" },
  { id: "design", name: "UI/UX Design", icon: Palette, color: "bg-pink-500" },
  { id: "marketing", name: "Digital Marketing", icon: TrendingUp, color: "bg-orange-500" },
  { id: "management", name: "Project Management", icon: Users, color: "bg-indigo-500" },
  { id: "business", name: "Business Analysis", icon: Briefcase, color: "bg-teal-500" },
  { id: "healthcare", name: "Healthcare", icon: Heart, color: "bg-red-500" },
]

const proficiencyLevels = [
  { value: "beginner", label: "Beginner", description: "0-1 years experience" },
  { value: "intermediate", label: "Intermediate", description: "2-4 years experience" },
  { value: "advanced", label: "Advanced", description: "5-8 years experience" },
  { value: "expert", label: "Expert", description: "8+ years experience" },
]

const interviewTypes = [
  { id: "technical", name: "Technical Interview", description: "Focus on technical skills and problem-solving" },
  { id: "behavioral", name: "Behavioral Interview", description: "Focus on soft skills and past experiences" },
  { id: "mixed", name: "Mixed Interview", description: "Combination of technical and behavioral questions" },
]

const focusAreas = [
  "Problem Solving",
  "Communication Skills",
  "Leadership Experience",
  "Team Collaboration",
  "Project Management",
  "Technical Expertise",
  "Innovation & Creativity",
  "Adaptability",
]

export default function SetupScreen({ onComplete }: SetupScreenProps) {
  const [selectedSkill, setSelectedSkill] = useState("")
  const [selectedProficiency, setSelectedProficiency] = useState("")
  const [duration, setDuration] = useState([15])
  const [selectedInterviewType, setSelectedInterviewType] = useState("")
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([])

  const handleFocusAreaToggle = (area: string) => {
    setSelectedFocusAreas((prev) => (prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]))
  }

  const handleStartInterview = () => {
    if (selectedSkill && selectedProficiency && selectedInterviewType) {
      onComplete({
        skill: selectedSkill,
        proficiency: selectedProficiency,
        duration: duration[0],
        interviewType: selectedInterviewType,
        focusAreas: selectedFocusAreas,
      })
    }
  }

  const isFormValid = selectedSkill && selectedProficiency && selectedInterviewType

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">AI Interview Setup</h1>
          <p className="text-xl text-white/80">Configure your personalized interview experience</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Skill Selection */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Select Your Skill Area
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {skills.map((skill) => {
                  const Icon = skill.icon
                  return (
                    <button
                      key={skill.id}
                      onClick={() => setSelectedSkill(skill.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedSkill === skill.id
                          ? "border-white bg-white/20"
                          : "border-white/20 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full ${skill.color} flex items-center justify-center mb-2`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-white text-sm font-medium">{skill.name}</p>
                    </button>
                  )
                })}
              </div>
            </Card>

            {/* Proficiency Level */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Proficiency Level</h2>
              <div className="space-y-3">
                {proficiencyLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setSelectedProficiency(level.value)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedProficiency === level.value
                        ? "border-white bg-white/20"
                        : "border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{level.label}</p>
                        <p className="text-white/60 text-sm">{level.description}</p>
                      </div>
                      {selectedProficiency === level.value && <CheckCircle className="w-5 h-5 text-green-400" />}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Interview Type */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Interview Type</h2>
              <div className="space-y-3">
                {interviewTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedInterviewType(type.id)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedInterviewType === type.id
                        ? "border-white bg-white/20"
                        : "border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{type.name}</p>
                        <p className="text-white/60 text-sm">{type.description}</p>
                      </div>
                      {selectedInterviewType === type.id && <CheckCircle className="w-5 h-5 text-green-400" />}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Duration */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Interview Duration
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Duration: {duration[0]} minutes</Label>
                  <Badge variant="secondary">
                    {duration[0] < 20 ? "Quick" : duration[0] < 40 ? "Standard" : "Comprehensive"}
                  </Badge>
                </div>
                <Slider value={duration} onValueChange={setDuration} max={60} min={10} step={5} className="w-full" />
                <div className="flex justify-between text-sm text-white/60">
                  <span>10 min</span>
                  <span>35 min</span>
                  <span>60 min</span>
                </div>
              </div>
            </Card>

            {/* Focus Areas */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Focus Areas (Optional)</h2>
              <div className="grid grid-cols-2 gap-3">
                {focusAreas.map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={area}
                      checked={selectedFocusAreas.includes(area)}
                      onCheckedChange={() => handleFocusAreaToggle(area)}
                    />
                    <Label htmlFor={area} className="text-white text-sm">
                      {area}
                    </Label>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Start Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleStartInterview}
            disabled={!isFormValid}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
          >
            Start Interview Setup
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
