import { useState, useEffect } from 'react';
import './App.css';
import { ApiPromise, WsProvider } from '@polkadot/api';
import QueryEventsForm from './QueryForm';
import EventsTable from './EventsTable';
import { BlockEventItem } from './_types/block-event-item';
import ApiEndpointForm from './ApiEndpointForm';
import { UnsubscribePromise } from '@polkadot/api/types';

function App() {
  const [initLoading, setInitLoading] = useState(true);
  const [startBlock, setStartBlock] = useState(0);
  const [endBlock, setEndBlock] = useState(0);
  const [latestBlock, setLatestBlock] = useState(0);
  const [api, setPolkadotApi] = useState<ApiPromise>();
  const [blockUnsubscribe, setBlockUnsubscribe] = useState<UnsubscribePromise>();
  const [fetchedBlockCount, setfetchedBlockCount] = useState(0);
  const [blockEvents, setBlockEvents] = useState<BlockEventItem[]>([]);
  const [fetchingBlockData, setFetchingBlockData] = useState(false);
  const [blocksScanned, setBlocksScanned] = useState(false);
  const [formsDisabled, setFormsDisabled] = useState(false);
  const [apiError, setApiError] = useState(false);

  // /** Init PolkaDot API */
  useEffect( () => {
    (async() => {
      const wsProvider = new WsProvider('wss://rpc.polkadot.io');
      const api = await ApiPromise.create({ provider: wsProvider });
      setApi(api);
    })();
  }, []);

  /** 
   * Set End Block to latest block on load 
   * Set Start Block to {endBlock - 100}
   **/
  useEffect( () => {
    if (api) {
      (async() => {
        // Retrieve the current block header
        const lastHdr = await api.rpc.chain.getHeader();
        setEndBlock(lastHdr.number.toNumber());
        setStartBlock(lastHdr.number.toNumber() - 100);
        if (initLoading) {
          setInitLoading(false);
        }
      })();
    }
  }, [api, initLoading]);

  /** Disable Form when fetching data */
  useEffect( () => {
    if (fetchedBlockCount >= endBlock - startBlock) {
      setFetchingBlockData(false);
      setFormsDisabled(false);
    }
  }, [fetchedBlockCount, startBlock, endBlock]);

  const searchBlocks = async () => {
    if (api) {
        setfetchedBlockCount(0);
        setBlockEvents([]);
        setFetchingBlockData(true);
        setFormsDisabled(true);
        setBlocksScanned(true);

        for (let i = startBlock; i <= endBlock; i++) {
          await fetchBlockEvents({api, blockNumber: i});
        }
    }
  }

  const updateApi = async (endpoint: string) => {
        setFormsDisabled(true);
        const wsProvider = new WsProvider(endpoint);
        const api = new ApiPromise({ provider: wsProvider });

        try {
            await api.isReadyOrError;
            setApiError(false);
            setApi(api);
        } catch (error) {
            api.disconnect();
            setApiError(true);
        }

        setFormsDisabled(false);
  }

  const fetchBlockEvents = async ({api, blockNumber}:{api: ApiPromise, blockNumber: number}) => {
    const hdr = await api.rpc.chain.getBlockHash(blockNumber);
    const events = await api.query.system.events.at(hdr);

    setfetchedBlockCount(fetchedBlockCount => fetchedBlockCount + 1);

    events.forEach((record) => {
      
      // Extract the phase, event and the event types
      const { event } = record;
      const types = event.typeDef;

      const args = event.data.map( (data, index) => {
        return {
          key: `${types[index].type}`,
          value: data.toString(),
        }
      })

      setBlockEvents(blockEvents => {
        blockEvents.push({
          block: blockNumber,
          eventName: record.event.meta.name.toString(),
          eventArgs: args
        });
        return blockEvents;
      })
    });

  }

  const setApi = async (_api: ApiPromise) => {
    setPolkadotApi(_api);

    if (blockUnsubscribe) {
      (await blockUnsubscribe)();
    }

    const sub = _api.rpc.chain.subscribeNewHeads((header) => {
      setLatestBlock(header.number.toNumber());
    });

    setBlockUnsubscribe(sub);
  }

  return (
    <div className="bg-gray-200 min-h-screen">
      <div className="container mx-auto" >
        <main className="py-8">
          {initLoading && (
            <div className="flex justify-center py-16">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
            </div>
          )}
          {!initLoading && (
            <div>
              <div>
                <div className="block uppercase tracking-wide text-xs font-bold mb-2">
                  <span className="text-gray-700 mr-1">Latest Block:</span> 
                  <span className="text-green-600 cursor-pointer">{latestBlock}</span>
                </div>
              </div>
              <ApiEndpointForm updateEndpoint={(endpoint) => updateApi(endpoint)} apiError={apiError} formsDisabled={formsDisabled} />

              <QueryEventsForm 
                startBlock={startBlock} 
                onStartBlockChange={(block) => {setStartBlock(block)}} 
                endBlock={endBlock}
                onEndBlockChange={(block) => setEndBlock(block)}
                onSubmit={searchBlocks}
                formDisabled={formsDisabled}
                latestBlock={latestBlock}
              />

              {/** Progress Bar */}
              {fetchingBlockData && (
                <progress className="rounded w-full" max={endBlock - startBlock} value={fetchedBlockCount}></progress>
              )}

              {/** Events Table */}
              {!formsDisabled && (
                <div className="pb-6">
                  <EventsTable blockEventItems={blockEvents} blocksScanned={blocksScanned} />
                </div>
              )}
              
            </div>
          )}
          
        </main>
      </div>
    </div>
  );
}

export default App;

