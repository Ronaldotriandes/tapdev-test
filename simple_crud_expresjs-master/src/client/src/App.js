import React, { useState } from 'react';
import UserForm from './components/UserForm';
import UserList from './components/UserList';

const App = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [refreshList, setRefreshList] = useState(false);

    const handleFormSubmit = () => {
        setSelectedUser(null);
        setRefreshList(prev => !prev); // Trigger re-render of UserList
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
    };

    const handleReset = () => {
        setSelectedUser(null);
        setRefreshList(prev => !prev); // Trigger re-render of UserList
    };

    return (
        <div className="App">
            <UserForm
                selectedUser={selectedUser}
                onFormSubmit={handleFormSubmit}
                onReset={handleReset}
                onSuccess={() => setRefreshList(prev => !prev)} // Pass the callback for list refresh
            />
            <UserList refresh={refreshList} onEdit={handleUserSelect} />
        </div>
    );
};

export default App;