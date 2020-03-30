const {
    createRoom,
    joinRoom,
    leaveRoom,
    removePersonFromRooms,
    updateCardValue,
    toggleCardsVisibility,
} = require('../repositories/roomManagement');
const { EVENT_SEND } = require('../utils/constants');

const mapRoom = (room) => ({
    people: room.people.map((person) => ({
        ...person,
        cardValue: room.cardsAreVisible ? person.cardValue : '?',
    })),
});

const createRoomHandler = (socket, io) => (name) => {
    try {
        const room = createRoom(socket.id, name);
        socket.join(`${room.id}`);
        socket.emit(EVENT_SEND.ROOM_JOINED, room.id, );
        io.emit(EVENT_SEND.ROOM_PEOPLE_UPDATE, mapRoom(room).people);
    } catch (err) {
        socket.emit(EVENT_SEND.ROOM_NOT_JOINED);
        console.log(err);
    }
};

const joinRoomHandler = (socket, io) => (roomId, name) => {
    try {

        const room = joinRoom(socket.id, Number(roomId), name);
        socket.join(`${roomId}`);

        socket.emit(EVENT_SEND.ROOM_JOINED, roomId);
        io.emit(EVENT_SEND.ROOM_PEOPLE_UPDATE, mapRoom(room).people);
    } catch (err) {
        socket.emit(EVENT_SEND.ROOM_NOT_JOINED);
        console.log(err);
    }
};

const leaveRoomHandler = (socket, io) => (roomId) => {
    try {

        const room = leaveRoom(socket.id, Number(roomId));
        socket.leave(`${roomId}`);

        io.emit(EVENT_SEND.ROOM_PEOPLE_UPDATE, mapRoom(room).people);
    } catch (err) {
        console.log(err);
    }
};

const disconnectHandler = (socket) => () => {
    try {
        const roomsId = removePersonFromRooms(socket.id);
        roomsId.forEach(roomId => socket.leave(`${roomId}`));
    } catch (err) {
        console.log(err);
    }
};

const cardsChosenHandler = (socket, io) => (roomId, value) => {
    try {
        const socketId = socket.id;

        const room = updateCardValue(socketId, Number(roomId), value);

        io.emit(EVENT_SEND.CARDS_UPDATE, mapRoom(room).people);
    } catch (err) {
        console.log(err);
    }
};

const hideCardsHandler = (socket, io) => (roomId) => {
    try {
        const room = toggleCardsVisibility(roomId, false);

        io.emit(EVENT_SEND.CARDS_UPDATE, mapRoom(room).people);
    } catch (err) {
        console.log(err);
    }
};

const showCardsHandler = (socket, io) => (roomId) => {
    try {
        const room = toggleCardsVisibility(roomId, true);

        io.emit(EVENT_SEND.CARDS_UPDATE, mapRoom(room).people);
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    createRoomHandler,
    joinRoomHandler,
    leaveRoomHandler,
    disconnectHandler,
    cardsChosenHandler,
    hideCardsHandler,
    showCardsHandler,
};
