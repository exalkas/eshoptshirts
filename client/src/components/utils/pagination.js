import React from 'react';

const Pagination = (props) => {

    const { recordCount, currentPage, maxNumberOfButtons, recordstoShow } = props; // destructure props to save typing

    const pagesNeeded = Math.ceil(recordCount/recordstoShow); //how many pages are needed for the pagination buttons

    console.log('PAGINATION: PAGES=',pagesNeeded);

    const buttons=[]; // array to store button values

    // Helper function to add values in buttons array
    const fillButtonsArray = (start, end) => {

        let maxLoop=1;

            if (maxNumberOfButtons > pagesNeeded ) { // in case the num of buttons needed is less than pages needed
                maxLoop= pagesNeeded;
            } else {
                maxLoop= end;
            }

        for (let i=start;i<=maxLoop;i++) { 
            buttons.push(i)
        }
    }

    const calcButtonValues= () => { // calc button array values and then call function to render buttons
        
        if (pagesNeeded > maxNumberOfButtons) { // More pages than buttons
            if (currentPage===1) { // first page?
                console.log('currentPage=1');
                fillButtonsArray(1,maxNumberOfButtons);
            } else if (currentPage>1 && currentPage < pagesNeeded) { // not first page not last page
                console.log('currentPage>1 & currentPage < pagesNeeded');
                if (currentPage+maxNumberOfButtons-1 <= pagesNeeded) {
                    console.log('currentPage+maxNumberOfButtons < pagesNeeded');
                    fillButtonsArray(currentPage-1,currentPage-1+maxNumberOfButtons-1);
                } else {
                    console.log('currentPage=1 & currentPage > pagesNeede');
                    fillButtonsArray(pagesNeeded-maxNumberOfButtons+1,pagesNeeded)
                }
                
            } else if (currentPage===pagesNeeded) { // last page
                console.log('currentPage===pagesNeeded');
                fillButtonsArray(currentPage+1-maxNumberOfButtons,currentPage);
            }
        } else { // Pages = buttons
            console.log('currentPage!==pagesNeeded');
            fillButtonsArray(1, maxNumberOfButtons);
        }

        return renderButtons();
    }

    // Function to render buttons based on buttons array
    const renderButtons = () => (
            
            <div className="pagination-buttons-container">
                {pagesNeeded >= maxNumberOfButtons ? // pages to render are more than number of buttons
                    buttons.length > 0 ? 
                        <div className="pagination-buttons-wrapper">
                            <div key="first" onClick={()=> props.handlePaginationClick("first")}>First</div>
                            {currentPage>1 ? 
                                <div key="prev" onClick={()=> props.handlePaginationClick("prev")}>Prev</div>
                            :null}
                            {buttons.map(item => ( // if there are values in array buttons render them
                            <div className="cart_remove_btn" //remove button. product is in the loop
                                onClick={() => props.handlePaginationClick(item)} key={item}> 
                                {item}
                            </div>
                            ))}
                            {currentPage<pagesNeeded ? 
                                <div key="next" onClick={()=> props.handlePaginationClick("next")}>Next</div>
                            :null}
                            <div key="last" onClick={()=> props.handlePaginationClick("last")}>Last</div>
                        </div>
                    : null
                : 
                    <div className="pagination-buttons-wrapper">
                        {buttons.length > 0 ? buttons.map(item => (
                            <div className="cart_remove_btn" //remove button. product is in the loop
                                onClick={(e)=> props.handlePaginationClick(e)} key={item}> 
                                {item}
                            </div>
                        )) :null}
                    </div>
                }
            </div>
    )

    return (
        <div className='pagination-container'>
            <div>{calcButtonValues()}</div>
            <div>{recordCount}</div>
        </div>
    );
};

export default Pagination;