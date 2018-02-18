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
        movieSections: document.getElementById("movieSections")

    };

    // Filmobjekt som ska pushas in
    let movie = {
        Director: "",
        Release: "",
        Title: ""
    };

    function sortByCount(Event) {
        db.ref("/Movielist").once("value", function (snapshot) {
            let data = snapshot.val();
            let counter = 1;
            let pageNr = 4;
            let pages = 1;
            htmlElements.movieSections.innerHTML = "";
           
            for (let film in data) {
                if (counter % pageNr === 0) {
                    
                    let pagination = document.createElement("a");
                    pagination.innerHTML = `${pages}`;
                    pages++;
                    pageNr + 4;
                    
                   
                    htmlElements.movieSections.appendChild(pagination);
                    
                    
                    pagination.addEventListener("click", function (Event) {
                    
                        if (Event.target.innerHTML === "1") {
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
                                        sortByCount();

                                    })

                                    htmlElements.movieContainer.appendChild(card);




                                    sortByCount();
                                }
                            })

                        } else {
                            db.ref("/Movielist").limitToLast(4).on("value", function (snapshot) {
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
                                        sortByCount();

                                    })

                                    htmlElements.movieContainer.appendChild(card);




                                    sortByCount();
                                }
                            })

                        }
                    })
                }
                counter++;
            }



        }) //Snapshot
    } // Function

    function lastFour() {
        db.ref("/Movielist").limitToLast(4).once("value", function (snapshot) {
            htmlElements.movieContainer.innerHTML = "";
            let movieList = snapshot.val();
            let key = "";

            for (let film in movieList) {
                let card = document.createElement("div");
                card.className = "card";
                let aFilm = movieList[film];
                console.log(movieList);

                card.innerHTML = `<div class="imgDiv"><img></div> <div class="cardInfo"><ul><li>Director : ${aFilm.Director}</li>
                            <li>Release : ${aFilm.Release}</li>
                           <li> Title : ${aFilm.Title}</li>
                            </ul></div><div class="removeCard"><p>Remove movie</p></div>`;

                let removeCard = card.getElementsByClassName("removeCard")[0];
                removeCard.addEventListener("click", function (Event) {

                    db.ref("Movielist/" + film).remove();
                    sortByCount();

                })

                htmlElements.movieContainer.appendChild(card);




                sortByCount();
            }
        })
    }



    function läggTillFilm(Event) {
        console.log(htmlElements.addFilm);
        htmlElements.formMovie.style.visibility = "visible";
    };

    function submitToDatabase(Event) {

        movie.Director = htmlElements.directorInput.value;
        movie.Release = htmlElements.yearInput.value;
        movie.Title = htmlElements.titleInput.value;
        //console.log(movie);
        db.ref("/Movielist").push(movie);
        htmlElements.directorInput.value = "";
        htmlElements.yearInput.value = "";
        htmlElements.titleInput.value = "";
        sortByCount();
        htmlElements.formMovie.style.visibility = "hidden";
    };

    function stängLäggTillFilm(Event) {
        htmlElements.directorInput.value = "";
        htmlElements.yearInput.value = "";
        htmlElements.titleInput.value = "";
        htmlElements.formMovie.style.visibility = "hidden";
    };

    function sort(Event) {
        htmlElements.movieContainer.innerHTML = "";
        db.ref("Movielist").orderByChild("Title").limitToFirst(4).on("value", function (snapshot) {

            htmlElements.movieContainer.innerHTML = "";
            let movieList = snapshot.forEach(child => {
                let object = child.val();
                let key = child.key;
                console.log(object);
                console.log(child.key);
                let card = document.createElement("div");
                card.className = "card";

                card.innerHTML = `<div class="imgDiv"><img></div> <div class="cardInfo"><ul><li>Director : ${object.Director}</li>
                            <li>Release : ${object.Release}</li>
                           <li> Title : ${object.Title}</li>
                            </ul></div><div class="removeCard"><p>Remove movie</p></div>`;

                let removeCard = card.getElementsByClassName("removeCard")[0];
                removeCard.addEventListener("click", function (Event) {

                    db.ref("Movielist/" + key).remove();
                    sortByCount();

                })

                htmlElements.movieContainer.appendChild(card);
            })

        }) // Snapshot
    }; // function









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
                sortByCount();

            })

            htmlElements.movieContainer.appendChild(card);




            sortByCount();
        }
    }) // Snapshot Ends here!


    htmlElements.sortMovies.addEventListener("click", sort);
    htmlElements.addFilm.addEventListener("click", läggTillFilm);
    htmlElements.closeContainer.addEventListener("click", stängLäggTillFilm);
    htmlElements.submitMovie.addEventListener("click", submitToDatabase);
};
window.addEventListener("load", loaded);