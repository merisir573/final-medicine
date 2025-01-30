# Use Node.js as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire app code
COPY . .

# Expose the port (default for NestJS)
EXPOSE 3003

# Start the application
CMD ["npm", "run", "start"]
