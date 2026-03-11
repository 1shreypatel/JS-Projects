let arr = [10, 20, 30, 40, 50];
let k = 3;
let n = [];

for (let i = k; i < arr.length; i++) {
    
    n[i] = arr[i];
}
for (let i = 0; i < k; i++) {
    
    n[i] = arr[i];
}

console.log(n);