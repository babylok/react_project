import React, { useState, useEffect, useRef } from 'react';
import { Form, Row } from 'react-bootstrap';



const AddressSearch = ({ setCoorPosition }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [hasSelected, setHasSelected] = useState(false);
    const inputRef = useRef(null);
    const coorPosition = useRef("");

    useEffect(() => {
        const handler = setTimeout(() => {
            if (query && !hasSelected) {
                fetchSuggestions(query);
            } else {
                setSuggestions([]);
            }
        }, 1000);

        return () => {
            clearTimeout(handler);
        };
    }, [query, hasSelected]);

    const fetchSuggestions = async (searchQuery) => {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&bounded=1&viewbox=113.8342,22.1967,114.4042,22.3964&q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();

        setSuggestions(data);
        setSelectedIndex(-1);
    };

    const cleanDisplayName = (name) => {
        return name.replace(/000/g, '').replace(/中國/g, '').trim();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            setSelectedIndex((prevIndex) => (prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex));
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
            e.preventDefault();
        } else if (e.key === 'Enter' || e.key === 'Tab') {
            if (selectedIndex >= 0) {
                const selectedSuggestion = cleanDisplayName(suggestions[selectedIndex].display_name);
                const newValue = [suggestions[selectedIndex].lat, suggestions[selectedIndex].lon];
                setCoorPosition(newValue);
                setQuery(selectedSuggestion);
                setSuggestions([]);
                setSelectedIndex(-1);
                setHasSelected(true);
                e.preventDefault();
            }
        }
    };

    const handleChange = (e) => {
        setQuery(e.target.value);
        if (hasSelected) {
            setHasSelected(false);
        }
    };

    return (
        <div >
            <Form>
                <Row className="mb-3">
                    <Form.Group>

                        <Form.Control
                            type="text"
                            placeholder="輸入地址"
                            value={query}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            ref={inputRef}
                        />
                    </Form.Group>
                </Row>

            </Form>


            {suggestions.length > 0 && (
                <ul style={{ border: '1px solid #ccc', maxHeight: '200px', overflowY: 'auto', margin: 0, padding: 0 }}>
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            style={{
                                backgroundColor: selectedIndex === index ? '#bde4ff' : 'white',
                                padding: '5px',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={() => setSelectedIndex(index)}
                            onClick={() => {
                                const selectedSuggestion = cleanDisplayName(suggestion.display_name);
                                const newValue = `${suggestions[selectedIndex].lat},${suggestions[selectedIndex].lon}`;
                                setCoorPosition(newValue);
                                setQuery(selectedSuggestion);
                                setSuggestions([]);
                                setSelectedIndex(-1);
                                setHasSelected(true);
                            }}
                        >
                            {cleanDisplayName(suggestion.display_name)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AddressSearch;