import { useState } from "react";

export const useForm = (callback, initState = {}) => {

    const [values, setValues] = useState(initState)

    const onChange = (e) => {
        setValues({ ...e })
    }

    const onSubmit = (e) => {
        // e.preventDefault();
        callback();
    }

    return {
        onChange,
        onSubmit,
        values
    }

}