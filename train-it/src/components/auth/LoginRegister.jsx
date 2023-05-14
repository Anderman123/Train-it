import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';


function LoginRegister() {
    let [login, setLogin] = useState(true);

    return (
        <div className='App'>
            {login ? <Login setCanvi={setLogin} /> : <Register setCanvi={setLogin} />}
        </div>
    );
}

export default LoginRegister