import React, {useCallback, useMemo } from "react";
import { Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { CHANGE_NICKNAME_REQUEST } from "../reducers/user";
import useInput from "../hooks/useInput";

function NicknameEditForm() {
    const dispatch = useDispatch();
    const { me } = useSelector((state) => state.user);
    const [nickname, onChangeNickname] = useInput(me?.nickname || '');
    const style = useMemo(() => ({ marginBottom: '20px', border: '1px solid #d9d9d9', padding: '20px' }), []);

    const onUpdateNickname = useCallback(() => {
        dispatch({
            type: CHANGE_NICKNAME_REQUEST,
            data: { nickname },
        });
    }, [nickname]);

    return (
      <Form style={style}>
        <Input.Search value={nickname} onChange={onChangeNickname} addonBefore="닉네임" enterButton="수정" onSearch={onUpdateNickname} />
      </Form>
    );
}

export default NicknameEditForm;
