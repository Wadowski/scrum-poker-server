const ROLES = {
    ADMIN: 'admin',
    PARTICIPANT: 'participant',
};

const Person = ({ socketId, name, roles, card }) => ({
    socketId,
    name,
    roles,
    card,
});

module.exports = {
    Person,
    ROLES,
};
