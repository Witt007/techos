
const fs = require('fs');

try {
    // Read as UTF-16LE if possible, or let Node handle it (Node fs.readFileSync usually expects UTF8 but can handle BOM)
    // PowerShell > creates UTF-16LE with BOM usually.
    const content = fs.readFileSync('lint_report.json', 'utf16le');
    const report = JSON.parse(content);

    report.forEach(file => {
        if (file.messages.length > 0) {
            console.log(`File: ${file.filePath}`);
            file.messages.forEach(msg => {
                console.log(`  ${msg.line}:${msg.column} [${msg.severity === 2 ? 'Error' : 'Warning'}] ${msg.message} (${msg.ruleId})`);
            });
        }
    });
} catch (e) {
    console.error('Error reading/parsing report:', e);
}
