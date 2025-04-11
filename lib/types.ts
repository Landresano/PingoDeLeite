import type { ObjectId } from "mongodb"


export enum Status {
  CONNECTED = "conectado",
  DISCONNECTED = "disconectado",
  ERROR = "erro",
}

export interface Event {
  _id: ObjectId // Only MongoDB's _id is used
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
}

export interface User {
  _id: ObjectId // Only MongoDB's _id is used
  name: string
  email: string
  password: string
}

export interface Client {
  _id: ObjectId // Only MongoDB's _id is used
  nome: string
  cpfCnpj?: string
  idade?: number
  endereco?: string
  filhos?: number
  comentarios?: string
  createdAt?: string
  updatedAt?: string
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

export interface LogEntry {
  _id: ObjectId // Only MongoDB's _id is used
  userId: string
  userName: string
  action: string
  timestamp: string
  success: boolean
  details?: any
}

export interface DatabaseStatus {
  isConnected: boolean
  lastChecked: string
}