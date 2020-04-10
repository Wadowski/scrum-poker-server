const { Person, ROLES } = require('../models/Person');
const { Room } = require('../models/Room');
const { Card } = require('../models/Card');

let rooms = [];
let id = 1;

const getRoomListIndex = (roomId) => {
    const storedRoomId = rooms.findIndex(({ id }) => id === roomId);
    if (storedRoomId === -1) throw new Error('Room not found');

    return storedRoomId;
};

const createRoom = (socketId, name) => {
    const person = Person({
        socketId,
        name,
        roles: [
            ROLES.ADMIN,
            ROLES.PARTICIPANT,
        ],
    });
    const room = Room({
        id,
        people: [person],
        cardsAreVisible: true,
        voteStarted: false,
    });
    id++;

    rooms.push(room);

    return room;
};

const joinRoom = (socketId, roomId, name) => {
    try {
        const storedRoomId = getRoomListIndex(roomId);

        const person = Person({ socketId, name, roles: [ROLES.PARTICIPANT] });
        rooms[storedRoomId].people.push(person);

        return rooms[storedRoomId];
    } catch (err) {
        throw err;
    }
};

const leaveRoom = (socketId, roomId) => {
    try {
        const storedRoomId = getRoomListIndex(roomId);

        rooms[storedRoomId].people = rooms[storedRoomId].people
            .filter(({ socketId: storedSocketId }) => storedSocketId !== socketId);

        return rooms[storedRoomId];
    } catch (err) {
        throw err;
    }
};

const removePersonFromRooms = (socketId) => {
    const roomsJoined = [];
    rooms.forEach((room) => {
        room.people = room.people.filter((({ socketId: id }) => {
            roomsJoined.push(id);
            return id !== socketId;
        }));
    });

    rooms = rooms.filter(room => room.people.length);
    return roomsJoined;
};

const updateCardValue = (socketId, roomId, card) => {
    const storedRoomId = getRoomListIndex(roomId);

    rooms[storedRoomId].people.forEach((person) => {
        if (person.socketId === socketId) {
            person.card = Card({
                position: card.position || null,
                value: card.value,
            });
        }
    });

    return rooms[storedRoomId];
};

const updateAllCardsValue = (roomId, card) => {
    const storedRoomId = getRoomListIndex(roomId);

    rooms[storedRoomId].people.forEach((person) => {
        person.card = Card({
            position: card.position || null,
            value: card.value,
        });
    });

    return rooms[storedRoomId];
};

const toggleCardsVisibility = (roomId, visibilityStatus) => {
    const storedRoomId = getRoomListIndex(roomId);

    rooms[storedRoomId].cardsAreVisible = visibilityStatus;

    return rooms[storedRoomId];
};

const toggleVoteStarted = (roomId, voteStarted) => {
    const storedRoomId = getRoomListIndex(roomId);

    rooms[storedRoomId].voteStarted = voteStarted;

    return rooms[storedRoomId];
};

module.exports = {
    createRoom,
    removePersonFromRooms,
    joinRoom,
    leaveRoom,
    updateCardValue,
    updateAllCardsValue,
    toggleCardsVisibility,
    toggleVoteStarted,
};
