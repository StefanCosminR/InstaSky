import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";

class ImagesModel {

    constructor() {
        this.data = {
            isLoading: false,
            loadingFinished: false,
            entities: [
                // { name: 'aaa' }
            ],
            images: [
                // { imageName: 'string', imageData: 'base64String' }
            ],
            selectedPhoto: '',
            imageURL: '',
            commentTitle: {
                label: ""
            },
            comment: {
                label: "Comment",
                name: "comment",
                required: false,
                placeholder: "Leave a comment",
                value: ''
            },
            comments: []
        };

    }

    hydrate(model) {
        return fetch('/download/data/images.json')
            .then((response) => {
                if (!response.ok) {
                    return;
                }

                return response.json().then((data) => {
                    console.log('getting some data 1324', data);
                    model.images = data.images;
                    model.selectedPhoto = data.selectedPhoto
                    model.comments = data.comments || []
                })
            })
            .catch((err) => {
                console.error(err);
            })

    }

    getJsonResponseBody(response) {
        return response.json((result) => {
            return result;
        }).catch((err) => {
            return Promise.resolve({});
        })
    };

    save(data) {
        const errors = [];

        this.data.images = data.images;
        this.data.selectedPhoto = data.selectedPhoto
        this.data.comments = data.comments
        console.log('saving with comments', data.comments);

        const profileFile = new File([JSON.stringify(this.data)], "images.json");

        const url = `/upload?path=/data&filename=${profileFile.name}`;

        return fetch(url, {
            method: 'POST',
            body: profileFile
        }).then((response) => {
            return this.getJsonResponseBody(response).then((data) => {
                if (!response.ok || response.status != 201) {
                    let errorMessage = '';
                    if (Array.isArray(data) && data.length) {
                        errorMessage = `${data[0].error.message}. Code: ${data[0].error.code}`;
                    } else {
                        errorMessage = data.message ? data.message : JSON.stringify(data);
                    }
                    return Promise.reject(new Error(`Unable to save profile. ${errorMessage}`));
                }

                if (Array.isArray(data)) {
                    for (const item of data) {
                        if (item.error) {
                            return Promise.reject(new Error(`Unable to upload ${item.file.name} due to an error. Code: ${item.error.code}. Message: ${item.error.message}`));
                        }
                    }
                }
            });
        });
    }

    toJSON() {
        return this.data;
    }
}


export default class HomePageController extends ContainerController {
    constructor(element) {
        super(element);
        console.log("A MERS ACEST CONTROLLER");

        this.imagesModel = new ImagesModel();
        this.model = this.setModel(this.imagesModel.toJSON());
        this.imagesModel.hydrate(this.model)
            .then(() => console.log('a mers n'))
            .catch((err) => {
                console.log('nu a mers', err)
            })
        const filesName = [];

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

        this.on("chooseFile", undefined, (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();

            const reader = new FileReader();

            this.model.isLoading = true;
            this.model.loadingFinished = false;

            reader.addEventListener("load", () => {
                const fileName = makeFileName(e.data[0].name)

                this.model.images.push({
                    imageName: fileName,
                    imageData: getBase64Image(reader.result)
                });

                this.imagesModel.save(this.model)
                    .then(() => {
                        this.model.isLoading = false;
                        this.model.loadingFinished = true;
                        console.log('saved')
                    })
                    .catch(err => console.error('failed to save', err))
            }, false);

            reader.readAsDataURL(e.data[0])
        })

        this.on('get-photos', undefined, (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();

            this.imagesModel.hydrate(this.model)
                .then(() => {
                    console.log('a mers', this.model.images)
                    this.model.images.forEach(image => {
                        this.model.entities.push({
                                name: arrayBufferToImageURL(_base64ToArrayBuffer(image.imageData)),
                                photoName: image.imageName
                            }
                        );
                    })
                })
                .catch((err) => {
                    console.log('nu a mers', err)
                })
        })

        this.on('photo-details', undefined, (event) => {
            console.log('args', event.data);
            this.model.selectedPhoto = event.data;
            this.imagesModel.save(this.model)
                .then(() => console.log('saved'))
                .catch((err) => console.error("ups", err));
            // window.location.href = "http://127.0.0.1:8080/image-details?image=" + event.data

            // document.location.href = "http://127.0.0.1:8080/image-details";
        })


        function arrayBufferToImageURL(arrBuf) {
            const arrayBufferView = new Uint8Array(arrBuf);
            const blob = new Blob([arrayBufferView], {type: "image/jpeg"});
            const urlCreator = window.URL || window.webkitURL;
            const imageUrl = urlCreator.createObjectURL(blob);

            return imageUrl
        }

        function _base64ToArrayBuffer(base64) {
            const binary_string = window.atob(base64);
            const len = binary_string.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        }

        function getBase64Image(img) {
            return img.replace(/^data:image\/(png|jpg);base64,/, "");
        }
    }
}