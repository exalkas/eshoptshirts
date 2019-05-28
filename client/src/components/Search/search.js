import React from 'react';

const Search = (props) => {
    return (
        <div className="search_container">
            <input 
                type="text"
                name="search"
                value={props.value}
                onChange={(e) => props.handleSearch(e)}
            />
            <a onClick={() => props.onClick()}>search</a>
        </div>
    );
};

export default Search;