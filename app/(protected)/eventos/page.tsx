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
import { handleError } from "@/lib/error-handler"
import { logAction } from "@/lib/log-handler"
import { cn } from "@/lib/utils"

export default function EventosPage() {
  const [events, setEvents] = useState<any[]>([])
  const [filteredEvents, setFilteredEvents] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadEvents = async () => {
      try {
        console.log("Loading events from MongoDB...")

        const response = await fetch("/api/events") // Call API route to fetch events
        if (!response.ok) throw new Error("Failed to fetch events")

        const eventsData = await response.json()
        console.log("Events loaded:", eventsData)

        if (eventsData.length === 0) {
          console.log("No events found")
          setError("No events found. Create your first event to get started.")
        }

        setEvents(eventsData)
        setFilteredEvents(eventsData)

        logAction("Load Events", (options) => toast({title: "Eventos carregados", description: `${eventsData.length} carregados`}), true, { count: eventsData.length})

      } catch (err) {
        console.error("Failed to load events:", err)
        const errorMsg = handleError(err, toast, "Failed to load events")
        setError(errorMsg)
        logAction("Load Events", (options) => toast({title: "Falha no carregamento dos eventos:", description: `${errorMsg}`}), false, { error: errorMsg })
      } finally {
        setIsLoading(false)
      }
    }

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
          event._id?.includes(query)
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
    logAction("Search Events", (options) => toast({}), true, { query: e.target.value })
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
                    <td colSpan={5} className="py-4 text-center">Carregando...</td>
                  </tr>
                ) : filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center">Nenhum evento encontrado</td>
                  </tr>
                ) : (
                  filteredEvents.map((event) => (
                    <tr key={event._id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2">
                        {new Date(event.data).toLocaleDateString("pt-BR")}
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
                            event.status === "Finalizada" && "bg-purple-100 text-purple-800"
                          )}
                        >
                          {event.status || "Orçamento"}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">{formatCurrency(event.precoTotal)}</td>
                      <td className="py-3 px-2 text-center">
                        <Button variant="link" asChild className="h-auto p-0">
                          <Link href={`/eventos/${event._id}`}>Detalhes</Link>
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
