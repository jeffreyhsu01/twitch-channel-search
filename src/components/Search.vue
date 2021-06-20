<template>
    <div id = "init">
        <input type = "text" v-model="channel_name" class= "form-input form-input-large form-padded-right w-input" placeholder="Enter your Twitch name...">
        <button @click= "fetchuserid()">Submit</button>  
    </div>
    
    <div id = "result" v-if="followers" > 
        <h3> {{ followers }} followers</h3>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                channel_name: '',
                user_id: null,
                followers: null,
            }
        },
        methods:{
            fetchuserid(){ 

                //check if the input string is a valid twitch username
                if (!this.channel_name.match("^[A-Za-z0-9_]+$")){
                    this.channel_name = "Please try again";
                    this.followers = "(Invalid username) No";
                    return;
                }
                this.followers = "Loading"

                //fetch follower count
                fetch('http://localhost:2000/get_user_id/users?login=' + `${this.channel_name}`)
                    .then(res => res.json())
                    .then(data => { this.user_id = data;
                        if (this.user_id == "-1" ){
                            this.followers = "(Channel not found) No"
                            return;
                        }
                    return fetch('http://localhost:2000/get_followers/users/follows?to_id=' + `${this.user_id}`);
                    })
                        .then(res => res.json())
                        .then(data => {
                            this.followers = data.total;
                            if (this.followers == 0){
                                this.followers = "No ";
                            }
                        })      
            }
        }
    }
</script>

<style>

    input{
        font-family: Inter,sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #12141d;
        margin-top: 10%;
        height: 20%;
        width: 40%;
        border-width: 1px;
    }

    input[type = "text"]{
        font-family: Inter,sans-serif;
        -webkit-font-smoothing: antialiased;
        font-size: 16px;
        font-weight: 600;
        margin-right: 10px;
        text-indent: 100px;
    }


    
    .form-input {
    height: 48px;
    margin-bottom: 0;
    padding-right: 20px;
    padding-left: 20px;
    border: 1px #000;
    border-radius: 6px;
    background-color: hsla(0,0%,100%,.1);
    transition: background-color .2s ease;
    color: #fff;
     margin-bottom: 1%;
    }

    button{
    border: 2px solid transparent;
    border-radius: 6px;
    background-color: #3c5ccf;
    box-shadow: inset 0 0 20px 20px transparent;
    transition: box-shadow .2s ease;
    font-weight: 600;
    color: white;
    font-family: Inter,sans-serif;
    cursor: pointer;
    padding-right: 24px;
    padding-left: 24px;
    height: 48px;
    }

    button:hover{
        background-color: #3653bd;
    }

    #result{
        background-color: hsla(0,0%,100%,.1);
        border-radius: 6px;
        height: 48px;
        margin: 0 auto 0 auto;
        width:50%;
        display:flex;
        justify-content: center;
        align-items: center;
    }
</style>