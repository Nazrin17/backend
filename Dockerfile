FROM node:20-alpine
WORKDIR /app
COPY package.json tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
RUN npm ci || npm install
RUN npx prisma generate
RUN npm run build
ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "dist/index.js"]
