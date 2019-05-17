import React from 'react';

/**
 * Stateless Component
 */

const Formfield = ({formdata, change, id}) => {

    const showError = () => {
        let errorMessage = null;

        if(formdata.validation && !formdata.valid){
            errorMessage = (
                <div className="error_label">
                    {formdata.validationMessage}
                </div>
            )
        }

        return errorMessage;
    }

    const renderTemplate = () => {
        let formTemplate = null;

        console.log("formfield: rendertemplate: formdata=",formdata);
        switch(formdata.element){
            case('input'):
                formTemplate = (
                    <div className="formBlock">
                        { formdata.showlabel ? 
                            <div className="label_inputs">{formdata.config.label}</div>
                        :null}

                        <input
                            {...formdata.config}
                            value={formdata.value}
                            onBlur={(event)=> change({event,id,blur:true})}
                            onChange={(event)=> change({event,id}) }
                        />
                        {showError()}
                    </div>
                )
            break;
            case('select'):
                formTemplate = (
                    <div className="formBlock">
                        { formdata.showlabel ? 
                            <div className="label_inputs">{formdata.config.label}</div>
                        :null}
                        <select
                            value={formdata.value}
                            onBlur={(event)=> change({event,id,blur:true})}
                            onChange={(event)=> change({event,id}) }
                        >
                            <option value="">Select one</option>
                            {
                                formdata.config.options.map(item=>(
                                    <option 
                                        key={item.key} // changed to item.value from item.key
                                        value={item.key} // item.key, item.value, item.key
                                    >
                                        {/* {line below is the problem. item.key renders ok when it's from db and item.value hardcoded } */}
                                        {item.value} 
                                    </option>
                                ))
                            }
                        </select>
                        {showError()}
                    </div>
                )
            break;
            case('textarea'):
            formTemplate = (
                <div className="formBlock">
                    { formdata.showlabel ? 
                        <div className="label_inputs">{formdata.config.label}</div>
                    :null}
                    <textarea
                        {...formdata.config}
                        value={formdata.value}
                        onBlur={(event)=> change({event,id,blur:true})}
                        onChange={(event)=> change({event,id}) }
                    />
                    {showError()}
                </div>
            )
            break;
            default:
                formTemplate = null;
        }

        return formTemplate;
    }


    return (
        <div>
            {renderTemplate()}
        </div>
    );
};

export default Formfield;