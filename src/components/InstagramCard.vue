<template>
    <div class="card text-center">
        <div class="card-header text-left">
            {{ info.title }} by
            <strong>{{ info.username }}</strong>
        </div>
        <div class="card-body">
            <img
                class="card-img-top"
                :src="info.url"
                alt="Uploaded image"
            />
        </div>
        <div class="card-footer text-left">
            <div>{{ timeAgo }}</div>

            <div v-if="showcomments">
                <!--comments-->
                <div class="comments list-group">
                    <div
                        :key="c.posted_at"
                        v-for="c in info.comments"
                        href="#"
                        class="animate list-group-item list-group-item-action flex-column align-items-start"
                        style="padding: 15px 0 0 0; margin-top: 5px; border:none;"
                    ><div style="padding: 0px 15px 15px 15px">
                        <div class="d-flex w-100 justify-content-between">
                            <small style="width:60%;">{{ formatTime(c.posted_at) }} by {{ c.username }}</small>  

                                <small v-if="isReplyCommentOpen==false"> <a @click="openReply(c.id)" style="margin-left:30px">Reply</a></small>
                                <small v-if="!isReplyCommentOpen==='' || isReplyCommentOpen===true"> <a @click="openReply(c.id)" style="margin-left:10px">Close reply</a></small>

                                <small v-if="isEditCommentOpen==false && auth.user_data.username === c.username"> <a @click="openEdit(c.id, c.comment)" style="margin-left:30px">Edit</a></small>
                                <small v-if="!isEditCommentOpen==='' || isEditCommentOpen===true && auth.user_data.username === c.username"> <a @click="openEdit(c.id)" style="margin-left:10px">Close Edit</a></small>  
                    
                            <small v-if="auth.user_data.username === c.username"> <a @click="removeComment(c.id)" href="#" style="margin-left:30px">Delete</a></small>
                        </div>
                        <span v-if="!isEditCommentOpen">{{ c.comment }}</span>
                        <!--open form if clicked on edit-->
                        <form v-if="isEditCommentOpen && c.id===editId" @submit.prevent="changeComment('main', c.id)" class="form-inline mb-0">
                                    <div class="inputDiv repliesDiv">                               
                                       <input style="width:100%;"
                                            v-model="editComment"
                                            type="text"
                                            class="form-control"
                                            id="postReplyButton"
                                        />
                                    </div>
                                 
                                    <button type="submit" class="btn btn-primary ml-1 pl-1 pr-1 pt-0 pb-0">Post</button>
                            </form>
                               
                    </div>
                        <!--comment replies-->
                        <template>
                            <div v-for="reply in c.replies"  class="replyLoop">
                                <div  class="repliesDiv" >
                                    <div class="d-flex w-100 justify-content-between"  >
                                        <small style="width:60%;" > Replied {{ formatTime(reply.posted_at) }} by {{ reply.username }}</small>
                                        
                                        <small v-if="isEditReplyOpen==false && auth.user_data.username === reply.username"> <a @click="openEditReply(reply._id)" style="margin-left:30px">Edit</a></small>
                                        <small v-if="!isEditReplyOpen==='' || isEditReplyOpen===true && auth.user_data.username === reply.username"> <a @click="openEditReply(reply._id)" style="margin-left:10px">Close Edit</a></small>      
                                        
                                        <small v-if="auth.user_data.username === reply.username"> <a @click="removeReply(reply._id, reply._id)" href="#" style="margin-left:30px">Delete</a></small>
                                    </div>
                                
                                    <span v-if="!isEditReplyOpen"> {{ reply.comment }}</span>
                                        <!--open form if clicked on edit-->
                                    <form v-if="isEditReplyOpen && reply._id===editReplyId" @submit.prevent="changeComment('reply', reply._id)" class="form-inline mb-0">
                                        <div class="inputDiv repliesDiv">                               
                                            <input style="width:100%;"
                                                    v-model="editReply"
                                                    type="text"
                                                    class="form-control"
                                                    id="postReplyButton"
                                                />
                                        </div>
                                        
                                        <button type="submit" class="btn btn-primary ml-1 pl-1 pr-1 pt-0 pb-0">Post</button>
                                    </form>
                                </div>
                            </div>
                        </template>
                        <!--add reply-->
                         <template>
                            <div v-if="isReplyCommentOpen && commentId===c.id" style="background-color: rgba(0,0,0,.03); ">
                                <form @submit.prevent="postComment('reply', c.id)" class="form-inline mb-5">
                                    <div class="inputDiv">                               
                                       <input style="width:100%;"
                                            v-model="replyComment"
                                            type="text"
                                            class="form-control"
                                            id="postButton"
                                            placeholder="Any comment?"
                                        />
                                    </div>
                                    <button type="submit" class="btn btn-primary ml-1 pl-1 pr-1 pt-0 pb-0">Post</button>
                                </form>
                            </div>
                        </template>
                    </div>
                    
                </div>

                <form @submit.prevent="postComment('main')" class="form-inline mb-5">
                    <div class="form-group">
                        <input
                            v-model="newComment"
                            type="text"
                            class="form-control"
                            id="postButton"
                            placeholder="Any comment?"
                        />
                    </div>
                    <button type="submit" class="btn btn-primary ml-2">Post</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import store from '@/store.js';
import { Posts, Auth } from '@/services';

export default {
    props: ['info', 'showcomments'],
    data() {
        return {
            global: store,
            auth: Auth.state,
            newComment: '',
            replyComment: '',
            isReplyCommentOpen:'',
            replies:'',
            commentId: '',
            isEditCommentOpen: '',
            editComment:'',
            editId:'',
            isEditReplyOpen: '',
            editReply:'',
            editReplyId:'',


 
        };
    },
    methods: {
        async refresh() {
            let post = await Posts.getOne(this.info.id);
            this.info.comments = post.comments;
        },
        formatTime(t) {
            return moment(t.posted_at).fromNow();
        },
        async removeComment(commentId) {
            let postId = this.info.id;
            await Posts.Comments.deleteComment(postId, commentId);
            this.refresh();
        },

        async removeReply(commentId, replyId) {
            let postId = this.info.id;
            await Posts.Comments.deleteReply(postId, commentId, replyId);
            this.refresh();
        },

        //redundant code - needs refactoring
        async postComment(type, id=undefined) {
           
            if (this.newComment && type==='main') {
                let postId = this.info.id;
                let comment = {
                    username: this.auth.user_data.username,
                    comment: this.newComment,
                };
       
                try {
                    await Posts.Comments.addComment(postId, comment);
                    this.refresh();
                } catch (e) {
                    console.error('Greška prilikom snimanja komentara', e);
                } finally {
                    this.newComment = '';
                }
            }

            else if (this.replyComment && type==='reply'){
               
                let postId = this.info.id;
                let comment = {
                    username: this.auth.user_data.username,
                    comment: this.replyComment,
                };

                try {
                    await Posts.Comments.addReply(postId, comment, id);
                    this.refresh();
                } catch (e) {
                    console.error('Greška prilikom snimanja komentara', e);
                } finally {
                    this.replyComment = '';
                    this.isReplyCommentOpen = '';
                }
        
            }
        },
        async openReply(id){
            if (this.isReplyCommentOpen===true) this.isReplyCommentOpen = false;
            else this.isReplyCommentOpen = true
                
            this.editReplyId=id
        },

        async openEditReply(id){
            if (this.isEditReplyOpen===true) this.isEditReplyOpen = false;
            else this.isEditReplyOpen = true
                
            this.editReplyId=id
        },

        //redundant
        async openEdit(id, comment){
            if (this.isEditCommentOpen===true) this.isEditCommentOpen = false;
            else this.isEditCommentOpen = true

            this.editComment= comment
            this.editId=id
        },


        // redundant code - needs refactoring
        async changeComment(type, id=undefined) {
           
            if (this.newComment && type==='main') {
                let postId = this.info.id;
                let comment = {
                    commentId: this.editComment,
                    comment: this.editComment,
                };

                try {
                    await Posts.Comments.changeComment(postId, comment);
                    this.refresh();
                } catch (e) {
                    console.error('Greška prilikom snimanja komentara', e);
                } finally {
                    this.newComment = '';
                }
            }

            else if (this.replyComment && type==='reply'){
                console.log('tu')
                let postId = this.info.id;
                let comment = {
                    username: this.auth.user_data.username,
                    comment: this.replyComment,
                };

                try {
                    await Posts.Comments.changeReply(postId, comment, id);
                    this.refresh();
                } catch (e) {
                    console.error('Greška prilikom snimanja komentara', e);
                } finally {
                    this.replyComment = '';
                    this.isReplyCommentOpen = '';
                }
        
            }

            //mozemo sve obrisati bolje je tako
            this.editComment=''
            this.editId= ''
            this.replyId=''
            this.replyComment
        },
        
    },
    computed: {
        timeAgo() {
            return moment(this.info.posted_at).fromNow();
        },
    },



};
</script>

<style>
.card {
    margin-bottom: 10px;
}
.comments {
    margin: 20px 0;
}

.inputDiv{
    width:60%;
    background-color:white; 
    padding: 15px 20px 15px 30px; 
    border-top: solid 1px aliceblue;  
    border-radius: 0 0 60px 0; 

}

.repliesDiv{
    background-color:white; 
    padding: 15px 20px 15px 30px; 
    border-top: solid 1px aliceblue;  
    border-radius: 0 0 60px 0; 

}


.replyLoop:last-of-type {
    background-color: rgba(0,0,0,.03);
}

/* ----------------------------------------------
  * Generated by Animista on 2020-1-3 19:19:35
  * Licensed under FreeBSD License.
  * See http://animista.net/license for more info. 
  * w: http://animista.net, t: @cssanimista
  * ---------------------------------------------- */
@-webkit-keyframes fade-in-fwd {
    0% {
        -webkit-transform: translateZ(-80px);
        transform: translateZ(-80px);
        opacity: 0;
    }
    100% {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        opacity: 1;
    }
}
@keyframes fade-in-fwd {
    0% {
        -webkit-transform: translateZ(-80px);
        transform: translateZ(-80px);
        opacity: 0;
    }
    100% {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        opacity: 1;
    }
}
.animate {
    -webkit-animation: fade-in-fwd 1s cubic-bezier(0.39, 0.575, 0.565, 1) both;
    animation: fade-in-fwd 1s cubic-bezier(0.39, 0.575, 0.565, 1) both;
}



</style>
