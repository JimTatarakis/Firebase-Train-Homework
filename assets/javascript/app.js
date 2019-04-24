// Initialize Firebase
var config = {
    apiKey: "AIzaSyBg9V77ZtVtV56zPJbumSLos-SWIOsI4EQ",
    authDomain: "train-hw-e4205.firebaseapp.com",
    databaseURL: "https://train-hw-e4205.firebaseio.com",
    projectId: "train-hw-e4205",
    storageBucket: "train-hw-e4205.appspot.com",
    messagingSenderId: "512287480601"
  };

  firebase.initializeApp(config);
  
  var database = firebase.database();

  // take info from form
  $('#add-schedule').on('click', function(event) {
    event.preventDefault();
    console.log($("#new-train").val().trim());
    console.log($("#new-destination").val().trim());
    console.log($("#first-departure").val().trim());
    console.log($("#new-frequency").val().trim());
    
    // grab user input
    var newTrain = $("#new-train").val().trim();
    var newDestination = $("#new-destination").val().trim();
    var firstDepart = $("#first-departure").val().trim();
    var newFrequency = $("#new-frequency").val().trim();

    // temp object for data
    var newRoute = {
      name: newTrain,
      destination: newDestination,
      departure: firstDepart,
      frequency: newFrequency
    };

    console.log(newRoute);
    // add it to firebase
    // upload new object to firebase
    database.ref().push(newRoute);

    alert('New route added!');

    // clear form
    $("#new-train").val("");
    $("#new-destination").val("");
    $("#first-departure").val("");
    $("#new-frequency").val("");

  });

  // take info from firebase
  database.ref().on("child_added", function(childSnapshot){

    var newTrain = childSnapshot.val().name;
    var newDestination = childSnapshot.val().destination;
    var firstDepart = childSnapshot.val().departure;
    var newFrequency = childSnapshot.val().frequency;
    var convertedFirstDepart = moment(firstDepart,'HH:mm').subtract(1, "years");

    // time passed since train started in minutes
    var timePassed = moment().diff(moment(convertedFirstDepart), 'minutes');
    console.log(timePassed);

    // how long til train arrives
    var minAway = timePassed % newFrequency;
    console.log(minAway);
    // what time train will arrive
    var arrival = moment().add(minAway, 'minutes');
    console.log(arrival);

     // populate into current train schedule
    var newRow = $("<tr>").append(
      $("<td>").text(newTrain),
      $("<td>").text(newDestination),
      $("<td>").text(newFrequency),
      $("<td>").text(arrival),
      $("<td>").text(minAway)
    );

      // add new row to html table
    $("#train-schedule > tbody").append(newRow);

  });