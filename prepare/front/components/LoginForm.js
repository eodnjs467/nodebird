import React, { useCallback, useEffect } from "react";
import { Button, Form, Input } from "antd";
import Link from "next/link";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../hooks/useInput";
import { loginRequestAction } from "../reducers/user";

export const ButtonWrapper = styled.div`
  margin-top: 10px;
`;
export const FormWrapper = styled(Form)`
  padding: 10px;
`;
function LoginForm() {
    const dispatch = useDispatch();
    const { logInLoading, loginError } = useSelector((state) => state.user);
    const [email, onChangeEmail] = useInput('');
    const [password, onChangePassword] = useInput('');

    useEffect(() => {
        if (loginError) {
            // eslint-disable-next-line no-alert
            alert(loginError);
        }
    }, [loginError]);

    const onSubmitForm = useCallback(() => {
        console.log(email, password);
        dispatch(loginRequestAction({ email, password }));
    }, [email, password]);

    return (
      <FormWrapper onFinish={onSubmitForm}>
        <div>
          <label htmlFor="user-email">아이디</label>
          <br />
          <Input name="user-email" value={email} type={email} onChange={onChangeEmail} required />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <Input name="user-password" type="password" value={password} onChange={onChangePassword} required />
        </div>
        <ButtonWrapper>
          <Button type="primary" htmlType="submit" loading={logInLoading}>로그인</Button>
          <Link href="/signup"><a><Button>회원가입</Button></a></Link>
        </ButtonWrapper>
      </FormWrapper>
    );
}

export default LoginForm;
