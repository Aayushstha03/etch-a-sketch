let counter = 2;
for (let i = 0; i <= Math.floor(Math.random() * (10 - 5 + 1) + 5); i += 2) {
    counter = 2
    for (let j = 0; j <= i; j++) {
        if (j == 0)
            console.log(Math.pow(2, j))
        else {
            if (j <= Math.round(i / 2)) {
                // console.log("first case")
                console.log(Math.pow(2, j))
            }
            else {
                // console.log("second case")
                console.log(Math.pow(2, j - counter))
                counter += 2
            }
        }
    }
    console.log("\n")
}