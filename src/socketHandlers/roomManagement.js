const {
    createRoom,
    joinRoom,
    removePersonFromRooms,
} = require('../repositories/roomManagement');
const { EVENT_SEND } = require('../utils/constants');

const createRoomHandler = (socket, io) => (name) => {
    try {
        const room = createRoom(socket.id, name);
        socket.join(`${room.id}`);
        socket.emit(EVENT_SEND.ROOM_JOINED, room.id);
        io.emit(EVENT_SEND.ROOM_PEOPLE_UPDATE, room.people);
    } catch (err) {
        socket.emit(EVENT_SEND.ROOM_NOT_JOINED);
    }
};

const joinRoomHandler = (socket, io) => (roomId, name) => {
    try {

        const room = joinRoom(socket.id, Number(roomId), name);
        socket.join(`${roomId}`);

        socket.emit(EVENT_SEND.ROOM_JOINED, roomId);
        io.emit(EVENT_SEND.ROOM_PEOPLE_UPDATE, room.people);
    } catch (err) {
        socket.emit(EVENT_SEND.ROOM_NOT_JOINED);
    }
};

const disconnectHandler = (socket) => () => {
    const roomsId = removePersonFromRooms(socket.id);
    roomsId.forEach(roomId => socket.leave(`${roomId}`));
};

module.exports = {
    createRoomHandler,
    joinRoomHandler,
    disconnectHandler,
};
