# Use a lightweight Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app and build it
COPY . .
RUN npm run build

# Install serve to run the app
RUN npm install -g serve

# Expose the port Cloud Run expects
EXPOSE 8080

# Command to run the app
CMD ["serve", "-s", "dist", "-l", "8080"]