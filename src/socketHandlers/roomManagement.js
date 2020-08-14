const {
    getRoom,
    createRoom,
    joinRoom,
    leaveRoom,
    removePersonFromRooms,
    isPersonInRoom,
    updateCardValue,
    updateAllCardsValue,
    toggleCardsVisibility,
    toggleVoteStarted,
    updateUserDetails,
    setRoomOwner,
} = require('../repositories/roomManagement');
const { EVENT_SEND } = require('../utils/constants');

const mapRoom = (room) => ({
    people: room.people.map((person) => ({
        ...person,
        card: room.cardsAreVisible ? person.card : { value: '?' },
    })),
});

const createRoomHandler = (socket, io) => () => {
    try {
        const room = createRoom(socket.id);
        socket.join(`${room.id}`);

        socket.emit(EVENT_SEND.ROOM_JOINED, room.id );
        io.in(`${room.id}`).emit(EVENT_SEND.ROOM_UPDATE, room);
        io.in(`${room.id}`).emit(EVENT_SEND.ROOM_PEOPLE_UPDATE, mapRoom(room).people);
    } catch (err) {
        socket.emit(EVENT_SEND.ROOM_NOT_JOINED);
        console.log(err);
    }
};

const joinRoomHandler = (socket, io) => (roomId) => {
    try {
        if (!isPersonInRoom(socket.id, Number(roomId))) {
            const room = joinRoom(socket.id, Number(roomId));

            socket.join(`${roomId}`);
            socket.emit(EVENT_SEND.ROOM_JOINED, roomId);

            io.in(`${room.id}`).emit(EVENT_SEND.ROOM_UPDATE, room);
            io.in(`${room.id}`).emit(EVENT_SEND.ROOM_PEOPLE_UPDATE, mapRoom(room).people);
        }
    } catch (err) {
        socket.emit(EVENT_SEND.ROOM_NOT_JOINED);
        console.log(err);
    }
};

const leaveRoomHandler = (socket, io) => (roomId) => {
    try {
        const room = leaveRoom(socket.id, Number(roomId));
        socket.leave(`${roomId}`);

        io.in(`${room.id}`).emit(EVENT_SEND.ROOM_PEOPLE_UPDATE, mapRoom(room).people);
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

const cardsChosenHandler = (socket, io) => (roomId, card) => {
    try {
        const socketId = socket.id;

        const room = updateCardValue(socketId, Number(roomId), card);

        const notDecidedPerson = room.people.find(({ card }) =>
            card === undefined || card.value === null
        );

        if (notDecidedPerson === undefined) {
            toggleCardsVisibility(roomId, true);
            toggleVoteStarted(roomId, false);
            io.in(`${roomId}`).emit(EVENT_SEND.VOTE_STATUS_UPDATE, room.voteStarted);
        }

        io.in(`${roomId}`).emit(EVENT_SEND.CARDS_UPDATE, mapRoom(room).people);
    } catch (err) {
        console.log(err);
    }
};

const hideCardsHandler = (socket, io) => (roomId) => {
    try {
        toggleCardsVisibility(roomId, false);
        toggleVoteStarted(roomId, true);
        const room = updateAllCardsValue(roomId, { value: null, position: null });

        io.in(`${roomId}`).emit(EVENT_SEND.CARDS_UPDATE, mapRoom(room).people);
        io.in(`${roomId}`).emit(EVENT_SEND.VOTE_STATUS_UPDATE, room.voteStarted);
    } catch (err) {
        console.log(err);
    }
};

const showCardsHandler = (socket, io) => (roomId) => {
    try {
        toggleCardsVisibility(roomId, true);
        const room = toggleVoteStarted(roomId, false);

        io.in(`${roomId}`).emit(EVENT_SEND.CARDS_UPDATE, mapRoom(room).people);
        io.in(`${roomId}`).emit(EVENT_SEND.VOTE_STATUS_UPDATE, room.voteStarted);
    } catch (err) {
        console.log(err);
    }
};

const updateUserDetailsHandler = (socket, io) => (roomId, userDetails) => {
    try {
        const user = updateUserDetails(socket.id, roomId, userDetails);

        socket.emit(EVENT_SEND.USER_DETAILS_UPDATE, user);
        io.in(`${roomId}`).emit(EVENT_SEND.ROOM_PEOPLE_UPDATE, mapRoom(getRoom(roomId)).people);
    } catch (err) {
        console.log(err);
    }
};

const updateRoomOwnerHandler = (socket, io) => (roomId, socketId) => {
    try {
        const { newOwner, oldOwner } = setRoomOwner(roomId, socketId);

        socket.emit(EVENT_SEND.USER_DETAILS_UPDATE, oldOwner);
        io.to(`${newOwner.socketId}`).emit(EVENT_SEND.USER_DETAILS_UPDATE, newOwner);
        io.in(`${roomId}`).emit(EVENT_SEND.ROOM_PEOPLE_UPDATE, mapRoom(getRoom(roomId)).people);
    } catch (err) {
        console.log(err);
    }
};

const pingHandler = (socket) => () => {
    socket.emit(EVENT_SEND.TEST);
};

module.exports = {
    createRoomHandler,
    joinRoomHandler,
    leaveRoomHandler,
    disconnectHandler,
    cardsChosenHandler,
    hideCardsHandler,
    showCardsHandler,
    updateUserDetailsHandler,
    updateRoomOwnerHandler,
    pingHandler,
};
