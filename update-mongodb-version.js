const fs = require('fs');
const path = require('path');

// List of files to update
const filesToUpdate = [
  'apps/meteor/ee/server/services/package.json',
  'apps/meteor/package.json',
  'ee/apps/account-service/package.json',
  'ee/apps/authorization-service/package.json',
  'ee/apps/ddp-streamer/package.json',
  'ee/apps/omnichannel-transcript/package.json',
  'ee/apps/presence-service/package.json',
  'ee/apps/queue-worker/package.json',
  'ee/apps/stream-hub-service/package.json',
  'ee/packages/omnichannel-services/package.json',
  'ee/packages/presence/package.json',
  'packages/agenda/package.json',
  'packages/core-services/package.json',
  'packages/core-typings/package.json',
  'packages/cron/package.json',
  'packages/instance-status/package.json',
  'packages/model-typings/package.json',
  'packages/rest-typings/package.json',
  'packages/ui-contexts/package.json',
  'package.json'
];

// Old and new versions
const oldVersion = 'patch:mongodb@npm%3A4.17.2#~/.yarn/patches/mongodb-npm-4.17.2-40d1286d70.patch';
const newVersion = '^6.12.0';

// Function to update a file
const updateFile = (filePath) => {
  const fullPath = path.resolve(filePath);
  
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const updatedContent = content.replace(oldVersion, newVersion);
    fs.writeFileSync(fullPath, updatedContent, 'utf8');
    console.log(`Updated: ${filePath}`);
  } else {
    console.error(`File not found: ${filePath}`);
  }
};

// Process each file
filesToUpdate.forEach(updateFile);

console.log('Update completed.');
