// Helper functions for local storage operations with offline support

export function saveToLocalStorage(key: string, data: any) {
  try {
    // Save to local storage
    localStorage.setItem(key, JSON.stringify(data))

    // Mark as pending sync if we're offline
    const isOnline = navigator.onLine
    if (!isOnline) {
      const pendingSync = JSON.parse(localStorage.getItem("pendingSync") || "{}")
      pendingSync[key] = true
      localStorage.setItem("pendingSync", JSON.stringify(pendingSync))
    }

    return true
  } catch (error) {
    console.error("Error saving to local storage:", error)
    return false
  }
}

export function getFromLocalStorage(key: string) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Error getting from local storage:", error)
    return null
  }
}

export function removeFromLocalStorage(key: string) {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error("Error removing from local storage:", error)
    return false
  }
}

// Function to log actions
// export function logAction(action: string, details: any) {
//   try {
//     const currentUser = JSON.parse(localStorage.getItem("current_user") || "{}")
//     const logs = JSON.parse(localStorage.getItem("action_logs") || "[]")

//     const logEntry = {
//       id: Date.now().toString(),
//       userId: currentUser.id || "unknown",
//       userName: currentUser.name || "unknown",
//       action,
//       details,
//       timestamp: new Date().toISOString(),
//     }

//     logs.unshift(logEntry) // Add to beginning of array
//     localStorage.setItem("action_logs", JSON.stringify(logs))

//     return true
//   } catch (error) {
//     console.error("Error logging action:", error)
//     return false
//   }
// }

// // Initialize sample data if not exists
// export function initializeSampleData() {
//   // Check if data already exists
//   const clients = getFromLocalStorage("clients")
//   const events = getFromLocalStorage("events")
//   const users = getFromLocalStorage("users")

//   // If no data exists, initialize with sample data
//   if (!clients) {
//     const sampleClients = [
//       {
//         id: "100001",
//         nome: "Maria Silva",
//         cpfCnpj: "123.456.789-00",
//         idade: 35,
//         endereco: "Rua das Flores, 123 - São Paulo, SP",
//         filhos: 2,
//         comentarios: "Cliente fiel, prefere decorações coloridas",
//         createdAt: new Date().toISOString(),
//       },
//       {
//         id: "100002",
//         nome: "Empresa ABC Ltda",
//         cpfCnpj: "12.345.678/0001-90",
//         idade: null,
//         endereco: "Av. Paulista, 1000 - São Paulo, SP",
//         filhos: 0,
//         comentarios: "Empresa que realiza eventos corporativos mensalmente",
//         createdAt: new Date().toISOString(),
//       },
//       {
//         id: "100003",
//         nome: "João Pereira",
//         cpfCnpj: "987.654.321-00",
//         idade: 42,
//         endereco: "Rua dos Pinheiros, 500 - São Paulo, SP",
//         filhos: 3,
//         comentarios: "Prefere eventos mais simples e elegantes",
//         createdAt: new Date().toISOString(),
//       },
//       {
//         id: "100004",
//         nome: "Ana Beatriz Costa",
//         cpfCnpj: "456.789.123-00",
//         idade: 28,
//         endereco: "Alameda Santos, 45 - São Paulo, SP",
//         filhos: 1,
//         comentarios: "Gosta de temas infantis elaborados",
//         createdAt: new Date().toISOString(),
//       },
//       {
//         id: "100005",
//         nome: "Restaurante Sabor & Cia",
//         cpfCnpj: "98.765.432/0001-10",
//         idade: null,
//         endereco: "Rua Augusta, 789 - São Paulo, SP",
//         filhos: 0,
//         comentarios: "Parceiro para eventos gastronômicos",
//         createdAt: new Date().toISOString(),
//       },
//     ]

//     saveToLocalStorage("clients", sampleClients)
//   }

//   if (!events) {
//     // Create sample events based on the sample clients
//     const today = new Date()
//     const tomorrow = new Date(today)
//     tomorrow.setDate(tomorrow.getDate() + 1)
//     const nextWeek = new Date(today)
//     nextWeek.setDate(nextWeek.getDate() + 7)
//     const nextMonth = new Date(today)
//     nextMonth.setMonth(nextMonth.getMonth() + 1)

//     // Update the sample events to include status
//     const sampleEvents = [
//       {
//         id: "200001",
//         data: today.toISOString(),
//         nome: "Aniversário de 10 anos",
//         clienteId: "100001",
//         clienteNome: "Maria Silva",
//         status: "Finalizada",
//         baloes: {
//           nacionalidade: "Nacional",
//           customizacao: "Customizado",
//           preenchimento: "Bom Preenchimento",
//           metros: 5,
//           shine: 2,
//         },
//         baloesEspeciais: [
//           {
//             tipo: "Esphera",
//             tamanho: '18"',
//             quantidade: 3,
//           },
//           {
//             tipo: "Bubble com Balão",
//             tamanho: '24"',
//             quantidade: 2,
//           },
//         ],
//         precoTotal: 655,
//         createdAt: new Date().toISOString(),
//       },
//       {
//         id: "200002",
//         data: tomorrow.toISOString(),
//         nome: "Evento Corporativo",
//         clienteId: "100002",
//         clienteNome: "Empresa ABC Ltda",
//         status: "Paga",
//         baloes: {
//           nacionalidade: "Importado",
//           customizacao: "Meio a Meio",
//           preenchimento: "Muito Preenchimento",
//           metros: 10,
//           shine: 5,
//         },
//         baloesEspeciais: [
//           {
//             tipo: "Bubble Simples",
//             tamanho: '24"',
//             quantidade: 5,
//           },
//         ],
//         precoTotal: 1880,
//         createdAt: new Date().toISOString(),
//       },
//       {
//         id: "200003",
//         data: nextWeek.toISOString(),
//         nome: "Festa de Formatura",
//         clienteId: "100003",
//         clienteNome: "João Pereira",
//         status: "Fechada",
//         baloes: {
//           nacionalidade: "Importado",
//           customizacao: "Customizado",
//           preenchimento: "Médio Preenchimento",
//           metros: 8,
//           shine: 3,
//         },
//         baloesEspeciais: [
//           {
//             tipo: "Bubble com Confete",
//             tamanho: '18"',
//             quantidade: 4,
//           },
//         ],
//         precoTotal: 1220,
//         createdAt: new Date().toISOString(),
//       },
//       {
//         id: "200004",
//         data: nextMonth.toISOString(),
//         nome: "Festa Infantil",
//         clienteId: "100004",
//         clienteNome: "Ana Beatriz Costa",
//         status: "Orçamento",
//         baloes: {
//           nacionalidade: "Nacional",
//           customizacao: "Customizado",
//           preenchimento: "Muito Preenchimento",
//           metros: 6,
//           shine: 4,
//         },
//         baloesEspeciais: [
//           {
//             tipo: "Bubble Foil",
//             tamanho: "Tamanho Unico",
//             quantidade: 10,
//           },
//         ],
//         precoTotal: 884,
//         createdAt: new Date().toISOString(),
//       },
//       {
//         id: "200005",
//         data: nextMonth.toISOString(),
//         nome: "Festival Gastronômico",
//         clienteId: "100005",
//         clienteNome: "Restaurante Sabor & Cia",
//         status: "Orçamento",
//         baloes: {
//           nacionalidade: "Importado",
//           customizacao: "Sem Customização",
//           preenchimento: "Pouco Preenchimento",
//           metros: 12,
//           shine: 0,
//         },
//         baloesEspeciais: [
//           {
//             tipo: "Esphera",
//             tamanho: '24"',
//             quantidade: 8,
//           },
//         ],
//         precoTotal: 1100,
//         createdAt: new Date().toISOString(),
//       },
//     ]

//     saveToLocalStorage("events", sampleEvents)
//   }

//   if (!users) {
//     const sampleUsers = [
//       {
//         id: "1",
//         name: "Admin",
//         email: "admin@example.com",
//         password: "password",
//         createdAt: new Date().toISOString(),
//       },
//     ]

//     saveToLocalStorage("users", sampleUsers)
//   }
// }

