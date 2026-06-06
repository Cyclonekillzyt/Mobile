FROM node:20

# Install system dependencies
RUN apt-get update && apt-get install -y \
  ffmpeg \
  curl \
  python3 \
  python3-pip

# Install yt-dlp
RUN pip3 install yt-dlp

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]