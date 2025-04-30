# Étape 1 : build
FROM golang:1.20-alpine AS builder

WORKDIR /app
COPY go.mod ./
COPY main.go ./
RUN go build -o comment-api

# Étape 2 : image minimale pour exécution
FROM alpine:latest

WORKDIR /app
COPY --from=builder /app/comment-api .

EXPOSE 8080
CMD ["./comment-api"]