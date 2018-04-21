var http = require('http')
var axios =require("axios") ;
var createHandler = require('github-webhook-handler')
var handler = createHandler({ path:'/', secret: process.env.SECRET})

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(process.env.PORT || 8000)

handler.on('error', function (err) {
  console.error('Error:', err.message)
})
handler.on('pull_request', function (event) {
  var a=`${event.payload.sender.login} ${event.payload.action} a pull request in the repository ${event.payload.repository.name}`;
  //console.log(a);
  sendGCMreq(getUser(event.payload.repository.full_name),a) ;
})
handler.on('push', function (event) {
  var branch=event.payload.ref.split("/").pop();
  var a=`${event.payload.sender.login} pushed files in the repository ${event.payload.repository.name} in ${branch} branch` ;
  //console.log(a); 
  sendGCMreq(getUser(event.payload.repository.full_name),a) ;
})

handler.on('fork', function (event) {
  var a=`${event.payload.sender.login} forked the repository ${event.payload.repository.name}`;
  //console.log(a);
  sendGCMreq(getUser(event.payload.repository.full_name),a) ;
})

handler.on('issues', function (event) {
  var a=`${event.payload.sender.login} ${event.payload.action} #${event.payload.issue.number} ${event.payload.issue.title} in the repository ${event.payload.repository.name}`
  //console.log(a);
  sendGCMreq(getUser(event.payload.repository.full_name),a) ;
})

handler.on('*', function (event) {
   if(event.event==='watch'){
     var a=`${event.payload.sender.login} starred the repository ${event.payload.repository.name}`;
     //console.log(a);
     sendGCMreq(getUser(event.payload.repository.full_name),a) ;
    }
})

function getUser(repository){
  return repository.split("/")[0];
}

function sendGCMreq(handle,message){
  console.log(handle);
    axios({method:'POST',
          url:"https://morning-oasis-24927.herokuapp.com/credential",
          headers: {'Authorization':process.env.SECRET},
          data:{
          handle:handle,
          }
         }).then(function(response){
            return axios({
              method:'POST',
              url:"https://morning-oasis-24927.herokuapp.com/event",
              headers: {'Authorization':process.env.SECRET},
              data:{
              token:response.data, 
              message:message 
              }
            })
         }).then(function(response){
            console.log('OK');
         }).catch(function(error){
           console.log(error);  
            console.log('FAIL');
         })
  }