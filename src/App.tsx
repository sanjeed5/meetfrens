import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

import {
  HuddleClientProvider,
  getHuddleClient,
  useRootStore,
} from "@huddle01/huddle01-client";
import PeerVideoAudioElem from "./components/PeerVideoAudioElem";

function App() {
  const huddleClient = getHuddleClient("YOUR_API_KEY");
  const stream = useRootStore((state) => state.stream);
  const enableStream = useRootStore((state) => state.enableStream);
  const pauseTracks = useRootStore((state) => state.pauseTracks);
  const isCamPaused = useRootStore((state) => state.isCamPaused);
  const peers = useRootStore((state) => state.peers);
  const peerId = useRootStore((state) => state.peerId);
  const lobbyPeers = useRootStore((state) => state.lobbyPeers);
  const roomState = useRootStore((state) => state.roomState);

  const handleJoin = async () => {
    try {
      await huddleClient.join("dev ", {
        address: "0x15900c698ee356E6976e5645394F027F0704c8Eb",
        wallet: "",
        ens: "axit.eth",
      });

      console.log("joined");
    } catch (error) {
      console.log({ error });
    }
  };

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    console.log({ peers: Object.values(peers), peerId, isCamPaused });
  }, [peers, peerId, isCamPaused]);

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
            <button onClick={() => enableStream()}>Enable Stream</button>
            <button onClick={() => pauseTracks()}>Disable Stream</button>
            <button onClick={() => huddleClient.enableWebcam()}>
              Enable Webcam
            </button>
            <button onClick={() => huddleClient.disableWebcam()}>
              Disable Webcam
            </button>
            <button onClick={() => huddleClient.allowAllLobbyPeersToJoinRoom()}>
              allowAllLobbyPeersToJoinRoom()
            </button>
          </div>
          {!isCamPaused && (
            <video
              style={{ width: "50%" }}
              ref={videoRef}
              autoPlay
              muted
            ></video>
          )}

          {lobbyPeers[0] && <h2>Lobby Peers</h2>}
          <div>
            {lobbyPeers.map((peer) => (
              <div>{peer.peerId}</div>
            ))}
          </div>

          {Object.values(peers)[0] && <h2>Peers</h2>}

          <div className="peers-grid">
            {Object.values(peers).map((peer) => (
              <PeerVideoAudioElem peerIdAtIndex={peer.peerId} />
            ))}
          </div>
        </div>
      </div>
    </HuddleClientProvider>
  );
}

export default App;
