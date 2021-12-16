import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getAuth, signInWithRedirect , GoogleAuthProvider, onAuthStateChanged ,signOut  } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";


export default (el, init_model) => {
    let model = init_model

    const firebaseConfig = {
        apiKey: "AIzaSyBjMvVKgFVEr2XHD8t3Ot5ukXFO9W4MUDk",
        authDomain: "semester6project.firebaseapp.com",
        projectId: "semester6project",
        storageBucket: "semester6project.appspot.com",
        messagingSenderId: "12632593485",
        appId: "1:12632593485:web:a9ee8e9b6ec0faa701b804"
      };

    const app = initializeApp(firebaseConfig);

    const auth = getAuth();

        auth.languageCode = 'it';
        

    const provider = new GoogleAuthProvider();

        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        provider.setCustomParameters({
            'login_hint': 'xxx@gmail.com'
        });

    const user = auth.currentUser;

    var userInfo ='';
    var userName ='';
    onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        
        if (user !== null) {
        user.providerData.forEach((profile) => {
        userInfo = profile.email;
        userName = profile.displayName;
        document.getElementById('loginHide').style.display ='block';
        document.getElementById('loginHide2').style.display   ='none';
        document.getElementById('headerNav').style.display ='block';
    });
    }
    } else {
        
        document.getElementById('loginHide').style.display  ='none';
        document.getElementById('loginHide2').style.display  ='block'; 
        document.getElementById('headerNav').style.display ='none';
      
    }


});

return {
    el,
    data:{
        movieTitle:'',
        movie: model.movie,
        toplist: model.moviefromDb,
        userdata:'',
        commentText:'',
        getComment: model.getComment,
        selected:'1',
        selected2:'1',
        list:'1',
        users:model.users,
        otherToplist: model.moviefromDb,
        actors:'',
        stars:'',
        year:'',
        likes:''
        
    },
    
   
    
    methods:{
      async getLikes(){
        const likes = await fetch('/getLikes/'+userInfo).then(res => res.json())
        this.likes=likes[0]['List 1 likes']
      },
        async like(){
          var data = {listUserId:this.selected2, userId:userInfo}

          fetch('/like', {
            method: 'POST', // or 'PUT'
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
     
              },
              async search(){
                if(this.movieTitle!=''){
                  this.year = {msg:""}
                  const movie_res = await fetch('https://www.omdbapi.com/?apikey=8ea3b105&t='+this.movieTitle).then(res => res.json())
                  this.movie = movie_res
                  this.movieTitle = null;
                  const comment_res = await fetch('/getComment/' + this.movie.imdbID.split("tt").pop()).then(res => res.json())
                  this.getComment = comment_res;       
                  var temp =this.movie.Actors
                  var temp1 = temp.split(', ').map(function (val){
                    return String(val);})

                    this.stars = {actor1:temp1[0],actor2:temp1[1],actor3:temp1[2]}
                    
                    // get average movie rating for actors
                    const actors = await fetch('/actors/'+this.movie.Actors).then(res => res.json())
                    console.log(actors)
                    const temp2 = {actor1:actors[0].toFixed(2),actor2:actors[1].toFixed(2),actor3:actors[2].toFixed(2)}
                    this.actors = temp2;
                    // get yearly average

                    /*
                    const yearList = await fetch('/year/' + this.movie.Year).then(res => res.json())
                  console.log(yearList)
                  var years = this.movie.Year
                  this.year = years;
                  console.log(years)
                  if(yearList.avg < this.movie.imdbRating){
                    this.year = {msg:"This movie is rated "+(this.movie.imdbRating-yearList.avg).toFixed(2) +" Above the average movie this year"}
                  }else{
                    this.year = {msg:"This movie is rated "+(yearList.avg-this.movie.imdbRating).toFixed(2) +" below the average movie this year"}
                  }
                  console.log(this.year.msg)
                  */
                  }
              
    },

    async addToFavourite(){
        if(this.movie.Title!=undefined){
            const data = {userID:userInfo, movieID: this.movie.imdbID.split("tt").pop(),list:this.list}
        fetch('/addToToplist', {
  method: 'POST', // or 'PUT'
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
})
.catch((error) => {
  console.error('Error:', error);
});

// add user to db
        
var data1= {email: userInfo}
await fetch('/addUser', {
  method: 'POST', // or 'PUT'
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data1),
})
.then(response => response.json())
.then(data1 => {
  console.log('Success:', data1);
})
.catch((error) => {
  console.error('Error:', error);
});
        }
        
    },
    
    async loginGoogle() {
        signInWithRedirect(auth, provider); 
        this.userdata = userInfo          
      },

    async logout() {
        signOut(auth).then(() => {
       console.log("You have been signed out")
    }).catch((error) => {
      console.log("Error")
        });
    },
    async addComment(){
        console.log(this.movie.Title)
        if(this.movie.Title!=undefined){
            const data = {user_id:userName, movie_id: this.movie.imdbID.split("tt").pop(), comment:this.commentText}
        fetch('/addComment', {
  method: 'POST', // or 'PUT'
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
})
.catch((error) => {
  console.error('Error:', error);
});

      const comment_res = await fetch('/getComment/' + this.movie.imdbID.split("tt").pop()).then(res => res.json())
                    this.getComment = comment_res;
                    this.commentText = null;
         
        }
      },
    async topList1(){
      this.toplist = await fetch('/toplists/'+userInfo+"+"+this.selected).then(res => res.json()).catch((error) => {
        console.log(('Error: No movies in Selected Toplist'));
      })
      
    },

    async otherToplist1(){
      if(this.selected2 == 1){
        this.otherToplist = await fetch('/OtherTopLists').then(res => res.json());
      }else{
        this.otherToplist = await fetch('/toplists/'+this.selected2+"+"+1).then(res => res.json()).catch((error) => {
        })
      }
      

      
    }

  }   
    
    
  }
}