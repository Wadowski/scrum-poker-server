const ROLES = {
    ADMIN: 'admin',
    PARTICIPANT: 'participant',
};

const Person = ({ socketId, name, roles, cardValue = 0 }) => ({
    socketId,
    name,
    roles,
    cardValue,
});

module.exports = {
    Person,
    ROLES,
};
