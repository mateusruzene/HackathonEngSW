# Multi-stage Dockerfile para o Sistema de Gestão de Hackathons DInf/UFPR

# Estágio 1: Build do Frontend React
FROM node:20-alpine AS client-builder
WORKDIR /app/src/client
COPY src/client/package*.json ./
RUN npm install
COPY src/client/ ./
RUN npm run build

# Estágio 2: Build e Execução da Aplicação Completa
FROM node:20-alpine
WORKDIR /app

# Dependências do sistema (sqlite3)
RUN apk add --no-cache python3 make g++

# Instalação das dependências do backend
COPY package*.json ./
RUN npm install

# Cópia do código-fonte do servidor e testes
COPY tsconfig*.json ./
COPY src/server ./src/server
COPY tests ./tests

# Cópia do bundle do frontend compilado
COPY --from=client-builder /app/src/client/dist ./src/client/dist

# Criação do diretório de dados para persistência SQLite
RUN mkdir -p /app/data

EXPOSE 3000

ENV PORT=3000
ENV HOST=0.0.0.0
ENV DB_PATH=/app/data/hackathon.sqlite

CMD ["npm", "start"]
