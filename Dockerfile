# Use a smaller base image
FROM node:24-slim AS base

# Set working directory
WORKDIR /usr/src/app

# Copy only package files first (to leverage Docker layer caching)
COPY package*.json ./

# Install only production dependencies
# You can switch to `npm install` for debugging
RUN npm ci --omit=dev \
    && npm cache clean --force

# Copy the rest of the app
COPY . .

# Use non-root user for better security
USER node

# Expose port (use the port you used on your .env file)
EXPOSE 4030

# Start app
CMD ["node", "app.js"]
