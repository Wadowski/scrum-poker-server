const {
    createRoomHandler,
    joinRoomHandler,
    disconnectHandler,
} = require('../socketHandlers/roomManagement');
const { EVENTS_RECEIVED } = require('../utils/constants');
const { getRooms } = require('../repositories/roomManagement');

const defaultNamespace = (io) => io
    .on(EVENTS_RECEIVED.CONNECTION, (socket) => {
        console.log(getRooms());
        socket.on(EVENTS_RECEIVED.CREATE_ROOM, createRoomHandler(socket, io));
        socket.on(EVENTS_RECEIVED.JOIN_ROOM, joinRoomHandler(socket, io));
        socket.on(EVENTS_RECEIVED.DISCONNECT, disconnectHandler(socket));
});

module.exports = {
    defaultNamespace
};
