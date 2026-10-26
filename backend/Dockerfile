# Use Node.js base image
FROM node:22

# Create app directory
WORKDIR /backend

# Copy dependencies and install
COPY package*.json ./
RUN npm install --production --omit=dev

# Copy rest of the code
COPY . .

# Expose the app port
EXPOSE 4000

# Run the app
CMD ["node", "server.js"]
