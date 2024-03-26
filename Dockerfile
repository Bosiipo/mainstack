FROM node:20.11.0-bullseye AS build
ARG DATABASE_URL
ARG PORT=7070
ARG USERNAME
ARG PASSWORD
ARG SECRET

ENV DATABASE_URL $DATABASE_URL
ENV PORT $PORT
ENV USERNAME $USERNAME
ENV PASSWORD $PASSWORD
ENV SECRET $SECRET
# Set working directory
WORKDIR /usr/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --loglevel verbose

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run compile

FROM node:alpine as main

COPY --from=build /usr/app /

# Expose port
EXPOSE 7070

# Start the app
CMD ["npm", "start"]
