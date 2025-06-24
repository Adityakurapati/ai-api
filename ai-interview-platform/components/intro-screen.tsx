"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle, Mic, Camera, Volume2, Target, Users, Lightbulb } from "lucide-react"
import type { InterviewConfig } from "@/app/page"

interface IntroScreenProps {
  config: InterviewConfig
  onComplete: () => void
  onBack: () => void
}

const tips = [
  {
    icon: Mic,
    title: "Clear Audio",
    description: "Ensure you're in a quiet environment with good microphone quality",
  },
  {
    icon: Camera,
    title: "Professional Setup",
    description: "Position yourself well-lit and maintain eye contact with the camera",
  },
  {
    icon: Volume2,
    title: "Audio Check",
    description: "Test your speakers/headphones to hear questions clearly",
  },
  {
    icon: Target,
    title: "Stay Focused",
    description: "Take your time to think before answering each question",
  },
]

export default function IntroScreen({ config, onComplete, onBack }: IntroScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const steps = ["Interview Overview", "Technical Setup", "Final Preparation"]

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && isReady) {
      onComplete()
    }
  }, [countdown, isReady, onComplete])

  const handleStartCountdown = () => {
    setIsReady(true)
    setCountdown(3)
  }

  const getSkillName = (skillId: string) => {
    const skillMap: { [key: string]: string } = {
      frontend: "Frontend Development",
      backend: "Backend Development",
      fullstack: "Full Stack Development",
      design: "UI/UX Design",
      marketing: "Digital Marketing",
      management: "Project Management",
      business: "Business Analysis",
      healthcare: "Healthcare",
    }
    return skillMap[skillId] || skillId
  }

  const getProficiencyLabel = (proficiency: string) => {
    const proficiencyMap: { [key: string]: string } = {
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
      expert: "Expert",
    }
    return proficiencyMap[proficiency] || proficiency
  }

  const getInterviewTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      technical: "Technical Interview",
      behavioral: "Behavioral Interview",
      mixed: "Mixed Interview",
    }
    return typeMap[type] || type
  }

  if (countdown > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="text-8xl font-bold text-white animate-pulse">{countdown}</div>
          <p className="text-2xl text-white/80">Get ready! Interview starting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Setup
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Interview Preparation</h1>
            <p className="text-white/60">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
          <div className="w-24" /> {/* Spacer */}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
          <div className="flex justify-between text-sm text-white/60">
            {steps.map((step, index) => (
              <span key={step} className={index <= currentStep ? "text-white" : ""}>
                {step}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 0 && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Interview Configuration */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Your Interview Configuration
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Skill Area:</span>
                  <Badge variant="secondary">{getSkillName(config.skill)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Proficiency:</span>
                  <Badge variant="outline">{getProficiencyLabel(config.proficiency)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Interview Type:</span>
                  <Badge>{getInterviewTypeLabel(config.interviewType)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Duration:</span>
                  <Badge variant="secondary">{config.duration} minutes</Badge>
                </div>
                {config.focusAreas.length > 0 && (
                  <div>
                    <span className="text-white/80 block mb-2">Focus Areas:</span>
                    <div className="flex flex-wrap gap-2">
                      {config.focusAreas.map((area) => (
                        <Badge key={area} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* What to Expect */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                What to Expect
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">AI-Powered Questions</p>
                    <p className="text-white/60 text-sm">Tailored questions based on your skill level and experience</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Real-time Transcription</p>
                    <p className="text-white/60 text-sm">Your responses will be transcribed and analyzed live</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Instant Feedback</p>
                    <p className="text-white/60 text-sm">Get detailed analysis and improvement suggestions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Professional Report</p>
                    <p className="text-white/60 text-sm">Receive a comprehensive performance report</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {currentStep === 1 && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Setup Tips */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Setup Tips</h2>
              <div className="space-y-4">
                {tips.map((tip, index) => {
                  const Icon = tip.icon
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{tip.title}</p>
                        <p className="text-white/60 text-sm">{tip.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* System Check */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">System Check</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Microphone Access</span>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Audio Output</span>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Speech Recognition</span>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Internet Connection</span>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {currentStep === 2 && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8 text-center">
              <div className="space-y-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Ready to Begin!</h2>
                <p className="text-white/80 text-lg">
                  You're all set for your {getInterviewTypeLabel(config.interviewType).toLowerCase()}
                  focused on {getSkillName(config.skill).toLowerCase()}.
                </p>
                <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-4">
                  <p className="text-blue-200 text-sm">
                    💡 <strong>Pro Tip:</strong> Take a deep breath, be yourself, and remember that this is a learning
                    experience. The AI interviewer is here to help you improve!
                  </p>
                </div>
                <Button
                  onClick={handleStartCountdown}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
                >
                  Start Interview
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
