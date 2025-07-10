let recognization = new webkitSpeechRecognition();
recognization.continuous = false;
recognization.interimResults = false;

var result = false;
var stop = true;
var started = false;
let listeningSessionActive = true;

async function runspeechrecognition(listenContinuous) {	
	if (started){
		console.log("Recognition already running");
        return;
	}

    recognization.onstart = () => {
        console.log("Speech recognition started");
        started = true;
        result = false;
        stop = false;
    };

    recognization.onresult = (e) => {
        var transcript = e.results[0][0].transcript;
        console.log("Speech recognition result:", transcript);

        window.Gameinstance.SendMessage(GameObjName, "OnMicResult", transcript);
        result = true;
    };

    recognization.onend = () => {
        console.log("Speech recognition ended");
        started = false;
		stop = true;

        window.Gameinstance.SendMessage(GameObjName, "OnMicEnd");
        

        // if (listenContinuous && listeningSessionActive && !result) {
            // console.log("Restarting recognition...");
            // setTimeout(() => {
                // if (!started && listeningSessionActive) {
                    // try {
                        // recognization.start();
                    // } catch (err) {
                        // console.error("Error restarting recognition:", err);
                    // }
                // }
            // }, 300);
        // }
    };

    try {
        if (!started && stop) {            
            recognization.start();
        }
    } catch (error) {
        console.error("Recognition start error:", error);
    }
}

async function askMicrophonePermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Microphone permission granted");

        stream.getTracks().forEach(track => track.stop());

        window.Gameinstance.SendMessage("MicHandler", "OnMicPermissionGranted");
    } catch (err) {
        console.error("User denied microphone permission:", err);
        window.Gameinstance.SendMessage("MicHandler", "OnMicPermissionDenied");
    }
}

function stoprecognition() {
    console.log("Stopping speech recognition");
    if (started) {
        recognization.stop();
    }
    stop = true;
    started = false;
}

function SetGameObjectName(name) {
    GameObjName = name;
    console.log(GameObjName);
}

function downloadFile(fileName, content) {
    const link = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = fileName + ".txt";
    link.click();
}
