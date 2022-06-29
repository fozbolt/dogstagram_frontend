<template>
    <form @submit.prevent="postImage" class="mb-5">
        <div class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text" id="">Title</span>
            </div>
            <input v-model="title" type="text" class="form-control" />
        </div>
        <croppa :width="400" :height="400" v-model="imageData"></croppa>
        <button type="submit" class="btn btn-primary ml-2">Post image</button>
    </form>
</template>

<script>
import { Posts, Auth } from '@/services';
import store from '@/store.js';
import { asyncLoading } from 'vuejs-loading-plugin'

export default {
    data() {
        return {
            store,
            imageData: null,
            title: ''
        };
    },
    name: 'newpost',
    methods: {
        getImageBlob() {
            // Advanced: kako omotati klasičnu callback funkciju u Promise
            return new Promise((resolve, reject) => {
                this.imageData.generateBlob(blobData => {
                    if (blobData != null) {
                        resolve(blobData);
                    } else {
                        reject('Error with getting image.');
                    }
                });
            });
        },

        async postImage() {
            let blobData = await this.getImageBlob();
            let isValidated = await Posts.validateImage('testttic');

            let imageName = this.store.userEmail + '/' + Date.now() + '.png';
            let result = await storage.ref(imageName).put(blobData);
            let url = await result.ref.getDownloadURL();
            let post = {
                createdBy: Auth.getUser().username,
                postedAt: Date.now(),
                source: url,
                title: this.title
            };

            
            //let newpost = await Posts.create(post);
            //console.log('Spremljeni post', newpost.data);
            this.$loading(true)
            let newpost = new Promise( (resolve, reject) => {
                Posts.create(post);
            })
            asyncLoading(newpost).then(this.$loading(false)).catch();
            
            

            this.imageData = null;
            this.$router.push({ name: 'posts' });
        },
    
    }
};
</script>

<style lang="scss">
.card-body {
    padding: 0px;
}

img:hover {
    cursor: pointer;
}

.btn-post {
    width: 200px;
}

.croppa-container {
    border: 3px dashed gray;
    width: 400px;
    display: block;
    margin-bottom: 10px;
}

.input-group {
    margin-bottom: 20px;
}
</style>
