ARG NODE_VERSION=21

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /usr/src/app

# Copy package.json and package-lock.json and
# install dependencies without dev dependencies
COPY ./socket-server/package.json ./
COPY ./socket-server/package-lock.json ./
RUN npm ci --omit=dev

# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY ./socket-server/app.js ./

# Expose the port that the application listens on.
EXPOSE 8000

# Run the application.
CMD npm start
