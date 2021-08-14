import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import QueryForm from './QueryForm';

test('should disable submit if endBlock is higher than latest block', async () => {
    render(<QueryForm startBlock={100} endBlock={300} onStartBlockChange={() => {}} onEndBlockChange={() => {}} onSubmit={() => {}} formDisabled={false} latestBlock={200} />);
    const submitBtn = screen.getByText("Scan").closest("button");
    expect(submitBtn).toBeDisabled();
});

test('should disable submit if startBlock is higher than endBlock', async () => {
    render(<QueryForm startBlock={200} endBlock={100} onStartBlockChange={() => {}} onEndBlockChange={() => {}} onSubmit={() => {}} formDisabled={false} latestBlock={200} />);
    const submitBtn = screen.getByText("Scan").closest("button");
    expect(submitBtn).toBeDisabled();
});
