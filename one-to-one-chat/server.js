import express from 'express';
import http from 'node:http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.use(express.static('public'));

const rooms = new Map();


io.on('connection', (socket) => {
    let current = { roomId: null, name: null };


    socket.on('join', ({ roomId, name }) => {
        current = { roomId, name };
        socket.join(roomId);
        if (!rooms.has(roomId)) rooms.set(roomId, { users: new Set(), history: [] });
        const info = rooms.get(roomId);
        info.users.add(name);

        socket.emit('history', info.history);
        io.to(roomId).emit('presence', Array.from(info.users));
    });


    socket.on('typing', (isTyping) => {
        if (!current.roomId) return;
        socket.to(current.roomId).emit('typing', { name: current.name, isTyping });
    });


    socket.on('message', (text) => {
        if (!current.roomId || !text?.trim()) return;
        const msg = { id: Date.now() + Math.random(), name: current.name, text: text.trim(), ts: Date.now() };
        const info = rooms.get(current.roomId);
        info.history.push(msg);
        if (info.history.length > 50) info.history.shift();
        io.to(current.roomId).emit('message', msg);
    });


    socket.on('disconnect', () => {
        const { roomId, name } = current;
        if (!roomId) return;
        const info = rooms.get(roomId);
        if (!info) return;
        info.users.delete(name);
        io.to(roomId).emit('presence', Array.from(info.users));
    });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`MiniChat on http://localhost:${PORT}`));