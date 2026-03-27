FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
CMD ["sh", "-c", "npx prisma migrate dev && node dist/src/main.js"]