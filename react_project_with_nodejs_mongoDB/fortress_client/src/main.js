import React, { useEffect, useState } from 'react';
import Datalist from './Datalist';


const Try = () => {
    const [isReadData, setIsReadData] = useState(true);
    const [isCreateData, setIsCreateData] = useState(false);
    const [isUpdateData, setIsdateData] = useState(false);
    const [isDeleteData, setIsDeleteData] = useState(false);



    return (
        <div>
            <ul>
                <li>choose1</li>
                <li>choose2</li>
                <li>choose3</li>
            </ul>
        </div>
    )
}

export default Try;