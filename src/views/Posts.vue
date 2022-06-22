<template>
    <div>
        <div @click="gotoDetails(card)" :key="card.id" v-for="card in cards">
            <InstagramCard :info="card" />
        </div>
    </div>
</template>

<script>
import _ from 'lodash';
import { Posts } from '@/services';
import InstagramCard from '@/components/InstagramCard.vue';
import store from '@/store.js';

export default {
    data() {
        return {
            store,
            cards: []
        };
    },
    watch: {
        'store.searchTerm': _.debounce(function(val) {
            this.fetchPosts(val);
        }, 500)
    },
    created() {
        this.fetchPosts();
    },
    name: 'posts',
    methods: {
        async fetchPosts(term) {
            term = term || store.searchTerm;
            
            let result = await Posts.getAll(term)
        
            //this.cards = Array.isArray(result) ? result.sort((a, b) => a.posted_at.localeCompare(b.posted_at)) : result;
            this.cards = _.sortBy( result, 'posted_at' ).reverse();
      
        },
        gotoDetails(card) {
            this.$router.push({ path: `post/${card.id}` });
        }
    },
    components: {
        InstagramCard
    }
};
</script>

<style scoped>
button {
    margin-bottom: 20px;
}
</style>
