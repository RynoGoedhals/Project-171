AFRAME.registerComponent("create-buttons", {
    init: function(){
        var button1 = document.createElement("button");
        button1.innerHTML = "Rate Kirby";
        button1.setAttribute("id", "rating-button");
        button1.setAttribute("class", "btn btn-warning");

        var button2 = document.createElement("button");
        button2.innerHTML = "Play now";
        button2.setAttribute("id", "play-button");
        button2.setAttribute("class", "btn btn-warning");

        var buttonDiv = document.getElementById("button-div");
        buttonDiv.appendChild(button1);
        buttonDiv.appendChild(button2);
    }
})