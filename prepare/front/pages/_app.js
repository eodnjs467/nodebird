import React, {useState} from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import {Menu, Input} from "antd";
import Head from "next/head";
import styled from "styled-components";

export const InputSearch = styled(Input.Search)`
  vertical-align: middle;
`
const onSearch = (value) => console.log(value);

const items = [
    {label: <Link href="/"><a>노드버드</a></Link>, key: '/'},
    {label: <Link href="/profile"><a>프로필</a></Link>, key: '/profile'},
    {label: <InputSearch placeholder="" onSearch={onSearch} enterButton />, key: 'search'},
    {label: <Link href="/signup"><a>회원가입</a></Link>, key: '/signup'},
];
const NodeBird = ({Component}) =>{
    const [current, setCurrent] = useState('/');
    const onClickMenu = e => {
        setCurrent(e.key);
    }
    return(
        <>
            <Head>
                <meta charSet="utf-8"/>
                <title>NodeBird</title>
            </Head>
            <Menu onClick={onClickMenu} gutter={10} selectedKeys={[current]} mode="horizontal" items={items} />
            <Component />
        </>
    )
}

NodeBird.propType ={
    Component: PropTypes.elementType.isRequired,
}

export default NodeBird;
