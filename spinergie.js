const fs = require('fs');
// Module to set json data
const editJsonFile = require("edit-json-file");
// Original json file
const src = editJsonFile(`${__dirname}/src.json`);
// Build an array from the file with list of changes, each item beeing one change
const listChanges = fs.readFileSync(__dirname + '/changes.txt').toString().trim().split("\n");

changeValues(src, listChanges);

// Source = source file
// changes = array of changes
function changeValues(source, changes) {
    // Loop for each line in change file
    for(i in changes) {
        const line = changes[i];
        let count = 0,
            keyStart = 0,
            keyEnd = 0,
            valueStart = 0,
            valueEnd = 0;

        // Set keys to know where to cut the line in order to get values
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                switch(count) {
                    case 0: keyStart = i + 1; break;
                    case 1: keyEnd = i; break;
                    case 2: valueStart = i + 1; break;
                    case 3: valueEnd = i; break;
                }
                count++;
            }
        }

        const key = line.substring(keyStart, keyEnd);
        const value = line.substring(valueStart, valueEnd);

        // set values with only the part of line where data is
        src.set(key, value);
    }

    const file = JSON.stringify(src.get(), undefined, 2);

    // Write file to "result.json"
    fs.writeFile('result.json', file, (err) => {
        if (err) throw err;
        console.log('File result.json has been created');
    });
}
