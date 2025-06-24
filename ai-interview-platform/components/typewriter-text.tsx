"use client"

import { useState, useEffect } from "react"

interface TypewriterTextProps {
        text: string
        speed?: number
        className?: string
        onComplete?: () => void
        syncWithSpeech?: boolean
        speechProgress?: number
}

export default function TypewriterText({
        text,
        speed = 100,
        className = "",
        onComplete,
        syncWithSpeech = false,
        speechProgress = 0,
}: TypewriterTextProps) {
        const [displayText, setDisplayText] = useState("")
        const [currentIndex, setCurrentIndex] = useState(0)

        useEffect(() => {
                setDisplayText("")
                setCurrentIndex(0)
        }, [text])

        useEffect(() => {
                if (syncWithSpeech) {
                        // Sync with speech progress
                        const targetIndex = Math.floor(speechProgress * text.length)
                        setDisplayText(text.substring(0, targetIndex))
                        setCurrentIndex(targetIndex)

                        if (targetIndex >= text.length && onComplete) {
                                onComplete()
                        }
                } else {
                        // Normal typewriter effect
                        if (currentIndex < text.length) {
                                const timeout = setTimeout(() => {
                                        setDisplayText((prev) => prev + text[currentIndex])
                                        setCurrentIndex((prev) => prev + 1)
                                }, speed)

                                return () => clearTimeout(timeout)
                        } else if (currentIndex === text.length && onComplete) {
                                onComplete()
                        }
                }
        }, [currentIndex, text, speed, onComplete, syncWithSpeech, speechProgress])

        return (
                <div className={className}>
                        {displayText}
                        {!syncWithSpeech && currentIndex < text.length && (
                                <span className="inline-block w-0.5 h-5 bg-current ml-1 animate-pulse" />
                        )}
                </div>
        )
}
