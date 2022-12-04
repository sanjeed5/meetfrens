import reactLogo from "./assets/react.svg";
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
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'meetfrens',
  chains
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

// Huddle
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

  // const renderNotConnectedContainer = () => (
  //   <button onClick={connectWallet} className="cta-button connect-wallet-button">
  //     Connect to Wallet
  //   </button>
  // );

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <HuddleClientProvider value={huddleClient}>
          <div className="App grid">
            <div>
              <h1>meetfrens</h1>
              {/* {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()} */}
            </div>
            <div className="w-fit mx-auto">
              <ConnectButton />
            </div>
            <div>
              
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
      </RainbowKitProvider>
    </WagmiConfig>

  );
}

export default App;
