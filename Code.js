let loaded = function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBWvsutunS3QnCiemwzBhpeuGdq9t_Zyas",
        authDomain: "moviedatabase-lab3.firebaseapp.com",
        databaseURL: "https://moviedatabase-lab3.firebaseio.com",
        projectId: "moviedatabase-lab3",
        storageBucket: "moviedatabase-lab3.appspot.com",
        messagingSenderId: "197672332451"
    };
    firebase.initializeApp(config);

    const db = firebase.database();

    // Lagrar alla html element i ett objekt
    let htmlElements = {
        //  AddMovie elements
        addMovieDiv: document.getElementsByClassName("addMovie")[0], // 
        addFilm: document.getElementById("AddMovieBtn"), // knappen
        formMovie: document.getElementById("formMovie"), // Formulär diven
        closeContainer: document.getElementById("closeContainer"), // Stängknappen
        titleInput: document.getElementById("titleInput"), // Titelinput
        yearInput: document.getElementById("yearInput"), //årinput
        directorInput: document.getElementById("directorInput"), // Regirssörinput
        submitMovie: document.getElementById("submitMovie"), // Knappen som skickar upp objekt
        movieContainer: document.getElementById("movieContainer"),
        removeCard: document.getElementsByClassName("removeCard")[0],
        sortMovies: document.getElementById("sortMovies"),
        movieSections: document.getElementById("movieSections"),
        MovieTimeM: document.getElementById("M")

    };

    // Filmobjekt som ska pushas in
    let movie = {
        Director: "",
        Release: "",
        Title: "",
        id: ""
    };



    function pagination(event) {
        db.ref("/Movielist").on("value", function (snapshot) {
            htmlElements.movieSections.innerHTML = "";
            let movies = [];
            let data = snapshot.val();
            let key = snapshot.key;
            let list = 0;
            let pages = 1;


            for (let x in data) {

                let film = data[x];
                list++;
                pages = Math.ceil(list / 4);
                film.id = x;
                movies.push(film);


            }

            let nr = 1;
            let limit = 0;
            let listOfNr = [];
            for (i = 0; i < pages; i++) {
                let pages = document.createElement("a");
                pages.innerHTML = `${nr}`;
                nr++;
                htmlElements.movieSections.appendChild(pages);

                pages.addEventListener("click", function (event) {
                    htmlElements.movieContainer.innerHTML = "";
                    let value = 0;
                    for (i = 0; i < listOfNr.length; i++) {
                        if (pages.innerHTML == (i + 1))
                            value = listOfNr[i];

                    }
                    for (i = 0; i < movies.length; i++) {
                        // console.log(movies[i]);
                        if ((i) >= value && (i) <= value + 3) {

                            let movie = movies[i];
                            let card = document.createElement("div");
                            card.className = "card";

                            card.innerHTML = `<div class="imgDiv"><img></div> <div class="cardInfo"><ul><li>Director : ${movie.Director}</li>
                            <li>Release : ${movie.Release}</li>
                           <li> Title : ${movie.Title}</li>
                            </ul></div><div class="removeCard"><p>Remove movie</p></div>`;

                            let removeCard = card.getElementsByClassName("removeCard")[0];
                            removeCard.addEventListener("click", function (Event) {


                                db.ref("Movielist/" + movie.id).remove();



                            })

                            htmlElements.movieContainer.appendChild(card);

                        }
                    }
                })

                listOfNr.push(limit);
                limit += 4;
            }
        })
    }






    function läggTillFilm(Event) {
        htmlElements.formMovie.style.visibility = "visible";
    };




    function submitToDatabase(Event) {
        movie.Director = htmlElements.directorInput.value;
        movie.Release = htmlElements.yearInput.value;
        movie.Title = htmlElements.titleInput.value;


        db.ref("/Movielist").push(movie);

        db.ref("/Movielist").on("child_added", function (snapshot, prevChildKey) {
            htmlElements.movieContainer.innerHTML = "";
            let data = snapshot.val();
            let key = snapshot.key;

            /* console.log(key);
             console.log(data.Director);
             console.log(data.Release);
             console.log(data.Title);*/

            let card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `<div class="imgDiv"><img></div> <div class="cardInfo"><ul><li>Director : ${data.Director}</li>
                            <li>Release : ${data.Release}</li>
                           <li> Title : ${data.Title}</li>
                            </ul></div><div class="removeCard"><p>Remove movie</p></div>`;

            let removeCard = card.getElementsByClassName("removeCard")[0];
            removeCard.addEventListener("click", function (Event) {
                htmlElements.movieContainer.innerHTML = "";
                db.ref("Movielist/" + key).remove();

                pagination();

            })

            htmlElements.movieContainer.appendChild(card);
            pagination();



            //console.log(movie);
            htmlElements.directorInput.value = "";
            htmlElements.yearInput.value = "";
            htmlElements.titleInput.value = "";
            htmlElements.formMovie.style.visibility = "hidden";
        })
    };

    function stängLäggTillFilm(Event) {
        htmlElements.directorInput.value = "";
        htmlElements.yearInput.value = "";
        htmlElements.titleInput.value = "";
        htmlElements.formMovie.style.visibility = "hidden";
    };

    function sort(Event) {
        htmlElements.movieSections.innerHTML = "";
        htmlElements.movieContainer.innerHTML = "";
        db.ref("Movielist").orderByChild("Title").on("value", function (snapshot) {

            let movies = [];
            let list = 0;
            let pages = 1;
            let movieList = snapshot.forEach(child => {
                let object = child.val();
                let key = child.key;
                list++;
                pages = Math.ceil(list / 4);

                object.id = key;
                movies.push(object);


            })

            let nr = 1;
            let limit = 0;
            let listOfNr = [];

            for (let i = 0; i < movies.length; i++) {
                let movie = movies[i];
                let card = document.createElement("div");
                card.className = "card";

                card.innerHTML = `<div class="imgDiv"><img></div> <div class="cardInfo"><ul><li>Director : ${movie.Director}</li>
                            <li>Release : ${movie.Release}</li>
                           <li> Title : ${movie.Title}</li>
                            </ul></div><div class="removeCard"><p>Remove movie</p></div>`;
                let removeCard = card.getElementsByClassName("removeCard")[0];
                removeCard.addEventListener("click", function (Event) {

                    db.ref("Movielist/" + movie.id).remove();

                })

                htmlElements.movieContainer.appendChild(card);
                if ((i) === 3) {
                    break;
                }

            }
            for (i = 0; i < pages; i++) {
                let pages = document.createElement("a");
                pages.innerHTML = `${nr}`;
                nr++;
                htmlElements.movieSections.appendChild(pages);


                pages.addEventListener("click", function (event) {
                    htmlElements.movieContainer.innerHTML = "";
                    let value = 0;
                    for (i = 0; i < listOfNr.length; i++) {
                        if (pages.innerHTML == (i + 1))
                            value = listOfNr[i];

                    }
                    for (i = 0; i < movies.length; i++) {
                        // console.log(movies[i]);
                        if ((i) >= value && (i) <= value + 3) {

                            let movie = movies[i];
                            let card = document.createElement("div");
                            card.className = "card";

                            card.innerHTML = `<div class="imgDiv"><img></div> <div class="cardInfo"><ul><li>Director : ${movie.Director}</li>
                            <li>Release : ${movie.Release}</li>
                           <li> Title : ${movie.Title}</li>
                            </ul></div><div class="removeCard"><p>Remove movie</p></div>`;


                            let removeCard = card.getElementsByClassName("removeCard")[0];
                            removeCard.addEventListener("click", function (Event) {

                                db.ref("Movielist/" + movie.id).remove();
                            })

                            htmlElements.movieContainer.appendChild(card);
                        }
                    }
                }) // Pages
                listOfNr.push(limit);
                limit += 4;
            }
        }) // Snapshot
    }; // function








    function start() {
        db.ref("/Movielist").limitToFirst(4).on("value", function (snapshot) {




            htmlElements.movieContainer.innerHTML = "";
            let movieList = snapshot.val();
            let key = "";

            for (let film in movieList) {
                let card = document.createElement("div");
                card.className = "card";
                let aFilm = movieList[film];

                card.innerHTML = `<div class="imgDiv"><img></div> <div class="cardInfo"><ul><li>Director : ${aFilm.Director}</li>
                            <li>Release : ${aFilm.Release}</li>
                           <li> Title : ${aFilm.Title}</li>
                            </ul></div><div class="removeCard"><p>Remove movie</p></div>`;

                let removeCard = card.getElementsByClassName("removeCard")[0];
                removeCard.addEventListener("click", function (Event) {

                    db.ref("Movielist/" + film).remove();

                })

                htmlElements.movieContainer.appendChild(card);
            }
            pagination();
        }) // Snapshot Ends here!

        db.ref("Movielist/").on("child_removed", function (snapshot) {

            pagination();
            start();
        });
    }
    start();

    htmlElements.MovieTimeM.addEventListener("click", function (event) {
        window.location.href = "index.html";
    })
    htmlElements.sortMovies.addEventListener("click", sort);
    htmlElements.addFilm.addEventListener("click", läggTillFilm);
    htmlElements.closeContainer.addEventListener("click", stängLäggTillFilm);
    htmlElements.submitMovie.addEventListener("click", submitToDatabase);
};
window.addEventListener("load", loaded);