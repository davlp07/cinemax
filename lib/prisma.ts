import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '@/app/generated/prisma/client'

const dbUrl = new URL(process.env.DATABASE_URL ?? '')

const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port || '4000', 10), // Porta padrão do TiDB é 4000
  user: dbUrl.username,
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.slice(1),

  ssl: {
    rejectUnauthorized: true, // Garante que o driver valide o certificado seguro do TiDB
  },

  connectionLimit: 5,        // Impede o Next.js de abrir conexões infinitas no modo dev
  connectTimeout: 5000,      // Tempo limite para abrir uma conexão (5 segundos)
})

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma