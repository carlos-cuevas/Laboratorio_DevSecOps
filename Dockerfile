FROM node:22.16.0-bookworm-slim
WORKDIR /app
COPY package.json ./
COPY src/ ./src/
EXPOSE 3000
USER node
CMD ["node", "--experimental-strip-types", "src/server.ts"]
