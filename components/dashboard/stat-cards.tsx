import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formataDatinhaDoMeuJeitinhoDoAmor } from "@/lib/utils"

export function StatCard({ title, value, description }: { title: string; value: string; description?: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}

export function EventPriceCard({
  event,
  type,
}: {
  event: any
  type: "cheapest" | "expensive"
}) {
  if (!event || !event.nome) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {type === "cheapest" ? "Evento Mais Barato" : "Evento Mais Caro"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Nenhum evento encontrado</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          {type === "cheapest" ? "Evento Mais Barato" : "Evento Mais Caro"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(event.precoTotal)}</div>
        <div className="flex flex-col mt-1">
          <span className="text-sm font-medium">{event.nome}</span>
          <span className="text-xs text-muted-foreground">
            {formataDatinhaDoMeuJeitinhoDoAmor(event.data)} • {event.clienteNome}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export function TopClientCard({ client }: { client: { name: string; revenue: number } }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Cliente com Maior Receita</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(client.revenue)}</div>
        <div className="text-sm mt-1">{client.name}</div>
      </CardContent>
    </Card>
  )
}

export function ItemsNeededCard({
  itemsNeeded,
}: {
  itemsNeeded: {
    nationalBalloons: number
    importedBalloons: number
    totalRegularBalloons: number
    specialBalloonsList: Array<{ name: string; count: number }>
    totalSpecialBalloons: number
    shine: number
  }
}) {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Itens Necessários (4 semanas)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium">Balões Regulares</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Nacional:</span>
                <span className="font-medium">{itemsNeeded.nationalBalloons} metros</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Importado:</span>
                <span className="font-medium">{itemsNeeded.importedBalloons} metros</span>
              </div>
              <div className="flex justify-between text-sm font-medium pt-1 border-t">
                <span>Total:</span>
                <span>{itemsNeeded.totalRegularBalloons} metros</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-sm">
                <span>Shine:</span>
                <span className="font-medium">{itemsNeeded.shine} metros</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Balões Especiais</h3>
            <div className="space-y-1">
              {itemsNeeded.specialBalloonsList.length > 0 ? (
                <>
                  {itemsNeeded.specialBalloonsList.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name}:</span>
                      <span className="font-medium">{item.count} unidades</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-medium pt-1 border-t">
                    <span>Total:</span>
                    <span>{itemsNeeded.totalSpecialBalloons} unidades</span>
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Nenhum balão especial necessário</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function MostRequestedItemCard({
  regularItem,
  specialItem,
}: {
  regularItem: { name: string; count: number }
  specialItem: { name: string; count: number }
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Itens Mais Solicitados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="text-sm font-medium">Balões Regulares</div>
            <div className="text-lg font-bold">{regularItem.name}</div>
            <div className="text-xs text-muted-foreground">Solicitado em {regularItem.count} eventos</div>
          </div>

          <div>
            <div className="text-sm font-medium">Balões Especiais</div>
            <div className="text-lg font-bold">{specialItem.name}</div>
            <div className="text-xs text-muted-foreground">{specialItem.count} unidades solicitadas</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

