import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatDocument(value: string): string {
  // Remove non-numeric characters
  const numbers = value.replace(/\D/g, "")

  // Format as CPF (000.000.000-00) or CNPJ (00.000.000/0000-00)
  if (numbers.length <= 11) {
    // CPF
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  } else {
    // CNPJ
    return numbers
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
  }
}

export function formataDatinhaDoMeuJeitinhoDoAmor(value: string): string {
  if(value.length == 10) 
    //2025-05-24 -> 24/05/2025
    return `${value.split("-")[2]}/${value.split("-")[1]}/${value.split("-")[0]}`
  else if(value.length == 24) 
  //2025-05-24T10:00:00.000Z -> 24/05/2025 10:00:00
    if (parseInt(value.split(":")[0].split("T")[1], 10) < 3)
      // Se o horário for menor que 3, então é o dia anterior
      return `${parseInt(value.split("-")[2].split("T")[0], 10) - 1}/${value.split("-")[1]}/${value.split("-")[0]} ${25 - parseInt(value.split(":")[0].split("T")[1], 10)}:${value.split(":")[1]}:${value.split(":")[2].split(".")[0]}`
    else 
      // Se o horário for maior que 3, então é o mesmo dia
    return `${value.split("-")[2].split("T")[0]}/${value.split("-")[1]}/${value.split("-")[0]} 0${value.split(":")[0].split("T")[1]-3}:${value.split(":")[1]}:${value.split(":")[2].split(".")[0]}`
  else 
    return value
}


export function calculateBalloonPrice(
  nationality: string,
  customization: string,
  filling: string,
  meters: number,
): number {
  // Base price based on nationality and customization
  let basePrice = 0

  if (nationality === "Importado") {
    if (customization === "Customizado") {
      basePrice = 150
    } else if (customization === "Meio a Meio") {
      basePrice = 140
    } else if (customization === "Sem Customização") {
      basePrice = 130
    }
  } else if (nationality === "Nacional") {
    if (customization === "Customizado") {
      basePrice = 95
    } else if (customization === "Meio a Meio") {
      basePrice = 87.5
    } else if (customization === "Sem Customização") {
      basePrice = 80
    }
  }

  // Apply filling factor
  let fillingFactor = 0

  if (filling === "Pouco Preenchimento") {
    fillingFactor = 0.5
  } else if (filling === "Médio Preenchimento") {
    fillingFactor = 0.8
  } else if (filling === "Bom Preenchimento") {
    fillingFactor = 1
  } else if (filling === "Muito Preenchimento") {
    fillingFactor = 1.2
  }

  // Calculate base cost
  const baseCost = basePrice * meters

  // Calculate filling cost (base price × meters × filling factor)
  const fillingCost = basePrice * meters * fillingFactor

  // Calculate final price (base cost + filling cost)
  return baseCost + fillingCost
}

export function calculateSpecialBalloonPrice(type: string, size: string): number {
  if (type === "Esphera") {
    if (size === "Gobo") return 15
    if (size === '15"') return 20
    if (size === '18"') return 30
    if (size === '24"') return 40
  } else if (type === "Bubble Simples") {
    if (size === '11"') return 15
    if (size === '18"') return 20
    if (size === '24"') return 40
  } else if (type === "Bubble com Balão" || type === "Bubble com Confete") {
    if (size === '11"') return 20
    if (size === '18"') return 40
    if (size === '24"') return 60
  } else if (type === "Bubble Foil") {
    if (size === "Tamanho Unico") return 20
  }

  return 0
}

export function formatCpfCnpj(value: string): string {
  // Remove non-numeric characters
  const numbers = value.replace(/\D/g, "")

  // Format as CPF (000.000.000-00) or CNPJ (00.000.000/0000-00)
  if (numbers.length <= 11) {
    // CPF
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  } else {
    // CNPJ
    return numbers
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
  }
}

export function generateClientId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 5)
}

interface EventFormData {
  data: string
  nome: string
  clienteId: string
  clienteNome: string
  baloes: {
    nacionalidade: string
    customizacao: string
    preenchimento: string
    metros: number
    shine: number
  }
  baloesEspeciais: {
    tipo: string
    tamanho: string
    quantidade: number
  }[]
}

export function calculateEventPrice(formData: EventFormData): number {
  const { baloes, baloesEspeciais } = formData

  const balloonPrice = calculateBalloonPrice(
    baloes.nacionalidade,
    baloes.customizacao,
    baloes.preenchimento,
    baloes.metros,
  )

  const shinePrice = baloes.shine * 20

  const specialBalloonsPrice = baloesEspeciais.reduce((acc, balao) => {
    return acc + calculateSpecialBalloonPrice(balao.tipo, balao.tamanho) * balao.quantidade
  }, 0)

  return balloonPrice + shinePrice + specialBalloonsPrice
}

