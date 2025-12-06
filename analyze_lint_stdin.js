
const fs = require('fs');

let data = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    data += chunk;
});

process.stdin.on('end', function () {
    try {
        const jsonStart = data.indexOf('[');
        const jsonEnd = data.lastIndexOf(']') + 1;
        if (jsonStart === -1 || jsonEnd === 0) {
            console.log("No JSON found");
            return;
        }
        const jsonStr = data.substring(jsonStart, jsonEnd);
        const report = JSON.parse(jsonStr);

        report.forEach(file => {
            if (file.messages.length > 0) {
                console.log(`File: ${file.filePath}`);
                // Show only first 3 messages
                file.messages.slice(0, 3).forEach(msg => {
                    console.log(`  ${msg.line}:${msg.column} [${msg.severity === 2 ? 'Error' : 'Warning'}] ${msg.message} (${msg.ruleId})`);
                });
                if (file.messages.length > 3) {
                    console.log(`  ... and ${file.messages.length - 3} more`);
                }
            }
        });
    } catch (e) {
        console.error('Error parsing JSON:', e);
    }
});
