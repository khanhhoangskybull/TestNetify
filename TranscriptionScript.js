let recognization = new webkitSpeechRecognition();

var result = false;
var stop = true; // Initially stopped
var started = false; // Recognition has not started yet
var GameObjName = null;

function SetGameObjectName(name) {
    GameObjName = name;
    console.log(GameObjName);
}

function runspeechrecognition(listenContinuous) {
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

        // if (listenContinuous && !stop) {
            // setTimeout(() => {
                // if (!started) {
                    // recognization.start(); // Restart recognition
                // }
            // }, 100);
        // }
    };

    recognization.onend = () => {
        console.log("Speech recognition ended");
        started = false;
		
		window.Gameinstance.SendMessage(GameObjName, "OnMicEnd");
		stop = true;

        // if (!result && listenContinuous && !stop) {
            // setTimeout(() => {
                // if (!started) {
                    // recognization.start(); // Restart recognition
                // }
            // }, 100);
        // }
    };
	
	recognization.onstart = () => {
		console.log("Speech recognition started");
		started = true;
		result = false;
		stop = false;

		// *** ADD THIS LINE TO SIGNAL SUCCESS TO C# ***
		window.Gameinstance.SendMessage(GameObjName, "OnMicStart"); 
		
};

	recognization.onerror = (e) => {
        console.error("Speech recognition error:", e.error);
        started = false; // Ensure 'started' is false on error

        // Map the error type to a specific event in C#
        let errorMessage = e.error; 
        
        // The 'not-allowed' error is typically what fires if the user denies the microphone
        if (e.error === "not-allowed") {
             errorMessage = "MicrophonePermissionDenied"; 
        } else if (e.error === "no-speech") {
             errorMessage = "NoSpeechDetected"; 
        }
        
        // Send a message back to Unity on failure
        window.Gameinstance.SendMessage(GameObjName, "OnMicError", errorMessage);
    };

    try	{
		// Start recognition if it is not running and has not been stopped
		if (!started && stop) {
			stop = false;
			recognization.start();
			console.log("Start recognition if it is not running and has not been stopped");
		}
	} catch (error) {
	  console.error(error);
	}
}

function stoprecognition() {
    console.log("Stopping speech recognition");
    recognization.stop();
    stop = true;
    started = false;
}

function downloadfile(fileName, content) {
    const link = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = fileName + ".txt";
    link.click();
}
