"use client"

import { useRef, useState, useEffect } from "react"

export function useLazyImage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoaded(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: "200px",
      },
    )

    if (imageRef.current) {
      observer.observe(imageRef.current)
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current)
      }
    }
  }, [])

  return { isLoaded, imageRef }
}
