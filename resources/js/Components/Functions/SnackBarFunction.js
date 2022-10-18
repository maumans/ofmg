import React, {useEffect, useState} from 'react';
import SnackBar from "@/Components/SnackBar";

function SnackBarFunction(props) {
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    useEffect(() => {
        setError(props.error)
    },[props])

    useEffect(() => {
        setSuccess(props.success)
    },[props])

    function update()
    {
        error && setError(null)
        success && setSuccess(null)
    }
    return (
        <SnackBar error={error} update={update} success={success}/>
    );
}

export default SnackBarFunction;
