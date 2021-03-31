const fs = require('fs');

const BLOCKED_FILENAMES = ['.DS_Store'];
const FOLDER = 'emojis/';


function notBlocked(filename){
  return !BLOCKED_FILENAMES.includes(filename);
}

let readme = `
# slack-emoji
:suspect: My slack emoji collection and download script

First, install dependencies:
\`\`\`sh
npm i
\`\`\`

Second, [create a slack app](https://api.slack.com/apps), add it to your workspace, add \`emoji:read\` user token scope and put the \`User OAuth Token\` into \`config.json\`

To download emojis from your slack team run:
> don't forget to create config.json, see [config.example.json](config.example.json)

\`\`\`sh
npm start
\`\`\`

To generate preview for readme run:
\`\`\`sh
npm run generate-md
\`\`\`

---
`


fs.readdir(FOLDER, (err, categories) => {
  categories.filter(notBlocked).sort().forEach(category => {
    const files = fs.readdirSync(`${FOLDER}${category}`);
    readme += `\n## ${category}\n\n`;
    files.filter(notBlocked).sort().forEach(file => {
      readme += `![${file}](${FOLDER + category}/${file})\n`;
    });
  });

  fs.writeFile("./README.md", readme, err => {
    if(err) {
        return console.error(err);
    }

    console.log("The readme was saved!")
  });
});
