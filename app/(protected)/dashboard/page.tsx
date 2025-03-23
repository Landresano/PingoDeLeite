"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { RevenueProjectionChart, TopItemsChart, calculateAnalytics } from "@/components/dashboard/analytics"
import {
  StatCard,
  EventPriceCard,
  TopClientCard,
  ItemsNeededCard,
  MostRequestedItemCard,
} from "@/components/dashboard/stat-cards"
import { fetchClientsFromDB, fetchEventsFromDB } from "@/app/actions" // Import MongoDB actions

export default function DashboardPage() {
  const [clients, setClients] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load clients and events from MongoDB
        const clientsData = await fetchClientsFromDB()
        const eventsData = await fetchEventsFromDB()

        setClients(clientsData)
        setEvents(eventsData)

        // Calculate analytics
        if (eventsData.length > 0) {
          const analyticsData = calculateAnalytics(eventsData, clientsData)
          setAnalytics(analyticsData)
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Calculate total revenue
  const totalRevenue = events.reduce((sum, event) => sum + event.precoTotal, 0)

  // Calculate events per client
  const eventsPerClient = events.reduce((acc: any, event) => {
    const clientId = event.clienteId
    if (!acc[clientId]) {
      acc[clientId] = {
        count: 0,
        revenue: 0,
      }
    }
    acc[clientId].count += 1
    acc[clientId].revenue += event.precoTotal
    return acc
  }, {})

  // Enrich client data with event counts and revenue
  const clientsWithStats = clients.map((client) => ({
    ...client,
    eventCount: eventsPerClient[client._id]?.count || 0,
    totalRevenue: eventsPerClient[client._id]?.revenue || 0,
  }))

  // Sort clients by event count (descending)
  const sortedClients = [...clientsWithStats].sort((a, b) => b.eventCount - a.eventCount)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral de clientes e eventos do Pingo de Leite</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total de Clientes" value={clients.length.toString()} />

        <StatCard title="Total de Eventos" value={events.length.toString()} />

        <StatCard title="Receita Total" value={formatCurrency(totalRevenue)} />

        <StatCard
          title="Média por Evento"
          value={events.length > 0 ? formatCurrency(totalRevenue / events.length) : formatCurrency(0)}
        />
      </div>

      {!isLoading && analytics && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Projeção de Receita</CardTitle>
              <CardDescription>Receita projetada para as próximas 4 semanas</CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueProjectionChart events={events} />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <MostRequestedItemCard
              regularItem={analytics.mostRequestedItem}
              specialItem={analytics.mostRequestedSpecialItem}
            />

            <TopClientCard client={analytics.topClient} />

            <div className="md:col-span-2 lg:col-span-1">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                <EventPriceCard event={analytics.cheapestEvent} type="cheapest" />
                <EventPriceCard event={analytics.mostExpensiveEvent} type="expensive" />
              </div>
            </div>
          </div>

          <ItemsNeededCard itemsNeeded={analytics.itemsNeeded} />

          <Card>
            <CardHeader>
              <CardTitle>Itens Mais Solicitados</CardTitle>
              <CardDescription>Top 5 itens mais solicitados em todos os eventos</CardDescription>
            </CardHeader>
            <CardContent>
              <TopItemsChart events={events} />
            </CardContent>
          </Card>
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
          <CardDescription>Lista de clientes e seus eventos associados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-2 text-left font-medium">Cliente #</th>
                  <th className="py-3 px-2 text-left font-medium">Nome</th>
                  <th className="py-3 px-2 text-left font-medium">CPF/CNPJ</th>
                  <th className="py-3 px-2 text-left font-medium">Email</th>
                  <th className="py-3 px-2 text-center font-medium">Eventos</th>
                  <th className="py-3 px-2 text-right font-medium">Receita Total</th>
                  <th className="py-3 px-2 text-center font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-4 text-center">
                      Carregando...
                    </td>
                  </tr>
                ) : sortedClients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-4 text-center">
                      Nenhum cliente encontrado
                    </td>
                  </tr>
                ) : (
                  sortedClients.map((client) => (
                    <tr key={client._id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2">{client._id}</td>
                      <td className="py-3 px-2">{client.nome}</td>
                      <td className="py-3 px-2">{client.cpfCnpj}</td>
                      <td className="py-3 px-2">-</td>
                      <td className="py-3 px-2 text-center">{client.eventCount}</td>
                      <td className="py-3 px-2 text-right">{formatCurrency(client.totalRevenue)}</td>
                      <td className="py-3 px-2 text-center">
                        <Link href={`/clientes/${client._id}`} className="text-primary hover:underline">
                          Detalhes
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Próximos Eventos</CardTitle>
          <CardDescription>Eventos agendados para os próximos dias</CardDescription>
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
                    <td colSpan={6} className="py-4 text-center">
                      Carregando...
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-4 text-center">
                      Nenhum evento encontrado
                    </td>
                  </tr>
                ) : (
                  // Sort events by date and show only future events
                  events
                    .filter((event) => new Date(event.data) >= new Date())
                    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
                    .slice(0, 5)
                    .map((event) => (
                      <tr key={event._id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2">{new Date(event.data).toLocaleDateString("pt-BR")}</td>
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
                          <Link href={`/eventos/${event._id}`} className="text-primary hover:underline">
                            Detalhes
                          </Link>
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