"use client"

import type React from "react"
import type {Client} from "@/lib/types"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Combobox } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { logAction } from "@/lib/log-handler"
import { calculateEventPrice, formatCurrency } from "@/lib/utils"

export default function NovoEventoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  
  // Removed unused 'events' state

  // Get clientId from query params if available
  const clientIdFromQuery = searchParams.get("clienteId")

  const [formData, setFormData] = useState({
    data: new Date().toISOString().split("T")[0],
    nome: "",
    clienteId: clientIdFromQuery || "",
    clienteNome: "",
    status: "Orçamento", // Add default status
    baloes: {
      nacionalidade: "Nacional",
      customizacao: "Customizado",
      preenchimento: "Bom Preenchimento",
      metros: 1,
      shine: 0,
    },
    baloesEspeciais: [
      {
        tipo: "Esphera",
        tamanho: '18"',
        quantidade: 1,
      },
    ],
  })

    useEffect(() => {
      const fetchClients = async () => {
      try {
        const response = await fetch("/api/clients")
        if (!response.ok) throw new Error("Failed to fetch clients")

        const clientsData = await response.json()
        console.log("Clients loaded:", clientsData)

        setClients(clientsData)
      } catch (error) {
        console.error("Error fetching clients:", error)
      }
      }
      fetchClients()
    }, [])

    //TODO Como descobrir o que isso fazia?
    // useEffect(() => {
    //   if (clientIdFromQuery) {
    //     const selectedClient = clients.find((c: any) => c._id === clientIdFromQuery)
    //     if (selectedClient) {
    //       setFormData((prev) => ({
    //         ...prev,
    //         clienteNome: selectedClient.nome,
    //       }))
    //     }}
    //  }, [clientIdFromQuery, clients])

  // Calculate total price whenever form data changes
  useEffect(() => {
    const price = calculateEventPrice(formData)
    setTotalPrice(price)
  }, [formData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleBaloesChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      baloes: {
        ...formData.baloes,
        [field]: field === "metros" || field === "shine" ? Number(value) : value,
      },
    })
  }

  const handleBaloesEspeciaisChange = (index: number, field: string, value: any) => {
    const updatedBaloesEspeciais = [...formData.baloesEspeciais]
    updatedBaloesEspeciais[index] = {
      ...updatedBaloesEspeciais[index],
      [field]: field === "quantidade" ? Number(value) : value,
    }

    setFormData({
      ...formData,
      baloesEspeciais: updatedBaloesEspeciais,
    })
  }

  const addBalaoEspecial = () => {
    setFormData({
      ...formData,
      baloesEspeciais: [
        ...formData.baloesEspeciais,
        {
          tipo: "Esphera",
          tamanho: '18"',
          quantidade: 1,
        },
      ],
    })
  }

  const removeBalaoEspecial = (index: number) => {
    const updatedBaloesEspeciais = [...formData.baloesEspeciais]
    updatedBaloesEspeciais.splice(index, 1)

    setFormData({
      ...formData,
      baloesEspeciais: updatedBaloesEspeciais,
    })
  }

  const handleClientSelect = (clientId: string) => {
    const selectedClient = clients.find((c) => c._id.toString() === clientId)
  
    setFormData({
      ...formData,
      clienteId: clientId,
      clienteNome: selectedClient ? selectedClient.nome : "",
    })
  

    setFormData({
      ...formData,
      clienteId: clientId,
      clienteNome: selectedClient ? selectedClient.nome : "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!formData.nome.trim()) {
        toast({
          title: "Erro",
          description: "O nome do evento é obrigatório",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (!formData.clienteId) {
        toast({
          title: "Erro",
          description: "Selecione um cliente para o evento",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Get existing events
      const fetchEvents = async () => {
        try {
          const response = await fetch("/api/events")
          if (!response.ok) throw new Error("Failed to fetch events")
      
          const eventsData = await response.json()
          console.log("Events loaded:", eventsData)
      
          return eventsData
        } catch (error) {
          console.error("Error fetching events:", error)
          return []
        }
      }

      // Create new event object
      const newEvent = {
        data: formData.data,
        nome: formData.nome.trim(),
        clienteId: formData.clienteId,
        clienteNome: formData.clienteNome,
        status: formData.status,
        baloes: formData.baloes,
        baloesEspeciais: formData.baloesEspeciais,
        precoTotal: totalPrice,
        createdAt: new Date().toISOString(),
      }

      // Save to mongoDB
      const saveEventToDB = async (newEvent: any) => {
        try {
          const response = await fetch("/api/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newEvent),
          })
      
          if (!response.ok) throw new Error("Failed to save event")
      
          const savedEvent = await response.json()
          // Optionally log the saved event
          console.log("Saved event:", savedEvent)
          // Optionally update local state with the new event
          // Optionally update local state with the new event (removed setEvents as it is undefined)
        } catch (error) {
          console.error("Error saving event:", error)
        }
      }
      await saveEventToDB(newEvent)

      // Log the action
      logAction("Create_Event",
        (options) => toast({title: "Evento criado", description: `Evento ${newEvent.nome} criado com sucesso`}),
        true, 
        { eventName: newEvent.nome, clientId: newEvent.clienteId, clientName: newEvent.clienteNome, before: null, after: newEvent})
      

      // Redirect to event list
      router.push("/eventos")
    } catch (error) {
      console.error("Error creating event:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o evento",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get available tamanhos based on tipo
  const getTamanhoOptions = (tipo: string) => {
    switch (tipo) {
      case "Esphera":
        return [
          { value: "Gobo", label: "Gobo - R$15,00" },
          { value: '15"', label: '15" - R$20,00' },
          { value: '18"', label: '18" - R$30,00' },
          { value: '24"', label: '24" - R$40,00' },
        ]
      case "Bubble Simples":
        return [
          { value: '11"', label: '11" - R$15,00' },
          { value: '18"', label: '18" - R$20,00' },
          { value: '24"', label: '24" - R$40,00' },
        ]
      case "Bubble com Balão":
      case "Bubble com Confete":
        return [
          { value: '11"', label: '11" - R$20,00' },
          { value: '18"', label: '18" - R$40,00' },
          { value: '24"', label: '24" - R$60,00' },
        ]
      case "Bubble Foil":
        return [{ value: "Tamanho Unico", label: "Tamanho Único - R$20,00" }]
      default:
        return []
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Novo Evento</h1>
        <p className="text-muted-foreground">Adicione um novo evento ao sistema</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Detalhes gerais do evento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="data">Data *</Label>
                <Input id="data" name="data" type="date" value={formData.data} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Evento *</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Nome do evento"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente *</Label>
                <Combobox
                  items={clients.map((client) => ({
                    label: client.nome,
                    value: client._id.toString(), // Convert ObjectId to string
                  }))}
                  value={formData.clienteId}
                  onChange={handleClientSelect}
                  placeholder="Selecione um cliente"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Orçamento">Orçamento</SelectItem>
                    <SelectItem value="Fechada">Fechada</SelectItem>
                    <SelectItem value="Paga">Paga</SelectItem>
                    <SelectItem value="Finalizada">Finalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Balões</CardTitle>
              <CardDescription>Configuração dos balões para o evento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nacionalidade">Nacionalidade</Label>
                <Select
                  value={formData.baloes.nacionalidade}
                  onValueChange={(value) => handleBaloesChange("nacionalidade", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a nacionalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nacional">Nacional</SelectItem>
                    <SelectItem value="Importado">Importado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customizacao">Customização</Label>
                <Select
                  value={formData.baloes.customizacao}
                  onValueChange={(value) => handleBaloesChange("customizacao", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a customização" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Customizado">Customizado</SelectItem>
                    <SelectItem value="Meio a Meio">Meio a Meio</SelectItem>
                    <SelectItem value="Sem Customização">Sem Customização</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preenchimento">Preenchimento</Label>
                <Select
                  value={formData.baloes.preenchimento}
                  onValueChange={(value) => handleBaloesChange("preenchimento", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o preenchimento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sem Preenchimento">Sem Preenchimento (0%)</SelectItem>
                    <SelectItem value="Pouco Preenchimento">Pouco Preenchimento (+50%)</SelectItem>
                    <SelectItem value="Médio Preenchimento">Médio Preenchimento (+80%)</SelectItem>
                    <SelectItem value="Bom Preenchimento">Bom Preenchimento (+100%)</SelectItem>
                    <SelectItem value="Muito Preenchimento">Muito Preenchimento (+120%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="metros">Metros</Label>
                  <Input
                    id="metros"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.baloes.metros}
                    onChange={(e) => handleBaloesChange("metros", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shine">Shine (Metros)</Label>
                  <Input
                    id="shine"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.baloes.shine}
                    onChange={(e) => handleBaloesChange("shine", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Balões Especiais</CardTitle>
            <CardDescription>Adicione balões especiais ao evento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.baloesEspeciais.map((balao, index) => (
                <div key={index} className="flex flex-col gap-4 p-4 border rounded-md">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Balão Especial #{index + 1}</h3>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeBalaoEspecial(index)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`tipo-${index}`}>Tipo</Label>
                      <Select
                        value={balao.tipo}
                        onValueChange={(value) => handleBaloesEspeciaisChange(index, "tipo", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Esphera">Esphera</SelectItem>
                          <SelectItem value="Bubble Simples">Bubble Simples</SelectItem>
                          <SelectItem value="Bubble com Balão">Bubble com Balão</SelectItem>
                          <SelectItem value="Bubble com Confete">Bubble com Confete</SelectItem>
                          <SelectItem value="Bubble Foil">Bubble Foil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`tamanho-${index}`}>Tamanho</Label>
                      <Select
                        value={balao.tamanho}
                        onValueChange={(value) => handleBaloesEspeciaisChange(index, "tamanho", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tamanho" />
                        </SelectTrigger>
                        <SelectContent>
                          {getTamanhoOptions(balao.tipo).map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`quantidade-${index}`}>Quantidade</Label>
                      <Input
                        id={`quantidade-${index}`}
                        type="number"
                        min="1"
                        value={balao.quantidade}
                        onChange={(e) => handleBaloesEspeciaisChange(index, "quantidade", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addBalaoEspecial} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Balão Especial
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xl font-bold">Total: {formatCurrency(totalPrice)}</div>
            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/eventos")}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Evento"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}