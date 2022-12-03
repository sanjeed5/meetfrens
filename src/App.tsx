import reactLogo from "./assets/react.svg";
import "./App.css";
// import redis from 'redis'
const Redis = require('ioredis');
const fs = require('fs');


import {
  HuddleClientProvider,
  getHuddleClient,
} from "@huddle01/huddle01-client";

import { useHuddleStore } from "@huddle01/huddle01-client/store";
import PeerVideoAudioElem from "./components/PeerVideoAudioElem";
import MeVideoElem from "./components/MeVideoElem";

function App() {
  const huddleClient = getHuddleClient("1a830629f8577a2293556d84dd8fc32b8e187dba755a2b65d21bd0ce0121523f");
  const peersKeys = useHuddleStore((state) => Object.keys(state.peers));
  const lobbyPeers = useHuddleStore((state) => state.lobbyPeers);
  const roomState = useHuddleStore((state) => state.roomState);
  const recordingState = useHuddleStore((state) => state.recordingState);
  const recordings = useHuddleStore((state) => state.recordings);

  /* Datastore
   List of peers
   List of rooms
  */

  const redis = new Redis({
       host: 'redis-14119.c212.ap-south-1-1.ec2.cloud.redislabs.com',
       port: 14119,
       password: process.env.REDIS_PWD
   });

  const client = redis.createClient();
  client.connect()

  client.on('error', err => {
    console.log('Error ' + err);
  });

   // peers set
   // roomids set
   // roomid-peers key value

   client.hmset('roomids', {
    roomid: '0',
  });

  client.hgetall('roomids', function(err, object) {
    console.log(object); 
  });

  client.sadd(['peerids', "peerid"], function(err, reply) {
    console.log(reply); // 4
  });


 
  const handleJoin = async () => {
    
      // User joins lobby. 
      client.set("name", "Flavio")

      // POST add to active peer
      // GET !FULL Room id
      // If yes, join. 
      // If no, create random room ID. 
      // POST room_id !FULL. 

      // When leaving room, 
      //   If room full, make room !full
      //     UPDATE roomid !full
      //   else del roomid
      //     DEL roomid. 
      //   DEL active peer

    try {
      await huddleClient.join("dev", {
        address: "0x15900c698ee356E6976e5645394F027F0704c8Eb",
        wallet: "",
        ens: "axit.eth",
      });
      huddleClient.setRoomLockState(false)
      console.log("joined");
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <HuddleClientProvider value={huddleClient}>
      <div className="App grid grid-cols-2">
        <div>
          <div>
            <a href="https://vitejs.dev" target="_blank">
              <img src="/vite.svg" className="logo" alt="Vite logo" />
            </a>
            <a href="https://reactjs.org" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h1>Vite + React</h1>

          <h2 className={`text-${!roomState.joined ? "red" : "green"}`}>
            Room Joined:&nbsp;{roomState.joined.toString()}
          </h2>

          <h2>Instructions</h2>
          <ol className="w-fit mx-auto text-left">
            <li>
              Click on <b>Enable Stream</b>
            </li>
            <li>
              Then Click on <b>Join room</b>, <i>"Room Joined"</i> should be
              changed to true
            </li>
            <li>
              Open the app in a <b>new tab</b> and repeat <b>steps 1 & 2</b>
            </li>
            <li>Return to 1st tab, now you'll see peers in the peer list,</li>
            <li>
              Click on <b>allowAllLobbyPeersToJoinRoom</b> to accept peers into
              the room.
            </li>
          </ol>
        </div>

        <div>
          <div className="card">
            <button onClick={handleJoin}>Join Room</button>
            <button onClick={() => huddleClient.enableWebcam()}>
              Enable Webcam
            </button>
            <button onClick={() => huddleClient.disableWebcam()}>
              Disable Webcam
            </button>
            
            
         
          </div>

          <MeVideoElem />

          {lobbyPeers[0] && <h2>Lobby Peers</h2>}
          <div>
            {lobbyPeers.map((peer) => (
              <div>{peer.peerId}</div>
            ))}
          </div>

          {peersKeys[0] && <h2>Peers</h2>}

          <div className="peers-grid">
            {peersKeys.map((key) => (
              <PeerVideoAudioElem key={`peerId-${key}`} peerIdAtIndex={key} />
            ))}
          </div>
          
        </div>
      </div>
    </HuddleClientProvider>
  );
}

export default App;
