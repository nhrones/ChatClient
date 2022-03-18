# WebRTC-DataChannel Chat
A `chat` client that uses a signal server hosted on Deno Deploy.
The server is only used to negociate WebRTC connects between two clients.
This signel server communicates to clients using Server Sent Events and BroadcastChannels.