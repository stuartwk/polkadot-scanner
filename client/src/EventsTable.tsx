import { useState }  from 'react';
import { BlockEventItem } from './_types/block-event-item';
import './EventsTable.scss';

type EventsTableProps = {
    blockEventItems: BlockEventItem[];
    blocksScanned: boolean;
}

function EventsTable({blockEventItems, blocksScanned}: EventsTableProps) {
    const [sortedProducts, setSortedProducts] = useState([...blockEventItems]);

    const filterByEventName = (searchTerm: string) => {
        const filtered = (searchTerm.length > 0) 
            ? blockEventItems.filter( (item) => item.eventName.toUpperCase().includes(searchTerm.toUpperCase()) )
            : blockEventItems;

        setSortedProducts(filtered);
    }

    return blocksScanned ? (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 overflow-x-auto">
            <div>
                <div className="mb-4 w-full">
                    <label className="label" htmlFor="startBlock">
                    Filter Events By Name
                    </label>
                    <input
                        className={`form-input focus:outline-none focus:shadow-outline w-full`}
                        name="filterByEventName"
                        id="filterByEventName"
                        onChange={(e) => filterByEventName(e.target.value)}
                        required />
                </div>

                <table id="events-table" className="w-full shadow rounded">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Block</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Args</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                        </tr>
                    </thead>
                    {sortedProducts.map( (eventItem, i) => (
                        <tbody key={`${eventItem.block}-${i}`}>
                            <tr>
                                <td className="font-semibold">{eventItem.block}</td>
                                <td className="font-semibold">{eventItem.eventName}</td>
                                {eventItem.eventArgs.length > 0 && (
                                    <td>{eventItem.eventArgs[0].key}</td>
                                )}
                                {eventItem.eventArgs.length > 0 && (
                                    <td>{eventItem.eventArgs[0].value}</td>
                                )}
                                
                            </tr>
                            {eventItem.eventArgs.length > 1 && eventItem.eventArgs.map( (arg, j) => {
                                if (j > 0) {
                                return <tr key={j} className="border border-b-0 border-light-blue-500">
                                            <td></td>
                                            <td></td>
                                            <td>{arg.key}</td>
                                            <td>{arg.value}</td>
                                        </tr>
                                } else {
                                    return <tr key={j}></tr>
                                }
                            }
                            
                            )}
                        </tbody>
                    ))}
                </table>
            </div>


            {blockEventItems.length <= 0 && (
                <div>
                    No events found in this block range
                </div>
            )}
        </div>
    )
    : (<div></div>);
}

export default EventsTable;
