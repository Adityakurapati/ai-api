"use client"

import { useRef, useState, useEffect, Suspense, useCallback } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, OrbitControls, Environment } from "@react-three/drei"
import * as THREE from "three"

interface TalkingAvatarProps {
        isPlaying: boolean
        currentQuestion: number
        onSpeechEnd?: () => void
}

function AvatarModel({
        visemeData,
        isPlaying,
        speechProgress,
}: {
        visemeData: any[]
        isPlaying: boolean
        speechProgress: number
}) {
        const { scene } = useGLTF("/models/avatar1.glb")
        const meshRef = useRef<THREE.Mesh>()
        const headBoneRef = useRef<THREE.Bone>() // Add head bone reference
        const clockRef = useRef(0)

        // Enhanced animation state management
        const blinkTimerRef = useRef(0)
        const headMovementRef = useRef({
                x: 0,
                y: 0,
                targetX: 0,
                targetY: 0,
                nodTimer: 0,
                isNodding: false,
                acknowledgmentTimer: 0,
        })
        const eyeBlinkRef = useRef({
                isBlinking: false,
                blinkDuration: 0,
                nextBlinkTime: 2 + Math.random() * 3,
        })
        const breathingRef = useRef({
                phase: 0,
                intensity: 0.01,
        })
        const microExpressionRef = useRef({
                timer: 0,
                currentExpression: "neutral",
                expressionDuration: 0,
        })

        // Enhanced viseme mapping for Ready Player Me models
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
                blinkTimerRef.current += delta
                headMovementRef.current.nodTimer += delta
                headMovementRef.current.acknowledgmentTimer += delta
                breathingRef.current.phase += delta
                microExpressionRef.current.timer += delta

                if (meshRef.current && scene) {
                        // === MOUTH ANIMATION (Enhanced Visemes) ===
                        if (isPlaying) {
                                const currentTime = clockRef.current
                                const currentViseme = visemeData.find((v) => currentTime >= v.start && currentTime < v.end)

                                // Reset all morph targets
                                if (meshRef.current.morphTargetInfluences) {
                                        meshRef.current.morphTargetInfluences.fill(0)
                                }

                                if (currentViseme && meshRef.current.morphTargetDictionary) {
                                        const morphTargetName = visemeMap[currentViseme.viseme as keyof typeof visemeMap]
                                        const index = meshRef.current.morphTargetDictionary[morphTargetName]

                                        if (index !== undefined && meshRef.current.morphTargetInfluences) {
                                                // Smooth transition for more natural mouth movement
                                                const targetWeight = currentViseme.weight || 0.8
                                                const currentWeight = meshRef.current.morphTargetInfluences[index]
                                                meshRef.current.morphTargetInfluences[index] = THREE.MathUtils.lerp(currentWeight, targetWeight, delta * 12)
                                        }
                                }
                        } else {
                                // Gradually close mouth when not speaking
                                if (meshRef.current.morphTargetInfluences) {
                                        for (let i = 0; i < meshRef.current.morphTargetInfluences.length; i++) {
                                                meshRef.current.morphTargetInfluences[i] = THREE.MathUtils.lerp(
                                                        meshRef.current.morphTargetInfluences[i],
                                                        0,
                                                        delta * 6,
                                                )
                                        }
                                }
                        }

                        // === ENHANCED EYE BLINKING ===
                        if (blinkTimerRef.current >= eyeBlinkRef.current.nextBlinkTime) {
                                eyeBlinkRef.current.isBlinking = true
                                eyeBlinkRef.current.blinkDuration = 0
                                eyeBlinkRef.current.nextBlinkTime = 1.5 + Math.random() * 4 // 1.5-5.5 seconds
                                blinkTimerRef.current = 0
                        }

                        if (eyeBlinkRef.current.isBlinking) {
                                eyeBlinkRef.current.blinkDuration += delta
                                const blinkProgress = eyeBlinkRef.current.blinkDuration / 0.12 // 120ms blink

                                if (blinkProgress < 1) {
                                        // Natural blink curve - fast close, slower open
                                        const blinkCurve = blinkProgress < 0.3 ? blinkProgress / 0.3 : 1 - (blinkProgress - 0.3) / 0.7
                                        const blinkWeight = Math.sin(blinkCurve * Math.PI) * 0.9

                                        // Apply to eye blink morph targets
                                        if (meshRef.current.morphTargetDictionary && meshRef.current.morphTargetInfluences) {
                                                const leftEyeIndex = meshRef.current.morphTargetDictionary["eyeBlinkLeft"]
                                                const rightEyeIndex = meshRef.current.morphTargetDictionary["eyeBlinkRight"]

                                                if (leftEyeIndex !== undefined) {
                                                        meshRef.current.morphTargetInfluences[leftEyeIndex] = blinkWeight
                                                }
                                                if (rightEyeIndex !== undefined) {
                                                        meshRef.current.morphTargetInfluences[rightEyeIndex] = blinkWeight
                                                }
                                        }
                                } else {
                                        eyeBlinkRef.current.isBlinking = false
                                }
                        }

                        // === ENHANCED HEAD MOVEMENT & ACKNOWLEDGMENT ===
                        if (isPlaying) {
                                // Natural speaking head movement - much more subtle
                                const speakingIntensity = Math.sin(clockRef.current * 2.5) * 0.03 // Reduced from 0.08
                                const baseMovement = Math.sin(clockRef.current * 0.4) * 0.05 // Reduced from 0.12

                                headMovementRef.current.targetX = baseMovement + speakingIntensity

                                // Acknowledgment nods during pauses or emphasis
                                if (headMovementRef.current.acknowledgmentTimer > 3 + Math.random() * 4) {
                                        headMovementRef.current.isNodding = true
                                        headMovementRef.current.acknowledgmentTimer = 0
                                }

                                if (headMovementRef.current.isNodding) {
                                        const nodProgress = (headMovementRef.current.nodTimer % 0.8) / 0.8
                                        if (nodProgress < 1) {
                                                // Subtle nod for acknowledgment
                                                const nodIntensity = Math.sin(nodProgress * Math.PI * 2) * 0.12 // Reduced from 0.25
                                                headMovementRef.current.targetY = nodIntensity
                                        } else {
                                                headMovementRef.current.isNodding = false
                                                headMovementRef.current.nodTimer = 0
                                        }
                                } else {
                                        // Very subtle vertical movement while speaking
                                        headMovementRef.current.targetY = Math.cos(clockRef.current * 0.6) * 0.02 // Reduced from 0.06
                                }

                                // Remove emphasis gestures that were too much
                        } else {
                                // Return to neutral listening position with very subtle movement
                                headMovementRef.current.targetX = Math.sin(clockRef.current * 0.2) * 0.02 // Reduced from 0.05
                                headMovementRef.current.targetY = 0

                                // Acknowledgment nods while listening - more frequent and subtle
                                if (headMovementRef.current.acknowledgmentTimer > 4 + Math.random() * 6) {
                                        // More frequent
                                        headMovementRef.current.isNodding = true
                                        headMovementRef.current.acknowledgmentTimer = 0
                                }

                                if (headMovementRef.current.isNodding) {
                                        const nodProgress = (headMovementRef.current.nodTimer % 1.0) / 1.0 // Faster nod
                                        if (nodProgress < 1) {
                                                const nodIntensity = Math.sin(nodProgress * Math.PI) * 0.15 // Subtle listening nod
                                                headMovementRef.current.targetY = nodIntensity
                                        } else {
                                                headMovementRef.current.isNodding = false
                                                headMovementRef.current.nodTimer = 0
                                        }
                                }
                        }

                        // Smooth head movement interpolation
                        headMovementRef.current.x = THREE.MathUtils.lerp(
                                headMovementRef.current.x,
                                headMovementRef.current.targetX,
                                delta * 4,
                        )
                        headMovementRef.current.y = THREE.MathUtils.lerp(
                                headMovementRef.current.y,
                                headMovementRef.current.targetY,
                                delta * 5,
                        )

                        // Apply head rotation ONLY to head bone, not entire scene
                        if (headBoneRef.current) {
                                headBoneRef.current.rotation.y = Math.max(-0.15, Math.min(0.15, headMovementRef.current.x)) // Reduced range
                                headBoneRef.current.rotation.x = Math.max(-0.1, Math.min(0.1, headMovementRef.current.y)) // Reduced range
                        }

                        // === ENHANCED BREATHING ANIMATION ===
                        const breathingOffset = Math.sin(breathingRef.current.phase * 0.8) * breathingRef.current.intensity
                        const breathingVariation = Math.sin(breathingRef.current.phase * 0.3) * 0.005

                        // Maintain original position with breathing - keep scene position stable
                        scene.position.y = -3.2 + breathingOffset + breathingVariation
                        scene.position.x = 0 // Keep X position stable
                        scene.rotation.y = 0 // Keep scene rotation stable
                        scene.rotation.x = 0 // Keep scene rotation stable
                        scene.rotation.z = 0 // Keep scene rotation stable

                        // === MICRO EXPRESSIONS ===
                        if (microExpressionRef.current.timer > 8 + Math.random() * 12) {
                                // Random micro-expressions every 8-20 seconds
                                if (meshRef.current.morphTargetDictionary && meshRef.current.morphTargetInfluences) {
                                        const expressions = ["browInnerUp", "browOuterUpLeft", "browOuterUpRight", "eyeSquintLeft", "eyeSquintRight"]
                                        const randomExpression = expressions[Math.floor(Math.random() * expressions.length)]
                                        const expressionIndex = meshRef.current.morphTargetDictionary[randomExpression]

                                        if (expressionIndex !== undefined) {
                                                microExpressionRef.current.currentExpression = randomExpression
                                                microExpressionRef.current.expressionDuration = 0
                                                microExpressionRef.current.timer = 0
                                        }
                                }
                        }

                        // Apply micro-expressions
                        if (
                                microExpressionRef.current.currentExpression !== "neutral" &&
                                meshRef.current.morphTargetDictionary &&
                                meshRef.current.morphTargetInfluences
                        ) {
                                microExpressionRef.current.expressionDuration += delta
                                const expressionProgress = microExpressionRef.current.expressionDuration / 0.5 // 500ms expression

                                if (expressionProgress < 1) {
                                        const expressionIndex = meshRef.current.morphTargetDictionary[microExpressionRef.current.currentExpression]
                                        if (expressionIndex !== undefined) {
                                                const intensity = Math.sin(expressionProgress * Math.PI) * 0.3
                                                meshRef.current.morphTargetInfluences[expressionIndex] = intensity
                                        }
                                } else {
                                        microExpressionRef.current.currentExpression = "neutral"
                                }
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
                // Find the head mesh with morph targets and head bone
                scene.traverse((child) => {
                        if (child.isMesh && child.morphTargetDictionary) {
                                meshRef.current = child as THREE.Mesh
                                console.log("Available morph targets:", Object.keys(child.morphTargetDictionary))
                        }

                        // Find the head bone specifically
                        if (child.isBone) {
                                // Look for head bone with various naming conventions
                                if (
                                        child.name.toLowerCase().includes("head") ||
                                        child.name.toLowerCase().includes("neck") ||
                                        child.name === "Head" ||
                                        child.name === "head" ||
                                        child.name === "Neck" ||
                                        child.name === "neck"
                                ) {
                                        headBoneRef.current = child as THREE.Bone
                                        console.log("Found head bone:", child.name)
                                }

                                // Enhanced arm positioning with more natural poses (keep existing arm code)
                                if (
                                        child.name.toLowerCase().includes("leftarm") ||
                                        child.name.toLowerCase().includes("left_arm") ||
                                        child.name.toLowerCase().includes("l_upperarm") ||
                                        child.name.toLowerCase().includes("leftupperarm")
                                ) {
                                        child.rotation.x = Math.PI / 2.2
                                        child.rotation.y = 0
                                        child.rotation.z = Math.PI / 8
                                }

                                if (
                                        child.name.toLowerCase().includes("rightarm") ||
                                        child.name.toLowerCase().includes("right_arm") ||
                                        child.name.toLowerCase().includes("r_upperarm") ||
                                        child.name.toLowerCase().includes("rightupperarm")
                                ) {
                                        child.rotation.x = Math.PI / 2.2
                                        child.rotation.y = 0
                                        child.rotation.z = -Math.PI / 8
                                }

                                if (
                                        child.name.toLowerCase().includes("leftforearm") ||
                                        child.name.toLowerCase().includes("left_forearm") ||
                                        child.name.toLowerCase().includes("l_forearm") ||
                                        child.name.toLowerCase().includes("leftlowerarm")
                                ) {
                                        child.rotation.x = Math.PI / 12
                                        child.rotation.y = 0
                                        child.rotation.z = 0
                                }

                                if (
                                        child.name.toLowerCase().includes("rightforearm") ||
                                        child.name.toLowerCase().includes("right_forearm") ||
                                        child.name.toLowerCase().includes("r_forearm") ||
                                        child.name.toLowerCase().includes("rightlowerarm")
                                ) {
                                        child.rotation.x = Math.PI / 12
                                        child.rotation.y = 0
                                        child.rotation.z = 0
                                }

                                if (
                                        child.name.toLowerCase().includes("lefthand") ||
                                        child.name.toLowerCase().includes("left_hand") ||
                                        child.name.toLowerCase().includes("l_hand")
                                ) {
                                        child.rotation.x = Math.PI / 24
                                        child.rotation.y = 0
                                        child.rotation.z = 0
                                }

                                if (
                                        child.name.toLowerCase().includes("righthand") ||
                                        child.name.toLowerCase().includes("right_hand") ||
                                        child.name.toLowerCase().includes("r_hand")
                                ) {
                                        child.rotation.x = Math.PI / 24
                                        child.rotation.y = 0
                                        child.rotation.z = 0
                                }
                        }
                })
        }, [scene])

        // Positioned to show upper half like an interviewer sitting with straight arms
        return <primitive object={scene} scale={2.0} position={[0, -3.2, 0]} />
}

function AvatarLoader({ isPlaying, currentQuestion, onSpeechEnd }: TalkingAvatarProps) {
        const [visemeData, setVisemeData] = useState<any[]>([])
        const [speechProgress, setSpeechProgress] = useState(0)

        // Generate enhanced viseme data based on text analysis
        const generateVisemeData = useCallback((text: string) => {
                const words = text.split(" ")
                const visemes = []
                let timeOffset = 0

                for (const word of words) {
                        const phonemes = word.toLowerCase().split("")

                        for (const phoneme of phonemes) {
                                const duration = 0.08 + Math.random() * 0.04 // 80-120ms per phoneme
                                let viseme = "A" // default

                                // Enhanced phoneme to viseme mapping
                                if ("aeiou".includes(phoneme)) {
                                        const vowelMap = { a: "A", e: "E", i: "I", o: "O", u: "U" }
                                        viseme = vowelMap[phoneme as keyof typeof vowelMap] || "A"
                                } else if ("bmp".includes(phoneme)) {
                                        viseme = "M"
                                } else if ("fv".includes(phoneme)) {
                                        viseme = "F"
                                } else if ("td".includes(phoneme)) {
                                        viseme = "T"
                                } else if ("kg".includes(phoneme)) {
                                        viseme = "K"
                                } else if ("sz".includes(phoneme)) {
                                        viseme = "S"
                                } else if ("rl".includes(phoneme)) {
                                        viseme = "R"
                                } else if ("n".includes(phoneme)) {
                                        viseme = "N"
                                }

                                visemes.push({
                                        start: timeOffset,
                                        end: timeOffset + duration,
                                        viseme: viseme,
                                        weight: 0.6 + Math.random() * 0.4,
                                })

                                timeOffset += duration
                        }

                        // Add pause between words
                        timeOffset += 0.1
                }

                return visemes
        }, [])

        useEffect(() => {
                // Load viseme data for current question
                fetch(`/visemes/question_${currentQuestion}.json`)
                        .then((res) => res.json())
                        .then((data) => setVisemeData(data))
                        .catch(() => {
                                // Generate realistic viseme data from text
                                const questions = [
                                        "Hello! I'm excited to interview you today. Let's start with something simple - can you tell me your name and what you do?",
                                        "That's interesting! What inspired you to get into your current field or profession?",
                                        "Can you share a recent project or achievement you're particularly proud of?",
                                        "What challenges have you faced recently, and how did you overcome them?",
                                        "Where do you see yourself or your work heading in the next few years?",
                                        "Finally, what advice would you give to someone just starting in your field?",
                                ]

                                if (questions[currentQuestion]) {
                                        const generatedVisemes = generateVisemeData(questions[currentQuestion])
                                        setVisemeData(generatedVisemes)
                                } else {
                                        // Fallback to default viseme data
                                        setVisemeData([
                                                { start: 0, end: 0.5, viseme: "A", weight: 0.8 },
                                                { start: 0.5, end: 1.0, viseme: "E", weight: 0.9 },
                                                { start: 1.0, end: 1.5, viseme: "O", weight: 0.7 },
                                                { start: 1.5, end: 2.0, viseme: "M", weight: 0.8 },
                                                { start: 2.0, end: 2.5, viseme: "A", weight: 0.6 },
                                        ])
                                }
                        })
        }, [currentQuestion, generateVisemeData])

        return <AvatarModel visemeData={visemeData} isPlaying={isPlaying} speechProgress={speechProgress} />
}

export default function TalkingAvatar({ isPlaying, currentQuestion, onSpeechEnd }: TalkingAvatarProps) {
        const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null)
        const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null)
        const [isActuallySpeaking, setIsActuallySpeaking] = useState(false)
        const [speechProgress, setSpeechProgress] = useState(0)

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
                                                                voice.name.toLowerCase().includes("allison") ||
                                                                voice.name.toLowerCase().includes("zira")),
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
                                        setSpeechProgress(0)
                                }

                                utterance.onend = () => {
                                        setCurrentUtterance(null)
                                        setIsActuallySpeaking(false)
                                        setSpeechProgress(1)
                                        onSpeechEnd?.()
                                }

                                utterance.onerror = () => {
                                        setCurrentUtterance(null)
                                        setIsActuallySpeaking(false)
                                        setSpeechProgress(0)
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
                        {/* Enhanced Audio Visualization */}
                        {isActuallySpeaking && (
                                <div className="absolute top-4 right-4 z-10 flex items-center gap-3 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2">
                                        <div className="flex gap-1">
                                                <div className="w-1 h-4 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                                                <div className="w-1 h-6 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "100ms" }} />
                                                <div className="w-1 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "200ms" }} />
                                                <div className="w-1 h-5 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                                                <div className="w-1 h-4 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "400ms" }} />
                                        </div>
                                        <span className="text-white text-xs font-medium">Speaking</span>
                                        <div className="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
                                                <div
                                                        className="h-full bg-green-400 transition-all duration-100"
                                                        style={{ width: `${speechProgress * 100}%` }}
                                                />
                                        </div>
                                </div>
                        )}

                        {/* Listening Indicator */}
                        {!isActuallySpeaking && isPlaying && (
                                <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-blue-600/70 backdrop-blur-sm rounded-full px-3 py-2">
                                        <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" />
                                        <span className="text-white text-xs">Listening</span>
                                </div>
                        )}

                        <Canvas
                                camera={{
                                        position: [0, 0, 2.0],
                                        fov: 30,
                                        near: 0.1,
                                        far: 1000,
                                }}
                                className="w-full h-full"
                                shadows
                        >
                                {/* Enhanced Lighting */}
                                <ambientLight intensity={0.5} />
                                <directionalLight
                                        position={[2, 2, 2]}
                                        intensity={1.2}
                                        castShadow
                                        shadow-mapSize-width={1024}
                                        shadow-mapSize-height={1024}
                                />
                                <pointLight position={[-2, 2, 2]} intensity={0.6} color="#ffffff" />
                                <pointLight position={[1, -1, 1]} intensity={0.4} color="#4f46e5" />

                                {/* Rim lighting for professional look */}
                                <directionalLight position={[-1, 0, -1]} intensity={0.3} color="#8b5cf6" />

                                <Suspense fallback={null}>
                                        <AvatarLoader isPlaying={isActuallySpeaking} currentQuestion={currentQuestion} onSpeechEnd={onSpeechEnd} />
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
                                        enableDamping
                                        dampingFactor={0.05}
                                />
                        </Canvas>
                </div>
        )
}
