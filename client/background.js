chrome.runtime.onMessage.addListener(function(response,sender,sendResponse){
    if(response.length===0)
      return ;
    chrome.storage.local.set({user: response});
})

chrome.gcm.onMessage.addListener(function(message) {
  console.log(message.data);
  // A message is an object with a data property that
  // consists of key-value pairs.
  chrome.notifications.create('report',{
  type:'basic',
  title:'Github Notification',
  iconUrl:'./icon.png',
  message:message.data.message,
  expandedMessage:'Hello thanks for using our app',
  priority:1,
  isClickable:true
 },function(){});

});


function registerCallback(registrationId) {
  if (chrome.runtime.lastError) {
    // When the registration fails, handle the error and retry the
    // registration later.
    return;
  }
  // Send the registration token to your application server.
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        chrome.storage.local.set({registered: true});
    }
  }
  xhttp.open("POST", "https://morning-oasis-24927.herokuapp.com/register", true);
  xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  chrome.storage.local.get("user",function(result){
    userHandle=result["user"];
    xhttp.send(`handle=${userHandle}&token=${registrationId}`);
  })
}

 chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.get("registered", function(result) {
    // If already registered, bail out.
    if (result["registered"])
      return;

    // Up to 100 senders are allowed.
    var senderIds = ["739251976837"];
    chrome.gcm.register(senderIds, registerCallback);
  });
});
