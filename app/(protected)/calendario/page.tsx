"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import { handleError, logAction } from "@/lib/error-handler"
import { cn } from "@/lib/utils"
import { fetchEventsFromDB } from "@/app/actions" // Import MongoDB action

export default function CalendarioPage() {
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedDateEvents, setSelectedDateEvents] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Create a map of dates with events
  const [eventDates, setEventDates] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    const loadEvents = async () => {
      try {
        console.log("Loading calendar data...")

        // Load events from MongoDB
        const eventsData = await fetchEventsFromDB()
        console.log("Loaded events:", eventsData)

        setEvents(eventsData)

        // Create a map of dates with events
        const dates: { [key: string]: number } = {}
        eventsData.forEach((event: any) => {
          try {
            const eventDate = new Date(event.data)
            if (!isNaN(eventDate.getTime())) {
              const dateStr = eventDate.toISOString().split("T")[0]
              dates[dateStr] = (dates[dateStr] || 0) + 1
              console.log(`Event on ${dateStr}: ${event.nome}`)
            } else {
              console.error("Invalid date in event:", event)
            }
          } catch (err) {
            console.error("Error processing event date:", err, event)
          }
        })

        console.log("Event dates map:", dates)
        setEventDates(dates)

        logAction("Load Calendar", toast, true, { eventCount: eventsData.length })
      } catch (err) {
        console.error("Calendar data loading error:", err)
        const errorMsg = handleError(err, toast, "Failed to load calendar data")
        setError(errorMsg)
      } finally {
        setIsLoading(false)
      }
    }

    loadEvents()
  }, [toast])

  const handleDateSelect = (date: Date | undefined) => {
    console.log("Date selected:", date)
    setSelectedDate(date)

    if (date && date instanceof Date && !isNaN(date.getTime())) {
      try {
        const dateStr = date.toISOString().split("T")[0]
        console.log("Looking for events on:", dateStr)

        const filteredEvents = events.filter((event) => {
          try {
            const eventDate = new Date(event.data)
            if (!isNaN(eventDate.getTime())) {
              const eventDateStr = eventDate.toISOString().split("T")[0]
              return eventDateStr === dateStr
            }
            return false
          } catch (err) {
            console.error("Error comparing event date:", err, event)
            return false
          }
        })

        console.log("Found events for selected date:", filteredEvents)
        setSelectedDateEvents(filteredEvents)
        setIsDialogOpen(true)

        logAction("View Date Events", toast, true, {
          date: dateStr,
          eventCount: filteredEvents.length,
        })
      } catch (err) {
        console.error("Error handling date selection:", err)
        handleError(err, toast, "Error selecting date")
      }
    }
  }

  // Completely revised day rendering function with better undefined handling
  const renderDayContents = (day: any) => {
    // If day is undefined or null, return a simple placeholder
    if (!day) {
      console.log("Day is undefined or null")
      return <div className="text-muted">·</div>
    }

    try {
      // Validate day is a proper Date object
      if (!(day instanceof Date)) {
        console.log("Day is not a Date object:", day)
        return <div className="text-muted">·</div>
      }

      if (isNaN(day.getTime())) {
        console.log("Day is an invalid Date:", day)
        return <div className="text-muted">·</div>
      }

      // Format the date to match our event dates format
      const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`
      const hasEvents = eventDates[dateStr]

      return (
        <>
          <div>{day.getDate()}</div>
          {hasEvents && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full" />}
        </>
      )
    } catch (error) {
      console.error("Error rendering day:", error, day)
      return <div className="text-muted">·</div>
    }
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendário</h1>
          <p className="text-muted-foreground">Visualize seus eventos do Pingo de Leite no calendário</p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendário</h1>
        <p className="text-muted-foreground">Visualize seus eventos do Pingo de Leite no calendário</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <Card>
          <CardHeader>
            <CardTitle>Calendário de Eventos</CardTitle>
            <CardDescription>Clique em uma data para ver os eventos agendados</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-lg">Carregando...</p>
                </div>
              </div>
            ) : (
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md border"
                modifiersClassNames={{
                  selected: "bg-primary text-primary-foreground",
                  today: "bg-accent text-accent-foreground",
                }}
                components={{
                  Day: ({ date: day, displayMonth, ...props }: { date: Date | undefined; displayMonth?: Date }) => {
                    // Handle undefined day case
                    if (!day) {
                      return (
                        <div className="relative">
                          <button {...props} disabled>
                            <div className="text-muted">·</div>
                          </button>
                        </div>
                      )
                    }

                    return (
                      <div className="relative">
                        <button {...props}>{renderDayContents(day)}</button>
                      </div>
                    )
                  },
                }}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
            <CardDescription>Eventos agendados para os próximos dias</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
                Carregando...
              </div>
            ) : events.length === 0 ? (
              <p className="text-muted-foreground">Nenhum evento agendado</p>
            ) : (
              <div className="space-y-4">
                {events
                  .filter((event) => {
                    try {
                      const eventDate = new Date(event.data)
                      return !isNaN(eventDate.getTime()) && eventDate >= new Date()
                    } catch (err) {
                      console.error("Error filtering event date:", err, event)
                      return false
                    }
                  })
                  .sort((a, b) => {
                    try {
                      const dateA = new Date(a.data)
                      const dateB = new Date(b.data)
                      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                        return 0
                      }
                      return dateA.getTime() - dateB.getTime()
                    } catch (err) {
                      console.error("Error sorting event dates:", err, a, b)
                      return 0
                    }
                  })
                  .slice(0, 5)
                  .map((event) => (
                    <div key={event._id} className="flex justify-between items-start border-b pb-4">
                      <div>
                        <h3 className="font-medium">{event.nome}</h3>
                        <p className="text-sm text-muted-foreground">
                          {(() => {
                            try {
                              const eventDate = new Date(event.data)
                              if (!isNaN(eventDate.getTime())) {
                                return eventDate.toLocaleDateString("pt-BR")
                              }
                              return "Data inválida"
                            } catch (err) {
                              console.error("Error formatting event date:", err, event)
                              return "Data inválida"
                            }
                          })()}
                        </p>
                        <p className="text-sm">{event.clienteNome}</p>
                      </div>
                      <Button variant="link" asChild className="h-auto p-0">
                        <Link href={`/eventos/${event._id}`}>Ver detalhes</Link>
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Eventos em{" "}
              {selectedDate
                ? (() => {
                    try {
                      if (selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
                        return selectedDate.toLocaleDateString("pt-BR")
                      }
                      return "data selecionada"
                    } catch (err) {
                      console.error("Error formatting selected date:", err)
                      return "data selecionada"
                    }
                  })()
                : "data selecionada"}
            </DialogTitle>
            <DialogDescription>
              {selectedDateEvents.length === 0
                ? "Nenhum evento agendado para esta data"
                : `${selectedDateEvents.length} evento(s) agendado(s)`}
            </DialogDescription>
          </DialogHeader>

          {selectedDateEvents.length > 0 && (
            <div className="space-y-4 mt-4">
              {selectedDateEvents.map((event) => (
                <div key={event._id} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{event.nome}</h3>
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        event.status === "Orçamento" && "bg-yellow-100 text-yellow-800",
                        event.status === "Fechada" && "bg-blue-100 text-blue-800",
                        event.status === "Paga" && "bg-green-100 text-green-800",
                        event.status === "Finalizada" && "bg-purple-100 text-purple-800",
                      )}
                    >
                      {event.status || "Orçamento"}
                    </span>
                    <p className="font-medium">{formatCurrency(event.precoTotal)}</p>
                  </div>
                  <p className="text-sm">Cliente: {event.clienteNome}</p>
                  <div className="flex justify-end">
                    <Button asChild size="sm">
                      <Link href={`/eventos/${event._id}`}>Ver detalhes</Link>
                    </Button>
                  </div>
                  <Separator className="mt-2" />
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}