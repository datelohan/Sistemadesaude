import type { PrismaClient, User, UserProfile, RefreshToken } from '@prisma/client'

type UserWithProfiles = User & { profiles: Pick<UserProfile, 'role' | 'clientId' | 'supplierId'>[] }
type RefreshTokenWithUser = RefreshToken & { user: UserWithProfiles }

export interface AuthRepository {
  findUserByEmail(email: string): Promise<UserWithProfiles | null>
  findUserById(id: string): Promise<UserWithProfiles | null>
  createRefreshToken(userId: string, token: string, expiresAt: Date): Promise<void>
  findRefreshToken(token: string): Promise<RefreshTokenWithUser | null>
  deleteRefreshToken(id: string): Promise<void>
  deleteAllUserRefreshTokens(userId: string): Promise<void>
}

export class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly db: PrismaClient) {}

  async findUserByEmail(email: string) {
    return this.db.user.findUnique({
      where: { email },
      include: { profiles: { select: { role: true, clientId: true, supplierId: true } } },
    })
  }

  async findUserById(id: string) {
    return this.db.user.findUnique({
      where: { id },
      include: { profiles: { select: { role: true, clientId: true, supplierId: true } } },
    })
  }

  async createRefreshToken(userId: string, token: string, expiresAt: Date) {
    await this.db.refreshToken.create({ data: { userId, token, expiresAt } })
  }

  async findRefreshToken(token: string) {
    return this.db.refreshToken.findUnique({
      where: { token },
      include: {
        user: {
          include: { profiles: { select: { role: true, clientId: true, supplierId: true } } },
        },
      },
    })
  }

  async deleteRefreshToken(id: string) {
    await this.db.refreshToken.delete({ where: { id } })
  }

  async deleteAllUserRefreshTokens(userId: string) {
    await this.db.refreshToken.deleteMany({ where: { userId } })
  }
}
