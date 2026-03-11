let num = 7, count = 0;

for (let i = 1; i <= num; i++) {
    if (num % i == 0) {
        count++;
    }
}

if (count % 2 == 0) {
    console.log("Prime");
}
else {
    console.log("Not Prime");
}