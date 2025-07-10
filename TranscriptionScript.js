let recognization = new webkitSpeechRecognition();
let micPermissionAsked = false;
let listeningSessionActive = false;

var result = false;
var stop = true;
var started = false;
var GameObjName = null;

async function ensureMicPermission() {
    if (!micPermissionAsked) {
        micPermissionAsked = true;
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log("Mic permission granted already");
        } catch (err) {
            console.error("Mic permission denied", err);
        }
    }
}

async function runspeechrecognition(listenContinuous) {
	listeningSessionActive = true;
    await ensureMicPermission();

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

        window.Gameinstance.SendMessage(GameObjName, "OnMicEnd");
        stop = true;

        if (listenContinuous && listeningSessionActive && !result) {
            console.log("Restarting recognition...");
            setTimeout(() => {
                if (listeningSessionActive) {
                    recognization.start();
                }
            }, 300);
        }
    };

    try {
        if (!started && stop) {
            stop = false;
            recognization.start();
        }
    } catch (error) {
        console.error(error);
    }
}

function stopRecognition() {
    console.log("Stopping speech recognition");
    recognization.stop();
    stop = true;
    started = false;
	listeningSessionActive = false;
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
