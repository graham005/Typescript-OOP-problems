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
    data:unknown[],
    save(_data: unknown): void,
    delete(id: number): void,
    viewAll(): unknown 
}

class database implements Database{
    data: unknown[];

    constructor(){
        this.data= [];
    }

    save(_data: unknown): void{
        this.data.push(_data);
    }
    delete(id: number): void{
        this.data = this.data.filter(value=>value!=id);
    }
    viewAll(): unknown{
        return this.data;
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
        if(role.idNo === 1234){
            return this.enrolledStudents;
        }
        return "Unauthorized buddy!!";
    }
}

class enrollment{
    student: Student | null;
    admin: Admin | null;
    constructor(){
        this.student = null;
        this.admin = null;
    }

    enroll(_student: Student){
      this.admin?.admitStudent(_student);
      this.admin?.notifyAll("New student admitted!");
    }

    gradeStudent(courseWork: Quiz & Assignment & Project): string{
        let grade = courseWork.gradeAsmt();
        if(grade>=80)
            return "A";
        else if(grade >=75 && grade < 80)
            return "A-";
        else if(grade>=70 && grade < 75)
            return "B+";
        else if(grade >=65 && grade < 70)
            return "B";
        else if(grade>=60 && grade < 65)
            return "B-";
        else if(grade >=55 && grade < 60)
            return "C+";
        else if(grade>=50 && grade < 55)
            return "C";
        else if(grade >=45 && grade < 50)
            return "C-";
        else
            return "Sup you cant be serious!!";
    }
}

class Student extends Person{
    regNum: number;
    course !: Course;
    modules: string[];
    grade: string | null;
    yearOfStudy: number;
    enrollment !: enrollment;

    constructor(_name: string, _role:string, _age: number, _gender: string, _regNum: number, _modules: string[], _grade: string, _yearOfStudy: number){
        super(_name, _role, _age, _gender);
        this.regNum = _regNum;
        this.modules = _modules;
        this.grade = null;
        this.yearOfStudy = _yearOfStudy;

    }

    apply(){
        this.enrollment.enroll(this);
    }

    doAssessment(test: Quiz | Assignment | Project){
        
        test.gradeAsmt()
    }
}

class Professor extends Person{
    private IdNo: number;
    lecture: string[] | string;

    constructor(_name: string, _role:string, _age: number, _gender: string,_idNo: number, _lecture: string[] | string){
        super(_name, _role, _age, _gender);
        this.IdNo = _idNo;
        this.lecture = _lecture;
    }
}

class Admin extends Person{
    idNo: number;
    private db: database;

    constructor(_name: string, _role:string, _age: number, _gender: string, _idNo: number){
        super(_name, _role, _age, _gender);
        this.idNo = _idNo;
        this.db = new database();
    }

    admitStudent(student: Student){
        this.db.save(student);
    }

    expellStudent(student: Student): string{
        this.db.delete(student.regNum);
        return "Student expelled";
    }

    notifyAll(message: string){
        console.log(message);
    }

    getAllStudents(): unknown{
        return this.db.viewAll();
    }

    getAllProfs(): unknown{
        return this.db.viewAll();
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


function Main(){


}