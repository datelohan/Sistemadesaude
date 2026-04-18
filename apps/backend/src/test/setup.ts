import { afterAll } from 'vitest'
import { prisma } from '../lib/prisma.js'

// Prisma conecta lazily — não forçar $connect() aqui.
// Testes de integração com DB real ficam em *.integration.test.ts.
afterAll(async () => {
  await prisma.$disconnect()
})
