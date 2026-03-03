FROM alpine:latest

# Install dependencies
RUN apk add --no-cache wget unzip ca-certificates

# Download PocketBase Linux binary
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v0.28.2/pocketbase_0.28.2_linux_amd64.zip \
    && unzip pocketbase_0.28.2_linux_amd64.zip \
    && rm pocketbase_0.28.2_linux_amd64.zip \
    && chmod +x pocketbase

# Copy migrations
COPY pb_migrations /pb_migrations

# Expose port
EXPOSE 8090

# Start PocketBase
CMD ["./pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb_data", "--migrationsDir=/pb_migrations"]