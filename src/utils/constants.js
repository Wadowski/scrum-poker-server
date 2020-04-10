const EVENTS_RECEIVED = {
    CONNECTION: 'connection',
    CREATE_ROOM: 'create room',
    JOIN_ROOM: 'join room',
    LEAVE_ROOM: 'leave room',
    DISCONNECT: 'disconnect',
    CARD_CHOSEN: 'card chosen',
    HIDE_CARDS: 'hide cards',
    SHOW_CARDS: 'show cards',
    PING: 'ping',
};

const EVENT_SEND = {
    ROOM_JOINED: 'room joined successfully',
    ROOM_NOT_JOINED: 'room not joined successfully',
    ROOM_PEOPLE_UPDATE: 'room people update',
    CARDS_UPDATE: 'cards update',
    ROOM_UPDATE: 'room update',
    VOTE_STATUS_UPDATE: 'vote status update',
};

module.exports = {
    EVENTS_RECEIVED,
    EVENT_SEND,
};
