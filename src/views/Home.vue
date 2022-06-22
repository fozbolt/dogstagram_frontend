<template>
    <div class="row">
        <div class="col-sm-12 col-md-8">
            <router-link :to="{ name: 'newpost' }">
                <button type="Novi post" style="margin-bottom: 10px" class="btn btn-primary btn-block d-md-none">
                    Post new image
                </button>
            </router-link>
            <router-view :term="term" />
        </div>
        <div class="col-4">
            <!-- <span v-if="auth.authenticated">
                empty placeholder for maintaining column state
                 Current account: {{this.auth.user_data.username  }} 
                <br />
                <br />
            </span> -->
            <router-link :to="{ name: 'newpost' }" v-if="$route.name!=='newpost'">
                <button type="Novi post" class="btn btn-primary btn-block d-none d-md-block">Post new image</button>
            </router-link>
        </div>
    </div>
</template>

<script>
import store from '@/store.js';
import {Auth} from "@/services/index.js";

export default {
    props: ['term'],
    data() {
        return{
           ...store,
           auth: Auth.state,
        }
    },
    name: 'home'
    
};
</script>
