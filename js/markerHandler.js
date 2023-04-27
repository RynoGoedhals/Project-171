AFRAME.registerComponent("markerhandler", {
    init: async function(){
        if(userNumber === null){
            this.askUserNumber();
        }

        var games = await this.getGames();

        this.el.addEventListener("markerFound", () => {
            var markerId = this.el.id;
            this.handleMarkerFound(games, markerId);
        });

        this.el.addEventListener("markerLost", () => {
            this.handleMarkerLost();
        });
    },

    handleMarkerFound: function(games, markerId){
        var todaysDate = new Date();
        var todaysDay = todaysDate.getDate();
        var days = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday"
        ];

        var game = games.filter(game => game.id === markerId)[0];

        if(game.unavailable_days.includes(days[todaysDay])){
            swal({
                icon: "warning",
                title: game.game_name.toUpperCase(),
                text: "This game is not available today!",
                timer: 2500,
                buttons: false
            });
        } else {
            var model = document.querySelector(`#model-${game.id}`);

            model.setAttribute("position", game.model_geometry.position);
            model.setAttribute("rotation", game.model_geometry.rotation);
            model.setAttribute("scale", game.model_geometry.scale);
            model.setAttribute("visible", true);

            var descriptionContainer = document.querySelector(`#main-plane-${game.id}`);

            descriptionContainer.setAttribute("visible", true);

            var priceplane = document.querySelector(`#price-plane-${game.id}`);

            priceplane.setAttribute("visible", true);

            var buttonDiv = document.getElementById("button-div");
            buttonDiv.style.display = "flex";

            var ratingButton = document.getElementById("rating-button");
            var playButton = document.getElementById("play-button");

            if(userNumber != null){
                ratingButton.addEventListener("click", function(){
                    swal({
                        icon: "warning",
                        title: "Rate Game",
                        text: "Work In Progress"
                    });
                });

                playButton.addEventListener("click", () => {
                    var uNumber;

                    userNumber <= 9 ? (uNumber = `U0${userNumber}`) : `U${userNumber}`;

                    this.handleOrder(uNumber, game);
                    swal({
                        icon: "https://i.imgur.com/4NZ6uLY.jpg",
                        title: "Thanks for choosing to play!",
                        text: "You will play shortly!",
                        timer: 2500,
                        buttons: false
                    });
                });
            }
        }
    },

    handleMarkerLost: function(){
        var buttonDiv = document.getElementById("button-div");
        buttonDiv.style.display = "none";
    },

    getGames: async function(){
        return await firebase
        .firebase()
        .collection("games")
        .get()
        .then(snap => {
            return snap.docs.map(doc => doc.data());
        });
    },

    handleOrder: function(uNumber, game){
        firebase
        .firestore()
        .collection("users")
        .doc(uNumber)
        .get()
        .then(doc => {
            var details = doc.data();

            if(details["current_orders"][game.id]){
                details["current_orders"][game.id]["quantity"] += 1;

                var currentQuantity = details["current_orders"][game.id]["quantity"];
                
                details["current_orders"][game.id]["subtotal"] = currentQuantity * game.price;
            } else {
                details["current_orders"][game.id] = {
                    item: game.game_name,
                    price: game.price,
                    quantity: 1,
                    subtotal: game.price * 1
                };
            }

           details.total_bill += game.price;

           firebase
           .firestore()
           .collection("users")
           .doc(doc.id)
           .update(details);
        });
    },

    askUserNumber: function(){
        var iconUrl = "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png";

        swal({
            title: "Welcome to the arcade!",
            icon: iconUrl,
            content: {
                element: "input",
                attributes: {
                    placeholder: "Type your user number",
                    type: "number",
                    min: 1
                }
            },

            closeOnClickOutside: false,
        }).then(inputValue => {
            userNumber = inputValue;
        });
    }
})