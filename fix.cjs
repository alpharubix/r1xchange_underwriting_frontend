const fs = require('fs');

const iconv = require('iconv-lite');

function fixFile(file) {
    let content = fs.readFileSync(file);
    // Remove BOM if present
    if (content[0] === 0xEF && content[1] === 0xBB && content[2] === 0xBF) {
        content = content.slice(3);
    }
    const text = content.toString('utf8');
    
    // Convert string to windows-1252 buffer
    const buf = iconv.encode(text, 'win1252');
    
    // Decode that buffer as utf8
    const fixedText = buf.toString('utf8');
    
    // Check if fixedText has replacement characters, meaning the decode failed
    if (fixedText.includes('\uFFFD')) {
        // Just return if it fails, maybe not corrupted in this way
        return false;
    }
    
    if (text !== fixedText) {
        fs.writeFileSync(file, fixedText, 'utf8');
        console.log('Fixed', file);
        return true;
    }
    return false;
}

const files = require('child_process').execSync('dir /s /b *.tsx *.ts').toString().split('\r\n').filter(Boolean);
let fixedCount = 0;
for (const file of files) {
    try {
        if(fixFile(file)) fixedCount++;
    } catch(e) {
        // ignore files that cannot be decoded back
    }
}
console.log('Total fixed:', fixedCount);
