/**
 * Helper functions for forms
 */

 /**
  * Helper function to validate form
  * accepts element to be validated and form state
  */
export const validate = (element, formdata= []) => {

    console.log("formActions: validate: element=",element);
    console.log("formActions: validate: formdata=",formdata);

    let error = [true,'']; //error array will contain the validation result and the message


    if(element.validation.email){ //element to be validated is the email?
        const valid = /\S+@\S+\.\S+/.test(element.value)
        const message = `${!valid ? 'Must be a valid email':''}`;
        error = !valid ? [valid,message] : error;
    }

    if(element.validation.confirm){//element to be validated is the password?
        const valid = element.value.trim() === formdata[element.validation.confirm].value;
        const message = `${!valid ? 'Passwords do not match':''}`;
        error = !valid ? [valid,message] : error;
    }

    if(element.validation.required){//element is required?
        const valid = element.value.trim() !== '';
        const message = `${!valid ? 'This field is required':''}`;
        error = !valid ? [valid,message] : error;
    }

    return error
}

/**
 * Function used by updateForm
 * element is the form element (input, etc)
 * formdata is the form state
 * formname as the name implies
 */
export const update = (element, formdata, formName ) => {
    const newFormdata = { //store the state here
        ...formdata
    }
    const newElement = { //store all the data for the element
        ...newFormdata[element.id]
    }

    console.log("FORMACTIONS: UPDATE: ELEMENT=",element);
    console.log("formactions: update: newelement=",newElement);

    newElement.value = element.event.target.value; //store the value

    if(element.blur){ //do the validation only when the input looses control
        let validData = validate(newElement,formdata); //call another helper function and pass element and state
        newElement.valid = validData[0]; //store true/false
        newElement.validationMessage = validData[1]; //store the validation message
    }

    newElement.touched = element.blur; //update state that element has lost control
    newFormdata[element.id] = newElement;//store new state for the specific element

    return newFormdata;//return new state
}

/**
 * Returns data to be submitted. Username and password
 * and skips the confirmed password
 * @param {*} formdata form state
 * @param {*} formName who is calling
 */
export const generateData = (formdata, formName) =>{
    let dataToSubmit = {};

    for(let key in formdata){
        if(key !== 'confirmPassword'){
            dataToSubmit[key] = formdata[key].value;
        }
    }

    return dataToSubmit;
}

/**
 * Checks valid key in state. If true returns true
 * 
 */
export const isFormValid = (formdata, formName) => {
    let formIsValid = true;

    for(let key in formdata){
        formIsValid = formdata[key].valid && formIsValid
        console.log("FORM ACTIONS: key=",key, "valid=",formdata[key].valid);
    }
    return formIsValid;
}

//updates state with the options that will be used for select input
//formdata is the state, arraydata is the options, and field is the element that will show the options
export const populateOptionFields= (formdata, arrayData =[],field) => {
    const newArray = [];
    const newFormdata = {...formdata};
    
    console.log("formactions: populateOptionFields: newformdata=",newFormdata);
    console.log("formactions: populateOptionFields: arraydata=",arrayData);

    arrayData.forEach(item=>{
        newArray.push({key:item._id,value:item.name});
    });

    newFormdata[field].config.options = newArray;
    return newFormdata;
}

//set all fields to empty. img included, and update form states
export const resetFields = (formdata, formName)=>{
    const newFormdata = {...formdata};

    for(let key in newFormdata){ //loop through formdata
        if(key === 'images'){ //if it's an image, then reset array
            newFormdata[key].value = [];
        }else if (key==='price' || key==='discounted_price') {
            newFormdata[key].value = 0;    
        } else if (key==='checkedColors') {
            for (let key2 in newFormdata.checkedColors) {
                newFormdata.checkedColors[key2]=false;
            }
        } else if (key==='checkedSize'){
            for (let key2 in newFormdata.checkedSize) {
                newFormdata.checkedSize[key2]=false;
            }
        } else {
            newFormdata[key].value = '';
        }
        newFormdata[key].valid = false;
        newFormdata[key].touched = false;
        newFormdata[key].validationMessage = '';
    }

    return newFormdata
}

//receives formdata and some fields
export const populateFields = (formData, fields) => {

    for(let key in formData){ //loop through formdata and update from fields
        formData[key].value = fields[key];
        formData[key].valid = true;
        formData[key].touched = true;
        formData[key].validationMessage = ''
    }

    return formData;
}
