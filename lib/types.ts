import type { ObjectId } from "mongodb"

export interface User {
  id: string
  name: string
  email: string
  password: string
  _id?: ObjectId
}

export interface Client {
  id: string
  nome: string
  cpfCnpj?: string
  idade?: number
  endereco?: string
  filhos?: number
  comentarios?: string
  createdAt?: string
  updatedAt?: string
  _id?: ObjectId
}

export interface Balloon {
  nacionalidade: string
  customizacao: string
  preenchimento: string
  metros: number
  shine: number
}

export interface SpecialBalloon {
  tipo: string
  tamanho: string
  quantidade: number
  price: number
}

export interface Event {
  id: string
  data: string
  nome: string
  clienteId: string
  clienteNome: string
  status: string
  baloes: Balloon
  baloesEspeciais: SpecialBalloon[]
  precoTotal: number
  createdAt?: string
  updatedAt?: string
  _id?: ObjectId
}

export interface LogEntry {
  id: string
  userId: string
  userName: string
  action: string
  timestamp: string
  success: boolean
  details?: any
  _id?: ObjectId
}

export interface DatabaseStatus {
  isConnected: boolean
  lastChecked: string
}

