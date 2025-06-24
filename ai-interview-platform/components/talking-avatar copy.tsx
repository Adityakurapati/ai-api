"use client"

import { useRef, useState, useEffect, Suspense, useCallback } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, OrbitControls, Environment } from "@react-three/drei"
import type * as THREE from "three"

interface TalkingAvatarProps {
        isPlaying: boolean
        currentQuestion: number
        onSpeechEnd?: () => void
}

function AvatarModel({ visemeData, isPlaying }: { visemeData: any[]; isPlaying: boolean }) {
        const { scene } = useGLTF("/models/avatar1.glb")
        const meshRef = useRef<THREE.Mesh>()
        const clockRef = useRef(0)

        // Map viseme names to blendshape indices for Ready Player Me models
        const visemeMap = {
                A: "viseme_aa",
                E: "viseme_E",
                I: "viseme_I",
                O: "viseme_O",
                U: "viseme_U",
                M: "viseme_PP",
                B: "viseme_PP",
                P: "viseme_PP",
                F: "viseme_FF",
                V: "viseme_FF",
                T: "viseme_TH",
                D: "viseme_DD",
                K: "viseme_kk",
                G: "viseme_kk",
                S: "viseme_SS",
                Z: "viseme_SS",
                R: "viseme_RR",
                L: "viseme_nn",
                N: "viseme_nn",
        }

        useFrame((state, delta) => {
                clockRef.current += delta

                if (meshRef.current && isPlaying) {
                        const currentTime = clockRef.current

                        // Find current viseme based on time
                        const currentViseme = visemeData.find((v) => currentTime >= v.start && currentTime < v.end)

                        // Reset all morph targets
                        if (meshRef.current.morphTargetInfluences) {
                                meshRef.current.morphTargetInfluences.fill(0)
                        }

                        if (currentViseme && meshRef.current.morphTargetDictionary) {
                                const morphTargetName = visemeMap[currentViseme.viseme as keyof typeof visemeMap]
                                const index = meshRef.current.morphTargetDictionary[morphTargetName]

                                if (index !== undefined && meshRef.current.morphTargetInfluences) {
                                        meshRef.current.morphTargetInfluences[index] = currentViseme.weight || 1
                                }
                        }

                        // Add subtle head movement and blinking
                        if (scene) {
                                scene.rotation.y = Math.sin(currentTime * 0.5) * 0.05
                                // Subtle movement while maintaining upper body position
                                scene.position.y = Math.sin(currentTime * 2) * 0.01 - 3.2
                        }
                } else {
                        // Reset clock when not playing and maintain position
                        clockRef.current = 0
                        if (scene) {
                                scene.position.y = -3.2
                        }
                }
        })

        useEffect(() => {
                // Find the head mesh with morph targets and adjust arm positions
                scene.traverse((child) => {
                        if (child.isMesh && child.morphTargetDictionary) {
                                meshRef.current = child as THREE.Mesh
                        }

                        // Adjust arm bones to make arms hang straight down vertically
                        if (child.isBone) {
                                if (child.name.toLowerCase().includes('leftarm') || child.name.toLowerCase().includes('left_arm') ||
                                        child.name.toLowerCase().includes('l_upperarm') || child.name.toLowerCase().includes('leftupperarm')) {
                                        child.rotation.set(0, 0, 0) // Make left arm hang straight down
                                }
                                if (child.name.toLowerCase().includes('rightarm') || child.name.toLowerCase().includes('right_arm') ||
                                        child.name.toLowerCase().includes('r_upperarm') || child.name.toLowerCase().includes('rightupperarm')) {
                                        child.rotation.set(0, 0, 0) // Make right arm hang straight down
                                }
                                if (child.name.toLowerCase().includes('leftforearm') || child.name.toLowerCase().includes('left_forearm') ||
                                        child.name.toLowerCase().includes('l_forearm') || child.name.toLowerCase().includes('leftlowerarm')) {
                                        child.rotation.set(0, 0, 0) // Straight forearm
                                }
                                if (child.name.toLowerCase().includes('rightforearm') || child.name.toLowerCase().includes('right_forearm') ||
                                        child.name.toLowerCase().includes('r_forearm') || child.name.toLowerCase().includes('rightlowerarm')) {
                                        child.rotation.set(0, 0, 0) // Straight forearm
                                }
                                // Also handle shoulder bones
                                if (child.name.toLowerCase().includes('leftshoulder') || child.name.toLowerCase().includes('left_shoulder') ||
                                        child.name.toLowerCase().includes('l_shoulder')) {
                                        child.rotation.set(0, 0, 0)
                                }
                                if (child.name.toLowerCase().includes('rightshoulder') || child.name.toLowerCase().includes('right_shoulder') ||
                                        child.name.toLowerCase().includes('r_shoulder')) {
                                        child.rotation.set(0, 0, 0)
                                }
                        }
                })
        }, [scene])

        // Positioned to show upper half like an interviewer sitting with straight arms
        return <primitive object={scene} scale={2.0} position={[0, -3.2, 0]} />
}

function AvatarLoader({ isPlaying, currentQuestion }: TalkingAvatarProps) {
        const [visemeData, setVisemeData] = useState<any[]>([])

        useEffect(() => {
                // Load viseme data for current question
                fetch(`/visemes/question_${currentQuestion}.json`)
                        .then((res) => res.json())
                        .then((data) => setVisemeData(data))
                        .catch(() => {
                                // Fallback to default viseme data if specific file doesn't exist
                                setVisemeData([
                                        { start: 0, end: 0.5, viseme: "A", weight: 0.8 },
                                        { start: 0.5, end: 1.0, viseme: "E", weight: 0.9 },
                                        { start: 1.0, end: 1.5, viseme: "O", weight: 0.7 },
                                        { start: 1.5, end: 2.0, viseme: "M", weight: 0.8 },
                                        { start: 2.0, end: 2.5, viseme: "A", weight: 0.6 },
                                ])
                        })
        }, [currentQuestion])

        return <AvatarModel visemeData={visemeData} isPlaying={isPlaying} />
}

export default function TalkingAvatar({ isPlaying, currentQuestion, onSpeechEnd }: TalkingAvatarProps) {
        const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null)
        const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null)
        const [isActuallySpeaking, setIsActuallySpeaking] = useState(false)

        const questions = [
                "Hello! I'm excited to interview you today. Let's start with something simple - can you tell me your name and what you do?",
                "That's interesting! What inspired you to get into your current field or profession?",
                "Can you share a recent project or achievement you're particularly proud of?",
                "What challenges have you faced recently, and how did you overcome them?",
                "Where do you see yourself or your work heading in the next few years?",
                "Finally, what advice would you give to someone just starting in your field?",
        ]

        useEffect(() => {
                if (typeof window !== "undefined") {
                        setSpeechSynthesis(window.speechSynthesis)
                }
        }, [])

        const speakQuestion = useCallback(
                (text: string) => {
                        if (speechSynthesis) {
                                // Cancel any ongoing speech
                                speechSynthesis.cancel()

                                const utterance = new SpeechSynthesisUtterance(text)

                                // Configure voice settings for natural interview experience
                                utterance.rate = 0.85
                                utterance.pitch = 1.1
                                utterance.volume = 0.9

                                // Wait for voices to load and select a good one
                                const setVoice = () => {
                                        const voices = speechSynthesis.getVoices()

                                        // Prefer female voices for interview experience
                                        const preferredVoices = voices.filter(
                                                (voice) =>
                                                        voice.lang.startsWith("en") &&
                                                        (voice.name.toLowerCase().includes("female") ||
                                                                voice.name.toLowerCase().includes("samantha") ||
                                                                voice.name.toLowerCase().includes("karen") ||
                                                                voice.name.toLowerCase().includes("moira") ||
                                                                voice.name.toLowerCase().includes("susan") ||
                                                                voice.name.toLowerCase().includes("allison")),
                                        )

                                        if (preferredVoices.length > 0) {
                                                utterance.voice = preferredVoices[0]
                                        } else {
                                                // Fallback to any English voice
                                                const englishVoices = voices.filter((voice) => voice.lang.startsWith("en"))
                                                if (englishVoices.length > 0) {
                                                        utterance.voice = englishVoices[0]
                                                }
                                        }
                                }

                                if (speechSynthesis.getVoices().length === 0) {
                                        speechSynthesis.onvoiceschanged = setVoice
                                } else {
                                        setVoice()
                                }

                                utterance.onstart = () => {
                                        setCurrentUtterance(utterance)
                                        setIsActuallySpeaking(true)
                                }

                                utterance.onend = () => {
                                        setCurrentUtterance(null)
                                        setIsActuallySpeaking(false)
                                        onSpeechEnd?.()
                                }

                                utterance.onerror = () => {
                                        setCurrentUtterance(null)
                                        setIsActuallySpeaking(false)
                                        onSpeechEnd?.()
                                }

                                speechSynthesis.speak(utterance)
                                setCurrentUtterance(utterance)
                        }
                },
                [speechSynthesis, onSpeechEnd],
        )

        useEffect(() => {
                if (isPlaying && currentQuestion >= 0 && questions[currentQuestion]) {
                        // Small delay to ensure avatar animation starts
                        const timer = setTimeout(() => {
                                speakQuestion(questions[currentQuestion])
                        }, 500)

                        return () => clearTimeout(timer)
                }
        }, [isPlaying, currentQuestion, speakQuestion])

        useEffect(() => {
                return () => {
                        if (speechSynthesis && currentUtterance) {
                                speechSynthesis.cancel()
                        }
                }
        }, [speechSynthesis, currentUtterance])

        return (
                <div className="w-full h-full relative">
                        {/* Audio visualization indicator */}
                        {isActuallySpeaking && (
                                <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/50 rounded-full px-3 py-2">
                                        <div className="flex gap-1">
                                                <div className="w-1 h-4 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                                                <div className="w-1 h-6 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "100ms" }} />
                                                <div className="w-1 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "200ms" }} />
                                                <div className="w-1 h-5 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                                        </div>
                                        <span className="text-white text-xs">Speaking</span>
                                </div>
                        )}

                        <Canvas
                                camera={{
                                        position: [0, 0, 2.0],
                                        fov: 30,
                                        near: 0.1,
                                        far: 1000
                                }}
                                className="w-full h-full"
                        >
                                <ambientLight intensity={0.6} />
                                <directionalLight position={[2, 2, 2]} intensity={1} />
                                <pointLight position={[-2, 2, 2]} intensity={0.5} />

                                <Suspense fallback={null}>
                                        <AvatarLoader isPlaying={isActuallySpeaking} currentQuestion={currentQuestion} />
                                        <Environment preset="studio" />
                                </Suspense>

                                <OrbitControls
                                        enablePan={false}
                                        enableZoom={true}
                                        enableRotate={true}
                                        maxDistance={4}
                                        minDistance={1.5}
                                        maxPolarAngle={Math.PI / 2.2}
                                        minPolarAngle={Math.PI / 4}
                                        target={[0, 0.2, 0]}
                                />
                        </Canvas>
                </div>
        )
}