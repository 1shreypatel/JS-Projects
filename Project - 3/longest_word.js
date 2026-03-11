let string = "Hello World";
let words = string.split(" ");
let longest = "";

console.log(words);

for (let i = 0; i < words.length; i++) {
    if (words[i].length > longest.length) {
        longest = words[i];
    }
}

console.log(`Longest word is ${longest}`);