  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBP5WahtgOldosDSVPcQknkUPA1KVYJ8o0",
    authDomain: "trainscheduler-5f0ef.firebaseapp.com",
    databaseURL: "https://trainscheduler-5f0ef.firebaseio.com",
    projectId: "trainscheduler-5f0ef",
    storageBucket: "trainscheduler-5f0ef.appspot.com",
    messagingSenderId: "536223047546"
  };
  firebase.initializeApp(config);

  let database = firebase.database();
  let trainName = '';
  let destination = '';
  let trainTime = '';
  let frequency = '';
  

  database.ref().on("child_added", function (childSnapshot) {
    makeTable(childSnapshot);

  });
  console.log(database.ref().child())
  
  setInterval(function(childSnapshot) {
    $('#clock').text(moment().format('HH:mm:ss'));
  }, 1000);

  $('#submit').on('click', function(event) {
    event.preventDefault();
    trainName = $('#trainName').val();
    destination = $('#destination').val();
    trainTime = $('#trainTime').val();
    console.log(trainTime)
    frequency = $('#frequency').val();
    nextArrival = Date.now()

    database.ref().push({
        trainName: trainName,
        destination: destination,
        trainTime: trainTime,
        frequency: frequency
    })
    $('#trainName').val('');
    $('#destination').val('');
    $('#trainTime').val('');
    $('#frequency').val('');
  })

function makeTable(childSnapshot) {
  let currentTime = moment();
  let tempTime = moment(childSnapshot.val().trainTime, 'HH:mm');
  // console.log(`current Time: ${currentTime}`)
  // console.log(`Temp Time: ${tempTime}`)

  while (tempTime < currentTime) { // increment start time until greater than current time to find next arrival time
    tempTime = moment(tempTime).add(childSnapshot.val().frequency, 'minutes');
  }
  // write values to index.html schedule table
  $('#trainSchedule').append(`
  <tr data-trainTime="${childSnapshot.val().trainTime}" data-frequency="${childSnapshot.val().frequency}">
  <th scope="col">${childSnapshot.val().trainName}</th>
  <th scope="col">${childSnapshot.val().destination}</th>
  <th scope="col">${childSnapshot.val().trainTime}</th>
  <th scope="col">${childSnapshot.val().frequency}</th>
  <th scope="col">${tempTime.diff(currentTime, 'minutes')}</th>
  <th scope="col">${moment(tempTime).format('HH:mm')}</th>
  </tr>
  `)
}