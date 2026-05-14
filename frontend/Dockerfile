# ──────────────────────────────────────────────
# Stage 1: dev  →  used by docker-compose (hot reload)
# ──────────────────────────────────────────────
FROM node:18-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
# Source files are mounted via volume at runtime — no COPY needed here
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]


# ──────────────────────────────────────────────
# Stage 2: build  →  intermediate build step
# ──────────────────────────────────────────────
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG VITE_API_URL=http://localhost:8000/api/v1
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Inject CSS variables into the built bundle
RUN CSS_FILE=$(ls /app/dist/assets/*.css 2>/dev/null | head -1) && \
    if [ -n "$CSS_FILE" ]; then \
      echo ":root{--gd:#2D6A4F;--gm:#40916C;--gf:#52B788;--gl:#D8F3DC;--cream:#FAFAF7;--white:#FFFFFF;--sand:#F2EFE9;--ink:#1A1A2E;--muted:#6B7280;--light:#9CA3AF;--border:#E5E7EB;--warn:#F59E0B;--err:#EF4444;--info:#3B82F6}" >> $CSS_FILE; \
    fi


# ──────────────────────────────────────────────
# Stage 3: prod  →  serve static build (lean image)
# ──────────────────────────────────────────────
FROM node:18-alpine AS prod
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
