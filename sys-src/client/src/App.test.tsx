import { render, screen } from './utils/test-utils';
import App from './App';

const Wrapper = () => {
    return <App />;
};

describe('Test App component', () => {
    test('render App component', () => {
        render(<Wrapper />);

        //check if overview exists
        const overview = screen.getByTestId('overview-main');
        expect(overview).toBeInTheDocument();
    });
});
