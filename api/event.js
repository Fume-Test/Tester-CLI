class Event {
    constructor (id, eventType, detail, session, eventOrder, location, eventTime) {
        this.id = id;
        this.eventType = eventType;
        this.detail = detail;
        this.session = session;
        this.eventOrder = eventOrder;
        this.location = location;
        this.eventTime = eventTime;
    }
}

module.exports = Event