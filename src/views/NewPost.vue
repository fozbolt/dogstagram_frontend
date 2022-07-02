<template>
    <form @submit.prevent="postImage" class="mb-5">
        <div class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text" id="">Title</span>
            </div>
            <input v-model="title" type="text" class="form-control" />
        </div>
        
        <croppa :width="400" :height="400" v-model="imageData"></croppa>
        <div class="alert alert-warning" style="max-width:400px; padding:0; text-align:center; display:none;">
            <strong>Note:</strong> 
                Please upload photo of your dog or cat
        </div>
        <div class="center"><Preloader/></div>
        <button type="submit" class="btn btn-primary ml-2">Post image</button>
        
    </form>
    
</template>

<script>
import { Posts, Auth } from '@/services';
import store from '@/store.js';
import { asyncLoading } from 'vuejs-loading-plugin'
import Preloader from '@/components/Preloader.vue';
import $ from 'jquery'

export default {
    data() {
        return {
            store,
            imageData: null,
            title: ''
        };
    },
    name: 'newpost',
    components: {
    "Preloader": Preloader,
    },
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


        blobToBase64(blob) {
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
        },

        async postImage() {
            let blobData = await this.getImageBlob();

            //this.$loading(true) // ukljuciti ovo za loder br 2. (kroz cijeli ekran)
            this.store.showLoader = true;

            let base64_img = await this.blobToBase64(blobData)
            let isValidated = await Posts.validateImage(base64_img);
        
            if (isValidated){
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

                
                let newpost = new Promise( (resolve, reject) => {
                    Posts.create(post);
                })
                asyncLoading(newpost).then(this.$loading(false)).catch(); //for loader v2
                
                this.imageData = null;
                this.$router.push({ name: 'posts' });
                }   

            else{
                this.$loading(false) //for loader v2
                $('.alert').fadeIn();
                console.log('Please upload dog or cat picture')      
                }

                this.store.showLoader = false;
                
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

.center {
margin: auto;
width:20%; /*glupo*/
/*border: 5px solid #FFFF00;*/
padding: 10px;
align-items: center;
}
</style>
