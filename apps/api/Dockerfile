# Use specific Bun version for stability
FROM oven/bun:1.2.2 AS base
WORKDIR /app

# Build stage with dependency caching
FROM base AS build
# Copy package files first to leverage layer caching
COPY package.json bun.lock ./
COPY apps/api/package.json ./apps/api/
# Install all dependencies (including devDependencies)
RUN bun install
# Copy remaining source files
COPY . .
# Execute build process
RUN bun build:api

# Optimized production stage
FROM base AS release
# Copy only production necessities
COPY --from=build /app/apps/api/package.json .
# Install PRODUCTION dependencies only
RUN bun install --production
# Copy built assets from build stage
COPY --from=build /app/apps/api/dist ./dist
# Use production environment file
COPY --from=build /app/apps/api/.env.production ./

# Runtime configuration
ENV NODE_ENV=production
EXPOSE 3000
CMD ["bun", "start"]