const ROLES = {
    ADMIN: 'admin',
    PARTICIPANT: 'participant',
};

const Person = ({ socketId, name = null, roles, card }) => ({
    socketId,
    name,
    roles,
    card,
});

module.exports = {
    Person,
    ROLES,
};
