import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';

// LABORATORIO: la consulta del login contiene una SQLi intencional.
// No utilizar con datos reales ni exponer a Internet.
const db = new DatabaseSync(':memory:');
db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
  INSERT INTO users (username, password) VALUES ('admin', 'admin123');
`);

const sessions = new Set<string>();
const port = Number(process.env.PORT ?? '3000');

function page(title: string, content: string): string {
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title><style>
  body{font:16px system-ui,Arial,sans-serif;background:#f3f4f6;margin:0;display:grid;place-items:center;min-height:100vh}
  main{background:white;padding:2rem;border-radius:12px;box-shadow:0 4px 24px #0001;width:min(350px,90vw)}
  h1{margin-top:0}label{display:block;margin:.8rem 0 .3rem}input{box-sizing:border-box;width:100%;padding:.7rem;border:1px solid #bbb;border-radius:6px}
  button{margin-top:1.2rem;width:100%;padding:.75rem;border:0;border-radius:6px;background:#1d4ed8;color:white;cursor:pointer}
  .error{color:#b91c1c}
</style></head><body><main>${content}</main></body></html>`;
}

function html(res: ServerResponse, status: number, body: string): void {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
  res.end(body);
}

function redirect(res: ServerResponse, destination: string): void {
  res.writeHead(302, { Location: destination });
  res.end();
}

function isAuthenticated(req: IncomingMessage): boolean {
  const token = /(?:^|;\s*)session=([^;]+)/.exec(req.headers.cookie ?? '')?.[1];
  return Boolean(token && sessions.has(token));
}

function loginForm(failed = false): string {
  return page('Iniciar sesión', `<h1>Iniciar sesión</h1>
  ${failed ? '<p class="error">Credenciales incorrectas</p>' : ''}
  <form method="post" action="/login">
    <label for="username">Usuario</label><input id="username" name="username" required autocomplete="username">
    <label for="password">Contraseña</label><input id="password" name="password" type="password" required autocomplete="current-password">
    <button type="submit">Entrar</button>
  </form>`);
}

async function readForm(req: IncomingMessage): Promise<URLSearchParams> {
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of req) {
    const part = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += part.length;
    if (total > 8192) throw new Error('Solicitud demasiado grande');
    chunks.push(part);
  }
  return new URLSearchParams(Buffer.concat(chunks).toString('utf8'));
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');

  if (req.method === 'GET' && url.pathname === '/') {
    if (isAuthenticated(req)) return redirect(res, '/hello');
    return html(res, 200, loginForm());
  }

  if (req.method === 'POST' && url.pathname === '/login') {
    try {
      const form = await readForm(req);
      const username = form.get('username') ?? '';
      const password = form.get('password') ?? '';

      // VULNERABILIDAD SQLi INTENCIONAL PARA PRUEBAS DAST:
      // entradas de usuario concatenadas directamente a la consulta SQL.
      const query = `SELECT id, username FROM users WHERE username = '${username}' AND password = '${password}' LIMIT 1`;
      const user = db.prepare(query).get();

      if (!user) return html(res, 401, loginForm(true));
      const token = randomUUID();
      sessions.add(token);
      res.writeHead(302, {
        Location: '/hello',
        'Set-Cookie': `session=${token}; HttpOnly; SameSite=Lax; Path=/`,
      });
      return res.end();
    } catch {
      return html(res, 401, loginForm(true));
    }
  }

  if (req.method === 'GET' && url.pathname === '/hello') {
    if (!isAuthenticated(req)) return redirect(res, '/');
    return html(res, 200, page('Hola mundo', '<h1>Hola mundo</h1><p>Inicio de sesión correcto.</p><form action="/logout" method="post"><button>Salir</button></form>'));
  }

  if (req.method === 'POST' && url.pathname === '/logout') {
    const token = /(?:^|;\s*)session=([^;]+)/.exec(req.headers.cookie ?? '')?.[1];
    if (token) sessions.delete(token);
    res.writeHead(302, { Location: '/', 'Set-Cookie': 'session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0' });
    return res.end();
  }

  html(res, 404, page('404', '<h1>No encontrado</h1>'));
});

server.listen(port, '0.0.0.0', () => console.log(`Laboratorio disponible en http://localhost:${port}`));
