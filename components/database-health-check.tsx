"use client"

import { useEffect, useState } from "react"

export function useDatabaseHealth() {
  const [isConnected, setIsConnected] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [lastChecked, setLastChecked] = useState<string | null>(null)

  const checkHealth = async () => {
    if (isChecking) return

    setIsChecking(true)
    try {
      // Add a timeout to the fetch request
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        console.log("Database health check timed out")
        controller.abort()
      }, 3000)

      const response = await fetch("/api/mongodb/status", {
        signal: controller.signal,
        cache: "no-store", // Evitar cache
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        setIsConnected(data.status === "connected")
        setLastChecked(data.timestamp)

        // Store status in localStorage for other components to access
        localStorage.setItem(
          "mongodb_status",
          JSON.stringify({
            isConnected: data.status === "connected",
            lastChecked: data.timestamp,
          }),
        )
      } else {
        console.error("Database health check failed with status:", response.status)
        throw new Error("Failed to check database health")
      }
    } catch (error) {
      console.error("Error checking database health:", error)
      setIsConnected(false)

      // Update localStorage with offline status
      localStorage.setItem(
        "mongodb_status",
        JSON.stringify({
          isConnected: false,
          lastChecked: new Date().toISOString(),
        }),
      )
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    // Check health immediately on mount
    checkHealth()

    // Set up interval to check health every minute
    const intervalId = setInterval(checkHealth, 60000)

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [])

  return { isConnected, checkHealth, isChecking, lastChecked }
}

export default function DatabaseHealthCheck() {
  const { isConnected, checkHealth, isChecking } = useDatabaseHealth()

  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></span>
      <span className="text-xs text-muted-foreground">{isConnected ? "MongoDB Online" : "MongoDB Offline"}</span>
      <button
        onClick={checkHealth}
        disabled={isChecking}
        className="text-xs text-primary hover:underline"
        aria-label="Check database connection"
      >
        {isChecking ? "Checking..." : "Check"}
      </button>
    </div>
  )
}

