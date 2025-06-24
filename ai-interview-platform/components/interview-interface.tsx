"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, HelpCircle, Square, Play, Pause, Edit3, Flag, Volume2, VolumeX, SkipForward } from "lucide-react"
import TalkingAvatar from "@/components/talking-avatar"
import TypewriterText from "@/components/typewriter-text"

interface InterviewConfig {
  interviewType: "technical" | "behavioral" | "general"
  skill?: string
}

interface InterviewInterfaceProps {
  config: InterviewConfig
  onComplete: (data: any) => void
}

// Add this function at the top of the component
const generateQuestionsForConfig = (config: InterviewConfig) => {
  const baseQuestions = [
    "Hello! I'm excited to interview you today. Let's start with something simple - can you tell me your name and what you do?",
    "That's interesting! What inspired you to get into your current field or profession?",
    "Can you share a recent project or achievement you're particularly proud of?",
    "What challenges have you faced recently, and how did you overcome them?",
    "Where do you see yourself or your work heading in the next few years?",
    "Finally, what advice would you give to someone just starting in your field?",
  ]

  // Customize questions based on config
  if (config.interviewType === "technical") {
    return [
      `Hello! I'm excited to interview you for a ${config.skill} position. Let's start - can you tell me about your background in ${config.skill}?`,
      "Can you walk me through a challenging technical problem you've solved recently?",
      "How do you approach debugging and troubleshooting in your work?",
      "What tools and technologies do you prefer to work with and why?",
      "How do you stay updated with the latest developments in your field?",
      "What's a technical concept you've had to explain to non-technical stakeholders?",
    ]
  } else if (config.interviewType === "behavioral") {
    return [
      "Hello! Let's start with your background - can you tell me about yourself and your career journey?",
      "Tell me about a time when you had to work with a difficult team member. How did you handle it?",
      "Describe a situation where you had to meet a tight deadline. What was your approach?",
      "Can you share an example of when you had to learn something completely new for work?",
      "Tell me about a time when you disagreed with your manager. How did you handle it?",
      "What motivates you in your work, and how do you handle stress?",
    ]
  }

  return baseQuestions
}

export default function InterviewInterface({ config, onComplete }: InterviewInterfaceProps) {
  const questions = generateQuestionsForConfig(config)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const [transcription, setTranscription] = useState<string[]>([])
  const [currentTranscript, setCurrentTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false)
  const [questionDisplayed, setQuestionDisplayed] = useState(false)
  const [speechEnabled, setSpeechEnabled] = useState(true)
  const [flaggedLines, setFlaggedLines] = useState<number[]>([])
  const [editingLine, setEditingLine] = useState<number | null>(null)
  const [editText, setEditText] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [speechSupported, setSpeechSupported] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const recognitionRef = useRef<any>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    setSpeechSupported(!!SpeechRecognition)

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US"
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setIsListening(true)
        console.log("Speech recognition started")
      }

      recognition.onresult = (event: any) => {
        let interimTranscript = ""
        let finalTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setInterimTranscript(interimTranscript)

        if (finalTranscript) {
          setCurrentTranscript((prev) => prev + finalTranscript)
          setInterimTranscript("")
        }
      }

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
        console.log("Speech recognition ended")

        // Restart recognition if still recording and not paused
        if (isRecording && !isPaused) {
          setTimeout(() => {
            try {
              recognition.start()
            } catch (error) {
              console.log("Recognition restart failed:", error)
            }
          }, 100)
        }
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [isRecording, isPaused])

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setSessionTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording, isPaused])

  const setupAudioVisualization = (stream: MediaStream) => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream)

      analyserRef.current.fftSize = 256
      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      microphoneRef.current.connect(analyserRef.current)

      const updateAudioLevel = () => {
        if (analyserRef.current && isRecording) {
          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b) / bufferLength
          setAudioLevel(average)
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
        }
      }

      updateAudioLevel()
    } catch (error) {
      console.error("Audio visualization setup failed:", error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        },
      })

      // Setup MediaRecorder for audio recording
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      })

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        audioChunksRef.current = []
        console.log("Audio recording saved:", audioBlob)
      }

      mediaRecorderRef.current.start(1000) // Record in 1-second chunks
      setIsRecording(true)

      // Setup audio visualization
      setupAudioVisualization(stream)

      // Start speech recognition
      if (recognitionRef.current && speechSupported) {
        try {
          recognitionRef.current.start()
        } catch (error) {
          console.log("Speech recognition start failed:", error)
        }
      }
    } catch (error) {
      console.error("Error starting recording:", error)
      alert("Could not access microphone. Please check permissions and try again.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      setIsListening(false)

      // Stop speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }

      // Stop audio visualization
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }

      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())

      // Save current transcript if any
      if (currentTranscript.trim()) {
        setTranscription((prev) => [...prev, currentTranscript.trim()])
        setCurrentTranscript("")
      }
    }
  }

  const togglePause = () => {
    const newPausedState = !isPaused
    setIsPaused(newPausedState)

    if (recognitionRef.current) {
      if (newPausedState) {
        recognitionRef.current.stop()
        setIsListening(false)
      } else {
        try {
          recognitionRef.current.start()
        } catch (error) {
          console.log("Recognition restart failed:", error)
        }
      }
    }
  }

  const handleSpeechEnd = () => {
    setIsAvatarSpeaking(false)
    setQuestionDisplayed(true)
  }

  const toggleSpeech = () => {
    setSpeechEnabled(!speechEnabled)
    if (!speechEnabled && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }

  const skipSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setIsAvatarSpeaking(false)
    setQuestionDisplayed(true)
  }

  const nextQuestion = () => {
    // Save current transcript before moving to next question
    if (currentTranscript.trim()) {
      setTranscription((prev) => [...prev, currentTranscript.trim()])
      setCurrentTranscript("")
      setInterimTranscript("")
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setQuestionDisplayed(false)
      setIsAvatarSpeaking(true)
    } else {
      endInterview()
    }
  }

  const endInterview = () => {
    stopRecording()

    // Save final transcript
    if (currentTranscript.trim()) {
      setTranscription((prev) => [...prev, currentTranscript.trim()])
    }

    // Simulate WhatsApp notification
    setTimeout(() => {
      alert(
        "📱 WhatsApp: Interview completed! Your article is now being processed. You'll receive another message when it's ready.",
      )
    }, 1000)

    // Pass interview data to parent
    onComplete({
      questions: questions.slice(0, currentQuestion + 1),
      responses: transcription,
      duration: sessionTime,
      flaggedLines,
      timestamp: new Date().toISOString(),
    })
  }

  const flagLine = (index: number) => {
    setFlaggedLines((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const startEditing = (index: number, text: string) => {
    setEditingLine(index)
    setEditText(text)
  }

  const saveEdit = () => {
    if (editingLine !== null) {
      setTranscription((prev) => prev.map((text, index) => (index === editingLine ? editText : text)))
      setEditingLine(null)
      setEditText("")
    }
  }

  useEffect(() => {
    // Start with avatar speaking the first question
    setIsAvatarSpeaking(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6">
        {/* Left Panel - Avatar and Question */}
        <div className="flex-1 space-y-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
            <div className="aspect-video bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg overflow-hidden relative">
              <TalkingAvatar
                isPlaying={isAvatarSpeaking && speechEnabled}
                currentQuestion={currentQuestion}
                onSpeechEnd={handleSpeechEnd}
              />

              {/* Audio Level Indicator */}
              {isRecording && (
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 rounded-full px-3 py-2">
                  <div
                    className={`w-3 h-3 rounded-full ${isListening ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                  />
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-100 ${
                          audioLevel > (i * 50) ? "bg-green-400 h-4" : "bg-gray-600 h-2"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-white text-xs">{isListening ? "Listening" : "Paused"}</span>
                </div>
              )}
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Current Question</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-purple-600 text-white">
                  {currentQuestion + 1} / {questions.length}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleSpeech}
                  className={`text-white ${speechEnabled ? "bg-green-600/20" : "bg-red-600/20"}`}
                >
                  {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
                {isAvatarSpeaking && (
                  <Button size="sm" variant="ghost" onClick={skipSpeech} className="text-white/60 hover:text-white">
                    <SkipForward className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="min-h-[100px] flex items-center">
              {questionDisplayed ? (
                <TypewriterText
                  text={questions[currentQuestion]}
                  className="text-white text-lg leading-relaxed"
                  speed={50}
                />
              ) : (
                <div className="text-white/60 text-lg flex items-center gap-2">
                  {isAvatarSpeaking ? (
                    <>
                      <div className="flex gap-1">
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                      Speaking question...
                    </>
                  ) : (
                    "Preparing question..."
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Panel - Transcription */}
        <div className="flex-1">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Live Transcription</h3>
              <div className="flex items-center gap-2">
                <Badge variant={isRecording ? "destructive" : "secondary"}>
                  {isRecording ? "Recording" : "Stopped"}
                </Badge>
                {!speechSupported && (
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                    Speech Recognition Not Supported
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              {transcription.map((text, index) => (
                <div key={index} className="group relative">
                  <div
                    className={`p-3 rounded-lg ${
                      flaggedLines.includes(index) ? "bg-yellow-500/20 border border-yellow-500/40" : "bg-slate-800/50"
                    }`}
                  >
                    {editingLine === index ? (
                      <div className="space-y-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full bg-slate-700 text-white p-2 rounded resize-none"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={saveEdit}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingLine(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-white text-sm leading-relaxed">{text}</p>
                        <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => flagLine(index)}
                            className={flaggedLines.includes(index) ? "text-yellow-400" : "text-white/60"}
                          >
                            <Flag className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditing(index, text)}
                            className="text-white/60"
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {/* Current Live Transcript */}
              {(currentTranscript || interimTranscript) && (
                <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/40">
                  <p className="text-white text-sm leading-relaxed">
                    <span className="text-blue-200">{currentTranscript}</span>
                    <span className="text-blue-300/70 italic">{interimTranscript}</span>
                    {isListening && <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse" />}
                  </p>
                </div>
              )}

              {/* No speech recognition fallback */}
              {!speechSupported && isRecording && (
                <div className="p-3 rounded-lg bg-orange-500/20 border border-orange-500/40">
                  <p className="text-orange-200 text-sm">
                    🎤 Recording audio... (Speech recognition not available in this browser. Please use Chrome, Edge, or
                    Safari for live transcription)
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-black/50 backdrop-blur-sm border-t border-white/20 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isRecording && !isPaused ? "bg-red-500 animate-pulse" : "bg-gray-500"
                }`}
              />
              <span className="text-white font-medium">
                {isRecording ? (isPaused ? "Paused" : "Recording") : "Stopped"}
              </span>
              {isRecording && (
                <span className="text-white/60 text-sm">{isListening ? "🎤 Listening" : "⏸️ Speech Paused"}</span>
              )}
            </div>

            <div className="text-white font-mono">{formatTime(sessionTime)}</div>
          </div>

          <div className="flex items-center gap-3">
            {!isRecording ? (
              <Button onClick={startRecording} className="bg-green-600 hover:bg-green-700">
                <Mic className="w-4 h-4 mr-2" />
                Start Recording
              </Button>
            ) : (
              <>
                <Button onClick={togglePause} variant="outline">
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </Button>
                <Button onClick={nextQuestion} className="bg-blue-600 hover:bg-blue-700">
                  {currentQuestion < questions.length - 1 ? "Next Question" : "Complete Interview"}
                </Button>
              </>
            )}

            <Button onClick={endInterview} variant="destructive">
              <Square className="w-4 h-4 mr-2" />
              End Interview
            </Button>

            <Button variant="ghost" className="text-white">
              <HelpCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
