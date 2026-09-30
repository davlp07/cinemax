# 1. Usa a imagem oficial do Node.js (versão 20, versão Alpine que é super leve)
FROM node:20-alpine

# 2. Define a pasta de trabalho dentro do container
WORKDIR /app

# 3. Copia apenas os arquivos de dependências e a pasta do Prisma primeiro (otimização de cache)
COPY package.json package-lock.json ./
COPY prisma ./prisma

# 4. Instala as dependências limpas
RUN npm ci

# 5. Copia o resto do código do seu projeto para o container
COPY . .

# 6. Gera o Prisma Client (Crucial para o nosso banco de dados funcionar)
RUN npx prisma generate

# 7. Constrói a versão de produção do Next.js
RUN npm run build

# 8. Expõe a porta 3000 para a sua máquina conseguir acessar
EXPOSE 3000

# 9. Comando final que roda quando o container ligar
CMD ["npm", "start"]