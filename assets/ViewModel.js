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

    onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        
        if (user !== null) {
        user.providerData.forEach((profile) => {
        userInfo = profile.email;
        document.getElementById('loginHide').style.visibility = 'visible';
        console.log("Sign-in provider: " + profile.providerId);
        console.log("  Provider-specific UID: " + profile.uid);
        console.log("  Name: " + profile.displayName);
        console.log("  Email: " + profile.email);
        console.log("  Photo URL: " + profile.photoURL);
    });
    }
    } else {
        console.log("Login is NOT Working!")
        document.getElementById('loginHide').style.visibility = 'hidden';
    }


});

return {
    el,
    data:{
        movieTitle:'',
        movie: model.movie,
        toplist: model.moviefromDb,
        userdata:'',
        selected:'1',
        selected2:'1',
        list:'1',
        users:model.users,
        otherToplist: model.moviefromDb
        
    },
    
   
    
    methods:{
        async writeToConsole(){
                //console.log(this.selected)
               // console.log("List: " + this.list)
               const othertopList = await fetch('/OtherTopLists').then(res => res.json()).catch((error) => {
                console.error('No movies in toplist');
              });
               this.otherToplist = othertopList
                console.log(othertopList)
              
            
                const users = await fetch('/allUsers').then(res => res.json());
                console.log("users : "+users[0].email)

                this.users = users;

    },
    async search(){
        if(this.movieTitle!=''){
            console.log("hello")
            const movie_res = await fetch('https://www.omdbapi.com/?apikey=8ea3b105&t='+this.movieTitle).then(res => res.json())
            this.movie = movie_res
            //console.log(this.movie.Released)
            console.log(this.movie)
            this.movieTitle = null;
        }
        
        
        
    },
    async addToFavourite(){
        if(this.movie.Title!=undefined){
            console.log(this.movie.Title + ' Added to favourites')
            const data = {userID:userInfo, movieID: this.movie.imdbID.split("tt").pop(),list:this.list}
            console.log(data)
            console.log("UserData: " + this.userdata + " List: "+this.list)
    
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

        /*
        const res = await fetch('http://localhost:8080/search').then(res => res.json())
        console.log("responce: ")
        console.log(res)
        */

        /*
        const res = await fetch('http://localhost:8080/toplists').then(res => res.json())
        console.log("responce: ")
        console.log(res)
        this.toplist = res;
        */

       /*
       const res = await fetch('/searchById/mathias').then(res => res.json())
        console.log("responce: ")
        console.log(res)
        this.toplist = res;
         */
        
    },
    
    async loginGoogle() {
        console.log("Hello from google")
        signInWithRedirect(auth, provider); 
        this.userdata = userInfo
        console.log("Email: "+userInfo)
        
      },

    async logout() {
        signOut(auth).then(() => {
       console.log("You have been signed out")
    }).catch((error) => {
      console.log("Error")
        });
    },
    async topList1(){
      this.toplist = await fetch('/toplists/'+userInfo+"+"+this.selected).then(res => res.json()).catch((error) => {
        console.log(('Error: No movies in Selected Toplist'));
      })
      
    },

    async otherToplist1(){
      console.log("Toplist selected for: " + this.selected2)
      if(this.selected2 == 1){
        console.log(this.selected2 + " first ")
        this.otherToplist = await fetch('/OtherTopLists').then(res => res.json());
      }else{
        console.log(this.selected2 + " other than first ")
        this.otherToplist = await fetch('/toplists/'+this.selected2+"+"+1).then(res => res.json()).catch((error) => {
          console.log(('Error: No movies in Selected Toplist'));
        })
      }
      

      
    }

        
    }
    
}
}