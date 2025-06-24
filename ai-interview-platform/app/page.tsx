"use client"

import { useState } from "react"
import SetupScreen from "@/components/setup-screen"
import IntroScreen from "@/components/intro-screen"
import InterviewInterface from "@/components/interview-interface"
import ResultsScreen from "@/components/results-screen"
import Dashboard from "@/components/dashboard"

export type InterviewConfig = {
        skill: string
        proficiency: string
        duration: number
        interviewType: string
        focusAreas: string[]
}

export default function Home() {
        const [currentView, setCurrentView] = useState<"setup" | "intro" | "interview" | "results" | "dashboard">("setup")
        const [interviewConfig, setInterviewConfig] = useState<InterviewConfig | null>(null)
        const [interviewData, setInterviewData] = useState(null)

        const handleSetupComplete = (config: InterviewConfig) => {
                setInterviewConfig(config)
                setCurrentView("intro")
        }

        const handleIntroComplete = () => {
                setCurrentView("interview")
        }

        const handleInterviewComplete = (data: any) => {
                setInterviewData(data)
                setCurrentView("results")
        }

        const handleResultsComplete = () => {
                setCurrentView("dashboard")
        }

        const handleBackToSetup = () => {
                setCurrentView("setup")
                setInterviewConfig(null)
                setInterviewData(null)
        }

        const handleBackToInterview = () => {
                setCurrentView("interview")
        }

        return (
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                        {currentView === "setup" && <SetupScreen onComplete={handleSetupComplete} />}

                        {currentView === "intro" && interviewConfig && (
                                <IntroScreen config={interviewConfig} onComplete={handleIntroComplete} onBack={() => setCurrentView("setup")} />
                        )}

                        {currentView === "interview" && interviewConfig && (
                                <InterviewInterface config={interviewConfig} onComplete={handleInterviewComplete} />
                        )}

                        {currentView === "results" && interviewData && interviewConfig && (
                                <ResultsScreen
                                        interviewData={interviewData}
                                        config={interviewConfig}
                                        onComplete={handleResultsComplete}
                                        onRetry={handleBackToInterview}
                                />
                        )}

                        {currentView === "dashboard" && interviewData && (
                                <Dashboard interviewData={interviewData} onBack={handleBackToSetup} />
                        )}
                </div>
        )
}
