domainRequire=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"./../../domain":[function(require,module,exports){
(function (Buffer){
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
}).call(this,require("buffer").Buffer)

},{"buffer":false,"crypto":false,"fs":false,"path":false}],"/Users/stefanromanescu/Faculty/PCD/Homework45/web-wallet/todo-app/builds/tmp/domain_intermediar.js":[function(require,module,exports){
(function (global){
global.domainLoadModules = function(){ 

	if(typeof $$.__runtimeModules["./../../domain"] === "undefined"){
		$$.__runtimeModules["./../../domain"] = require("./../../domain");
	}
};
if (true) {
	domainLoadModules();
}
global.domainRequire = require;
if (typeof $$ !== "undefined") {
	$$.requireBundle("domain");
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../domain":"./../../domain"}]},{},["/Users/stefanromanescu/Faculty/PCD/Homework45/web-wallet/todo-app/builds/tmp/domain_intermediar.js"])