document.getElementById("save").onclick = getUserHandle;

function getUserHandle() {
    var handle=document.getElementById("saveInput").value ;
    chrome.runtime.sendMessage(handle);
}
