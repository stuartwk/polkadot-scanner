import {render, fireEvent, screen} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ApiEndpointForm from './ApiEndpointForm';

const setup = () => {
    const component = render(<ApiEndpointForm onSubmit={(api) => {}} />);
    const input = component.container.querySelector('#polkadotEndpoint');
    const form = component.container.querySelector('#endpointForm');
    return {
        input,
        form,
        ...component
    }
}

test('endpoint without https or wss should fail', async () => {
    const {input} = setup();
    fireEvent.change(input!, {target: {value: 'incorrect.io'}});
    const linkElement = screen.getByText(/Please enter a valid endpoint/i);
    expect(linkElement).toBeInTheDocument();
});

test('should disable button on submit', async () => {
    const {input, form} = setup();
    const submitBtn = screen.getByText("Update Endpoint").closest("button");
    fireEvent.change(input!, {target: {value: 'wss://kusama-rpc.polkadot.io/'}});
    expect(submitBtn).not.toBeDisabled();
    await fireEvent.submit(form!);
    expect(submitBtn).toBeDisabled();
});