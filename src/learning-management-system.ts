enum typeOfWork{
    QUIZ = "quiz",
    PROJECT = "project",
    ASSIGNMENT = "Assignment"
}

interface Assessment{
    typeOfAsmt: typeOfWork,
    maxScore: number,
    yourScore: number,
    gradeAsmt(): number
}


interface Database{
    data: []
}

class database implements Database{
    private data;

    constructor(){
        this.data= [];
    }

    save(_data: Person | Course){
        this.data.push(_data);
    }
}

class Person{
    protected name: string;
    protected role: string;
    protected age: number;
    protected gender: string;

    constructor(_name: string, _role: string, _age: number, _gender: string){
        this.name = _name;
        this.role= _role;
        this.gender = _gender;
        this.age = _age;
    }
}

class Course{
    protected lectures: number[];
    protected assignments: number[];
    private enrolledStudents: string[];
    protected classSchedule: string[];

    constructor(_lectures: number[], _assignmetns:number[], _enrolledStudents: string[], _classSchedule: string[]){
        this.lectures = _lectures;
        this.assignments = _assignmetns;
        this.enrolledStudents = _enrolledStudents;
        this.classSchedule = _classSchedule;
    }

    getEnrolledStudents(role: Admin): string[] | string{
        if(role.id === "1234"){
            return this.enrolledStudents;
        }
        return "Unauthorized buddy!!";
    }
}

class enrollment{
    student: Student;
    course: Course;

    constructor(_student: Student, _course: Course){
        this.student = _student;
        this.course = _course;
    }

    grade(courseWork: Quiz & Assignment & Project): number{
        
    }
}

class Student extends Person{
    regNum: number;
    course !: Course;
    modules: string[];
    grade: string;
    yearOfStudy: number;

    constructor(_name: string, _role:string, _age: number, _gender: string, _regNum: number, _modules: string[], _grade: string, _yearOfStudy: number){
        super(_name, _role, _age, _gender);
        this.regNum = _regNum;
        this.modules = _modules;
        this.grade = _grade;
        this.yearOfStudy = _yearOfStudy;
    }

    enrollToCourse(_course: Course){
        this.course = _course;
    }
}

class Professor extends Person{
    private IdNo: number,
    lecture: string[] | string,

    constructor(_name: string, _role:string, _age: number, _gender: string,_idNo: number, _lecture: string[] | string){
        super(_name, _role, _age, _gender);
        this.IdNo = _idNo;
        this.lecture = _lecture;
    }
}

class Admin{
    private id: number,
    

    admitStudent(){

    }

    expellStudent(){

    }

    notifyAll(){

    }

    getAllStudents(): string[]{

    }

    getAllProfs(): string[]{

    }

}

class Quiz implements Assessment{
    typeOfAsmt: typeOfWork;
    maxScore: number;
    yourScore: number;
    
    constructor(_typeOfAsmt: typeOfWork, _maxScore: number, _yourscore: number){
        this.typeOfAsmt = _typeOfAsmt;
        this.maxScore = _maxScore;
        this.yourScore = _yourscore;
    }

    gradeAsmt(): number {
        let grade:number = this.yourScore/this.maxScore * 100;
        return grade;
    }
}

class Assignment implements Assessment{
    typeOfAsmt: typeOfWork;
    maxScore: number;
    yourScore: number;
    
    constructor(_typeOfAsmt: typeOfWork, _maxScore: number, _yourscore: number){
        this.typeOfAsmt = _typeOfAsmt;
        this.maxScore = _maxScore;
        this.yourScore = _yourscore;
    }

    gradeAsmt(): number {
        let grade:number = this.yourScore/this.maxScore * 100;
        return grade;
    }
}

class Project implements Assessment{
    typeOfAsmt: typeOfWork;
    maxScore: number;
    yourScore: number;
    
    constructor(_typeOfAsmt: typeOfWork, _maxScore: number, _yourscore: number){
        this.typeOfAsmt = _typeOfAsmt;
        this.maxScore = _maxScore;
        this.yourScore = _yourscore;
    }

    gradeAsmt(): number {
        let grade:number = this.yourScore/this.maxScore * 100;
        return grade;
    }
}