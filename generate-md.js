const folder = 'emojis/';

console.log('Copy the text below to readme:\n\n---\n')

require('fs').readdir(folder, (err, files) => {
  files.forEach(file => {
    console.log(`![${file}](${folder+file})`);
  });
});
