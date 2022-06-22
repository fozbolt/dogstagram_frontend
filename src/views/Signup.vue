<template>
    <div>
        <div class="row">
            <div class="col">
                <h1 class="text-center mb-5">Sign up for our instagram clone</h1>
            </div>
        </div>
        <div class="row">
            <div class="col"></div>
            <div class="col">
                <form @submit.prevent="signup">
                    <div v-if="errorMessage" class="alert alert-danger">
                        <strong>Ups!</strong>
                        {{ errorMessage }}
                    </div>
                    <div class="form-group">
                        <label for="emailField">Email address</label>
                        <input
                            v-model="username"
                            type="email"
                            class="form-control"
                            id="emailField"
                            aria-describedby="emailHelp"
                            placeholder="Enter email"
                        />
                        <small id="emailHelp" class="form-text text-muted">
                            We'll never share your email with anyone else.
                        </small>
                    </div>
                    <div class="form-group">
                        <label for="passwordField">Password</label>
                        <input
                            v-model="password"
                            type="password"
                            class="form-control"
                            id="passwordField"
                            placeholder="Password"
                        />
                    </div>
                    <div class="form-group">
                        <label for="confirmPasswordField">Confirm Password</label>
                        <input
                            v-model="confirmPassword"
                            type="password"
                            class="form-control"
                            id="confirmPasswordField"
                            placeholder="Confirm password"
                        />
                    </div>
                    <div class="form-group">
                        <label for="tipProfila">Tip profila</label>
                        <select v-model="odabraniTipProfila" id="tipProfila" class="form-control form-control-lg">
                            <option v-for="k in tipProfila">{{ k }}</option>
                        </select>
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

export default {
    data() {
        return {
            errorMessage: '',
            username: '',
            password: '',
            confirmPassword: '',
            tipProfila: ['Javni', 'Privatni'],
            odabraniTipProfila: ''
        };
    },
    mounted() {},
    methods: {
        async signup() {
        
            if (this.password === this.confirmPassword) {
      
                const response = await Auth.register({username: this.username, password:this.password, profileType:this.odabraniTipProfila});
                console.log(response)
                if(response){
                    this.username = {};
                    this.password  =undefined
                    this.confirm_password = undefined;

                    this.$router.push('/');
                }
            }
                
			//else this.error_message = "Došlo je do greške tijekom registracije!";
		},
    }
};
</script>
