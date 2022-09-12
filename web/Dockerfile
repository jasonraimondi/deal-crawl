FROM denoland/deno

EXPOSE 8000

WORKDIR /app

COPY . .

# Cache dependencies
RUN deno cache main.ts --import-map=import_map.json

# No need to check about --allow-all because it's already sandboxed
CMD ["task", "start"]
