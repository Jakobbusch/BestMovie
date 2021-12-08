import {ajax} from 'https://dev.jspm.io/rxjs@6/_esm2015/ajax'
import {interval, of, merge} from 'https://dev.jspm.io/rxjs@6/_esm2015'
import {filter, map, concatMap,share,mergeScan} from 'https://dev.jspm.io/rxjs@6/_esm2015/operators'


export default (el, init_model) => {
    let model = init_model

return {
    el,
    data:{
        movieTitle:'',
        movie: model.movie
    },
    
    
    
    methods:{
        async writeToConsole(){
                this.movie = [{Title: 'bubaboba', Released: '1997'},
                {Title: 'hasdas', Released: '1991'},
                {Title: 'fgdasda', Released: '1990'}]
            
                

    },
    async search(){
        if(this.movieTitle!=''){
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

        var con = import ('mysql');
  var con = createPool({
     host: "34.159.166.233",
    user: "root",
    password: "k4j4mnzswek",
    database: "MyDB",
    port: 3306
    });

    con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
    });

        
        
    }

        
    }
    
}
}