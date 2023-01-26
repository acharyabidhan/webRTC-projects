let MEDIASTREAM;

navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" }, audio: false
}).then(function (stream) {
    MEDIASTREAM = stream.clone()
}).catch(function (error) {
    console.log("Error getting video stream:", error);
});

const PEER = new Peer();

var currentCall;

PEER.on("open", function (id) {
    document.getElementById("uuid").textContent = id;
});

async function callUser() {
    const peerId = document.querySelector("input").value;
    document.getElementById("menu").style.display = "none";
    document.getElementById("live").style.display = "block";
    document.getElementById("local-video").srcObject = MEDIASTREAM;
    const call = PEER.call(peerId, MEDIASTREAM);
    call.on("stream", (stream) => {
        document.getElementById("remote-video").srcObject = stream;
    });
    call.on("data", (stream) => {
        document.querySelector("#remote-video").srcObject = stream;
    });
    call.on("error", (err) => {
        console.log(err);
    });
    call.on('close', () => {
        endCall()
    })
    currentCall = call;
}

PEER.on("call", (call) => {
    if (confirm(`Accept call from ${call.peer}?`)) {
        call.answer(MEDIASTREAM);
        currentCall = call;
        document.querySelector("#menu").style.display = "none";
        document.querySelector("#live").style.display = "block";
        document.getElementById("local-video").srcObject = MEDIASTREAM;
        call.on("stream", (remoteStream) => {
            document.getElementById("remote-video").srcObject = remoteStream;
        });
    } else {
        call.close();
    }
});

function endCall() {
    document.querySelector("#menu").style.display = "block";
    document.querySelector("#live").style.display = "none";
    if (!currentCall) return;
    try {
        currentCall.close();
    } catch { }
    currentCall = undefined;
}