const { Person, ROLES } = require('../models/Person');
const { Room } = require('../models/Room');

let rooms = [];
let id = 1;

const getRooms = () => rooms;

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
    });
    id++;

    rooms.push(room);

    return room;
};

const joinRoom = (socketId, roomId, name) => {
    try {
        const storedRoomId = rooms.findIndex(({ id }) => id === roomId);
        if (storedRoomId === -1) throw new Error('Room not found');

        const person = Person({ socketId, name, roles: [ROLES.PARTICIPANT] });
        rooms[storedRoomId].people.push(person);

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

module.exports = {
    getRooms,
    createRoom,
    removePersonFromRooms,
    joinRoom,
};
