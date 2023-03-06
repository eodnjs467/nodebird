import React, { useCallback, useRef, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addPostRequest } from '../reducers/post';

function PostForm() {
  const { imagePaths } = useSelector((state) => state.post);
  const { addPostLoading } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  const [text, setText] = useState('');
  const imageInput = useRef();

  const onChangeText = useCallback((e) => {
    setText(e.target.value);
  }, []);

  const onSubmit = useCallback(() => {
    const newPost = {
      content: text,
    };
    dispatch(addPostRequest(newPost));
  }, [text]);

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  return (
    <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onFinish={onSubmit}>
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="어떤 신기한 일이 있었나요?"
      />
      <div>
        <input type="file" multiple ref={imageInput} style={{ display: 'none' }} />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: 'right' }} htmlType="submit" loading={addPostLoading}>짹짹</Button>
      </div>
      <div>
        {imagePaths.map((v) => (
          <div key={v} style={{ display: 'inline-block' }}>
            <img src={v} style={{ width: '200px' }} alt={v} />
            <div>
              <Button>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
}

export default PostForm;
