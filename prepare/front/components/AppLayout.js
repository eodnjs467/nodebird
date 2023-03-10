import React, { useState } from "react";
import PropTypes from "prop-types";
import { Col, Input, Menu, Row } from "antd";
import { useSelector } from "react-redux";
import Head from "next/head";
import styled from "styled-components";
import Link from "next/link";
import LoginForm from "./LoginForm";
import UserProfile from "./UserProfile";

export const InputSearch = styled(Input.Search)`
  vertical-align: middle;
`;
const onSearch = (value) => console.log(value);

const items = [
    { label: <Link href="/"><a>노드버드</a></Link>, key: '/' },
    { label: <Link href="/profile"><a>프로필</a></Link>, key: '/profile' },
    { label: <InputSearch placeholder="" onSearch={onSearch} enterButton />, key: 'search' },
    { label: <Link href="/signup"><a>회원가입</a></Link>, key: '/signup' },
];
function AppLayout({ children }) {
    const { me } = useSelector((state) => state.user);
    // const {isLoggedIn} = useSelector((state) => state.user); 이런식으로 구조분해할당으로 받와와도 되는데 취향차이
    const [current, setCurrent] = useState('/');
    const onClickMenu = (e) => {
        setCurrent(e.key);
    };
    return (
      <div>
        <Head>
          <meta charSet="utf-8" />
          <title>NodeBird</title>
        </Head>
        <Menu onClick={onClickMenu} gutter={10} selectedKeys={[current]} mode="horizontal" items={items} />
        <Row gutter={8}>
          <Col xs={24} md={6}>
            {me ? <UserProfile /> : <LoginForm />}
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
}

AppLayout.propType = {
    children: PropTypes.node.isRequired,
};

export default AppLayout;
