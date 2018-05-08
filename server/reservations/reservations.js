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
    if (!fs.existsSync('./roomList/reservations.json')) {
        fs.writeFileSync('./roomList/reservations.json', JSON.stringify([req.body], null, 2));
    } else {
        let reservationsList = JSON.parse(fs.readFileSync('./roomList/reservations.json'));
        const reservationRenamedKeys = renameKeys({reservationStartTime: 'queryStartTime', reservationEndTime: 'queryEndTime'}, req.body);

        if (!reservationsList.some(reservation => !checkSchedule(reservationRenamedKeys, reservation))){
            reservationsList.push(req.body);
            fs.writeFileSync('./roomList/reservations.json', JSON.stringify(reservationsList, null, 2));
        } else {
            console.log("OUPS");
            res.sendStatus(400);
            return ;
        }
    }
    res.sendStatus(201);
};

const filterRooms = (roomsList, query) => {
    if (!fs.existsSync('./roomList/reservations.json')){
        return roomsList.filter(room => checkCapacityAndEquipements(query, room));
    } else {
        let reservationsList = fs.readFileSync('./roomList/reservations.json', 'utf8');

        return roomsList.filter(room => !JSON.parse(reservationsList).some(reservation => {
            return (checkName(reservation.name, room.name) && !checkSchedule(query, reservation)) ||
                !checkCapacityAndEquipements(query, room)
        }));
    }
};


const checkName = (reservation, room) => {
    return reservation === room;
};

const checkSchedule = ({queryStartTime ,queryEndTime}, {reservationStartTime, reservationEndTime}) => {
    return (queryStartTime < reservationStartTime && queryEndTime < reservationStartTime) ||
        (queryStartTime > reservationEndTime && queryEndTime > queryStartTime);
};

const checkCapacityAndEquipements = (query, room) => {
    return checkCapacity(query.capacity, room.capacity) && checkEquipements(query.equipements, room.equipements)
};

const checkCapacity = (queryCapacity, roomCapacity) => {
    return queryCapacity !== undefined ? roomCapacity >= queryCapacity : true;
};

const checkEquipements = (queryEquipements, roomEquipements) => {
    return queryEquipements ? queryEquipements.filter(equipement => {
        return roomEquipements.findIndex((roomEquipement) => {
            return equipement === roomEquipement.name
        }) !== -1
    }).length === queryEquipements.length : true;
};

const renameKeys = (keysMap, obj) => {
    return Object.keys(obj).reduce((newObj, key) => {
        const renamedKey = {[keysMap[key] || key] : obj[key]};

        return Object.assign(newObj, renamedKey);
    }, {});
};

export {getRooms, reserveRoom};

