<template>
    <div>
        <div class="row">
            <div class="col">
                <h1 class="text-center mb-5">This is a login page</h1>
            </div>
        </div>
        <div class="row">
            <div class="col"></div>
            <div class="col">
                <form @submit.prevent="login">
                    <div class="form-group">
                        <label for="exampleInputEmail1">Email address</label>
                        <input
                            v-model="username"
                            type="email"
                            class="form-control"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            placeholder="Enter email"
                        />
                        <small id="emailHelp" class="form-text text-muted">
                            We'll never share your email with anyone else.
                        </small>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input
                            v-model="password"
                            type="password"
                            class="form-control"
                            id="exampleInputPassword1"
                            placeholder="Password"
                        />
                    </div>
                    <div class="row pl-4 pr-4 d-flex justify-content-center" v-if="error_message">
				        <small style="color: red">{{error_message}}</small><br>
                    </div>
                    <button type="submit" class="btn btn-primary mt-5">Submit</button>
                </form>
            </div>
            <div class="col"></div>
        </div>
    </div>
</template>

<script>
import {Auth} from "@/services/index.js";
import store from '@/store.js';

export default {
    data() {
        return {
            username: '',
            password: '',
            error_message: false,
            store
        };
    },
    methods: {
        async login(){
			const result = await Auth.login({'username': this.username, 'password': this.password});
			
			if(result){
                this.store.username = 'getthisfrom localstorage or?'
                this.store.authenticated = true;
				this.username = null;
				this.password = null;
                
				this.$router.push('/');
			}
			else this.error_message = "Neuspjeli pokušaj prijave u sustav, molimo provjerite unesene podatke!";
		}
    },
    watch:{
		"error_message": _.debounce(function(){this.error_message = false}, 10000)
	},
    name:"Login" // da onda možemo router.push({name:''})
};
</script>
