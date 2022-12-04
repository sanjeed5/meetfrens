import "./App.css";

// Rainbowkit
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  [
    alchemyProvider({ apiKey: 'sCB9uun12koMeTY0UkwAGGT5G_VHtR0d' }),
    publicProvider()
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'makefrens',
  chains
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

// World ID
import { WorldIDWidget, WidgetProps } from "@worldcoin/id";

// Huddle
import {
  HuddleClientProvider,
  getHuddleClient,
} from "@huddle01/huddle01-client";

import { useHuddleStore } from "@huddle01/huddle01-client/store";
import PeerVideoAudioElem from "./components/PeerVideoAudioElem";
import MeVideoElem from "./components/MeVideoElem";
import { useState, Dispatch, useEffect } from "react";

function App() {
  const { address, isConnected } = useAccount();
  const [ isVerifiedAddress, setIsVerifiedAddress ] = useState(false);
  let verifiedAddressesList = [];

  const huddleClient = getHuddleClient("1a830629f8577a2293556d84dd8fc32b8e187dba755a2b65d21bd0ce0121523f");
  const peersKeys = useHuddleStore((state) => Object.keys(state.peers));
  const lobbyPeers = useHuddleStore((state) => state.lobbyPeers);
  const roomState = useHuddleStore((state) => state.roomState);
  const recordingState = useHuddleStore((state) => state.recordingState);
  const recordings = useHuddleStore((state) => state.recordings);

  const worldIDWidgetProps: WidgetProps = {
    actionId: "wid_staging_06c9d0b73b1db8264c78b4a54b871f59",
    signal: address,
    enableTelemetry: true,
    appName: "makefrens",
    signalDescription: "Create account on makefrens",
    theme: "dark",
    debug: true, // DO NOT SET TO `true` IN PRODUCTION
    onSuccess: (result) => onWorldIDSuccess(result),
    onError: ({ code, detail }) => console.log({ code, detail }),
    onInitSuccess: () => console.log("Init successful"),
    onInitError: (error) => console.log("Error while initialization World ID", error),
  };

  const handleJoin = async () => {
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

  const onWorldIDSuccess = (result) => {
    console.log("WORDLID results", result);
    verifiedAddressesList.push(address);
  };

  const renderConnectContainer = () => (
    <div>
      {!isConnected && <p>Connect to makefrens</p>}
      <div className="w-fit mx-auto">
        <ConnectButton chainStatus="none" showBalance={false}/>
      </div>
    </div>
  );

  const renderWorldIDContainer = () => (
    <div>
      {!isVerifiedAddress && <p>Verify that you're a unique person to makefrens</p>}
      <div className="w-fit mx-auto" id="world-id-container">
        <WorldIDWidget {...worldIDWidgetProps} />
      </div>
    </div>
  );

  useEffect(() => {
    if(verifiedAddressesList.includes(address))
      setIsVerifiedAddress(true);
    else
      setIsVerifiedAddress(false);
  }, [address]) 

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <HuddleClientProvider value={huddleClient}>
          <div className="App grid">
            <div>
              <h1>meetfrens</h1>
              {/* {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()} */}
            </div>

            {renderConnectContainer()}

            {/* If not verified */}
            {renderWorldIDContainer()}

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
      </RainbowKitProvider>
    </WagmiConfig>

  );
}

export default App;
