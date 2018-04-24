# Github-real-time-notifications
A  Chrome extension with **Node.js** backend which gives subscribers real time notifications when someone interacts
with their repositories(push,pull,fork,issues,star).It uses **Github webhooks** to recieve github events and **Google Cloud messaging(GCM)** for interaction between the server and client app 
and **Redis** as a key value look up to determine the GCM id's for the client app .

The server code is primarily for reference only if one wishes to understand the working of the backend and will not function
on your machine.

## Installation
To use this extension
1. Clone this repository 
- git clone https://github.com/aditya730/Github-real-time-notifications.git
2. Go to chrome://extensions/
- Load unpacked extension and navigate to the client folder in the cloned repository. 
- You will see a mini github icon on the top right of the screen.Click and follow the instructions.
- Click on Reload to complete the registration process on Server.
3. You can now recieve chrome notifications.
