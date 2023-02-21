import React, { useCallback, useState } from "react";
import { Avatar, Button, Card, List, Popover } from "antd";
import {
    EllipsisOutlined,
    HeartOutlined, HeartTwoTone,
    MessageOutlined, MessageTwoTone,
    RetweetOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import PostImage from "./PostImage";
import CommentForm from './CommentForm';
import PostCardContent from "./PostCardContent";
import { deletePostRequest } from "../reducers/post";
import FollowButton from "./FollowButton";

function PostCard({ post }) {
    const dispatch = useDispatch();
    const { me } = useSelector((state) => state.user);
    const postCreatedId = post.User.id;
    const [liked, setLiked] = useState(false);
    const [commentFormOpened, setCommentFormOpened] = useState(false);

    const onToggleLike = useCallback(() => {
        setLiked((prevLike) => !prevLike);
    }, []);

    const onToggleComment = useCallback(() => {
        setCommentFormOpened((prevState) => !prevState);
    }, []);

    const onDeletePost = useCallback(() => {
        dispatch(deletePostRequest({ postId: post.id }));
    }, []);

    return (
      <div style={{ marginBottom: 10 }}>
        <Card
          cover={post.Images[0] && <PostImage images={post.Images} />}
          actions={[
            <RetweetOutlined key="setting" />,
                    liked
                        ? <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onToggleLike} />
                        : <HeartOutlined key="edit" onClick={onToggleLike} />,
                    commentFormOpened
                        ? <MessageTwoTone twoToneColor="blue" key="comment" onClick={onToggleComment} />
                        : <MessageOutlined key="ellipsis" onClick={onToggleComment} />,
            <Popover
              key="more"
              content={(
                <Button.Group>
                  {me?.email === postCreatedId ? (
                      <>
                          <Button>수정</Button>
                          <Button onClick={onDeletePost} type="danger">삭제</Button>
                      </>
                            ) : (
                              <Button>신고</Button>
                            )}
                </Button.Group>
                    )}
            >
              <EllipsisOutlined />
            </Popover>,
                ]}
          extra={ me && <FollowButton post={post} />}
        >
          <Card.Meta
            avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
            title={post.User.nickname}
            description={<PostCardContent postData={post.content} />}
          />
        </Card>
        {commentFormOpened && (
        <>
          <CommentForm postId={post.id} />
          <List
            style={{ alignContent: 'center' }}
            header={`${post.Comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
                  title={item.User.nickname}
                  description={item.content}
                />
              </List.Item>
            )}
          />
        </>
            )}
      </div>
    );
}

PostCard.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.number,
        User: PropTypes.object,
        content: PropTypes.string,
        createdAt: PropTypes.object,
        Comments: PropTypes.arrayOf(PropTypes.object),
        Images: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
};

export default PostCard;
