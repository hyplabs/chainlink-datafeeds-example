import { createPublicClient, fallback, http } from "viem";
import { Row } from "./@/components/Row";
import { polygon } from "viem/chains";
import {
  polygonDataFeeds,
  useDataFeed,
} from "@hypotenuselabs/ts-chainlink-datafeed";

const PolygonRPCList = [
  "https://1rpc.io/matic",
  "https://polygon-bor.publicnode.com",
  "https://polygon.meowrpc.com",
  "https://rpc.ankr.com/polygon",
];

const transports = fallback(PolygonRPCList.map((rpc) => http(rpc)));

const polygonClient = createPublicClient({
  transport: transports,
  chain: polygon,
  batch: {
    multicall: true,
  },
});

export default function App() {
  const arbitrum = useDataFeed({
    viemClient: polygonClient,
    chainDataFeeds: polygonDataFeeds,
    feedsToSubscribeTo: Object.keys(polygonDataFeeds),
  });

  const fed = Object.values(arbitrum);
  return (
    <main className="max-w-[1080px] m-auto my-10">
      <Row
        chainName="Polygon - As prices update onchain, they will be displayed below"
        feeds={fed}
      />
    </main>
  );
}
