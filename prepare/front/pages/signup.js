import React, { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { Button, Checkbox, Form, Input } from "antd";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";
import useInput from "../hooks/useInput";
import AppLayout from "../components/AppLayout";
import { signUpRequestAction } from "../reducers/user";

export const ErrorMessage = styled.div`
  color: red;
`;
export const RegisterButtonWrapper = styled.div`
  margin-top: 10px;
`;
function Signup() {
    const dispatch = useDispatch();
    const { me, signUpLoading, signUpDone, signUpError } = useSelector((state) => state.user);

    useEffect(() => {
        if (me && me.id) {
            Router.replace('/');
        }
    }, [me && me.id]);

    useEffect(() => {
        if (signUpDone) {
            // eslint-disable-next-line no-alert
            Router.push('/').then(() => alert('회원가입이 완료되었습니다.'));
        }
    }, [signUpDone]);

    useEffect(() => {
        if (signUpError) {
            // eslint-disable-next-line no-alert
            alert(signUpError);
        }
    }, [signUpError]);

    const [email, onChangeEmail] = useInput('');
    const [password, onChangePassword] = useInput('');
    const [nickname, onChangeNickname] = useInput('');

    const [passwordCheck, setPasswordCheck] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const onChangePasswordCheck = useCallback((e) => {
        setPasswordCheck(e.target.value);
        setPasswordError(e.target.value !== password);
    }, [password]);

    const [term, setTerm] = useState(false);
    const [termError, setTermError] = useState(false);
    const onChangeTerm = useCallback((e) => {
        setTerm(e.target.checked);
        setTermError(false);
    }, []);

    // eslint-disable-next-line consistent-return
    const onSubmit = useCallback(() => {
        if (password !== passwordCheck) return setPasswordError(true);
        if (!term) return setTermError(true);
        const signUpData = { email, password, nickname };
        dispatch(signUpRequestAction(signUpData));
    }, [password, passwordCheck, term]);
    return (
      <AppLayout>
        <Head>
          <meta charSet="utf-8" />
          <title>회원가입 | NodeBird</title>
        </Head>
        <Form onFinish={onSubmit}>
          <div>
            <label htmlFor="user-email">아이디</label>
            <br />
            <Input name="user-email" value={email} type={email} required onChange={onChangeEmail} />
          </div>
          <div>
            <label htmlFor="user-nickname">닉네임</label>
            <br />
            <Input name="user-nickname" value={nickname} required onChange={onChangeNickname} />
          </div>
          <div>
            <label htmlFor="user-password">비밀번호</label>
            <br />
            <Input name="user-password" value={password} type="password" required onChange={onChangePassword} />
          </div>
          <div>
            <label htmlFor="user-password-check">비밀번호 확인</label>
            <br />
            <Input name="user-password-check" value={passwordCheck} type="password" required onChange={onChangePasswordCheck} />
            {passwordError && <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>}
          </div>
          <div>
            <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>내 말을 잘 들을 것을 동의합니다.</Checkbox>
            {termError && <ErrorMessage>약관에 동의하셔야 합니다.</ErrorMessage>}
          </div>
          <RegisterButtonWrapper>
            <Button type="primary" htmlType="submit" loading={signUpLoading}>가입하기</Button>
          </RegisterButtonWrapper>
        </Form>
      </AppLayout>
    );
}

export default Signup;
