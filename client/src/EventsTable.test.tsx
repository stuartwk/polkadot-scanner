import {render, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import EventsTable from './EventsTable';
import { BlockEventItem } from './_types/block-event-item';

const setup = () => {
    const items: BlockEventItem[] = [
        {
            block: 1,
            eventName: "Deposit",
            eventArgs: []
        },
        {
            block: 1,
            eventName: "Withdraw",
            eventArgs: []
        },
        {
            block: 2,
            eventName: "Deposit",
            eventArgs: []
        },
    ]
    const component = render(<EventsTable blockEventItems={items} blocksScanned={true} />);
    const table = component.container.querySelector('#events-table');
    const filterInput = component.container.querySelector('#filterByEventName');
    return {
        table,
        filterInput,
        component
    }
}

test('it should display 3 event items', async () => {
    const {component} = setup();
    const items = component.container.querySelectorAll('tbody');
    expect(items!.length).toBe(3);
});

test('it should filter and display only filtered items', async () => {
    const {component, filterInput} = setup();
    fireEvent.change(filterInput!, {target: {value: 'withdraw'}});
    const items = component.container.querySelectorAll('tbody');
    expect(items!.length).toBe(1);
});
