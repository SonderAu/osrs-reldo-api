# Use Node.js LTS as the base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application files
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port your server uses (e.g., 3000)
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]
