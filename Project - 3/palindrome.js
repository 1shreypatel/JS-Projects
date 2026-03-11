let a = "naman";
let b = a.split("").reverse().join("");

if (a === b) {
    console.log("Palindrome");
}
else {
    console.log("Not a Palindrome");
}