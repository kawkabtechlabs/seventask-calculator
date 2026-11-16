FROM node:24-alpine
WORKDIR /app
COPY calculator-core.js ./calculator-core.js
COPY chatgpt-plugin/package*.json ./chatgpt-plugin/
RUN cd chatgpt-plugin && npm ci --omit=dev
COPY chatgpt-plugin/src/ ./chatgpt-plugin/src/
COPY chatgpt-plugin/public/ ./chatgpt-plugin/public/
WORKDIR /app/chatgpt-plugin
ENV NODE_ENV=production PORT=8787
EXPOSE 8787
USER node
CMD ["node", "src/server.mjs"]
