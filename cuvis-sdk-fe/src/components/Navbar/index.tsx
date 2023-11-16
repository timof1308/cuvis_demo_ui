import React, { useState } from "react";
import { Layout, Button, Drawer, Row, Col, Typography } from "antd";
import LeftMenu from "./LeftMenu";
import { MenuOutlined } from "@ant-design/icons";
import colors from '../_variables.module.scss';
import './Navbar.scss';

export interface IindexProps {
}

const Index: React.FunctionComponent<IindexProps> = (props: IindexProps) => {
    const [visible, setVisible] = useState(false);
    const showDrawer = () => {
        setVisible(!visible);
    };

    return (
        <nav className="navbar">
            <Layout style={{background: colors.black}}>
                <Layout.Header className="nav-header">
                    <div className="logo">
                        <a href="https://www.cubert-hyperspectral.com/" target="_blank" rel="noreferrer">
                            <svg viewBox="0 0 200 45.627" height="45.627" width="170" data-name="GFX/Logos/Cubert/White" id="GFX_Logos_Cubert_White" xmlns="http://www.w3.org/2000/svg">
                                <rect xmlns="http://www.w3.org/2000/svg" id="GFX_Logos_Cubert_White_background" data-name="GFX/Logos/Cubert/White background" width="200" height="45.627" fill="none"></rect>
                                <g xmlns="http://www.w3.org/2000/svg" id="GFX_Logos_Cubert_White-2" data-name="GFX/Logos/Cubert/White" transform="translate(0)">
                                    <path id="Fill_1" data-name="Fill 1" d="M7.331,27.121a9.4,9.4,0,0,1-3.8-2.366A11.582,11.582,0,0,1,.951,20.462,19.486,19.486,0,0,1,0,13.92,19.486,19.486,0,0,1,.951,7.378,11.587,11.587,0,0,1,3.526,3.086,9.417,9.417,0,0,1,7.331.719,14.722,14.722,0,0,1,11.971,0H22.319V5.243H12.76a8.1,8.1,0,0,0-2.622.418A5.031,5.031,0,0,0,8,7.076,7.156,7.156,0,0,0,6.566,9.744a13.913,13.913,0,0,0-.534,4.176A13.913,13.913,0,0,0,6.566,18.1,7.151,7.151,0,0,0,8,20.764a5.025,5.025,0,0,0,2.134,1.415,8.1,8.1,0,0,0,2.622.417h9.558V27.84H11.971a14.706,14.706,0,0,1-4.64-.719" transform="translate(53.483 11.488)" fill="#fff"></path>
                                    <path id="Fill_3" data-name="Fill 3" d="M0,0H6.032V17.307a5.213,5.213,0,0,0,.534,2.482A4.547,4.547,0,0,0,8,21.414a6.052,6.052,0,0,0,2.134.9,11.846,11.846,0,0,0,2.622.278h5.8V0h6.032V27.84H11.971a19.457,19.457,0,0,1-4.64-.534,10.044,10.044,0,0,1-3.8-1.786A8.757,8.757,0,0,1,.951,22.249,11.537,11.537,0,0,1,0,17.307Z" transform="translate(80.441 11.488)" fill="#fff"></path>
                                    <path id="Fill_5" data-name="Fill 5" d="M13.549,37.12H0V0H6.032V9.28h7.517a14.806,14.806,0,0,1,4.64.719,9.469,9.469,0,0,1,3.8,2.366,11.661,11.661,0,0,1,2.575,4.293A19.59,19.59,0,0,1,25.52,23.2a19.59,19.59,0,0,1-.951,6.542,11.652,11.652,0,0,1-2.575,4.292,9.448,9.448,0,0,1-3.8,2.367A14.788,14.788,0,0,1,13.549,37.12Zm-7.517-22.6V31.877H12.76a8.15,8.15,0,0,0,2.621-.417,5.053,5.053,0,0,0,2.135-1.415,7.214,7.214,0,0,0,1.439-2.668,14.009,14.009,0,0,0,.533-4.176,14,14,0,0,0-.533-4.176,7.218,7.218,0,0,0-1.439-2.668,5.058,5.058,0,0,0-2.135-1.415,8.15,8.15,0,0,0-2.621-.417Z" transform="translate(109.672 2.208)" fill="#fff"></path>
                                    <path id="Fill_7" data-name="Fill 7" d="M7.331,27.121a9.4,9.4,0,0,1-3.8-2.366A11.581,11.581,0,0,1,.951,20.462,19.486,19.486,0,0,1,0,13.92,19.486,19.486,0,0,1,.951,7.378,11.586,11.586,0,0,1,3.527,3.086,9.417,9.417,0,0,1,7.331.719,14.724,14.724,0,0,1,11.971,0H22.319V5.243H12.76a8.331,8.331,0,0,0-2.274.3,5.328,5.328,0,0,0-1.926,1A5.764,5.764,0,0,0,7.1,8.4a9.565,9.565,0,0,0-.882,2.877h16.1v5.29H6.218A9.594,9.594,0,0,0,7.1,19.488a5.757,5.757,0,0,0,1.462,1.856,5.041,5.041,0,0,0,1.926.975,8.978,8.978,0,0,0,2.274.278h9.558V27.84H11.971a14.706,14.706,0,0,1-4.64-.719" transform="translate(137.976 11.488)" fill="#fff"></path>
                                    <path id="Fill_9" data-name="Fill 9" d="M19.24,6.739V0H13.208l.011,6.739H10.758v5.191h2.47l.012,7.386h0l.014,4.748a5.217,5.217,0,0,1-.534,2.482,4.553,4.553,0,0,1-1.438,1.624,6.057,6.057,0,0,1-2.134.9,11.846,11.846,0,0,1-2.622.278L2.543,29.4H0v5.2l7.881-.008a19.175,19.175,0,0,0,4.074-.526,10.057,10.057,0,0,0,3.8-1.786,8.758,8.758,0,0,0,2.575-3.271,11.537,11.537,0,0,0,.951-4.942L19.279,18.2V11.931h6.782V6.739Z" transform="translate(173.534 4.73)" fill="#fff"></path>
                                    <path id="Fill_11" data-name="Fill 11" d="M6.566,8.051a5.217,5.217,0,0,0-.534,2.482l.022,17.332H.022L0,10.533A11.537,11.537,0,0,1,.951,5.591,8.757,8.757,0,0,1,3.526,2.32,10.056,10.056,0,0,1,7.331.534,19.491,19.491,0,0,1,11.971,0H16.7V5.2l-3.944.046a11.851,11.851,0,0,0-2.622.278A6.056,6.056,0,0,0,8,6.427,4.552,4.552,0,0,0,6.566,8.051" transform="translate(164.934 11.463)" fill="#fff"></path>
                                    <path id="Fill_15" data-name="Fill 15" d="M42.707,45.59H2.979A2.983,2.983,0,0,1,0,42.611V2.979A2.983,2.983,0,0,1,2.979,0H31.517l.012,7.429H28.816v5.723h2.722l.014,8.143.016,5.234a5.782,5.782,0,0,1-.588,2.737,5.049,5.049,0,0,1-1.586,1.79,6.718,6.718,0,0,1-2.353,1,13.121,13.121,0,0,1-2.89.307l-4.391.051h-2.8v5.73l8.687-.008a.9.9,0,0,0-.092,0,.646.646,0,0,0,.092,0v-.008a21.242,21.242,0,0,0,4.491-.58,11.132,11.132,0,0,0,4.195-1.969,9.692,9.692,0,0,0,2.839-3.606,12.78,12.78,0,0,0,1.049-5.448l-.007-6.462V13.152h7.476V42.611A2.983,2.983,0,0,1,42.707,45.59ZM20.673,7.422a21.59,21.59,0,0,0-5.115.588,11.135,11.135,0,0,0-4.195,1.97,9.688,9.688,0,0,0-2.839,3.606,12.775,12.775,0,0,0-1.049,5.448L7.5,38.141h6.65l-.025-19.107a5.782,5.782,0,0,1,.588-2.737,5.045,5.045,0,0,1,1.586-1.79,6.718,6.718,0,0,1,2.353-1,13.119,13.119,0,0,1,2.89-.307l4.348-.05V7.422Z" transform="translate(0 0)" fill="#fff"></path>
                                    <g id="COLORS_Pink" data-name="COLORS/Pink" transform="translate(38.167)">
                                    <path id="Fill_13_Copy" data-name="Fill 13 Copy" d="M0,7.6H7.6V0H0Z" fill="#fe3233"></path>
                                    </g>
                                </g>
                            </svg>
                        </a>
                    </div>
                    <div className="navbar-menu">
                        <div className="leftMenu">
                            <LeftMenu mode={"horizontal"} />
                        </div>
                    </div>
                </Layout.Header>
            </Layout>
            <Row style={{background: colors.blue, padding: "10px 0 20px 0", borderBottom: "20px solid #00f1b3"}}>
                <Row style={{ width: "80%", margin: "0 auto", padding: "20px 50px"}}>
                    <Col style={{fontFamily: "Tomorrow"}}>
                        <Typography.Title level={1} style={{ marginBottom: "10px" }}>
                            Cuvis Online Viewer
                        </Typography.Title>
                        <Typography.Text style={{ margin: 0 }}>
                            New: View sample Data of Cubert Data Online and perform simple analysis
                        </Typography.Text>
                    </Col>
                </Row>
            </Row>
        </nav>
    );
}

export default Index;