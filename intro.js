const { use } = require("react");

// Variables
var x = 5;
var y = 6;
var z = x + y;
console.log(z)

// Strings
var firstName = "Tyler";
var lastName = "Pak";
var sentence = 'Hello ' +  firstName + ''  + lastName + '! How are you!?'
console.log(sentence)

// While Loop
var friendsAtParty = 0;
while (friendsAtParty < 10) {
    friendsAtParty = friendsAtParty + 1;
}
console.log(friendsAtParty)

// For Loop
let friendsAtParties = 0;
for (let i = 0; i < 10; i++) {
    friendsAtParties++;
}
console.log(friendsAtParty);

// Booleans
var trueValue = true;
var falseValue = false;

var trueFalse = !trueValue;
console.log(trueFalse);

// If Statements
const skyIsBlue = true;
if (skyIsBlue) {
    console.log('The sky is blue!')
} else {
    console.log('The sky is...not blue?')
}

// Functions
function addTwo(number) {
    return number + 2;
}

var finalAnswer = addTwo(5);
console.log(finalAnswer)

// Built-Ins
const sentece = 'ThIs HaS wEiRd  CaSing On It';
console.log(sentece.toLocaleLowerCase())

// Objects
const person = {
    name: 'Josh Hug',
    city: 'Austin',
    state: 'TX',
    favoriteFood: 'Tacos!',
    wantsTacosRightNow: true,
    numberOfTacosWanted: 100,
};

console.log(person);
console.log(person.name);
console.log(person['name']);


// JSONs
var myJSON = '{"name": "John", "age": 31, "city": "New York"}';
var myObj = JSON.parse(myJSON);
console.log(myObj);

let addNums = (n1, n2) => {
    return n1 + n2;
};
console.log(addNums(3, 4));

// Arrow Functions
addNums = (n1, n2) => n1 + n2;
console.log(addNums(3, 4));

// Arrays
const daysOfTheWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
];
console.log(daysOfTheWeek);
console.log(daysOfTheWeek[0]);
console.log(daysOfTheWeek[1]);
console.log(daysOfTheWeek[6]);

// Spread
let fruits = ['apple', 'orange', 'banana'];
let another_fruits = [...fruits, 'papaya'];
console.log(fruits);
console.log(another_fruits);

const base = { role: "user", active: true};
const override = {active: false};

const merged = {...base, ...override};

const state = {
    user: { name: "Tyler", prefs: {theme : "dark"}}
};

const next = {
    ...state,
    user: {
        ...state.user,
        prefs: {
            ...state.user.prefs,
            theme: "light",
        },
    },
};

// Scope

// Global Scope
var variable = 20;
function printVariable() {
    console.log(variable);
}

printVariable();

// Local Scope
function func() {
    var something = 20;
}
console.log(something);

// Lexical scope
function grandfather() {
    var name = 'Hammad';
    // likes is not accessible here
    function parent() {
        // name is accessible here
        // likes is not accessible here
        function child() {
            // Innermost level of the scope chain
            // name is also accessible here
            var likes = 'Coding';
        }
    }
}

// Block scope
if (true) {
    var variable = 20;
}

console.log(variable);

// Var properties
var username = 'Tyler';
var shouldFetch = true;

if (shouldFetch) {
    var username = 'Josh';
    fetch(username);
}
console.log(username);

// Async Tools: Promise
let myPromise = new Promise((resolve, reject) => {
    // some long function, or data fetch
    setTimeout(() => {
        console.log("this should print third");
        resolve();
    }, 500)
});

// Aynsc/Wait
myPromise.then(
    () => console.log("this should print fourth"),
    () => console.log("error")
);
console.log("this should print first");
console.log("this should print second");

let wait = () => {
    return new Promise(resolve => setTimeout(resolve, 500));
};

let slowFunction = async () => {
    // some long function, or data fetch
    await wait();
    console.log("this should print third");
};

slowFunction().then(
    () => console.log("this should print fourth")
    );
console.log("this should print first");
console.log("this should print second");