import React,  { useState, useEffect }  from 'react';

type QueryEventsFormProps = {
    startBlock: number;
    onStartBlockChange(block: number): void;
    endBlock: number;
    onEndBlockChange(block: number): void;
    onSubmit(): void;
    formDisabled: boolean;
    latestBlock: number;
}

function QueryEventsForm({
    startBlock, 
    onStartBlockChange, 
    endBlock, 
    onEndBlockChange, 
    onSubmit,
    formDisabled,
    latestBlock,
}: QueryEventsFormProps) {

    const [startBlockValid, setStartBlockValid] = useState(false);
    const [endBlockValid, setEndBlockValid] = useState(false);

    useEffect(() => {
        setStartBlockValid(startBlock > 0 && startBlock < endBlock);
        setEndBlockValid(endBlock > 0 && endBlock > startBlock);
    }, [startBlock, endBlock])

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSubmit();
    }

    const isDisabled = (): boolean => !startBlockValid || 
        !endBlockValid || 
        formDisabled || 
        endBlock > latestBlock;

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
                <div className="flex mb-2">                
                    <div className="mr-4">
                        <label className="label" htmlFor="startBlock">
                        Start Block
                        </label>
                        <input
                            className={`form-input focus:outline-none focus:shadow-outline w-full ${!startBlockValid ? 'border-red-500' : 'border-gray-200'}`}
                            name="startBlock"
                            id="startBlock"
                            value={startBlock}
                            type="number"
                            onChange={(e) => onStartBlockChange(+e.target.value)}
                            required />
                    </div>
                    <div className="mr-4">
                        <label className="label">
                        End Block
                        </label>
                        <input
                            className={`form-input focus:outline-none focus:shadow-outline w-full ${!endBlockValid ? 'border-red-500' : 'border-gray-200'}`}
                            name="end-block-input"
                            id="end-block-input"
                            aria-label="end-block-input"
                            type="number"
                            value={endBlock}
                            onChange={(e) => onEndBlockChange(+e.target.value)}
                            required />
                    </div>
                </div>
                <div className="w-full mb-2">
                    <span className="text-red-500 text-xs">
                        {startBlock >= endBlock && ("Start Block should be less than end block.")}
                        {endBlock - 1000 > startBlock && ("Careful, you're about to query a large amount of blocks.")}
                        {startBlock <= 0 && ("Start Block must be greater than 0.")}
                        {endBlock <= 0 && ("End Block must be greater than 0.")}
                        {endBlock > latestBlock && (`Cannot query block greater than latest block: ${latestBlock}`)}
                    </span>
                </div>
                <div className="w-full">
                    <div>
                        <button 
                            disabled={isDisabled()} 
                            className={`btn btn-blue ${isDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`} 
                            type="submit">
                                Scan
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default QueryEventsForm;
