//Add domain specific code here

const photosUploadFolderPath = './photo-uploads';
const commentsUploadFolderPath = './photo-comments';

$$.swarms.describe("FileManager", {
    writeFile: function (fileName, encodedContents) {
        const fs = require('fs');
        const path = require('path');
        const crypto = require('crypto');
        const regex = /^data:.+\/(.+);base64,(.*)$/;

        const matches = encodedContents.match(regex);
        const ext = matches[1];
        const data = matches[2];
        const buffer = Buffer.from(data, 'base64');

        fs.stat(photosUploadFolderPath, (err) => {
            if (err) {
                fs.mkdir(photosUploadFolderPath, (err) => {
                    if (err) {
                        this.return(err);
                        return;
                    }

                    writeFile.call(this);
                })
            } else {
                writeFile.call(this);
            }
        })

        function writeFile() {
            fs.writeFile(path.join(photosUploadFolderPath, makeFileName(fileName)), buffer, (err) => {
                if (err) {
                    return this.return(err);
                }

                this.return(undefined, "OK");
            });
        }

        /** @param{string} originalFileName */
        function makeFileName(originalFileName) {
            const randomId = makeId(12);
            let extensionLocation = originalFileName.lastIndexOf('.');
            originalFileName.substring(extensionLocation);
            let fileNameWithoutExtension = originalFileName.substring(0, extensionLocation);
            let extension = originalFileName.substring(extensionLocation + 1);

            function makeId(length) {
                let result = '';
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                const charactersLength = characters.length;
                for (let i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            }

            return `${randomId}.${extension}`;
        }
    },
    readFileNames: function () {
        const fs = require('fs');

        fs.readdir(photosUploadFolderPath, (err, files) => {
            if (err) {
                return this.return(err);
            }

            this.return(undefined, files);
        })
    },
    readFile: function (fileName) {
        const fs = require('fs');
        const path = require('path');

        fs.readFile(path.join(photosUploadFolderPath, fileName), {encoding: 'base64'}, (err, fileContents) => {
            if (err) {
                return this.return(err);
            }

            this.return(undefined, fileContents.toString('base64'));
        });
    }
});

$$.swarms.describe("CommentsManager", {
    commentForPhoto: function (photoName, comment) {
        const path = require('path');
        const fs = require('fs');

        fs.stat(commentsUploadFolderPath, (err) => {
            if (err) {
                fs.mkdir(commentsUploadFolderPath, (err) => {
                    if (err) {
                        this.return(err);
                        return;
                    }

                    addComment.call(this);
                })
            } else {
                addComment.call(this);
            }
        })

        function addComment() {
            const photoCommentsPath = path.join(commentsUploadFolderPath, photoName) + '.txt';

            fs.appendFile(photoCommentsPath, comment + '\n', (err) => {
                if (err) {
                    return this.return(err);
                }

                this.return();
            })
        }
    },
    getCommentsForPhoto: function (photoName) {
        const path = require('path');
        const fs = require('fs');

        const photoCommentsPath = path.join(commentsUploadFolderPath, photoName) + '.txt';

        fs.stat(commentsUploadFolderPath, (err) => {
            if (err) {
                return this.return(undefined, []);
            }

            fs.stat(photoCommentsPath, (err) => {
                if (err) {
                    return this.return(err);
                }

                fs.readFile(photoCommentsPath, 'utf8', (err, contents) => {
                   if(err) {
                       return this.return(err);
                   }

                   contents = contents.split('\n').filter(comment => comment !== '');

                   this.return(undefined, JSON.stringify(contents));
                });
            })

        })
    }
})

$$.swarms.describe("Echo", {
    say: function (input) {
        this.return(undefined, 'Hello ' + input);
    }
})