import * as React from 'react';
import { Menu } from "antd";

export interface ILeftMenuProps {
    mode: "horizontal" | "inline" | undefined
}

const LeftMenu: React.FunctionComponent<ILeftMenuProps> = (props: ILeftMenuProps) => {
    return (
        <Menu mode={props.mode}>
            {/* <Menu.SubMenu key="explore" title="Explore our Software">
                <Menu.Item key="sdk">
                    <GithubOutlined /> Cuvis SDK
                </Menu.Item>
                <Menu.Item key="about-us">
                    <RocketOutlined /> Cubert Touch Software
                </Menu.Item>
            </Menu.SubMenu> */}
            <Menu.Item>
                <a href="https://www.cubert-hyperspectral.com/products" rel="noreferrer" target="_blank">PRODUCTS</a>
            </Menu.Item>
            <Menu.Item>
                <a href="https://www.cubert-hyperspectral.com/tailored-solutions" rel="noreferrer" target="_blank">TAILORED SOLUTIONS</a>
            </Menu.Item>
            <Menu.Item>
                <a href="https://www.cubert-hyperspectral.com/knowledge-base" rel="noreferrer" target="_blank">KNOWLEDGE BASE</a>
            </Menu.Item>
            <Menu.Item>
                <a href="https://www.cubert-hyperspectral.com/about-us" rel="noreferrer" target="_blank">ABOUT US</a>
            </Menu.Item>
            <Menu.Item>
                <a href="https://www.cubert-hyperspectral.com/support" rel="noreferrer" target="_blank">SUPPORT</a>
            </Menu.Item>
            <Menu.Item>
                <a href="https://www.cubert-hyperspectral.com/contact" rel="noreferrer" target="_blank">CONTACT</a>
            </Menu.Item>
        </Menu>
    );
}

export default LeftMenu;