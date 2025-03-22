"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Search, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import { handleError, logAction } from "@/lib/error-handler"
import { cn } from "@/lib/utils"

export default function EventosPage() {
  const [events, setEvents] = useState<any[]>([])
  const [filteredEvents, setFilteredEvents] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadEvents = () => {
      try {
        console.log("Loading events from localStorage")

        // Check if we're in a browser environment
        if (typeof window === "undefined") {
          console.log("Not in browser environment, skipping load")
          setIsLoading(false)
          return
        }

        // Load events from local storage
        const eventsData = JSON.parse(localStorage.getItem("events") || "[]")
        console.log("Events loaded:", eventsData)

        if (eventsData.length === 0) {
          console.log("No events found")
          setError("No events found. Create your first event to get started.")
        }

        setEvents(eventsData)
        setFilteredEvents(eventsData)

        logAction("Load Events", toast, true, { count: eventsData.length })
      } catch (err) {
        console.error("Failed to load events:", err)
        const errorMsg = handleError(err, toast, "Failed to load events")
        setError(errorMsg)
        logAction("Load Events", toast, false, { error: errorMsg })
      } finally {
        setIsLoading(false)
      }
    }

    // Ensure this runs only once and after component is mounted
    loadEvents()
  }, [toast])

  // Filter events based on search query
  useEffect(() => {
    try {
      if (!searchQuery.trim()) {
        setFilteredEvents(events)
        return
      }

      const query = searchQuery.toLowerCase()
      const filtered = events.filter(
        (event) =>
          event.nome?.toLowerCase().includes(query) ||
          event.clienteNome?.toLowerCase().includes(query) ||
          event.id?.includes(query),
      )

      setFilteredEvents(filtered)

      if (filtered.length === 0 && events.length > 0) {
        toast({
          title: "Search Results",
          description: "No events match your search criteria",
        })
      }
    } catch (err) {
      handleError(err, toast, "Error filtering events")
    }
  }, [searchQuery, events, toast])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    logAction("Search Events", toast, true, { query: e.target.value })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
          <p className="text-muted-foreground">Gerencie seus eventos e festas do Pingo de Leite</p>
        </div>
        <Button asChild>
          <Link href="/eventos/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Evento
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista de Eventos</CardTitle>
          <CardDescription>Visualize e gerencie todos os seus eventos</CardDescription>
          <div className="mt-4 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nome, cliente ou ID..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-2 text-left font-medium">Data</th>
                  <th className="py-3 px-2 text-left font-medium">Nome</th>
                  <th className="py-3 px-2 text-left font-medium">Cliente</th>
                  <th className="py-3 px-2 text-center font-medium">Status</th>
                  <th className="py-3 px-2 text-right font-medium">Valor</th>
                  <th className="py-3 px-2 text-center font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
                        Carregando...
                      </div>
                    </td>
                  </tr>
                ) : filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center">
                      {searchQuery ? (
                        <div>
                          <p>Nenhum evento encontrado para esta busca</p>
                          <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2">
                            Limpar busca
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <p>Nenhum evento cadastrado</p>
                          <Button variant="outline" asChild className="mt-2">
                            <Link href="/eventos/novo">
                              <Plus className="mr-2 h-4 w-4" />
                              Criar Primeiro Evento
                            </Link>
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredEvents
                    .sort((a, b) => {
                      try {
                        const dateA = new Date(a.data)
                        const dateB = new Date(b.data)
                        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                          return 0
                        }
                        return dateA.getTime() - dateB.getTime()
                      } catch (err) {
                        console.error("Error sorting dates:", err)
                        return 0
                      }
                    })
                    .map((event) => (
                      <tr key={event.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2">
                          {(() => {
                            try {
                              const eventDate = new Date(event.data)
                              if (!isNaN(eventDate.getTime())) {
                                return eventDate.toLocaleDateString("pt-BR")
                              }
                              return "Data inválida"
                            } catch (err) {
                              return "Data inválida"
                            }
                          })()}
                        </td>
                        <td className="py-3 px-2">{event.nome}</td>
                        <td className="py-3 px-2">{event.clienteNome}</td>
                        <td className="py-3 px-2 text-center">
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
                        </td>
                        <td className="py-3 px-2 text-right">{formatCurrency(event.precoTotal)}</td>
                        <td className="py-3 px-2 text-center">
                          <Button variant="link" asChild className="h-auto p-0">
                            <Link href={`/eventos/${event.id}`}>Detalhes</Link>
                          </Button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

