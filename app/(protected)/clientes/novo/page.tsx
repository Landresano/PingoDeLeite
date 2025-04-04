"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { formatCpfCnpj } from "@/lib/utils"
import { logAction } from "@/lib/log-handler"
import { createClientInDB } from "@/app/api/mongodb/actions" // Import MongoDB actions

export default function NovoClientePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isCreating, setIsCreating] = useState(false)

  const [formData, setFormData] = useState({
    nome: "",
    cpfCnpj: "",
    idade: "",
    endereco: "",
    filhos: "0",
    comentarios: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "cpfCnpj") {
      setFormData({
        ...formData,
        [name]: formatCpfCnpj(value),
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleCreate = async () => {
    setIsCreating(true);

    try {
      // Validar nome
      if (!formData.nome.trim()) {
        toast({
          title: "Erro",
          description: "O nome do cliente é obrigatório",
          variant: "destructive",
        });
        setIsCreating(false);
        return;
      }

      // Criar objeto do cliente
      const newClient = {
        nome: formData.nome.trim(),
        cpfCnpj: formData.cpfCnpj,
        idade: formData.idade ? Number.parseInt(formData.idade) : 0,
        endereco: formData.endereco,
        filhos: Number.parseInt(formData.filhos) || 0,
        comentarios: formData.comentarios,
        createdAt: new Date().toISOString(),
      };

      // Enviar para o MongoDB
      const createdClient = await createClientInDB(newClient);
      if (!createdClient) {
        throw new Error("Falha ao criar o cliente no banco de dados");
      }

            // Exibir toast de sucesso
      

      // Registrar ação
      logAction(
        "create_client",
        (options) => toast({
          title: "Cliente criado",
          description: `Cliente ${createdClient.nome} criado com sucesso`,
        }),
        true, // Indicar que foi bem-sucedido
        {
          clientId: createdClient._id,
          clientName: createdClient.nome,
          before: null,
          after: createdClient,
        }
      );

      // Redirecionar para lista de clientes
      router.push("/clientes");
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o cliente",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Novo Cliente</h1>
        <p className="text-muted-foreground">Adicione um novo cliente ao sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Cliente</CardTitle>
          <CardDescription>Preencha os dados do novo cliente. Apenas o nome é obrigatório.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/clientes")}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleCreate} disabled={isCreating}>
            {isCreating ? "Salvando..." : "Salvar Cliente"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
