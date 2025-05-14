class Ride {

    private _pickup: string;
    private _dropoff: string;


    constructor(pickup: string, dropoff: string) {
        this._pickup = pickup;
        this._dropoff = dropoff;
    }
    get pickup(): string {
        return this._pickup;
        
    }
    get dropoff(): string {
        return this._dropoff;
    }

   distancePick(): number {
    switch (this.pickup) {
        case "within 300km":
            return 300;

        case "within 400km":
            return 400;

        case "within 500km":
            return 500;

        default:
            return 0;
    }
}
    distanceDrop(): number {
        switch (this.dropoff) {
            case "within 300km":
                return 300;

            case "within 400km":
                return 400;

            case "within 500km":
                return 500;

            default:
                return 0;
        }
    }
     distance(): number {
        const totalDistance = this.distancePick() + this.distanceDrop();
        return totalDistance;
     }
    daytime(): number {
        const now = new Date();
        const hours = now.getHours();
        if (hours >= 7 && hours <= 9) {
            return 1.5;
        }
        else if (hours >= 9 && hours <= 12) {
            return 1.8;
        }
        else if (hours >= 12 && hours <= 15) {
            return 2.0;
        }
        else if (hours >= 15 && hours <= 19) {
            return 2.5;
        }
        
        return 1.0;
    }
    traffic(condition: "low" | "medium" | "high"): number {
        switch (condition) {
            case "low":
                return 1.0;
            case "medium":
                return 1.5;
            case "high":
                return 2.0;
            default:
                return 0;
        }
    }
    price(): number {
        const distance = this.distance();
        //Assuming traffic is medium for the day
        const traffic = this.traffic("medium");
        const rate = (traffic + this.daytime()) / 2;

        if (distance <= 600) {
            return distance * rate;
        }
        else if (distance <= 1000) {
            return distance * rate;
        }
        else if (distance <= 2000) {
            return distance * rate;
        }
        else if (distance > 2000) {
            return distance * rate;
        }
        return 0;
    }
     NearestDriver(passenger: Passenger, driver: Driver): {latitude: number, longitude: number} {
    const closeness = {
        latitude: passenger.location.latitude - driver.location.latitude,
        longitude: passenger.location.longitude - driver.location.longitude
    };
    return closeness;
}
}
class VehicleManage {
    private _model: string;
    private _plateNumber: string;

    constructor( model: string,plateNumber: string) {
        this._model = model;
        this._plateNumber = plateNumber;
    }
    get model(): string { 
        return this._model;
     }
    get plateNumber(): string { 
        return this._plateNumber; 
    }

    set model(value: string) {
         this._model = value; 
        }
    set plateNumber(value: string) {
         this._plateNumber = value; 
        }

    toString(): string {
        return ` ${this._model} - Plate: ${this._plateNumber}`;
    }
}

class User{
    private _name: string;
    private _email: string;
    private _phone: number;
    private _location: { latitude: number, longitude: number };


    constructor(name: string, email: string, phone: number, location: { latitude: number, longitude: number }) {
        this._name = name;
        this._email = email;
        this._phone = phone;
        this._location = location;
    }
    get name(): string {
        return this._name;
    }
    get email(): string {
        return this._email;
    }
    get phone(): number {
        return this._phone;
    }
    get location(): { latitude: number, longitude: number } {
        return this._location;
    }
}
class Driver extends User {
    private _car: string;
    private _vehicles: VehicleManage[] = [];
    constructor( name:string,email:string, car:string, location: {latitude :number, longitude:number},phone:number,){
        super(name, email, phone, location);
        this._car = car;
    }

get car(): string {
    return this._car;
}
    addVehicle(vehicle: VehicleManage): void {
        this._vehicles.push(vehicle);
    }

    get vehicles(): VehicleManage[] {
        return this._vehicles;
    }

    listVehicles(): void {
        this._vehicles.forEach(vehicle => {
            console.log(vehicle.toString());
        });
    }
}

class RideHistory {
    private _rides: Ride[];

    constructor() {
        this._rides = [];
    }

    addRide(ride: Ride): void {
        this._rides.push(ride);
    }

    get rides(): Ride[] {
        return this._rides;
    }
}

class Passenger extends User {
    private _cc: number;
    private _rideHistory: RideHistory;
    constructor(name:string, email:string, phone:number, location:{latitude:number, longitude:number}, cc:number,rideHistory?: RideHistory){
        super(name, email, phone, location);
       this._cc = cc;
       this._rideHistory = new RideHistory();
}
    get rideHistory(): RideHistory {
        return this._rideHistory;
    }
get cc(): number {
    return this._cc;
}

}

// Example scenario
const trip = new Ride("within 300km", "within 400km");
console.log("Pickup distance:", trip.distancePick());
console.log("Dropoff distance:", trip.distanceDrop());
console.log("Distance:", trip.distance());
console.log("Price:", trip.price());
const passenger = new Passenger("John Doe", "john@example.com", 1234567890, { latitude: 10, longitude: 20 }, 1234567890123456);
console.log("Ride history for passenger:", passenger.rideHistory.rides);
const driver = new Driver("Jane Smith", "jane@example.com", "Toyota", { latitude: 12, longitude: 22 }, 9876543210);
passenger.rideHistory.addRide(trip);
console.log(`Nearest Driver: ${driver.name}`, "\nDistance to passenger:", trip.NearestDriver(passenger, driver));
const vehicle1 = new VehicleManage("Toyota", "KAA 123A");
const vehicle2 = new VehicleManage("Honda", "KAA 456B");
driver.addVehicle(vehicle1);
driver.addVehicle(vehicle2);
console.log("Vehicles currently operational:");
driver.listVehicles();
