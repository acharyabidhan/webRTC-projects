const constraints = {
    video: {
        facingMode: "environment",
    },
    audio: false
};

function getelement(id) { return document.getElementById(id); }

const myvideo = getelement("myvideo");
const othervideo = getelement("othervideo");

const peer = new Peer();

peer.on("open", (id) => {
    getelement("my-id").innerText = id;
});

function playmyvideo(stream) {
    myvideo.srcObject = stream;
}

function playothervideo(stream) {
    othervideo.srcObject = stream;
}

var CALL = undefined;
let STREAM;

navigator.mediaDevices.getUserMedia(constraints)
    .then(function (stream) {
        STREAM = stream.clone()
    }).catch(function (error) {
        console.log('Error getting video stream:', error);
    });


function playCallStream() {
    CALL.on("stream", function (callstream) {
        playothervideo(callstream);
    });
}

function answerCall() {
    playmyvideo(STREAM);
    CALL.answer(STREAM);
    playCallStream();
}

var incall = false;

peer.on("call", function (call) {
    if (!incall) {
        if (confirm("Answer call?")) {
            CALL = call;
            answerCall()
            incall = true
            callpeer(call.peer)
        }
    }
});

const otherid = getelement("other-id");

function callpeer(id = "") {
    peer.call(id == "" ? otherid.value : id, STREAM);
    playmyvideo(STREAM)
    otherid.disabled = true;
}