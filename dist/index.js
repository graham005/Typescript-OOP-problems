"use strict";
// Abstract base class for all library resources
class LibraryResources {
    resourceId;
    name;
    publicationYear;
    constructor(resourceId, name, publicationYear) {
        this.resourceId = resourceId;
        this.name = name;
        this.publicationYear = publicationYear;
    }
}
// Base class for user accounts
class Account {
    username;
    password;
    borrowedItems = [];
    fine = 0;
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    applyFine(amount) {
        this.fine += amount;
    }
    getFine() {
        return this.fine;
    }
    payFine(amount) {
        this.fine = Math.max(0, this.fine - amount);
    }
}
// Member user
class Member extends Account {
    constructor(username, password) {
        super(username, password);
    }
}
// Book class 
class Book extends LibraryResources {
    isBorrowed = false;
    dueDate;
    category() {
        return "Book";
    }
    borrowItem(user) {
        if (!this.isBorrowed) {
            this.isBorrowed = true;
            this.dueDate = new Date();
            this.dueDate.setDate(this.dueDate.getDate() + 7); // 1 week loan
            user.borrowedItems.push({ item: this, dueDate: this.dueDate });
            console.log(`"${this.name}" borrowed by ${user.username}`);
        }
    }
    returnBorrowedItem(user, returnedOn) {
        this.isBorrowed = false;
        const record = user.borrowedItems.find(b => b.item === this);
        if (record) {
            const due = record.dueDate.getTime();
            const returned = returnedOn.getTime();
            if (returned > due) {
                const daysLate = Math.ceil((returned - due) / (1000 * 3600 * 24));
                user.applyFine(daysLate * 20); // sh.20 per late day
            }
        }
        console.log(`"${this.name}" returned by ${user.username}`);
    }
}
// DVD class extending Book
class DVD extends Book {
    category() {
        return "DVD";
    }
}
// EBook class (non-physical but still borrowable)
class EBook extends LibraryResources {
    isBorrowed = false;
    dueDate;
    category() {
        return "EBook";
    }
    borrowItem(user) {
        if (!this.isBorrowed) {
            this.isBorrowed = true;
            this.dueDate = new Date();
            this.dueDate.setDate(this.dueDate.getDate() + 7); // 1-week loan for ebooks
            user.borrowedItems.push({ item: this, dueDate: this.dueDate });
            console.log(`"${this.name}" digitally borrowed by ${user.username}`);
        }
    }
    returnBorrowedItem(user, returnedOn) {
        this.isBorrowed = false;
        const record = user.borrowedItems.find(b => b.item === this);
        if (record) {
            const due = record.dueDate.getTime();
            const returned = returnedOn.getTime();
            if (returned > due) {
                const daysLate = Math.ceil((returned - due) / (1000 * 3600 * 24));
                user.applyFine(daysLate * 10); // 1 per late day
            }
        }
        console.log(`"${this.name}" returned (eBook) by ${user.username}`);
    }
}
// Librarian user
class Librarian extends Account {
    constructor(username, password) {
        super(username, password);
    }
    addItemToLibrary(item) {
        console.log(`"${item.name}" added to library by ${this.username}.`);
    }
}
const member = new Member("Murchoid", "1234");
const book = new Book("B1", "Learning JavaScript: A Beginner's Guide", 2022);
const ebook = new EBook("E1", "Digital Learning", 2023);
const dvd = new DVD("D1", "Roman Civilization History", 2021);
// Member borrows and returns a book late
book.borrowItem(member);
const lateReturnDate = new Date();
lateReturnDate.setDate(lateReturnDate.getDate() + 13); // 6 days late
book.returnBorrowedItem(member, lateReturnDate);
// Member borrows another book
const anotherBook = new Book("E1", "Digital Learning", 2023);
anotherBook.borrowItem(member);
const anotherLateReturnDate = new Date();
anotherLateReturnDate.setDate(anotherLateReturnDate.getDate() + 1); // 5 days late
anotherBook.returnBorrowedItem(member, anotherLateReturnDate);
console.log(`Total fine for ${member.username}: ${member.getFine()}`);
const librarian = new Librarian("Enoch Grahams", "Group4");
librarian.addItemToLibrary(book);
librarian.addItemToLibrary(ebook);
librarian.addItemToLibrary(dvd);
