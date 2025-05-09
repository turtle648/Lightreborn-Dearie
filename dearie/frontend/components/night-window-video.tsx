"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

interface NightWindowVideoProps {
  className?: string
}

export function NightWindowVideo({ className }: NightWindowVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Load background image
    const bgImage = new Image()
    bgImage.crossOrigin = "anonymous"
    bgImage.src =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250425_1733_Dreamy%20Nightscape%20Window_simple_compose_01jsp18g00exzbpq55scs9jzxp.gif-c8TDdNG7DzbinVx1rJT06M7VAxAkQo.jpeg"

    // Create stars
    const stars: { x: number; y: number; radius: number; opacity: number; speed: number }[] = []
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.6,
        radius: Math.random() * 1.5,
        opacity: Math.random() * 0.8,
        speed: 0.05 + Math.random() * 0.1,
      })
    }

    // Create shooting star
    const shootingStar = {
      x: canvas.width * 0.8,
      y: canvas.height * 0.2,
      length: 80,
      speed: 3,
      opacity: 0,
      active: false,
      timer: 0,
    }

    // Animation variables
    let curtainLeft = -canvas.width * 0.25
    let curtainRight = canvas.width
    let plantsY = canvas.height + 50
    let textOpacity = 0

    // Animation loop
    let animationStartTime = 0

    const animate = (timestamp: number) => {
      if (!animationStartTime) animationStartTime = timestamp
      const elapsed = timestamp - animationStartTime

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background
      if (bgImage.complete) {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height)
      } else {
        ctx.fillStyle = "#0a1a2a"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      // Animate stars
      stars.forEach((star) => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * (0.5 + Math.sin(elapsed * star.speed * 0.01) * 0.5)})`
        ctx.fill()
      })

      // Animate shooting star
      if (elapsed > 2000 && !shootingStar.active) {
        shootingStar.active = true
        shootingStar.opacity = 1
        shootingStar.x = canvas.width * 0.8
        shootingStar.y = canvas.height * 0.2
        shootingStar.timer = elapsed
      }

      if (shootingStar.active) {
        const shootingStarElapsed = elapsed - shootingStar.timer

        if (shootingStarElapsed < 2000) {
          shootingStar.x -= shootingStar.speed
          shootingStar.y += shootingStar.speed * 0.5

          ctx.beginPath()
          ctx.moveTo(shootingStar.x, shootingStar.y)
          ctx.lineTo(shootingStar.x + shootingStar.length, shootingStar.y - shootingStar.length * 0.5)

          const gradient = ctx.createLinearGradient(
            shootingStar.x,
            shootingStar.y,
            shootingStar.x + shootingStar.length,
            shootingStar.y - shootingStar.length * 0.5,
          )
          gradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`)
          gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

          ctx.strokeStyle = gradient
          ctx.lineWidth = 2
          ctx.stroke()

          // Star head
          ctx.beginPath()
          ctx.arc(shootingStar.x, shootingStar.y, 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${shootingStar.opacity})`
          ctx.fill()
        } else {
          shootingStar.active = false
          shootingStar.timer = elapsed + 5000 // Wait before next shooting star
        }
      }

      // Animate curtains
      if (elapsed < 1500) {
        curtainLeft = Math.min(-canvas.width * 0.05, curtainLeft + canvas.width * 0.001)
        curtainRight = Math.max(canvas.width * 0.8, curtainRight - canvas.width * 0.001)
      }

      // Draw curtains
      ctx.fillStyle = "rgba(26, 42, 58, 0.5)"
      ctx.fillRect(curtainLeft, 0, canvas.width * 0.25, canvas.height)
      ctx.fillRect(curtainRight, 0, canvas.width * 0.25, canvas.height)

      // Animate plants
      if (elapsed > 1800) {
        plantsY = Math.max(canvas.height * 0.8, plantsY - 1)
      }

      // Draw plants (simplified)
      const plantSize = canvas.width * 0.1

      // Left plant (pine)
      ctx.fillStyle = "#3a2a1a"
      ctx.fillRect(
        canvas.width * 0.35 - plantSize * 0.15,
        plantsY - plantSize * 0.15,
        plantSize * 0.3,
        plantSize * 0.15,
      )

      ctx.fillStyle = "#1a3a2a"
      ctx.beginPath()
      ctx.moveTo(canvas.width * 0.35 - plantSize * 0.4, plantsY - plantSize * 0.15)
      ctx.lineTo(canvas.width * 0.35 + plantSize * 0.4, plantsY - plantSize * 0.15)
      ctx.lineTo(canvas.width * 0.35, plantsY - plantSize * 0.6)
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(canvas.width * 0.35 - plantSize * 0.3, plantsY - plantSize * 0.4)
      ctx.lineTo(canvas.width * 0.35 + plantSize * 0.3, plantsY - plantSize * 0.4)
      ctx.lineTo(canvas.width * 0.35, plantsY - plantSize * 0.8)
      ctx.fill()

      // Right plant (leafy)
      ctx.fillStyle = "#3a2a1a"
      ctx.fillRect(
        canvas.width * 0.65 - plantSize * 0.15,
        plantsY - plantSize * 0.15,
        plantSize * 0.3,
        plantSize * 0.15,
      )

      ctx.fillStyle = "#2a4a3a"
      ctx.beginPath()
      ctx.ellipse(canvas.width * 0.65, plantsY - plantSize * 0.4, plantSize * 0.25, plantSize * 0.3, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.ellipse(
        canvas.width * 0.65 - plantSize * 0.15,
        plantsY - plantSize * 0.5,
        plantSize * 0.15,
        plantSize * 0.25,
        Math.PI * 0.25,
        0,
        Math.PI * 2,
      )
      ctx.fill()

      ctx.beginPath()
      ctx.ellipse(
        canvas.width * 0.65 + plantSize * 0.15,
        plantsY - plantSize * 0.5,
        plantSize * 0.15,
        plantSize * 0.25,
        -Math.PI * 0.25,
        0,
        Math.PI * 2,
      )
      ctx.fill()

      // Animate text
      if (elapsed > 2500) {
        textOpacity = Math.min(1, textOpacity + 0.02)
      }

      // Draw text
      if (textOpacity > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${textOpacity})`
        ctx.font = "bold 16px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("오늘 하루도 수고하셨어요", canvas.width * 0.5, canvas.height * 0.9)

        ctx.fillStyle = `rgba(255, 255, 255, ${textOpacity * 0.7})`
        ctx.font = "14px sans-serif"
        ctx.fillText("당신의 마음을 기록해보세요", canvas.width * 0.5, canvas.height * 0.9 + 24)
      }

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} />
}
