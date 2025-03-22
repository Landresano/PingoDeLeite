"use client"

import { useMemo } from "react"
import { formatCurrency } from "@/lib/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts"

// Function to get the week number of a date
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

// Function to get the week label (e.g., "Week 1")
function getWeekLabel(date: Date): string {
  const weekNumber = getWeekNumber(date)
  return `Semana ${weekNumber}`
}

// Function to get the month and day (e.g., "Jan 15")
function getMonthDay(date: Date): string {
  return `${date.getDate()}/${date.getMonth() + 1}`
}

export function RevenueProjectionChart({ events }: { events: any[] }) {
  const chartData = useMemo(() => {
    const today = new Date()
    const nextFourWeeks: { [key: string]: { date: Date; revenue: number } } = {}

    // Initialize the next 4 weeks
    for (let i = 0; i < 4; i++) {
      const weekDate = new Date(today)
      weekDate.setDate(today.getDate() + i * 7)
      const weekLabel = getWeekLabel(weekDate)
      nextFourWeeks[weekLabel] = {
        date: weekDate,
        revenue: 0,
      }
    }

    // Filter events for the next 4 weeks and sum revenue by week
    events.forEach((event) => {
      const eventDate = new Date(event.data)

      // Only consider future events
      if (eventDate >= today) {
        const weekDiff = Math.floor((eventDate.getTime() - today.getTime()) / (7 * 24 * 60 * 60 * 1000))

        // Only include events in the next 4 weeks
        if (weekDiff < 4) {
          const weekLabel = getWeekLabel(eventDate)
          if (nextFourWeeks[weekLabel]) {
            nextFourWeeks[weekLabel].revenue += event.precoTotal
          }
        }
      }
    })

    // Convert to array for chart
    return Object.entries(nextFourWeeks).map(([weekLabel, data]) => ({
      name: `${weekLabel} (${getMonthDay(data.date)})`,
      revenue: data.revenue,
    }))
  }, [events])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => formatCurrency(value).split(",")[0]} />
        <Tooltip formatter={(value: number) => [formatCurrency(value), "Receita Projetada"]} />
        <Legend />
        <Line type="monotone" dataKey="revenue" name="Receita Projetada" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function TopItemsChart({ events }: { events: any[] }) {
  const chartData = useMemo(() => {
    const itemCounts: { [key: string]: number } = {}

    // Count all balloon types
    events.forEach((event) => {
      // Count regular balloons
      const balloonType = `${event.baloes.nacionalidade} ${event.baloes.customizacao}`
      itemCounts[balloonType] = (itemCounts[balloonType] || 0) + 1

      // Count special balloons
      event.baloesEspeciais.forEach((balao: any) => {
        const specialType = `${balao.tipo} ${balao.tamanho}`
        itemCounts[specialType] = (itemCounts[specialType] || 0) + balao.quantidade
      })
    })

    // Convert to array and sort by count
    return Object.entries(itemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5) // Top 5 items
  }, [events])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" name="Quantidade" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function calculateAnalytics(events: any[], clients: any[]) {
  // Find most requested item
  const itemCounts: { [key: string]: number } = {}
  const specialItemCounts: { [key: string]: number } = {}

  events.forEach((event) => {
    // Count regular balloons
    const balloonType = `${event.baloes.nacionalidade} ${event.baloes.customizacao}`
    itemCounts[balloonType] = (itemCounts[balloonType] || 0) + 1

    // Count special balloons
    event.baloesEspeciais.forEach((balao: any) => {
      const specialType = `${balao.tipo} ${balao.tamanho}`
      specialItemCounts[specialType] = (specialItemCounts[specialType] || 0) + balao.quantidade
    })
  })

  // Find most popular regular balloon
  let mostRequestedItem = { name: "Nenhum", count: 0 }
  Object.entries(itemCounts).forEach(([name, count]) => {
    if (count > mostRequestedItem.count) {
      mostRequestedItem = { name, count }
    }
  })

  // Find most popular special balloon
  let mostRequestedSpecialItem = { name: "Nenhum", count: 0 }
  Object.entries(specialItemCounts).forEach(([name, count]) => {
    if (count > mostRequestedSpecialItem.count) {
      mostRequestedSpecialItem = { name, count }
    }
  })

  // Find cheapest and most expensive events
  let cheapestEvent = { ...events[0], precoTotal: Number.POSITIVE_INFINITY }
  let mostExpensiveEvent = { ...events[0], precoTotal: Number.NEGATIVE_INFINITY }

  events.forEach((event) => {
    if (event.precoTotal < cheapestEvent.precoTotal) {
      cheapestEvent = event
    }
    if (event.precoTotal > mostExpensiveEvent.precoTotal) {
      mostExpensiveEvent = event
    }
  })

  // Calculate revenue per client
  const revenuePerClient: { [key: string]: number } = {}
  events.forEach((event) => {
    revenuePerClient[event.clienteId] = (revenuePerClient[event.clienteId] || 0) + event.precoTotal
  })

  // Find client with most revenue
  let topClient = { id: "", name: "Nenhum", revenue: 0 }
  Object.entries(revenuePerClient).forEach(([clientId, revenue]) => {
    if (revenue > topClient.revenue) {
      const client = clients.find((c) => c.id === clientId)
      topClient = {
        id: clientId,
        name: client ? client.nome : "Cliente Desconhecido",
        revenue,
      }
    }
  })

  // Calculate items needed in the next 4 weeks
  const today = new Date()
  const fourWeeksLater = new Date(today)
  fourWeeksLater.setDate(today.getDate() + 28)

  // Track balloons by nationality
  let nationalBalloons = 0
  let importedBalloons = 0
  let totalShine = 0

  // Track special balloons by type and size
  const specialBalloonsBySize: { [key: string]: number } = {}

  events.forEach((event) => {
    const eventDate = new Date(event.data)
    if (eventDate >= today && eventDate <= fourWeeksLater) {
      // Count regular balloons by nationality (in meters)
      if (event.baloes.nacionalidade === "Nacional") {
        nationalBalloons += event.baloes.metros
      } else if (event.baloes.nacionalidade === "Importado") {
        importedBalloons += event.baloes.metros
      }

      // Count shine (in meters)
      totalShine += event.baloes.shine

      // Count special balloons by type and size
      event.baloesEspeciais.forEach((balao: any) => {
        const sizeKey = `${balao.tipo} ${balao.tamanho}`
        specialBalloonsBySize[sizeKey] = (specialBalloonsBySize[sizeKey] || 0) + balao.quantidade
      })
    }
  })

  // Convert special balloons object to array for easier display
  const specialBalloonsList = Object.entries(specialBalloonsBySize)
    .map(([name, count]) => ({
      name,
      count,
    }))
    .sort((a, b) => b.count - a.count)

  return {
    mostRequestedItem,
    mostRequestedSpecialItem,
    cheapestEvent,
    mostExpensiveEvent,
    topClient,
    itemsNeeded: {
      nationalBalloons,
      importedBalloons,
      totalRegularBalloons: nationalBalloons + importedBalloons,
      specialBalloonsList,
      totalSpecialBalloons: Object.values(specialBalloonsBySize).reduce((sum, count) => sum + count, 0),
      shine: totalShine,
    },
  }
}

