// server.js

const http = require('http');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const PORT = 3000;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'simple_website_db',
    password: 'mock22',
    port: 5432,
});

const server = http.createServer(async (req, res) => {
    console.log(`Получен запрос: ${req.method} ${req.url}`);

    // --- РУЧНОЙ РОУТИНГ ДЛЯ API ---

    // 1. GET /api/notes - Получить все заметки
    if (req.url === '/api/notes' && req.method === 'GET') {
        try {
            const result = await pool.query('SELECT * FROM notes ORDER BY created_at DESC');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.rows));
        } catch (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Ошибка на сервере' }));
        }
        return;
    }

    // 2. POST /api/notes - Создать новую заметку
    if (req.url === '/api/notes' && req.method === 'POST') {
        let body = '';
        // Запрос приходит по частям (chunks), собираем их
        req.on('data', chunk => {
            body += chunk.toString();
        });
        // Когда все части получены
        req.on('end', async () => {
            try {
                const { content } = JSON.parse(body);
                if (!content) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Содержимое не может быть пустым' }));
                }
                const result = await pool.query(
                    'INSERT INTO notes (content) VALUES ($1) RETURNING *',
                    [content]
                );
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result.rows[0]));
            } catch (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Ошибка на сервере' }));
            }
        });
        return;
    }

    // 3. DELETE /api/notes/:id - Удалить заметку
    // Используем регулярное выражение для извлечения ID из URL
    const deleteMatch = req.url.match(/^\/api\/notes\/(\d+)$/);
    if (deleteMatch && req.method === 'DELETE') {
        try {
            const id = deleteMatch[1]; // Получаем ID из URL
            const result = await pool.query('DELETE FROM notes WHERE id = $1', [id]);
            if (result.rowCount === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Заметка не найдена' }));
            }
            res.writeHead(204); // 204 No Content - успешное удаление
            res.end();
        } catch (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Ошибка на сервере' }));
        }
        return;
    }

    // --- ОТДАЧА СТАТИЧЕСКИХ ФАЙЛОВ (HTML, CSS, JS) ---
    // Этот код выполняется, если запрос не подошел ни под один из API-маршрутов
    const filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
        case '.js': contentType = 'text/javascript'; break;
        case '.css': contentType = 'text/css'; break;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>');
            } else {
                res.writeHead(500);
                res.end(`Ошибка сервера: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});