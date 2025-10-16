import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { CContainer } from '@coreui/react';

import '@coreui/coreui/dist/css/coreui.min.css';

ReactDOM.render(
    <React.StrictMode>
        <CContainer>
            <App />
        </CContainer>
    </React.StrictMode>,
    document.getElementById('root')
);
