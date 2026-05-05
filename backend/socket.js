const { Server } = require('socket.io');

let io;

const init = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", // Adjust in production
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`[Socket] New connection: ${socket.id}`);

        // Join private user room for targeted notifications
        socket.on('join', (userId) => {
            socket.join(userId);
            console.log(`[Socket] User ${userId} joined their private room`);
        });

        // Join zone room for collectors
        socket.on('joinZone', (zone) => {
            socket.join(`zone_${zone}`);
            console.log(`[Socket] User joined zone room: zone_${zone}`);
        });

        socket.on('disconnect', () => {
            console.log(`[Socket] User disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

module.exports = { init, getIo };
