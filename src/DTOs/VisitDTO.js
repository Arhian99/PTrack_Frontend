


export default class VisitDTO{
    doctorUsername;
    patientUsername;
    locationName;
    status;
    date;

    static build(doctorUsername, patientUsername, locationName){
        return new VisitDTO(doctorUsername, patientUsername, locationName, "", "");
    }

    constructor(doctorUsername, patientUsername, locationName, status, date){
        this.doctorUsername = doctorUsername;
        this.patientUsername = patientUsername;
        this.locationName = locationName;
        this.status = status;
        this.date = date;
    }
}