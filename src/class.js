function formatDate(date) {
    return date.substr(0, 4) + date.substr(5, 2) + date.substr(8, 2) + "T" + date.substr(11, 2) + date.substr(14, 2) + date.substr(17, 2);
}

class IEvent {
    constructor() {
        if (this.constructor === IEvent)
            throw new TypeError('Interface "IEvent" cannot be instantiated directly');
    }

    isRegistered()   {throw new Error('You must implement this function');}
    getTile()        {throw new Error('You must implement this function');}
    getId()          {throw new Error('You must implement this function');}
    getDescription() {throw new Error('You must implement this function');}
    getLocation()    {throw new Error('You must implement this function');}
    getCategories()  {throw new Error('You must implement this function');}
    getStart()       {throw new Error('You must implement this function');}
    getEnd()         {throw new Error('You must implement this function');}
    getStamp() {
        let now = new Date(Date.now());
        return formatDate(now.toISOString()) + "Z";
    }
}

class Activity extends IEvent {
    constructor(activity) {
        super();
        this.acti = activity;
    }

    isRegistered() {
        return (
            this.acti.event_registered === "registered" ||
            this.acti.event_registered === "present" ||
            this.acti.event_registered === "absent" ||
            this.acti.status_manager === "eat" ||
            this.acti.status_manager === "accept"
        );
    }

    getTile() {
        return (this.acti.acti_title || this.acti.title || "");
    }

    getId() {
        return (this.acti.codeevent || "");
    }

    getDescription() {
        return (this.acti.type_title || "");
    }

    getLocation() {
        if (!this.acti.room || ! this.acti.room.code) {
            console.log("NO ROOM");
            return "";
        }
        let slices = this.acti.room.code.split("/");
        return (slices.length > 0 ? slices[slices.length - 1] : "");
    }

    getCategories() {
        return (this.acti.type_code || "");
    }

    getStart() {
        if (this.acti.rdv_indiv_registered) {
            let slices = this.acti.rdv_indiv_registered.split("|");
            return formatDate(slices[0]);
        } else if (this.acti.rdv_group_registered) {
            let slices = this.acti.rdv_group_registered.split("|");
            return formatDate(slices[0]);
        } else {
            return formatDate(this.acti.start);
        }
    }

    getEnd() {
        if (this.acti.rdv_indiv_registered) {
            let slices = this.acti.rdv_indiv_registered.split("|");
            return formatDate(slices[1]);
        } else if (this.acti.rdv_group_registered) {
            let slices = this.acti.rdv_group_registered.split("|");
            return formatDate(slices[1]);
        } else {
            return formatDate(this.acti.end);
        }
    }
}

class Project extends IEvent {
    constructor(activity) {
        super();
        this.acti = activity;
    }

    isRegistered() {
        return (this.acti.registered === 1 && this.acti.type_acti_code === "proj");
    }

    getTile() {
        return (this.acti.acti_title || "");
    }

    getId() {
        return (this.acti.acti_title || "");
    }

    getDescription() {
        return (this.acti.type_acti || "");
    }

    getLocation() {
        return (this.acti.code_location || "");
    }

    getCategories() {
        return (this.acti.type_acti_code || "");
    }

    getStart() {
        return formatDate(this.acti.begin_acti);
    }

    getEnd() {
        return formatDate(this.acti.end_acti);
    }
}

class ProjectEnd extends Project {
    constructor(activity) {
        super(activity);
    }

    getStart() {
        let start = this.getEnd();

        if (Number(start.substr(10, 1)) !== 0)
            return start.substr(0, 10) + (Number(start.substr(10, 1)) - 1) + start.substr(11, 4);
        else
            return start
    }
}

module.exports = {
    IEvent: IEvent,
    Activity: Activity,
    Project: Project,
    ProjectEnd: ProjectEnd
};