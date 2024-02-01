FROM node:21-alpine

# Change the working directory on the Docker image to /app
WORKDIR /app

# Copy package.json and package-lock.json to the /app directory
COPY ./socket-server/package.json ./
COPY ./socket-server/package-lock.json ./
COPY ./socket-server/app.js ./

# Install dependencies
RUN npm install

# Expose application port
EXPOSE 3000

# Start the application
CMD npm start

