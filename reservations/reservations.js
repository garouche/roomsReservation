import fs from 'fs';

const getRooms = (req, res) => {
    if (fs.existsSync('./roomList/rooms.json')){
        const roomsList = JSON.parse(fs.readFileSync('./roomList/rooms.json', 'utf8'));

        res.status(200).send(filterRooms(roomsList.rooms, req.query));
    } else {
        res.status(500).send('Une erreure est survenue.');
    }
};

const reserveRoom = (req, res) => {
    console.log("BODY", req.body);
    res.status(200);
};

const filterRooms = (roomsList, query) => {
    if (!fs.existsSync('./roomList/reservations.json')){
        return roomsList.filter(room => checkCapacity(query.capacity, room.capacity) && checkEquipements(query.equipements, room.equipements));
    } else {
        let reservationsList = fs.readFileSync('./roomList/reservations.json', 'utf8');

        return roomsList.filter(room => !JSON.parse(reservationsList).reservations.some(reservation => checkName && !checkSchedule));
    }
};


const checkName = (reservation, room) => reservation.name === room.name;

const checkSchedule = ({queryStart, queryEnd}, {reservationStart, reservationEnd}) => {
    return (queryStart < reservationStart && queryEnd < reservationStart) || (queryStart > reservationEnd && queryEnd > queryStart);
};

const checkCapacity = (queryCapacity, roomCapacity) => {
    return queryCapacity !== undefined ? roomCapacity >= queryCapacity : true;
};

const checkEquipements = (queryEquipements, roomEquipements) => {
    return queryEquipements ? queryEquipements.filter(equipement => roomEquipements.findIndex((roomEquipement) => equipement === roomEquipement.name) !== -1).length === queryEquipements.length : true;
};

export {getRooms, reserveRoom};

