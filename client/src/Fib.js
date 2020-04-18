import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";

export default function Fib(pops) {
    const [state, setState] = useState({
        seenIndexes: [],
        values: {},
        index: ''
    });

    const fetchValues = async () => {
        const values = await axios.get("/api/values/current");
        setState(state => {
            return {
                ...state,
                values: values.data
            }
        })
    }

    const fetchIndexes = async () => {
        const seenIndexes = await axios.get("/api/values/all");
        setState(state => {
            return {
                ...state,
                seenIndexes: seenIndexes.data
            }
        });
    }

    const [date, setDate] = useState(new Date());

    useEffect(() => {
        fetchValues();
        fetchIndexes();
    }, [date]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        await axios.post('/api/values', {
            index: state.index
        });

        setState(state => {
            return {
                ...state,
                index: ''
            }
        })

        setDate(new Date());
    }, [state.index]);

    const caluculatedNode = useMemo(() => {
        const entries = [];

        for (let key in state.values) {
            entries.push(<div key={key}>
                For Index {key} I calculated {state.values[key]}
            </div>);
        }

        return entries;

    }, [state.values])

    return <div>
        <form onSubmit={handleSubmit}>
            <label>Enter your index:</label>
            <input value={state.index} onChange={event => {
                const { value } = event.target;
                setState(state => {
                    return {
                        ...state,
                        index: value
                    }
                })
            }} />
            <button>Submit</button>
        </form>

        <h3>Indexes I have seen:</h3>
        {state.seenIndexes.map(({ number }) => number).join(", ")}

        <h3>Calculates Values:</h3>
        {caluculatedNode}

    </div>
}