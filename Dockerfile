# Stage 1: Build the visualizer assets and bundle CLI package
FROM node:18-alpine AS builder
WORKDIR /build

COPY package.json package-lock.json ./
COPY packages/cli/package.json ./packages/cli/
COPY packages/viewer/package.json ./packages/viewer/

# Install build dependencies
RUN npm ci

COPY . .

# Compile viewer and CLI assets
RUN npm run build:viewer && npm run build:cli

# Stage 2: Minimal runtime image
FROM node:18-alpine
WORKDIR /workspace

# Copy built CLI package from builder stage
COPY --from=builder /build/packages/cli /opt/aam

# Symlink the binary executable globally
RUN chmod +x /opt/aam/bin/aam.js && ln -s /opt/aam/bin/aam.js /usr/local/bin/aam

ENV NODE_ENV=production

# Expose interactive visualizer server port
EXPOSE 4200

ENTRYPOINT ["aam"]
CMD ["validate"]
