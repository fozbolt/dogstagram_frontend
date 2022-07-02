<template>
    <div v-if="auth.loaderState" >
        <div class="loader"></div>
        <div><strong>Validating</strong></div>
    </div>
</template>

<script>
import {Auth} from "@/services/index.js";

export default {
	name: 'Preloader',
	data(){
		return {
			//show: store.showLoader,
            auth: Auth.state,
		}
	},
    //  watch: {

    //     "store.showLoader": _.debounce(function(){this.show=this.store.showLoader}, 1000)
    // },

	mounted(){
		if(Boolean(this.show)) this.showToggle()
	},
	methods: {
		showToggle(){
			setTimeout(() => {
				this.show = false
			}, 117000)
		}
	}
}

</script>

<style>
body {
  height: 100vh;
  display: grid;
  place-items: center;
}

.loader {
  height: 5rem;
  width: 5rem;
  border-radius: 50%;
  border: 10px solid orange;
  border-top-color: #002147;
  box-sizing: border-box;
  background: transparent;
  animation: loading 1s linear infinite;
}

@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  0% {
    transform: rotate(360deg);
  }
}

</style>