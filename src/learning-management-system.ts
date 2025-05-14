const inMemoryDb: unknown = [];

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
    save(_data: unknown): void,
    delete(id: number): void,
    viewAll(): unknown 
}



class database implements Database{
    data: unknown;

    constructor(){
        this.data= inMemoryDb;
    }

    save(_data: unknown): void{
        this.data.push(_data);
    }
    delete(id: number): void{
        this.data = this.data.filter((student)=>student.regNum!=id);
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
    protected lectures: string[];
    protected assignments: string[];
    private enrolledStudents: number;
    protected classSchedule: string[];

    constructor(_lectures: string[], _assignmetns:string[], _enrolledStudents: number, _classSchedule: string[]){
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

    totalScore: number;
    constructor(){ this.totalScore = 0}

    calculateTotalScore(courseWork: Quiz | Assignment | Project){
        this.totalScore += courseWork.gradeAsmt();
    }

    gradeStudent(): string{

        let grade = (this.totalScore / 3);
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
    db: database;
    test !: Quiz | Assignment | Project;
    enroll: enrollment;

    constructor(_name: string, _role:string, _age: number, _gender: string, _regNum: number,_course:Course, _modules: string[], _grade: string | null, _yearOfStudy: number){
        super(_name, _role, _age, _gender);
        this.regNum = _regNum;
        this.modules = _modules;
        this.grade = null;
        this.yearOfStudy = _yearOfStudy;
        this.course = _course;
        this.db = new database();
        this.enroll = new enrollment();
    }

  private getAllCourses(): unknown{
        let all = this.db.viewAll();
        let students = all.filter((value) => value.role === "student");
        let thisStudent = students.filter(value => value.regNum == this.regNum);
        let courses = thisStudent.map(student=> student.course);
        
        return courses;
  }

  public accessCourses(): unknown{
    return this.getAllCourses();
  }

  doQuiz(score: number, outOf: number){
        this.test = new Quiz(typeOfWork.QUIZ, outOf, score);
        this.enroll.calculateTotalScore(this.test);
  }

   doProj(score: number, outOf: number){
        this.test = new Quiz(typeOfWork.PROJECT, outOf, score);
        this.enroll.calculateTotalScore(this.test);
  }

   doAssignment(score: number, outOf: number){
    this.test = new Quiz(typeOfWork.ASSIGNMENT, outOf, score);
    this.enroll.calculateTotalScore(this.test);
    
  }
  getGrade(): string{
    this.grade = this.enroll.gradeStudent();
    return this.grade;
  }
}

class Professor extends Person{
    private IdNo: number;
    lecture: string[] | string;
    db: database;

    constructor(_name: string, _role:string, _age: number, _gender: string,_idNo: number, _lecture: string[] | string){
        super(_name, _role, _age, _gender);
        this.IdNo = _idNo;
        this.lecture = _lecture;
        this.db = new database();
    }

    private getAllLectures(): unknown{
        let all = this.db.viewAll();
        let profs = all.filter((value) => value.role === "professor");
        let thisProf = profs.filter(value => value.IdNo == this.IdNo);
        let lectures = thisProf.map(prof => prof.lecture);
        
        return lectures;
  }

  public accessLectures(): unknown{
    return this.getAllLectures();
  }
}

class Admin extends Person{
    idNo: number;
    private db: database;
    private enroll: enrollment;

    constructor(_name: string, _role:string, _age: number, _gender: string, _idNo: number){
        super(_name, _role, _age, _gender);
        this.idNo = _idNo;
        this.db = new database();
        this.enroll = new enrollment();
    }

    admitOrUpdateStudent(student: Student){
        this.db.save(student);
        this.notifyAll("student updated!");
    }

    assignProf(professor: Professor){
        this.db.save(professor);
        this.notifyAll("Professor assigned lecture");
    }

    expellStudent(student: Student){
        this.db.delete(student.regNum);
        this.notifyAll("Student expelled");
    }

    notifyAll(message: string){
        console.log(message);
    }

    getAllStudents(): unknown{
        let all = this.db.viewAll();
        let students = all.filter((value)=> value.role == "student");
        return students;
    }

    getAllProfs(): unknown{
        let all = this.db.viewAll();
        let professors = all.filter((value)=> value.role == "professor");

        return professors;
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
    let admin = new Admin("Kay", "admin", 21, "Male", 211);
    let course = new Course(["Math for science", "IoT"], ["Math for science ass", "IoT ass"], 0, ["Monday 10-12pm", "Tue 10-12pm"]);
    let student1 = new Student("Mike", "student", 20, "Male", 2333,course,["maths", "oop"], null, 1);
    let student2 = new Student("Jack", "student", 20, "Male", 2334,course,["maths", "oop"], null, 1);
    let professor1 = new Professor("Kevin", "professor",57,"Male", 123, ["Maths"]);


    console.log();

   
    admin.assignProf(professor1);


    student1.doAssignment(70, 100);
    student1.doQuiz(70, 100);
    student1.doProj(70, 100);


    console.log("Student grade is : " + student1.getGrade());

    admin.admitOrUpdateStudent(student1);
    admin.admitOrUpdateStudent(student2);


    console.log(" All students in the database: ");
    console.log(admin.getAllStudents());

    console.log("All professors in the database: ");
    console.log(admin.getAllProfs());

    console.log("Student courses are : ");
    console.log(student2.accessCourses());

    console.log("Lecturer's courses are: ");
    console.log( professor1.accessLectures());
}

Main();