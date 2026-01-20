import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from "./routers/routers";
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Router>
                <Header />
                <main style={{ flex: 1, paddingTop: 64 }}>
                    <AppRouter />
                </main>
                <Footer />
            </Router>
        </div>
    );
}

export default App;