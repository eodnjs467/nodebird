import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Button, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../hooks/useInput";
import { addCommentRequest } from "../reducers/post";

function CommentForm({ postId }) {
    const dispatch = useDispatch();
    const { addCommentLoading, me } = useSelector((state) => state.user);
    const [commentText, onChangeCommentText] = useInput('');
    const onSubmitComment = useCallback(() => {
        const data = { postId, content: commentText, user: { userId: me.id, nickname: me.nickname }};
        dispatch(addCommentRequest(data));
    }, [commentText]);
    return (
      <Form onFinish={onSubmitComment}>
        <Form.Item>
          <Input.TextArea value={commentText} onChange={onChangeCommentText} rows={4} />
          <Button type="primary" htmlType="submit" loading={addCommentLoading}>삐약</Button>
        </Form.Item>
      </Form>
    );
}

CommentForm.propTypes = {
    postId: PropTypes.number.isRequired,
};

export default CommentForm;
