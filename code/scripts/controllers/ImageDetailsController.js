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

        const model = {
            imageURL: '',
            commentTitle: {
                label: "Comment"
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

        this.imagesModel = new ImagesModel();
        this.model = this.setModel(this.imagesModel.toJSON());
        this.imagesModel.hydrate(this.model)
            .then(() => {
                console.log('poze?', this.model.images)
                console.log('a mers', this.model.selectedPhoto, '2')
                setImageURL.call(this);
            })
            .catch((err) => {
                console.log('nu a mers', err)})

        function setImageURL() {
            const selectedPhoto = this.model.selectedPhoto;

            for(const photo of this.model.images) {
                console.log('comparing', photo.imageName, selectedPhoto);;
                if(photo.imageName === selectedPhoto) {
                    const ab = _base64ToArrayBuffer(photo.imageData)
                    this.model.imageURL = arrayBufferToImageURL(ab);
                    break;
                }
            }
        }

        this.on('submit-comment', undefined, (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();

            console.log('gonna commit', this.model.comment.value);
            this.model.comments.push({comm: this.model.comment.value});
            this.imagesModel.save(this.model)
                .then(() => {
                    this.model.comment.value = '';
                    return this.imagesModel.hydrate(this.model);
                })
                .then(() => {

                })
                .catch(console.error);
        });

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
    }
}