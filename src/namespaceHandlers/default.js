const {
    createRoomHandler,
    joinRoomHandler,
    leaveRoomHandler,
    disconnectHandler,
    cardsChosenHandler,
    hideCardsHandler,
    showCardsHandler,
    updateUserDetailsHandler,
} = require('../socketHandlers/roomManagement');
const { EVENTS_RECEIVED } = require('../utils/constants');

const defaultNamespace = (io) => io
    .on(EVENTS_RECEIVED.CONNECTION, (socket) => {
        socket.on(EVENTS_RECEIVED.CREATE_ROOM, createRoomHandler(socket, io));
        socket.on(EVENTS_RECEIVED.JOIN_ROOM, joinRoomHandler(socket, io));
        socket.on(EVENTS_RECEIVED.LEAVE_ROOM, leaveRoomHandler(socket, io));
        socket.on(EVENTS_RECEIVED.DISCONNECT, disconnectHandler(socket));
        socket.on(EVENTS_RECEIVED.CARD_CHOSEN, cardsChosenHandler(socket, io));
        socket.on(EVENTS_RECEIVED.HIDE_CARDS, hideCardsHandler(socket, io));
        socket.on(EVENTS_RECEIVED.SHOW_CARDS, showCardsHandler(socket, io));
        socket.on(EVENTS_RECEIVED.UPDATE_USER_DETAILS, updateUserDetailsHandler(socket, io));
});

module.exports = {
    defaultNamespace
};
