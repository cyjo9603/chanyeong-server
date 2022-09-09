# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app

COPY . .

RUN yarn build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

# set timezone
RUN apk add --no-cache tzdata
ENV TZ=Asia/Seoul

ENV NODE_ENV production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 4000

CMD ["yarn", "start:prod"]