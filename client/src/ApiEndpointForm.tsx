import React,  { useState, useEffect }  from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';

type ApiEndpointFormProps = {
    onSubmit(api: ApiPromise): void;
    fetchingBlockData: boolean;
}

function ApiEndpointForm({
    onSubmit,
    fetchingBlockData
}: ApiEndpointFormProps) {
    const [endpointValid, setEndpointValid] = useState(false);
    const [endpoint, setEndpoint] = useState('wss://rpc.polkadot.io');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setEndpointValid(endpoint.length > 0 && (endpoint.includes('https://') || endpoint.includes('wss://')));
    }, [endpoint])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        setLoading(true);
        const wsProvider = new WsProvider(endpoint);
        const api = new ApiPromise({ provider: wsProvider });

        try {
            await api.isReadyOrError;
            setEndpointValid(true);
            onSubmit(api);
        } catch (error) {
            api.disconnect();
            setEndpointValid(false);
        }

        setLoading(false);
    }

    const isDisabled = (): boolean => !endpointValid || loading || fetchingBlockData;

    return (
        <div className="w-full">
            <form id="endpointForm" onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
                <div className="flex mb-2">                
                    <div className="mr-4">
                        <label className="label" htmlFor="polkadotEndpoint">
                        Endpoint
                        </label>
                        <input
                            className={`form-input focus:outline-none focus:shadow-outline w-full ${!endpointValid ? 'border-red-500' : 'border-gray-200'}`}
                            name="polkadotEndpoint"
                            id="polkadotEndpoint"
                            placeholder="wss://rpc.polkadot.io"
                            value={endpoint}
                            disabled={isDisabled()}
                            onChange={(e) => setEndpoint(e.target.value)}
                            required />
                    </div>
                </div>
                <div className="w-full mb-2">
                    <span className="text-red-500 text-xs">
                        {(endpoint.length <= 0 || (!endpoint.includes('https://') && !endpoint.includes('wss://'))) && ("Please enter a valid endpoint")}
                        {!endpointValid && ("Error connecting to endpoint")}
                    </span>
                </div>
                <div className="w-full">
                    <div>
                        <button 
                            id="submitEndpoint"
                            disabled={isDisabled()}
                            className={`btn btn-blue ${isDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`} 
                            type="submit">
                                Update Endpoint
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ApiEndpointForm;
