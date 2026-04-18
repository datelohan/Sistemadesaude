import { PrismaClient } from '@prisma/client'
import * as argon2 from 'argon2'

const db = new PrismaClient()

const ICMS_RATES: [string, number][] = [
  ['AC', 0.17],
  ['AL', 0.19],
  ['AM', 0.2],
  ['AP', 0.18],
  ['BA', 0.19],
  ['CE', 0.18],
  ['DF', 0.2],
  ['ES', 0.17],
  ['GO', 0.17],
  ['MA', 0.22],
  ['MG', 0.18],
  ['MS', 0.17],
  ['MT', 0.17],
  ['PA', 0.19],
  ['PB', 0.18],
  ['PE', 0.185],
  ['PI', 0.21],
  ['PR', 0.15],
  ['RJ', 0.2],
  ['RN', 0.18],
  ['RO', 0.175],
  ['RR', 0.17],
  ['RS', 0.17],
  ['SC', 0.17],
  ['SE', 0.19],
  ['SP', 0.18],
  ['TO', 0.18],
]

async function main() {
  console.log('Seeding ICMS rates...')
  for (const [state, rate] of ICMS_RATES) {
    await db.icmsRate.upsert({
      where: { state },
      update: { rate },
      create: { state, rate },
    })
  }

  console.log('Creating admin user...')
  const passwordHash = await argon2.hash('admin@smeds2024')
  await db.user.upsert({
    where: { email: 'admin@smeds.com' },
    update: {},
    create: {
      email: 'admin@smeds.com',
      passwordHash,
      name: 'Administrador',
      active: true,
      profiles: {
        create: { role: 'ADMIN' },
      },
    },
  })

  console.log('Seed concluído.')
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
