import { h, Component, Prop, State } from '@stencil/core';
import { Option, SelectType } from '../../../interfaces/FormModel';
import { BindModel } from '../../../decorators/BindModel';
import { TableOfContentProperty } from '../../../decorators/TableOfContentProperty';

@Component({
    tag: 'psk-select'
})
export class PskSelect {

    @BindModel()

    @State() options: Array<Option> = null;

    componentWillLoad() {
        if (this.selectionType !== 'single' && this.selectionType !== 'multiple') {
            this.selectionType = 'single';
        }
    }

    render() {
        const name: string = this.label && this.label.replace(/( |:|\/|\.|-)/g, "").toLowerCase();

        return (
            <div class="form-group">
                <psk-label for={name} label={this.label} />

                <select name={name} id={name} class="form-control"
                    disabled={this.disabled} required={this.required}
                    multiple={this.selectionType === 'multiple'}
                    onChange={this.__onChangeHandler.bind(this)} >

                    {this.placeholder && <option
                        disabled={true}
                        label={this.placeholder}
                        value={''}
                        selected={this.value === null} />}

                    {this.options && this.options.map((option: Option) => {
                        const value = option.value ? option.value
                            : option.label && option.label.replace(/( |:|\/|\.|-)/g, "").toLowerCase();

                        const selected: boolean = option.selected === true;

                        return (
                            <option
                                selected={selected}
                                value={value}
                                label={option.label}
                                disabled={option.disabled}
                            />
                        );
                    })}
                </select>
            </div>
        );
    }

    __onChangeHandler(evt): void {
        evt.preventDefault();
        evt.stopImmediatePropagation();

        let value = evt.target.value;
        if (this['changeModel']) {
            this['changeModel'].call(this, 'value', value);
        } else {
            console.warn('[psk-select] Function named -=changeModel=- is not defined!');
        }
    }

    @TableOfContentProperty({
        description: [`By filling out this property, the component will display above it, a label using <psk-link page="forms/psk-label">psk-label</psk-link> component.`],
        isMandatory: false,
        propertyType: 'string',
        specialNote: `If this property is not provided, the component will be displayed without any label`
    })
    @Prop() label?: string | null = null;

    @TableOfContentProperty({
        description: [`Specifies the value of a psk-select component.`,
            `This value is updated also in the model using the two-way binding. Information about two-way binding using models and templates can be found at: <psk-link page="forms/using-forms">Using forms</psk-link>.`],
        isMandatory: false,
        propertyType: 'string'
    })
    @Prop() value?: string | null = null;

    @TableOfContentProperty({
        description: [`Specifies the type of the psk-select component.`,
            `There are two possible values, "single" and "multiple". If no value is provided, "single" is assumed.`],
        isMandatory: false,
        propertyType: 'string',
        defaultValue: 'single'
    })
    @Prop() selectionType?: SelectType = 'single';

    @TableOfContentProperty({
        description: [`Specifies a short hint that describes the expected value of an psk-date-input component`],
        isMandatory: false,
        propertyType: 'string'
    })
    @Prop() placeholder?: string | null = null;

    @TableOfContentProperty({
        description: [`Specifies that at least one option must be selected before submitting the form.`,
            `Accepted values: "true" and "false"`],
        isMandatory: false,
        propertyType: 'boolean',
        defaultValue: "false"
    })
    @Prop() required?: boolean = false;

    @TableOfContentProperty({
        description: [`	Specifies that the component is disabled. Most of the times is used within conditional formatting of components.`,
            `Accepted values: "true" and "false"`],
        isMandatory: false,
        propertyType: 'boolean',
        defaultValue: "false"
    })
    @Prop() disabled?: boolean = false;

    @TableOfContentProperty({
        description: [`This property indicates if the value entered by the user is a valid one according to some validation present in the controller.`],
        isMandatory: false,
        propertyType: 'boolean'
    })
    @Prop() invalidValue?: boolean | null = null;
}