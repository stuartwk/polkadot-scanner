import React,  { useState, useEffect }  from 'react';

type ApiEndpointFormProps = {
    updateEndpoint(endpoint: string): void;
    apiError: boolean;
    formsDisabled: boolean;
}

function ApiEndpointForm({
    updateEndpoint,
    apiError,
    formsDisabled
}: ApiEndpointFormProps) {
    const [endpointValid, setEndpointValid] = useState(false);
    const [endpoint, setEndpoint] = useState('wss://rpc.polkadot.io');

    useEffect(() => {
        setEndpointValid(endpoint.length > 0 && endpoint.includes('wss://'));
    }, [endpoint])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        updateEndpoint(endpoint);
    }

    const isDisabled = (): boolean => !endpointValid || formsDisabled;

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
                            disabled={formsDisabled}
                            onChange={(e) => setEndpoint(e.target.value)}
                            required />
                    </div>
                </div>
                <div className="w-full mb-2">
                    <span className="text-red-500 text-xs">
                        {(endpoint.length <= 0 || !endpoint.includes('wss://')) && ("Please enter a valid endpoint")}
                        {apiError && ("Error connecting to endpoint")}
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
