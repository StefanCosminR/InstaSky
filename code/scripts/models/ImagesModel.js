export default class ImagesModel {

    constructor() {
        this.data = {
            isLoading: false,
            loadingFinished: false,
            entities: [
                // { name: 'aaa' }
            ],
            images: [
                // { imageName: 'string', imageData: 'base64String' }
            ]
        };

    }

    hydrate(model) {
        return fetch('/download/data/images.json')
            .then((response) => {
                if (!response.ok) {
                    return;
                }

                return response.json().then((data) => {
                    model.images = data.images;
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