<template>
    <div>
        <div class="row">
            <div class="col">
                <h1 class="text-center mb-5">Change your password</h1>
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
                        <label for="passwordField">Old password</label>
                        <input
                            v-model="oldPassword"
                            type="password"
                            class="form-control"
                            id="oldPasswordField"
                            placeholder="Password"
                        />
                    </div>
                    <div class="form-group">
                        <label for="passwordField">New password</label>
                        <input
                            v-model="newPassword"
                            type="password"
                            class="form-control"
                            id="newPasswordField"
                            placeholder="Password"
                        />
                    </div>
                    <div class="form-group">
                        <label for="confirmPasswordField">Confirm new password</label>
                        <input
                            v-model="confirmPassword"
                            type="password"
                            class="form-control"
                            id="confirmPasswordField"
                            placeholder="Confirm password"
                        />
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
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        };
    },
    mounted() {},
    methods: {
        async signup() {
        
            if (this.newPassword === this.confirmPassword) {
      
                const response = await Auth.changePassword({username: this.username, old_password:this.oldPassword, new_password:this.newPassword});
                
                if(response){
                    console.log(response)
                    this.username = {};
                    this.newPassword  =undefined
                    this.confirm_password = undefined;

                    this.$router.push('/');
                }
            }
                
			//else this.error_message = "Došlo je do greške tijekom registracije!";
		},
    }
};
</script>
