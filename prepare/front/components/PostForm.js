import React, {useCallback, useEffect, useRef, useState} from 'react';
import { Button, Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {ADD_POST_REQUEST, UPLOAD_IMAGES_REQUEST} from '../reducers/post';

function PostForm() {
    const { imagePaths, addPostLoading, addPostDone } = useSelector((state) => state.post);
    const dispatch = useDispatch();

    const [text, setText] = useState('');
    const imageInput = useRef();

    useEffect(() => {
        if (addPostDone) {
            setText('');
        }
    }, [addPostDone]);

    const onChangeText = useCallback((e) => {
        setText(e.target.value);
    }, []);

    const onSubmit = useCallback(() => {
        if (!text || !text.trim()) {
            return alert('게시글을 작성하세요.');
        }
        const formData = new FormData();
        imagePaths.forEach((p) => {
            formData.append('image', p);
        });
        formData.append('content', text);
        dispatch({
            type: ADD_POST_REQUEST,
            data: formData,
        });

        //  텍스트만 넣을 경우 객체로 해도 된다.
        // dispatch({
        //     type: ADD_POST_REQUEST,
        //     data: { imagePaths, content: text },
        // });
    }, [text, imagePaths]);

    const onClickImageUpload = useCallback(() => {
        imageInput.current.click();
    }, [imageInput.current]);

    const onChangeImages = useCallback((e) => {
        console.log(e.target.files);
        const imageFormData = new FormData();
        [].forEach.call(e.target.files, (f) => {
            imageFormData.append('image', f);
        });
        dispatch({
            type: UPLOAD_IMAGES_REQUEST,
            data: imageFormData,
        });
    }, []);

    return (
      <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onFinish={onSubmit}>
        <Input.TextArea
          value={text}
          onChange={onChangeText}
          maxLength={140}
          placeholder="어떤 신기한 일이 있었나요?"
        />
        <div>
          <input
            type="file"
            name="image"
            multiple
            ref={imageInput}
            style={{ display: 'none' }}
            onChange={onChangeImages}
          />
          <Button onClick={onClickImageUpload}>이미지 업로드</Button>
          <Button type="primary" style={{ float: 'right' }} htmlType="submit" loading={addPostLoading}>짹짹</Button>
        </div>
        <div>
          {imagePaths.map((v) => (
            <div key={v} style={{ display: 'inline-block' }}>
              <img src={`http://localhost:3065/${v}`} style={{ width: '200px' }} alt={v} />
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
