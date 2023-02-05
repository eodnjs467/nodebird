import React, {useState} from "react";
import PropTypes from "prop-types";
import {Col, Row} from "antd";
import UserProfile from "./UserProfile";
import LoginForm from "./LoginForm";

const AppLayout = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <div>
            <Row gutter={8}>
                <Col xs={24} md={6}>
                    {isLoggedIn ? <UserProfile setIsLoggedIn={setIsLoggedIn}/> : <LoginForm setIsLoggedIn={setIsLoggedIn} />}
                </Col>
                <Col xs={24} md={6}>
                    {children}
                </Col>
                <Col xs={24} md={6}>
                    <a href="https://www.google.com" target="_blank" rel="noreferrer noopener"> Naver로 가기</a>
                </Col>
            </Row>
        </div>
    );
};

AppLayout.propType = {
    children: PropTypes.node.isRequired,

}

export default AppLayout;
