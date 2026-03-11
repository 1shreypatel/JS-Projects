let a = "hert";
let b = "erth";

let sortA = a.split("").sort().join("");
let sortB = b.split("").sort().join("");

if (sortA === sortB) {
    console.log("Anagrams");
}
else {    
    console.log("Not Anagrams");
}