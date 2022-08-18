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
  const huddleClient = getHuddleClient();
  const stream = useRootStore((state) => state.stream);
  const enableStream = useRootStore((state) => state.enableStream);
  const pauseTracks = useRootStore((state) => state.pauseTracks);
  const isCamPaused = useRootStore((state) => state.isCamPaused);
  const peers = useRootStore((state) => state.peers);
  const peerId = useRootStore((state) => state.peerId);
  const lobbyPeers = useRootStore((state) => state.lobbyPeers);

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
      <div className="App">
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" className="logo" alt="Vite logo" />
          </a>
          <a href="https://reactjs.org" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
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
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        {!isCamPaused && (
          <video style={{ width: "50%" }} ref={videoRef} autoPlay muted></video>
        )}

        <h1>Lobby Peers</h1>
        <div>
          {lobbyPeers.map((peer) => (
            <div>{peer.peerId}</div>
          ))}
        </div>

        <h1>Peers</h1>

        <div className="peers-grid">
          {Object.values(peers).map((peer) => (
            <PeerVideoAudioElem peerIdAtIndex={peer.peerId} />
          ))}
        </div>

        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </HuddleClientProvider>
  );
}

export default App;
