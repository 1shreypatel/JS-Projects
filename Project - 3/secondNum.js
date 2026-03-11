let arr = [1,2,3,9,15,8,26,78,95,12,36,4,5];
let n = arr.length;

let sortedArr = arr.sort((a,b) => a - b);

console.log(sortedArr);

for(let i = 0; i <= n;i++){
    if(i == 0){
        console.log(sortedArr[i+1]);
    }
    if(i == n){
        console.log(sortedArr[i-2]);
    }
}
