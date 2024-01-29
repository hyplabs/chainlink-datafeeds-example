import { Chain, PublicClient, Transport } from "viem";
import { useEffect, useState } from "react";
import { subscribeToChainLinkPriceUpdates } from "@hypotenuselabs/ts-chainlink-datafeed";

export const useDataFeed = <K extends keyof any>({
  viemClient,
  chainDataFeeds,
  feedsToSubscribeTo,
}: {
  viemClient: PublicClient<Transport, Chain>;
  chainDataFeeds: Record<K, `0x${string}`>;
  feedsToSubscribeTo: K[];
}) => {
  const [client] = useState(viemClient);

  const [feeds, setFeeds] = useState<
    Record<
      string,
      {
        roundId: bigint;
        current: string;
        updatedAt: Date;
        price: string;
        description: string;
      }
    >
  >({});

  const feedAddresses = feedsToSubscribeTo.map((feed) => chainDataFeeds[feed]);

  useEffect(() => {
    console.log("useEffect");
    subscribeToChainLinkPriceUpdates({
      feedAddresses: feedAddresses,
      publicClient: client,
      onLogsFunction: (array) => {
        console.log("Update");
        for (const feed of array) {
          setFeeds((prev) => {
            let price = feed.current;
            if (feed.description.includes("USD")) {
              price = `${feed.current}`;
            }
            return {
              ...prev,
              [feed.description]: { ...feed, price },
            };
          });
        }
      },
    });
  }, [client, feedAddresses]);

  return feeds;
};