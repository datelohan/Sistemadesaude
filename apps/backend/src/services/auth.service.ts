import * as argon2 from 'argon2'
import * as crypto from 'crypto'
import * as jose from 'jose'
import type { AuthRepository } from '../repositories/auth.repository.js'
import type { AuthTokens, LoginInput, TokenPayload } from '../domain/auth.js'

export class AuthService {
  private readonly jwtSecret: Uint8Array

  constructor(
    private readonly repo: AuthRepository,
    jwtSecretString: string,
  ) {
    this.jwtSecret = new TextEncoder().encode(jwtSecretString)
  }

  async login(input: LoginInput): Promise<AuthTokens> {
    const user = await this.repo.findUserByEmail(input.email)

    if (!user) {
      throw new Error('Credenciais inválidas')
    }

    if (!user.active) {
      throw new Error('Usuário inativo')
    }

    const valid = await argon2.verify(user.passwordHash, input.password)
    if (!valid) {
      throw new Error('Credenciais inválidas')
    }

    return this.issueTokens(user)
  }

  async refresh(token: string): Promise<AuthTokens> {
    const stored = await this.repo.findRefreshToken(token)

    if (!stored) {
      throw new Error('Token inválido')
    }

    if (stored.expiresAt < new Date()) {
      await this.repo.deleteRefreshToken(stored.id)
      throw new Error('Token expirado')
    }

    await this.repo.deleteRefreshToken(stored.id)
    return this.issueTokens(stored.user)
  }

  async logout(token: string): Promise<void> {
    const stored = await this.repo.findRefreshToken(token)
    if (stored) {
      await this.repo.deleteRefreshToken(stored.id)
    }
  }

  private async issueTokens(
    user: NonNullable<Awaited<ReturnType<AuthRepository['findUserByEmail']>>>,
  ): Promise<AuthTokens> {
    const payload: TokenPayload = {
      sub: user.id,
      name: user.name,
      profiles: user.profiles.map((p) => ({
        role: p.role,
        ...(p.clientId ? { clientId: p.clientId } : {}),
        ...(p.supplierId ? { supplierId: p.supplierId } : {}),
      })),
    }

    const accessToken = await new jose.SignJWT({ ...payload })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15m')
      .setIssuedAt()
      .sign(this.jwtSecret)

    const refreshToken = crypto.randomBytes(64).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await this.repo.createRefreshToken(user.id, refreshToken, expiresAt)

    return { accessToken, refreshToken }
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    const { payload } = await jose.jwtVerify(token, this.jwtSecret)
    return payload as unknown as TokenPayload
  }
}
