# build stage
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4200
# Start Angular dev server
CMD ["npm","run","start","--","--host","0.0.0.0","--poll=2000"]

