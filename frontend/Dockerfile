FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --include=optional \
    && ARCH="$(uname -m)" \
    && if [ "$ARCH" = "x86_64" ]; then npm install --no-save @rollup/rollup-linux-x64-gnu; fi \
    && if [ "$ARCH" = "aarch64" ]; then npm install --no-save @rollup/rollup-linux-arm64-gnu; fi

COPY . .

ARG VITE_API_URL=/api/afisha
ARG VITE_CDN_URL=/content/afisha
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_CDN_URL=${VITE_CDN_URL}

RUN npm run build

FROM alpine:3.20

WORKDIR /app

COPY --from=builder /app/dist ./dist

CMD ["sh", "-c", "rm -rf /frontend-dist/* && cp -R /app/dist/. /frontend-dist/ && tail -f /dev/null"]
