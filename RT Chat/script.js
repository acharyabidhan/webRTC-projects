function element(id) { return document.getElementById(id); }

const msgbox = element("msg-body");
const msginp = element("msg-inp");

const peer = new Peer();

var Aconn = undefined;

peer.on("open", (id) => {
    console.log("connection open");
    element("my-id").innerText = id;
});

peer.on("connection", (NAConn) => {
    console.log("connected to peer");
    if (Aconn != undefined) Aconn.close();
    Aconn = NAConn;
    Aconn.on("data", receiveData);
});

function sendData(data) {
    if (Aconn != undefined) {
        Aconn.send(data);
        var msg = document.createElement("p");
        msg.className = "msgbox";
        msg.id = "mymsg"
        msg.innerText = data;
        msgbox.append(msg);
        msginp.value = null;
    }
}

function receiveData(data) {
    console.log("Received:", data);
    var msg = document.createElement("p");
    msg.className = "msgbox";
    msg.id = "othermsg"
    msg.innerText = data;
    msgbox.append(msg);
}

const otherid = element("other-id");

otherid.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        if (Aconn != undefined) Aconn.close();
        Aconn = peer.connect(otherid.value);
        otherid.disabled = true;
        Aconn.on("data", receiveData);
    }
});

msginp.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        if (Aconn != undefined) {
            sendData(msginp.value);
        }
    }
});