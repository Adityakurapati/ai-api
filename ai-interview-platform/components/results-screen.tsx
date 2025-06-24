"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Trophy,
  TrendingUp,
  MessageSquare,
  Clock,
  Target,
  ArrowRight,
  RefreshCw,
  Download,
  Share2,
  Star,
  CheckCircle,
  AlertCircle,
  Lightbulb,
} from "lucide-react"
import type { InterviewConfig } from "@/app/page"

interface ResultsScreenProps {
  interviewData: any
  config: InterviewConfig
  onComplete: () => void
  onRetry: () => void
}

export default function ResultsScreen({ interviewData, config, onComplete, onRetry }: ResultsScreenProps) {
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [currentAnalysis, setCurrentAnalysis] = useState(0)

  const analysisSteps = [
    "Analyzing speech patterns...",
    "Evaluating content quality...",
    "Assessing communication skills...",
    "Generating recommendations...",
    "Finalizing report...",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAnalysis((prev) => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1
        } else {
          setAnalysisComplete(true)
          clearInterval(timer)
          return prev
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Mock performance data based on interview
  const performanceData = {
    overallScore: 78,
    communicationScore: 82,
    technicalScore: 75,
    confidenceScore: 80,
    clarityScore: 85,
    strengths: [
      "Clear and articulate communication",
      "Good technical knowledge demonstration",
      "Confident delivery of responses",
      "Well-structured answers",
    ],
    improvements: [
      "Provide more specific examples",
      "Elaborate on problem-solving approaches",
      "Include more quantifiable achievements",
      "Practice concise storytelling",
    ],
    recommendations: [
      {
        category: "Technical Skills",
        suggestion: "Consider practicing more system design questions",
        priority: "High",
      },
      {
        category: "Communication",
        suggestion: "Work on providing concrete examples with metrics",
        priority: "Medium",
      },
      {
        category: "Confidence",
        suggestion: "Practice speaking more slowly and deliberately",
        priority: "Low",
      },
    ],
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent"
    if (score >= 80) return "Good"
    if (score >= 70) return "Average"
    if (score >= 60) return "Below Average"
    return "Needs Improvement"
  }

  if (!analysisComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Analyzing Your Performance</h2>
            <p className="text-white/60">Our AI is evaluating your interview responses...</p>
          </div>

          <div className="space-y-4">
            <Progress value={((currentAnalysis + 1) / analysisSteps.length) * 100} className="h-2" />
            <p className="text-center text-white/80">{analysisSteps[currentAnalysis]}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">Interview Complete!</h1>
          <p className="text-xl text-white/80">Here's your comprehensive performance analysis</p>
        </div>

        {/* Overall Score */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-white">Overall Performance</h2>
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className={`text-6xl font-bold ${getScoreColor(performanceData.overallScore)}`}>
                  {performanceData.overallScore}
                </div>
                <p className="text-white/60">Overall Score</p>
                <Badge variant="secondary">{getScoreLabel(performanceData.overallScore)}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(performanceData.communicationScore)}`}>
                    {performanceData.communicationScore}
                  </div>
                  <p className="text-white/60 text-sm">Communication</p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(performanceData.technicalScore)}`}>
                    {performanceData.technicalScore}
                  </div>
                  <p className="text-white/60 text-sm">Technical</p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(performanceData.confidenceScore)}`}>
                    {performanceData.confidenceScore}
                  </div>
                  <p className="text-white/60 text-sm">Confidence</p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(performanceData.clarityScore)}`}>
                    {performanceData.clarityScore}
                  </div>
                  <p className="text-white/60 text-sm">Clarity</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Strengths */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Key Strengths
            </h3>
            <div className="space-y-3">
              {performanceData.strengths.map((strength, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Star className="w-4 h-4 text-yellow-400 mt-0.5" />
                  <p className="text-white/80">{strength}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Areas for Improvement */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Areas for Improvement
            </h3>
            <div className="space-y-3">
              {performanceData.improvements.map((improvement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5" />
                  <p className="text-white/80">{improvement}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Detailed Recommendations */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Personalized Recommendations
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {performanceData.recommendations.map((rec, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{rec.category}</h4>
                  <Badge
                    variant={
                      rec.priority === "High" ? "destructive" : rec.priority === "Medium" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-white/70 text-sm">{rec.suggestion}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Interview Stats */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Interview Statistics</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {Math.floor(interviewData.duration / 60)}m {interviewData.duration % 60}s
              </div>
              <p className="text-white/60 text-sm">Total Duration</p>
            </div>
            <div className="text-center">
              <MessageSquare className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{interviewData.responses.length}</div>
              <p className="text-white/60 text-sm">Questions Answered</p>
            </div>
            <div className="text-center">
              <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {interviewData.responses.reduce((acc: number, resp: string) => acc + resp.split(" ").length, 0)}
              </div>
              <p className="text-white/60 text-sm">Total Words</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {Math.round(
                  interviewData.responses.reduce((acc: number, resp: string) => acc + resp.split(" ").length, 0) /
                    interviewData.responses.length,
                )}
              </div>
              <p className="text-white/60 text-sm">Avg Words/Answer</p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Retake Interview
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Report
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share Results
          </Button>
          <Button
            onClick={onComplete}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex items-center gap-2"
          >
            Continue to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
