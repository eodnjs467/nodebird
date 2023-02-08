import React, {useCallback} from "react";
import PropTypes from "prop-types";
import {Button, Form, Input} from "antd";
import useInput from "../hooks/useInput";
import {useDispatch} from "react-redux";
import {addComment} from "../reducers/post";

const CommentForm = ({postId}) => {
    const dispatch = useDispatch();
    const [commentText, onChangeCommentText] = useInput('');
    const onSubmitComment =useCallback(() => {
        dispatch(addComment({id: postId, content: commentText}));
    }, [commentText]);
    return(
        <Form onFinish={onSubmitComment}>
            <Form.Item>
                <Input.TextArea value={commentText} onChange={onChangeCommentText} rows={4} />
                <Button type="primary" htmlType="submit">삐약</Button>
            </Form.Item>
        </Form>
    )
};

CommentForm.propTypes = {
    postId: PropTypes.number.isRequired,
};

export default CommentForm;
