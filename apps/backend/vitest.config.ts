import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'mysql://smeds:smeds@127.0.0.1:3307/smeds_test',
      JWT_SECRET: 'test-secret-key-that-is-at-least-32-chars!!',
      JWT_ACCESS_EXPIRES_IN: '15m',
      JWT_REFRESH_EXPIRES_IN: '7d',
      AWS_ENDPOINT: 'http://localhost:9000',
      AWS_REGION: 'us-east-1',
      AWS_ACCESS_KEY_ID: 'test-key',
      AWS_SECRET_ACCESS_KEY: 'test-secret',
      S3_BUCKET_NAME: 'smeds-test',
      SQS_ENDPOINT: 'http://localhost:9324',
      SQS_QUEUE_URL: 'http://localhost:9324/queue/smeds-test',
      SMTP_HOST: 'localhost',
      SMTP_PORT: '1025',
      EMAIL_FROM: 'test@smeds.com',
      CORS_ORIGINS: 'http://localhost:5173',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80,
      },
      exclude: ['dist', 'node_modules', 'prisma', 'src/server.ts'],
    },
    setupFiles: ['./src/test/setup.ts'],
  },
})
