import { Component, h, Prop } from '@stencil/core';
import { FloatingMenuItem } from '../../interfaces/FloatingMenuItem'
import CustomTheme from '../../decorators/CustomTheme';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';


@Component({
    tag: 'psk-floating-menu',
    shadow: true
})
export class FloatingMenu {
    @CustomTheme()
    @Prop() menuItems: FloatingMenuItem[];
    @TableOfContentProperty({
        description:`This property shows the state of the backdrop on the floating menu`,
        isMandatory:false,
        propertyType:`boolean`,
        defaultValue: `false`
    })
    @Prop({ reflectToAttr: true, mutable: true }) opened: boolean = false;

    render() {
        return [
            <div id="backdrop" onClick={(event) => {
                event.preventDefault();
                this.opened = !this.opened;
            }}></div>,
            <div class="container">
                <ul class="items">
                    {
                        this.menuItems.map(menuItem => {
                            return <li>
                                <wg-anchor
                                    label={menuItem.label}
                                    href={menuItem.href} />
                            </li>;
                        })
                    }
                </ul>
                <div class="toggleFloatingMenu">
                    <a href="#" class="plus"
                        onClick={(event) => {
                            event.preventDefault();
                            this.opened = !this.opened;
                        }}>
                        <span class="fa fa-plus"></span>
                    </a>
                </div>
            </div>
        ];
    }
}