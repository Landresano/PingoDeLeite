"use client"

import type React from "react"
import type Client from "@/lib/types"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CalendarDays, Edit, Trash, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {  Dialog,  DialogContent,  DialogDescription,  DialogFooter,  DialogHeader,  DialogTitle,  DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import { handleError } from "@/lib/error-handler"
import { logAction } from "@/lib/log-handler"
import { fetchClientFromDB, fetchEventsByClientFromDB, updateClientInDB, deleteClientFromDB } from "@/app/api/mongodb/actions" // Import MongoDB actions


export default function ClienteDetalhesPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { id } = params

  const [client, setClient] = useState<any>(null)
  const [clientEvents, setClientEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nome: "",
    cpfCnpj: "",
    idade: "",
    endereco: "",
    filhos: "0",
    comentarios: "",
  })

  useEffect(() => {
    const loadClientData = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching client details for ID:", id);
          
        // Fetch client from MongoDB
        const foundClient: Client | null = await fetchClientFromDB(id);
        if (!foundClient) {
          throw new Error("Cliente não encontrado");
        }
        
        console.log("Fetched client:", foundClient);

        setClient(foundClient);
  
        // Initialize form data
        setFormData({
          nome: foundClient.nome || "",
          cpfCnpj: foundClient.cpfCnpj || "",
          idade: foundClient.idade ? foundClient.idade.toString() : "",
          endereco: foundClient.endereco || "",
          filhos: foundClient.filhos ? foundClient.filhos.toString() : "0",
          comentarios: foundClient.comentarios || "",
        });
  
        // Fetch related events
        const clientEvents = await fetchEventsByClientFromDB(id);
        console.log("Fetched client events:", clientEvents);
  
        setClientEvents(clientEvents);
  
        logAction("View Client Details", (options) => toast({title: "Detalhes do Cliente", description: `${foundClient.nome}`}), true, { clientId: id, clientName: foundClient.nome });
      } catch (error) {
        const errorMsg = handleError(error, toast, "Erro ao carregar dados do cliente");
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };
  
    loadClientData();
  }, [id, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSave = async () => {
    setIsSaving(true);
  
    try {
      console.log("Saving client changes:", formData);
  
      if (!formData.nome.trim()) {
        throw new Error("O nome do cliente é obrigatório");
      }
  
      // Create updated client object
      const updatedClient = {
        ...client,
        nome: formData.nome.trim(),
        cpfCnpj: formData.cpfCnpj,
        idade: formData.idade ? Number.parseInt(formData.idade) : null,
        endereco: formData.endereco,
        filhos: Number.parseInt(formData.filhos) || 0,
        comentarios: formData.comentarios,
        updatedAt: new Date().toISOString(),
      };
  
      // Update client in MongoDB
      const success = await updateClientInDB(id, updatedClient);
  
      if (!success) {
        throw new Error("Erro ao atualizar cliente");
      }
  
      setClient(updatedClient);
      setIsEditing(false);
  
      logAction("Update Client", (options) => toast({title: "Atualizando Cliente", description: `${updatedClient.nome}`}), true, { clientId: id, clientName: updatedClient.nome });
  
      toast({
        title: "Cliente atualizado",
        description: "As informações do cliente foram atualizadas com sucesso",
      });
    } catch (error) {
      console.error("Error updating client:", error);
      const errorMsg = handleError(error, toast, "Erro ao atualizar cliente");
      setError(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
  
    try {
      console.log("Deleting client:", id);
  
      const success = await deleteClientFromDB(id);
      if (!success) {
        throw new Error("Erro ao excluir cliente");
      }
  
      logAction("Delete Client", (options) => toast({title: "Removendo Cliente", description: `${client.nome}`}), true, { clientId: id, clientName: client.nome });

      toast({
        title: "Cliente excluído",
        description: "O cliente foi excluído com sucesso",
      });
  
      router.push("/clientes");
    } catch (error) {
      console.error("Error deleting client:", error);
      const errorMsg = handleError(error, toast, "Erro ao excluir cliente");
      setError(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };
  

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
          <h1 className="text-3xl font-bold tracking-tight">Detalhes do Cliente</h1>
          <p className="text-muted-foreground">Visualize informações detalhadas do cliente</p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <Button asChild>
          <Link href="/clientes">Voltar para Lista de Clientes</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{client.nome}</h1>
          <p className="text-muted-foreground">Cliente #{client.id || client._id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="mr-2 h-4 w-4" />
            {isEditing ? "Cancelar Edição" : "Editar"}
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
                  Tem certeza que deseja excluir o cliente {client.nome}? Esta ação não pode ser desfeita.
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
            <CardTitle>Informações do Cliente</CardTitle>
            <CardDescription>Detalhes e informações de contato</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Nome do cliente ou empresa"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                  <Input
                    id="cpfCnpj"
                    name="cpfCnpj"
                    value={formData.cpfCnpj}
                    onChange={handleChange}
                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="idade">Idade</Label>
                    <Input
                      id="idade"
                      name="idade"
                      type="number"
                      value={formData.idade}
                      onChange={handleChange}
                      placeholder="Idade"
                      min="0"
                      max="120"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="filhos">Filhos</Label>
                    <Input
                      id="filhos"
                      name="filhos"
                      type="number"
                      value={formData.filhos}
                      onChange={handleChange}
                      placeholder="Número de filhos"
                      min="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    placeholder="Endereço completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comentarios">Comentários</Label>
                  <Textarea
                    id="comentarios"
                    name="comentarios"
                    value={formData.comentarios}
                    onChange={handleChange}
                    placeholder="Observações sobre o cliente"
                    rows={4}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm">CPF/CNPJ</h3>
                    <p>{client.cpfCnpj || "-"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Idade</h3>
                    <p>{client.idade || "-"}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-sm">Endereço</h3>
                  <p>{client.endereco || "-"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm">Filhos</h3>
                    <p>{client.filhos || "0"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Cliente desde</h3>
                    <p>{new Date(client.createdAt).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-sm">Comentários</h3>
                  <p className="whitespace-pre-line">{client.comentarios || "-"}</p>
                </div>
              </div>
            )}
          </CardContent>
          {isEditing && (
            <CardFooter>
              <Button className="ml-auto" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </CardFooter>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eventos</CardTitle>
            <CardDescription>Eventos associados a este cliente</CardDescription>
          </CardHeader>
          <CardContent>
            {clientEvents.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Nenhum evento encontrado para este cliente</p>
                <Button asChild className="mt-4">
                  <Link href={`/eventos/novo?clienteId=${client.id || client._id}`}>
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Criar Novo Evento
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Total de eventos: {clientEvents.length}</p>
                  <Button asChild size="sm">
                    <Link href={`/eventos/novo?clienteId=${client.id || client._id}`}>
                      <CalendarDays className="mr-2 h-4 w-4" />
                      Novo Evento
                    </Link>
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  {clientEvents
                    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                    .map((event) => (
                      <div key={event._id} className="flex justify-between items-start border-b pb-4">
                        <div>
                          <h3 className="font-medium">{event.nome}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.data).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(event.precoTotal)}</p>
                          <Button variant="link" asChild className="h-auto p-0">
                            <Link href={`/eventos/${event._id}`}>Ver detalhes</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

