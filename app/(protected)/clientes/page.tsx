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
import { handleError, logAction } from "@/lib/error-handler"
import { fetchClientsFromDB } from "@/app/actions"

export default function ClientesPage() {
  const [clients, setClients] = useState<any[]>([])
  const [filteredClients, setFilteredClients] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadClients = async () => {
      try {
        console.log("Loading clients from MongoDB");
  
        setIsLoading(true);
  
        // Buscar clientes do MongoDB via API
        const response = await fetchClientsFromDB();
        if (!response || response.length === 0) {
          console.log("No clients found in MongoDB");
          setError("No clients found. Create your first client to get started.");
          setClients([]);
          setFilteredClients([]);
        } else {
          console.log("Clients loaded from MongoDB:", response);
          setClients(response);
          setFilteredClients(response);
        }
  
        logAction("Load Clients", toast, true, { count: response.length });
      } catch (err) {
        console.error("Failed to load clients from MongoDB:", err);
        const errorMsg = handleError(err, toast, "Failed to load clients from MongoDB");
        setError(errorMsg);
        logAction("Load Clients", toast, false, { error: errorMsg });
      } finally {
        setIsLoading(false);
      }
    };
  
    loadClients();
  }, [toast])

  // Filter clients based on search query
  useEffect(() => {
    try {
      if (!searchQuery.trim()) {
        setFilteredClients(clients)
        return
      }

      const query = searchQuery.toLowerCase()
      const filtered = clients.filter(
        (client) =>
          client.nome?.toLowerCase().includes(query) ||
          client.cpfCnpj?.toLowerCase().includes(query) ||
          client.id?.includes(query)|| client._id?.includes(query),
      )

      setFilteredClients(filtered)

      if (filtered.length === 0 && clients.length > 0) {
        toast({
          title: "Search Results",
          description: "No clients match your search criteria",
        })
      }
    } catch (err) {
      handleError(err, toast, "Error filtering clients")
    }
  }, [searchQuery, clients, toast])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    logAction("Search Clients", toast, true, { query: e.target.value })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">Gerencie seus clientes do Pingo de Leite</p>
        </div>
        <Button asChild>
          <Link href="/clientes/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
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
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>Visualize e gerencie todos os seus clientes</CardDescription>
          <div className="mt-4 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nome, CPF/CNPJ ou ID..."
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
                  <th className="py-3 px-2 text-left font-medium">Cliente #</th>
                  <th className="py-3 px-2 text-left font-medium">Nome</th>
                  <th className="py-3 px-2 text-left font-medium">CPF/CNPJ</th>
                  <th className="py-3 px-2 text-left font-medium">Endereço</th>
                  <th className="py-3 px-2 text-center font-medium">Filhos</th>
                  <th className="py-3 px-2 text-center font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-4 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
                        Carregando...
                      </div>
                    </td>
                  </tr>
                ) : filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-4 text-center">
                      {searchQuery ? (
                        <div>
                          <p>Nenhum cliente encontrado para esta busca</p>
                          <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2">
                            Limpar busca
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <p>Nenhum cliente cadastrado</p>
                          <Button variant="outline" asChild className="mt-2">
                            <Link href="/clientes/novo">
                              <Plus className="mr-2 h-4 w-4" />
                              Criar Primeiro Cliente
                            </Link>
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => (
                    <tr key={client.id || client._id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2">{client.id || client._id}</td>
                      <td className="py-3 px-2">{client.nome}</td>
                      <td className="py-3 px-2">{client.cpfCnpj}</td>
                      <td className="py-3 px-2">{client.endereco}</td>
                      <td className="py-3 px-2 text-center">{client.filhos}</td>
                      <td className="py-3 px-2 text-center">
                        <Button variant="link" asChild className="h-auto p-0">
                          <Link href={`/clientes/${client.id || client._id}`}>Detalhes</Link>
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

