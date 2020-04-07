const request = require('request');
const {Activity, Project, ProjectEnd} = require('./class');

Date.prototype.addDays = function(days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

function getLimits() {
    let nowMoment = new Date(Date.now());
    return {start: nowMoment.addDays(-7).toISOString().substr(0, 10), end: nowMoment.addDays(30).toISOString().substr(0, 10)};
}

function eventsToIcal(events) {
    let ical = "BEGIN:VCALENDAR" + "\r\n";
    ical += "VERSION:2.0" + "\r\n";
    ical += "PRODID:-//omnirem.dev//epicalendarv2//FR" + "\r\n";
    ical += "BEGIN:VTIMEZONE" + "\r\n";
    ical += "TZID:Europe/Paris" + "\r\n";
    ical += "X-LIC-LOCATION:Europe/Paris" + "\r\n";
    ical += "BEGIN:DAYLIGHT" + "\r\n";
    ical += "TZOFFSETFROM:+0100" + "\r\n";
    ical += "TZOFFSETTO:+0200" + "\r\n";
    ical += "TZNAME:CEST" + "\r\n";
    ical += "DTSTART:19700329T020000" + "\r\n";
    ical += "RRULE:FREQ=YEARLY;INTERVAL=1;BYDAY=-1SU;BYMONTH=3" + "\r\n";
    ical += "END:DAYLIGHT" + "\r\n";
    ical += "BEGIN:STANDARD" + "\r\n";
    ical += "TZOFFSETFROM:+0200" + "\r\n";
    ical += "TZOFFSETTO:+0100" + "\r\n";
    ical += "TZNAME:CET" + "\r\n";
    ical += "DTSTART:19701025T030000" + "\r\n";
    ical += "RRULE:FREQ=YEARLY;INTERVAL=1;BYDAY=-1SU;BYMONTH=10" + "\r\n";
    ical += "END:STANDARD" + "\r\n";
    ical += "END:VTIMEZONE" + "\r\n";
    for (const event of events) {
        ical += "BEGIN:VEVENT" + "\r\n";
        ical += "SUMMARY:" + event.getTile() + "\r\n";
        ical += "DESCRIPTION:" + event.getDescription() + "\r\n";
        ical += "LOCATION:" + event.getLocation() + "\r\n";
        ical += "CATEGORIES:" + event.getCategories() + "\r\n";
        ical += "UID:" + event.getId() + "\r\n";
        ical += "DTSTAMP:" + event.getStamp() +"\r\n";
        ical += "DTSTART;TZID=Europe/Paris:" + event.getStart() + "\r\n";
        ical += "DTEND;TZID=Europe/Paris:" + event.getEnd() + "\r\n";
        ical += "END:VEVENT" + "\r\n";
    }
    ical += "END:VCALENDAR" + "\r\n";
    return ical;
}

function makeRequest(req, res, url, cb) {
    const autologin = req.params.autologin;

    if (!autologin.startsWith("auth-") || autologin.length !== 45) {
        res.status(400);
        res.json({"error": "invalid autologin format"});
        return;
    }

    request(`https://intra.epitech.eu/${autologin}${url}`, { json: true }, (err, result, body) => {
        if (err || !body || typeof body !== "object") {
            res.status(500);
            res.json({"error": "intra is down, again"});
        } else if (body.hasOwnProperty("message")) {
            res.status(400);
            res.json({"error": body.message});
        } else {
            cb(body);
        }
    });
}

function planningHandler(req, res) {
    let limits = getLimits();
    makeRequest(req, res, `/planning/load?format=json&start=${limits.start}&end=${limits.end}`, (body) => {
        let events = [];
        for (const elem of body) {
            let acti = new Activity(elem);
            if (acti.isRegistered())
                events.push(acti);
        }
        res.set('Content-Type', 'text/calendar');
        res.send(eventsToIcal(events));
    });
}

function projectsHandler(req, res) {
    let limits = getLimits();
    makeRequest(req, res, `/module/board/?format=json&start=${limits.start}&end=${limits.end}`, (body) => {
        let events = [];
        for (const elem of body) {
            let acti = new Project(elem);
            if (acti.isRegistered())
                events.push(acti);
        }
        res.set('Content-Type', 'text/calendar');
        res.send(eventsToIcal(events));
    });
}

function projectsEndHandler(req, res) {
    let limits = getLimits();
    makeRequest(req, res, `/module/board/?format=json&start=${limits.start}&end=${limits.end}`, (body) => {
        let events = [];
        for (const elem of body) {
            let acti = new ProjectEnd(elem);
            if (acti.isRegistered())
                events.push(acti);
        }
        res.set('Content-Type', 'text/calendar');
        res.send(eventsToIcal(events));
    });
}

module.exports = {
    planningHandler: planningHandler,
    projectsHandler: projectsHandler,
    projectsEndHandler: projectsEndHandler
};