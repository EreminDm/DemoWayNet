// Params which will sending to local host
var currentPlace;
var gender;
var secondName;
var firstName;
var helloMesage;
//var deviceId = '4DF978E300000000'; //telefon 2
//var deviceId1 = '040A96DAC6488000'; // telefon 2
var deviceId = 'DDF778E300000000';
var deviceId1 = '04A699DAC6488000';
var ipAdress = "192.168.4.3";
var signalLimit = -47;
var ipPort = "8080";

var object;
var i = 0;
var j = 0;
var k = 1;
var imgURIadress;
var refreshIntervalId;
var success = 1;
var genderMale;
var genderFemale;
var onlyOne = 1;

//function that write params 'second name' and 'gender' and redirect to next select page
function findGender() {
    genderMale = document.getElementById("male");
    genderFemale = document.getElementById("female");
    if (genderMale.checked === true) {
        gender = "Mr.";
    }
    if (genderFemale.checked === true) {
        gender = "Ms.";
    }
}
function confirm() {
    findGender();
    secondName = document.getElementById("secondName").value;
    firstName = document.getElementById("firstName").value;

    // Next page.
    nextAfterHelloBlock();
    
}

// camera open

function cameraOpen() {
    success = 1;
    document.getElementById("pictureMan").style.display = "none";
    document.getElementById("pictureWoman").style.display = "none";
    document.getElementById("picturePhoto").style.display = "block";
    
    navigator.camera.getPicture(onSuccess, onFail,
             { quality: 30, destinationType: Camera.DestinationType.DATA_URL, correctOrientation: true });

    //A callback function when snapping picture is success.
    function onSuccess(imageData) {
        var image = document.getElementById('picturePhoto');
        image.src = "data:image/jpeg;base64," + imageData;
        imgURIadress = image.src;
        success = 2;
    }

    //A callback function when snapping picture is fail.
    function onFail(message) {
        if (success == 1) {
            document.getElementById("picturePhoto").style.display = "none";

            genderFemale = document.getElementById("female");
            if (genderFemale.checked === true) {
                document.getElementById("pictureWoman").style.display = "block";
            } else {
                document.getElementById("pictureMan").style.display = "block";
            }

        } else {
        //alert('Error occured: ' + message);
        var image = document.getElementById('picturePhoto');
        image.src = "data:image/jpeg;base64," + imageData;
        imgURIadress = image.src;
        }
    }
}

function uploadPhoto(imgURI) {
    var text = document.getElementById("selectWelcomeText").value;
    if (text == "") {
        text = "2"
    }
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = imgURI.substr(imgURI.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg;base64";

        options.params = {
            deviceId: deviceId,
            deviceId1: deviceId1,
            firstname: firstName,
            secondname: secondName,
            gender: gender,
            place: currentPlace,
            textId: text
        }
        var ft = new FileTransfer();
        ft.upload(imgURI, encodeURI("http://" + ipAdress + ":" + ipPort + "/nfcService/user/info"), win, fail, options);
}

// help function
function onFail(message) {
    console.log('Failed because: ' + message);
}

function win(r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    //alert("Response =" + r.response);
    console.log("Sent = " + r.bytesSent);
}

function fail(error) {
    alert("Problems with server connection! Code " + error.code);
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}



/////////////////////////
// function where sending params to local host when app online
function onOnline() {

    var networkState = navigator.connection.type;
    if (networkState !== Connection.NONE) {
        
            for (i; i < 1; i++) {
                uploadPhoto(imgURIadress);
            }
        }
        refreshIntervalId = setInterval(function () {

            if (device.signalRssi > signalLimit) {
                if (k == 1) {
                    xhr = new XMLHttpRequest();
                    url = "http://" + ipAdress + ":" + ipPort + "/nfcService/user/online";
                    xhr.open("POST", url, true);
                    xhr.setRequestHeader("Content-type", "application/json");
                    var jsonArray = { deviceId: deviceId, deviceId1: deviceId1, status: 'online' }
                    var connInfo = JSON.stringify(jsonArray);
                    xhr.send(connInfo);
                    k = 2;
                }
            }
            if (device.signalRssi < signalLimit) {
                if (k==2){
                    alert("offline");
                }
                k = 1;
            }
        }, 500);
}
// select watching place function and creating array of params
function placeSelected(place) {
    currentPlace = place;
    if (imgURIadress === undefined) {
        alert('Please go back and fill profile information');
    } else {
        for (j; j < 1; j++) {
            onOnline();
        }
        // watching for wi-fi connection 
        document.addEventListener("online", onOnline, false);

        // Next page
        nextAfterWhatToSelect();
    }
}

function onVolumeDownKeyDown() {
    console.log("volume down key pressed")
    xhr = new XMLHttpRequest();
    url = "http://" + ipAdress + ":" + ipPort + "/nfcService/user/nfc";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    var jsonArray = { deviceId: deviceId, deviceId1: deviceId1, status: 'nfc fliped' }
    var connInfo = JSON.stringify(jsonArray);
    xhr.send(connInfo);
}

function onVolumeUpKeyDown() {
    console.log("volume up key pressed")
    xhr = new XMLHttpRequest();
    url = "http://" + ipAdress + ":" + ipPort + "/nfcService/user/nfc";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    var jsonArray = { deviceId: deviceId, deviceId1: deviceId1, status: 'nfc fliped' }
    var connInfo = JSON.stringify(jsonArray);
    xhr.send(connInfo);
}

function changeToMan() {
    if(success == 1) {
        document.getElementById("pictureMan").style.display = "block";
        document.getElementById("pictureWoman").style.display = "none";
        document.getElementById("picturePhoto").style.display = "none";
        var mansrc = document.getElementById("pictureMan").src;
        imgURIadress = mansrc;
    }
}
function changeToWoMan() {
    if (success == 1) {
        document.getElementById("pictureMan").style.display = "none";
        document.getElementById("pictureWoman").style.display = "block";
        document.getElementById("picturePhoto").style.display = "none";
        var womansrc = document.getElementById("pictureWoman").src;
        imgURIadress = womansrc;
    }
}

function selectWelcome() {
    if (onlyOne == 1) {
        findGender();
        if (gender != undefined) {
            document.getElementById("selectWelcomeButton").style.display = "none";
            document.getElementById("selectWelcomeText").style.display = "block";
            var SecName = document.getElementById("secondName").value;
            var FirName = document.getElementById("firstName").value;
            var x = document.getElementById("selectWelcomeText");
            var option1 = document.createElement("option");
            option1.text = " Hi, " + FirName + ", welcome to Waynet booth!";
            option1.value = 1;
            option1.selected;
            var option2 = document.createElement("option");
            option2.text = " Dear, " + gender + SecName + ", we are glad to meet You at Waynet booth!";
            option2.value = 2;
            var option3 = document.createElement("option");
            option3.text = "Nice to see You, " + FirName + "! We are Waynet.";
            option3.value = 3;
            x.add(option1);
            x.add(option2);
            x.add(option3);
            onlyOne = 2
        } else {
            alert("Please select your gender")
        }
    }

}

function clearSelectList() {
    document.getElementById("selectWelcomeText").options.selectedIndex = 0;
    var length = document.getElementById("selectWelcomeText").options.length;
    document.getElementById("selectWelcomeButton").style.display = "block";
    document.getElementById("selectWelcomeText").style.display = "none";
    for (i = 0; i < length; i++) {
        document.getElementById("selectWelcomeText").options[0] = null;
    }
}
// Navigation function
function nextAfterStartBlock() {
    document.getElementById("startBlock").style.display = "none";
    document.getElementById("informationBlock").style.display = "block";
    document.getElementById("propertiesButton").style.display = "none";

}
function nextAfterInformationBlock() {
    document.getElementById("informationBlock").style.display = "none";
    document.getElementById("helloBlock").style.display = "block";
}
function nextAfterHelloBlock() {
    document.getElementById("helloBlock").style.display = "none";
    document.getElementById("whatToSelect").style.display = "block";
}
function nextAfterWhatToSelect() {
    document.getElementById("whatToSelect").style.display = "none";
    document.getElementById("attention").style.display = "block";
}

function backToInformationBlock() {
    document.getElementById("informationBlock").style.display = "block";
    document.getElementById("helloBlock").style.display = "none";
}
function backToHelloBlock() {
    i = 0;
    j = 0;
    document.getElementById("helloBlock").style.display = "block";
    document.getElementById("whatToSelect").style.display = "none";
}

// back to start page function
function back() {
    clearSelectList();
    i = 0;
    j = 0;
    k = 1;
    onlyOne = 1;
    success = 1;
    imgURIadress = undefined;
    gender = undefined;
    clearInterval(refreshIntervalId);
    document.getElementById("startBlock").style.display = "block";
    document.getElementById("informationBlock").style.display = "none";
    document.getElementById("attention").style.display = "none";

    // clear data on hello block page
    document.getElementById("pictureMan").style.display = "block";
    document.getElementById("picturePhoto").style.display = "none";
    document.getElementById("pictureWoman").style.display = "none";
    document.getElementById("picturePhoto").src = "";

    document.getElementById('firstName').value = "First name";
    document.getElementById('secondName').value = "Second name";

    document.getElementById("male").checked = false;
    document.getElementById("female").checked = false;
}

//clear fuctions

function cleartextBox(id) {
    document.getElementById(id).value= "";
}


// Admin page functions
function openConfiguration() {
    document.getElementById("startBlock").style.display = "none";
    document.getElementById("properties").style.display = "block";
}
function closeConfiguration() {
    document.getElementById("startBlock").style.display = "block";
    document.getElementById("properties").style.display = "none";
}

function getCofiguration() {
    signal = document.getElementById("SignalLevel").value;
    signalLimit = parseInt(signal);
    ipAdress = document.getElementById("IPadress").value;
    ipPort = document.getElementById("ipPort").value;
    deviceId = document.getElementById("NFC").value;
    deviceId1 = document.getElementById("NFC1").value;
    var tags = document.getElementsByTagName("meta");
    tags[0].content = "default-src 'unsafe-inline' 'self' http://" + ipAdress + ":" + ipPort + " data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *";
    console.log(signalLimit + ' ' + ipAdress + ' ' + deviceId);

    alert("Configuration Saved");
}