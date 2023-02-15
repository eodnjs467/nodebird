import React, {useCallback} from "react";
import PropTypes from "prop-types";
import {Button, Form, Input} from "antd";
import useInput from "../hooks/useInput";
import {useDispatch, useSelector} from "react-redux";
import {addCommentRequest} from "../reducers/post";

const CommentForm = ({postId}) => {
    const dispatch = useDispatch();
    const {addCommentLoading, me} = useSelector(state => state.user);
    const [commentText, onChangeCommentText] = useInput('');
    const onSubmitComment =useCallback(() => {
        dispatch(addCommentRequest({postId, content: commentText, user: {userId: me.id, nickname: me.nickname}}));
    }, [commentText]);
    return(
        <Form onFinish={onSubmitComment}>
            <Form.Item>
                <Input.TextArea value={commentText} onChange={onChangeCommentText} rows={4} />
                <Button type="primary" htmlType="submit" loading={addCommentLoading}>삐약</Button>
            </Form.Item>
        </Form>
    )
};

CommentForm.propTypes = {
    postId: PropTypes.number.isRequired,
};

export default CommentForm;
