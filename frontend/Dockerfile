FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_URL=http://localhost:8000/api/v1
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build
RUN CSS_FILE=$(ls /app/dist/assets/*.css) && \
    echo ":root{--gd:#2D6A4F;--gm:#40916C;--gf:#52B788;--gl:#D8F3DC;--cream:#FAFAF7;--white:#FFFFFF;--sand:#F2EFE9;--ink:#1A1A2E;--muted:#6B7280;--light:#9CA3AF;--border:#E5E7EB;--warn:#F59E0B;--err:#EF4444;--info:#3B82F6}" >> $CSS_FILE
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
