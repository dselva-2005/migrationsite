# ----------------------------
# Build stage
# ----------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN npm install -g pnpm

ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_TELEMETRY_DISABLED=1

# Copy ONLY dependency files first (this layer caches until deps change)
COPY frontend/package.json frontend/pnpm-lock.yaml ./

# Install deps with cache mount (preserves pnpm store between builds)
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Copy source code (this layer invalidates more often)
COPY frontend .

# Build Next.js with cache mount (preserves .next/cache between builds)
RUN --mount=type=cache,target=/app/.next/cache \
    pnpm build

# ----------------------------
# Runtime stage (standalone)
# ----------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]