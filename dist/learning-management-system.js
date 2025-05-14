const inMemoryDb = [];
var typeOfWork;
(function (typeOfWork) {
    typeOfWork["QUIZ"] = "quiz";
    typeOfWork["PROJECT"] = "project";
    typeOfWork["ASSIGNMENT"] = "Assignment";
})(typeOfWork || (typeOfWork = {}));
class database {
    constructor() {
        this.data = inMemoryDb;
    }
    save(_data) {
        this.data.push(_data);
    }
    delete(id) {
        this.data = this.data.filter((student) => student.regNum != id);
    }
    viewAll() {
        return this.data;
    }
}
class Person {
    constructor(_name, _role, _age, _gender) {
        this.name = _name;
        this.role = _role;
        this.gender = _gender;
        this.age = _age;
    }
}
class Course {
    constructor(_lectures, _assignmetns, _enrolledStudents, _classSchedule) {
        this.lectures = _lectures;
        this.assignments = _assignmetns;
        this.enrolledStudents = _enrolledStudents;
        this.classSchedule = _classSchedule;
    }
    getEnrolledStudents(role) {
        if (role.idNo === 1234) {
            return this.enrolledStudents;
        }
        return 0;
    }
}
class enrollment {
    constructor() { this.totalScore = 0; }
    calculateTotalScore(courseWork) {
        this.totalScore += courseWork.gradeAsmt();
    }
    gradeStudent() {
        let grade = (this.totalScore / 3);
        if (grade >= 80)
            return "A";
        else if (grade >= 75 && grade < 80)
            return "A-";
        else if (grade >= 70 && grade < 75)
            return "B+";
        else if (grade >= 65 && grade < 70)
            return "B";
        else if (grade >= 60 && grade < 65)
            return "B-";
        else if (grade >= 55 && grade < 60)
            return "C+";
        else if (grade >= 50 && grade < 55)
            return "C";
        else if (grade >= 45 && grade < 50)
            return "C-";
        else
            return "Sup you cant be serious!!";
    }
}
class Student extends Person {
    constructor(_name, _role, _age, _gender, _regNum, _course, _modules, _grade, _yearOfStudy) {
        super(_name, _role, _age, _gender);
        this.regNum = _regNum;
        this.modules = _modules;
        this.grade = null;
        this.yearOfStudy = _yearOfStudy;
        this.course = _course;
        this.db = new database();
        this.enroll = new enrollment();
    }
    getAllCourses() {
        let all = this.db.viewAll();
        let students = all.filter((value) => value.role === "student");
        let thisStudent = students.filter(value => value.regNum == this.regNum);
        let courses = thisStudent.map(student => student.course);
        return courses;
    }
    accessCourses() {
        return this.getAllCourses();
    }
    doQuiz(score, outOf) {
        this.test = new Quiz(typeOfWork.QUIZ, outOf, score);
        this.enroll.calculateTotalScore(this.test);
    }
    doProj(score, outOf) {
        this.test = new Quiz(typeOfWork.PROJECT, outOf, score);
        this.enroll.calculateTotalScore(this.test);
    }
    doAssignment(score, outOf) {
        this.test = new Quiz(typeOfWork.ASSIGNMENT, outOf, score);
        this.enroll.calculateTotalScore(this.test);
    }
    getGrade() {
        this.grade = this.enroll.gradeStudent();
        return this.grade;
    }
}
class Professor extends Person {
    constructor(_name, _role, _age, _gender, _idNo, _lecture) {
        super(_name, _role, _age, _gender);
        this.IdNo = _idNo;
        this.lecture = _lecture;
        this.db = new database();
    }
    getAllLectures() {
        let all = this.db.viewAll();
        let profs = all.filter((value) => value.role === "professor");
        let thisProf = profs.filter(value => value.IdNo == this.IdNo);
        let lectures = thisProf.map(prof => prof.lecture);
        return lectures;
    }
    accessLectures() {
        return this.getAllLectures();
    }
}
class Admin extends Person {
    constructor(_name, _role, _age, _gender, _idNo) {
        super(_name, _role, _age, _gender);
        this.idNo = _idNo;
        this.db = new database();
        this.enroll = new enrollment();
    }
    admitOrUpdateStudent(student) {
        this.db.save(student);
        this.notifyAll("student updated!");
    }
    assignProf(professor) {
        this.db.save(professor);
        this.notifyAll("Professor assigned lecture");
    }
    expellStudent(student) {
        this.db.delete(student.regNum);
        this.notifyAll("Student expelled");
    }
    notifyAll(message) {
        console.log(message);
    }
    getAllStudents() {
        let all = this.db.viewAll();
        let students = all.filter((value) => value.role == "student");
        return students;
    }
    getAllProfs() {
        let all = this.db.viewAll();
        let professors = all.filter((value) => value.role == "professor");
        return professors;
    }
}
class Quiz {
    constructor(_typeOfAsmt, _maxScore, _yourscore) {
        this.typeOfAsmt = _typeOfAsmt;
        this.maxScore = _maxScore;
        this.yourScore = _yourscore;
    }
    gradeAsmt() {
        let grade = this.yourScore / this.maxScore * 100;
        return grade;
    }
}
class Assignment {
    constructor(_typeOfAsmt, _maxScore, _yourscore) {
        this.typeOfAsmt = _typeOfAsmt;
        this.maxScore = _maxScore;
        this.yourScore = _yourscore;
    }
    gradeAsmt() {
        let grade = this.yourScore / this.maxScore * 100;
        return grade;
    }
}
class Project {
    constructor(_typeOfAsmt, _maxScore, _yourscore) {
        this.typeOfAsmt = _typeOfAsmt;
        this.maxScore = _maxScore;
        this.yourScore = _yourscore;
    }
    gradeAsmt() {
        let grade = this.yourScore / this.maxScore * 100;
        return grade;
    }
}
function Main() {
    let admin = new Admin("Kay", "admin", 21, "Male", 211);
    let course = new Course(["Math for science", "IoT"], ["Math for science ass", "IoT ass"], 0, ["Monday 10-12pm", "Tue 10-12pm"]);
    let student1 = new Student("Mike", "student", 20, "Male", 2333, course, ["maths", "oop"], null, 1);
    let student2 = new Student("Jack", "student", 20, "Male", 2334, course, ["maths", "oop"], null, 1);
    let professor1 = new Professor("Kevin", "professor", 57, "Male", 123, ["Maths"]);
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
    console.log(professor1.accessLectures());
}
Main();
