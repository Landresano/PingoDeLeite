"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Edit, Trash, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import { handleError } from "@/lib/error-handler"
import { logAction } from "@/lib/log-handler"
import { cn } from "@/lib/utils"
import { fetchEventsFromDB } from "@/app/api/mongodb/actions" // Import MongoDB actions

export default function EventoDetalhesPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { id } = params

  const [event, setEvent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEventDetails = async () => {
      setIsLoading(true)
      try {
        console.log("Loading event details for ID:", id)


        const foundEvent = (await fetchEventsFromDB()).find((event) => event._id.toString() === id);
        // const response = await fetch(`/api/events/${id}`)
        // if (!response.ok) throw new Error("Evento não encontrado")

        // const foundEvent = await response.json()
         console.log("Found event:", foundEvent)

        if (!foundEvent) {
          throw new Error(`Evento com ID ${id} não encontrado`)
        }

        setEvent(foundEvent)
        logAction("View Event Details", (options) => toast({title: "Detalhes de Eventos", description: `Detalhes de ${foundEvent.nome} carregados`}), true, { eventId: id, eventName: foundEvent.nome })
      } catch (error) {
        const errorMsg = handleError(error, toast, "Erro ao carregar dados do evento")
        setError(errorMsg)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEventDetails()
  }, [id, toast])

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      console.log("Deleting event:", id)

      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir evento")
      }

      logAction("Delete Event", (options) => toast({title: "Evento deletado", description: `${event.nome} deletado`}), true, { eventId: id, eventName: event.nome  })
      toast({
        title: "Evento excluído",
        description: "O evento foi excluído com sucesso",
      })

      router.push("/eventos")
    } catch (error) {
      const errorMsg = handleError(error, toast, "Erro ao excluir evento")
      setError(errorMsg)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Carregando...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Detalhes do Evento</h1>
          <p className="text-muted-foreground">Visualize informações detalhadas do evento</p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <Button asChild>
          <Link href="/eventos">Voltar para Lista de Eventos</Link>
        </Button>
      </div>
    )
  }

  const getBalaoEspecialPriceDescription = (tipo: string, tamanho: string) => {
    switch (tipo) {
      case "Esphera":
        if (tamanho === "Gobo") return "R$15,00 por unidade"
        if (tamanho === '15"') return "R$20,00 por unidade"
        if (tamanho === '18"') return "R$30,00 por unidade"
        if (tamanho === '24"') return "R$40,00 por unidade"
        break
      case "Bubble Simples":
        if (tamanho === '11"') return "R$15,00 por unidade"
        if (tamanho === '18"') return "R$20,00 por unidade"
        if (tamanho === '24"') return "R$40,00 por unidade"
        break
      case "Bubble com Balão":
      case "Bubble com Confete":
        if (tamanho === '11"') return "R$20,00 por unidade"
        if (tamanho === '18"') return "R$40,00 por unidade"
        if (tamanho === '24"') return "R$60,00 por unidade"
        break
      case "Bubble Foil":
        return "R$20,00 por unidade"
    }
    return ""
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{event.nome}</h1>
          <p className="text-muted-foreground">{new Date(event.data).toLocaleDateString("pt-BR")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/eventos/editar/${event._id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>

          <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar exclusão</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja excluir o evento {event.nome}? Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleting(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Excluir
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Evento</CardTitle>
            <CardDescription>Detalhes gerais do evento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-sm">Data</h3>
                <p>{new Date(event.data).toLocaleDateString("pt-BR")}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm">Cliente</h3>
                <p>
                  <Button variant="link" asChild className="h-auto p-0">
                    <Link href={`/clientes/${event.clienteId}`}>{event.clienteNome}</Link>
                  </Button>
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm">Status</h3>
                <p>
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
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm">Valor Total</h3>
              <p className="text-xl font-bold">{formatCurrency(event.precoTotal)}</p>
            </div>

            <div>
              <h3 className="font-medium text-sm">Criado em</h3>
              <p>{new Date(event.createdAt).toLocaleDateString("pt-BR")}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Balões</CardTitle>
            <CardDescription>Configuração dos balões para o evento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-sm">Nacionalidade</h3>
                <p>{event.baloes.nacionalidade}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm">Customização</h3>
                <p>{event.baloes.customizacao}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-sm">Preenchimento</h3>
                <p>{event.baloes.preenchimento}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm">Metros</h3>
                <p>{event.baloes.metros}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm">Shine (Metros)</h3>
              <p>{event.baloes.shine}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Balões Especiais</CardTitle>
          <CardDescription>Balões especiais adicionados ao evento</CardDescription>
        </CardHeader>
        <CardContent>
          {event.baloesEspeciais.length === 0 ? (
            <p className="text-muted-foreground">Nenhum balão especial adicionado</p>
          ) : (
            <div className="space-y-4">
              {event.baloesEspeciais.map((balao: any, index: number) => (
                <div key={index} className="p-4 border rounded-md">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">
                        {balao.tipo} - {balao.tamanho}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {getBalaoEspecialPriceDescription(balao.tipo, balao.tamanho)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Quantidade: {balao.quantidade}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-xl font-bold">Total: {formatCurrency(event.precoTotal)}</div>
        </CardFooter>
      </Card>
    </div>
  )
}