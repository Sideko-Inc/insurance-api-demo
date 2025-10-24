import { promises as fs } from "fs"
import path from "path"
import { createClient } from "redis"

const DATA_DIR = path.join(process.cwd(), "data")
const isProduction = process.env.VERCEL === "1" || process.env.NODE_ENV === "production"

let redisClient: ReturnType<typeof createClient> | null = null

async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    })
    await redisClient.connect()
  }
  return redisClient
}

export async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

export async function readJsonFile<T>(filename: string): Promise<T[]> {
  // In production (Vercel), use Redis
  if (isProduction) {
    try {
      const client = await getRedisClient()
      const data = await client.get(filename)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error(`Redis read error for ${filename}:`, error)
      return []
    }
  }

  // In development, use local file system
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, filename)

  try {
    const data = await fs.readFile(filePath, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, return empty array
    return []
  }
}

export async function writeJsonFile<T>(filename: string, data: T[]): Promise<void> {
  // In production (Vercel), use Redis
  if (isProduction) {
    try {
      const client = await getRedisClient()
      await client.set(filename, JSON.stringify(data))
      return
    } catch (error) {
      console.error(`Redis write error for ${filename}:`, error)
      throw new Error(`Failed to write to Redis: ${error}`)
    }
  }

  // In development, use local file system
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, filename)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
}

export function generateId(prefix: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  return `${prefix}-${timestamp}-${random}`
}

export function getCurrentTimestamp(): string {
  return new Date().toISOString()
}
