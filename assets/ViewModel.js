
export default (el, init_model) => {
    let model = init_model

return {
    el,
    data:{
        movieTitle:'',
        movie: model.movie,
        toplist: model.moviefromDb
    },
    
    
    
    methods:{
        async writeToConsole(){
                this.toplist = [{Title: 'bubaboba', Released: '1997'},
                {Title: 'hasdas', Released: '1991'},
                {Title: 'fgdasda', Released: '1990'}]
            
                

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
        const data = {userID:"Mathias", movieID:"12345"}
    
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
    }

        
    }
    
}
}