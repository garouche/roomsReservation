import fs from 'fs';
import moment from 'moment';

const getRooms = (req, res) => {
    if (checkQuery(req.query)) {
        if (fs.existsSync('./roomList/rooms.json')) {
            const roomsList = JSON.parse(fs.readFileSync('./roomList/rooms.json', 'utf8'));

            res.status(200).send(filterRooms(roomsList.rooms, req.query));
        } else {
            res.status(500).send('Une erreure est survenue.');
        }
    } else {
        res.status(400).send('Invalid data sent ! ò_ó');
    }
};

const reserveRoom = (req, res) => {
    if (checkBody(req.body)) {
        const writeBodyKeys = renameKeys({
            queryStartTime: 'reservationStartTime',
            queryEndTime: 'reservationEndTime'
        }, req.body);

        if (!fs.existsSync('./roomList/reservations.json')) {

            fs.writeFileSync('./roomList/reservations.json', JSON.stringify([writeBodyKeys], null, 2));
        } else {
            let reservationsList = JSON.parse(fs.readFileSync('./roomList/reservations.json'));
            const reservationRenamedKeys = renameKeys({
                reservationStartTime: 'queryStartTime',
                reservationEndTime: 'queryEndTime'
            }, req.body);

            if (!reservationsList.some(reservation => req.body.name === reservation.name && !checkSchedule(reservationRenamedKeys, reservation))) {
                reservationsList.push(writeBodyKeys);
                fs.writeFileSync('./roomList/reservations.json', JSON.stringify(reservationsList, null, 2));
            } else {
                res.sendStatus(400);
                return;
            }
        }
        res.sendStatus(201);
    } else {
        res.status(400).send('Invalid data sent ! ò_ó');
    }
};

const filterRooms = (roomsList, query) => {
    if (!fs.existsSync('./roomList/reservations.json')){
        return roomsList.filter(room => checkCapacityAndEquipements(query, room));
    } else {
        let reservationsList = fs.readFileSync('./roomList/reservations.json', 'utf8');

        return roomsList.filter(room => !JSON.parse(reservationsList).some(reservation =>
            ((checkName(reservation.name, room.name) && !checkSchedule(query, reservation)) ||
                !checkCapacityAndEquipements(query, room))
        ));
    }
};


const checkName = (reservation, room) => {
    return reservation === room;
};

const checkSchedule = ({queryStartTime ,queryEndTime}, {reservationStartTime, reservationEndTime}) => {
    return ((queryEndTime <= reservationStartTime || queryEndTime > reservationEndTime) && (queryStartTime < reservationStartTime || queryStartTime >= reservationEndTime));
};

const checkCapacityAndEquipements = (query, room) => {
    return checkCapacity(query.capacity, room.capacity) && checkEquipements(query.equipements, room.equipements)
};

const checkCapacity = (queryCapacity, roomCapacity) =>
     queryCapacity !== undefined ? roomCapacity >= queryCapacity : true;

const checkEquipements = (queryEquipements, roomEquipements) =>
    queryEquipements ? queryEquipements.filter(equipement =>
            roomEquipements.findIndex((roomEquipement) =>
                equipement === roomEquipement.name
        ) !== -1
    ).length === queryEquipements.length : true;

const renameKeys = (keysMap, obj) =>
    Object.keys(obj).reduce((newObj, key) => {
        const renamedKey = {[keysMap[key] || key] : obj[key]};

        return Object.assign(newObj, renamedKey);
    }, {});
const checkBody = (body) => {
    if (body){
        return checkTimeQuery(body) && checkNameQuery(body);
    } else {
        return false;
    }
};

const checkQuery = (query) => {
    if (query){
        return checkCapacityQuery(query) && checkEquipementsQuery(query) && checkTimeQuery(query);
    } else {
        return false;
    }
};

const checkNameQuery = (body) => {
    if (body && fs.existsSync('./roomList/rooms.json')){
        const roomsList = JSON.parse(fs.readFileSync('./roomList/rooms.json', 'utf8'));

        return roomsList.rooms.filter(room => room.name === body.name).length;
    } else {
        return false;
    }
};

const checkCapacityQuery = ({capacity}) => {
    return (!isNaN(parseInt(capacity)) && capacity >= 1 && capacity <= 26);
};

const checkEquipementsQuery = ({equipements}) => (equipements && typeof equipements === 'object' && equipements.length ? (!equipements.some(equipement => ['TV', 'Retro Projecteur'].indexOf(equipement) === -1)) : true);

const checkTimeQuery = ({queryStartTime, queryEndTime}) => {
    if (queryStartTime && queryEndTime) {
        const startTime = moment(queryStartTime.split('h').join(':'));
        const endTime = moment(queryEndTime.split('h').join(':'));
        const minutes = [0, 30];

        return startTime.isSameOrAfter(moment()) && startTime.isBefore(queryEndTime.split('h').join(':')) && startTime.isValid() && endTime.isValid() && (minutes.indexOf(startTime.minute()) !== -1) && (minutes.indexOf(startTime.minute()) !== -1);
    } else {
        return false;
    }
};

export {getRooms, reserveRoom};

