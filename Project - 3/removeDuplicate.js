let arr = [1, 2, 2, 3, 4, 1, 5];
let unique = [];
let len = arr.length;

for (let i = 0; i < len; i++) {
    if (unique.indexOf(arr[i]) === -1) {
        unique.push(arr[i]);
    }
}

console.log(unique);