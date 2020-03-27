const EVENTS_RECEIVED = {
    CONNECTION: 'connection',
    CREATE_ROOM: 'create room',
    JOIN_ROOM: 'join room',
    DISCONNECT: 'disconnect',
};

const EVENT_SEND = {
    ROOM_JOINED: 'room joined successfully',
    ROOM_NOT_JOINED: 'room not joined successfully',
    ROOM_PEOPLE_UPDATE: 'room people update',
};

module.exports = {
    EVENTS_RECEIVED,
    EVENT_SEND,
};
