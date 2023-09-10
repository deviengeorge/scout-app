/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '../types/types';

const AppMenu = () => {
    const model: AppMenuItem[] = [
        {
            label: 'Pages',
            icon: 'pi pi-fa pi-briefcase',
            to: '/pages',
            items: [
                // { label: 'Dashboard', icon: 'pi pi-fa pi-home', to: '/' },
                {
                    label: 'Tickets',
                    icon: 'pi pi-fa pi-ticket',
                    to: '/pages/tickets'
                }
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
