const { Person, ROLES } = require('../models/Person');
const { Room } = require('../models/Room');
const { Card } = require('../models/Card');

let rooms = [];
let id = 1;

const getRoomListIndex = (roomId) => {
    const roomIdNum = Number(roomId);
    const storedRoomId = rooms.findIndex(({ id }) => id === roomIdNum);
    if (storedRoomId === -1) throw new Error('Room not found');

    return storedRoomId;
};

const getRoom = (roomId) => {
    const storedRoomId = getRoomListIndex(roomId);

    return rooms[storedRoomId];
};

const createRoom = (socketId) => {
    const person = Person({
        socketId,
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

const joinRoom = (socketId, roomId) => {
    try {
        const storedRoomId = getRoomListIndex(roomId);

        const person = Person({ socketId, roles: [ROLES.PARTICIPANT] });
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

const updateUserDetails = (socketId, roomId, details) => {
    const storedRoomId = getRoomListIndex(roomId);

    let user = null;
    rooms[storedRoomId].people.forEach((person) => {
        if (person.socketId === socketId) {
            person = {
                ...person,
                ...details,
            };
            user = person;
        }
    });

    return user;
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
    getRoom,
    createRoom,
    removePersonFromRooms,
    joinRoom,
    leaveRoom,
    updateCardValue,
    updateAllCardsValue,
    updateUserDetails,
    toggleCardsVisibility,
    toggleVoteStarted,
};
