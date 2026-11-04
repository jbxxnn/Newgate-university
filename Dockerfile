FROM node:22-alpine AS base
WORKDIR /app

FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS build
COPY . .
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN npx prisma generate && npm run build -- --webpack

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
# Prisma Client is generated in the build stage. Copy its generated runtime
# artifacts as well as installed dependencies into the production image.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/next.config.ts ./next.config.ts
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
