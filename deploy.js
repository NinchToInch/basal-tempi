const fs = require('fs-extra');

const srcDir = './dist';
const destDir = './docs';

// Leere zuerst das Zielverzeichnis, kopiere dann die Dateien und lösche das Quellverzeichnis
fs.emptyDir(destDir)
    .then(() => fs.copy(srcDir, destDir))
    .then(() => fs.remove(srcDir)) // Lösche das /dist Verzeichnis
    .then(() => console.log('Deployment erfolgreich! Dateien wurden nach /docs verschoben und /dist wurde gelöscht.'))
    .catch(err => console.error('Deployment fehlgeschlagen:', err));
