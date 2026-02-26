---
# Taller práctico Docker (3 horas)
---
# Uso del CLI 

Objetivo: dominar ciclo de vida real de contenedores

Crear contenedor persistente:
```bash
docker run -dit --name lab ubuntu bash
```
Entrar:
```bash
docker exec -it lab bash
```

Dentro:
```bash
apt update
apt install curl -y
touch archivo.txt
exit
```

Revisar estado:
```bash
docker ps
docker ps -a
```

Parar y arrancar:
```bash
docker stop lab
docker start lab
docker exec -it lab ls
```

Commitar estado:
```bash
docker commit lab ubuntu-debug
docker images
```

Crear nuevo contenedor desde esa imagen:
```bash
docker run -it ubuntu-debug ls
```

Eliminar recursos:
```bash
docker rm -f lab
docker rmi ubuntu-debug
docker system prune -a
```

# Debugging

Objetivo: diagnosticar fallos típicos

```bash
docker run --name crash alpine false
```

Diagnóstico:

```bash
docker ps -a
docker logs crash
docker inspect crash
```

Contenedor sin shell bash:

```bash
docker run -it node:alpine bash
```

Falla.

Solución:

```bash
docker run -it node:alpine sh
```

Contenedor con límite de memoria:

```bash
docker run -m 50m progrium/stress --vm 1 --vm-bytes 100M
```

Ver salida:
```bash
docker ps -a
```
Identificar exit code 137.

Monitorear recursos:
```bash
docker stats
```

Inspeccionar configuración:

```bash
docker inspect <container>
```

# Volúmenes con Postgres

Objetivo: comprobar persistencia real

Sin volumen:
```bash
docker run -d --name pg -e POSTGRES_PASSWORD=1234 postgres
```

Entrar:
```bash
docker exec -it pg psql -U postgres
```

SQL:
```sql
create table test(id int);
insert into test values (1);
select * from test;
```

Eliminar:
```bash
docker rm -f pg
```

Con volumen:

```bash
docker volume create pgdata
```

```bash
docker run -d --name pg2 \
-e POSTGRES_PASSWORD=1234 \
-v pgdata:/var/lib/postgresql/data \
postgres
```

Repetir SQL.
Eliminar y recrear contenedor.
Datos persisten.

Inspeccionar:

```bash
docker volume ls
docker volume inspect pgdata
```

# Redes y API 

Objetivo: comunicación entre contenedores por nombre usando Redis

Crear red

```bash
docker network create backend
```

Levantar Redis

```bash
docker run -d --name redis --network backend redis
```

Verificar:

```bash
docker ps
```

Probar conectividad DNS

```bash
docker run -it --network backend alpine ping redis
```

Crear API Python

server.py

```python
import redis
from http.server import BaseHTTPRequestHandler, HTTPServer

r = redis.Redis(host="redis", port=6379, decode_responses=True)

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        count = r.incr("count")
        self.send_response(200)
        self.end_headers()
        self.wfile.write(f"Visitas: {count}".encode())

HTTPServer(("", 3000), Handler).serve_forever()
```

Ejecutar contenedor Python temporal
Montar código local dentro del contenedor:

```bash
docker run -it \
--network backend \
-v $(pwd):/app \
-w /app \
python:3.12-slim \
bash
```

Dentro del contenedor:

```bash
pip install redis
python server.py
```

En navegador:

```
http://localhost:3000
```


# Dockerfile inseguro

Objetivo: detectar malas prácticas

Crear:

Dockerfile.bad

```dockerfile
FROM python:latest
WORKDIR /app
COPY . .
RUN pip install redis
CMD ["python","server.py"]
```

Build:

```bash
time docker build -t api-bad -f Dockerfile.bad .
```

Ver tamaño:

```bash
docker images
```

Problemas a identificar:

* latest
* root
* imagen grande
* dependencias 
* cache pobre
* copia innecesaria

# Dockerfile seguro + multi-stage

Perfecto.
Aquí tienes la **versión segura del Dockerfile en Python**, pensada para contrastar directamente con `Dockerfile.bad`.

Mismo ejercicio, pero aplicando **buenas prácticas reales de producción**.

Formato limpio, solo código + comandos.

---

Archivos del proyecto

server.py

```python
import redis
from http.server import BaseHTTPRequestHandler, HTTPServer

r = redis.Redis(host="redis", port=6379, decode_responses=True)

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        count = r.incr("count")
        self.send_response(200)
        self.end_headers()
        self.wfile.write(f"Visitas: {count}".encode())

HTTPServer(("", 3000), Handler).serve_forever()
```

requirements.txt

Versionado y reproducible
```
redis==5.0.1
```

.dockerignore

Reduce tamaño y evita filtrar basura

```
.git
__pycache__
*.pyc
.env
venv
Dockerfile*
```
Dockerfile seguro

Dockerfile

```dockerfile
FROM python:3.12-slim

# Evita .pyc y mejora logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY server.py .

RUN useradd -m appuser
USER appuser

EXPOSE 3000
CMD ["python","server.py"]
```

Build
```bash
time docker build -t api-good -f Dockerfile.good .
```

Ejecutar
```bash
docker run -p 3000:3000 api-good
```
Comparación esperada en clase

```bash
docker images
```

# Seguridad

Instalar Trivy.
Escanear:

```bash
trivy image api-bad
trivy image api-good
```