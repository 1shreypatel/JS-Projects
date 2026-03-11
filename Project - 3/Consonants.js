let string = " Hello World";
let a = 0 , b = 0;

for (let i = 0; i < string.length; i++) {
    if (string[i] === "a" || string[i] === "e" || string[i] === "i" || string[i] === "o" || string[i] === "u") {
        a++;
    }
    else {
        b++;
    }
}

console.log(`Vowels: ${a} and Consonants: ${b}`);