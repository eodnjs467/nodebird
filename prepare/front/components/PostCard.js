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
import { DELETE_POST_REQUEST, LIKE_POST_REQUEST, UNLIKE_POST_REQUEST, RETWEET_REQUEST } from "../reducers/post";
import FollowButton from "./FollowButton";

function PostCard({ post }) {
    const dispatch = useDispatch();
    const id = useSelector((state) => state.user.me?.id);
    const liked = post.Likers.find((v) => v.id === id);
    const postCreatedId = post.UserId;
    const [commentFormOpened, setCommentFormOpened] = useState(false);

    const onLike = useCallback(() => {
        dispatch({
            type: LIKE_POST_REQUEST,
            data: post.id,
        });
    }, []);

    const onUnlike = useCallback(() => {
        dispatch({
            type: UNLIKE_POST_REQUEST,
            data: post.id,
        });
    }, []);

    const onToggleComment = useCallback(() => {
        setCommentFormOpened((prevState) => !prevState);
    }, []);

    const onDeletePost = useCallback(() => {
        dispatch({
            type: DELETE_POST_REQUEST,
            data: post.id,
        });
    }, []);

    const onRetweet = useCallback(() => {
        if (!id) {
            return alert('로그인이 필요합니다');
        }
        dispatch({
            type: RETWEET_REQUEST,
            data: post.id,
        });
    }, [id]);

    return (
      <div style={{ marginBottom: 10 }}>
        <Card
          cover={post.Images[0] && <PostImage images={post.Images} />}
          actions={[
            <RetweetOutlined key="setting" onClick={onRetweet} />,
                    liked
                        ? <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onUnlike} />
                        : <HeartOutlined key="edit" onClick={onLike} />,
                    commentFormOpened
                        ? <MessageTwoTone twoToneColor="blue" key="comment" onClick={onToggleComment} />
                        : <MessageOutlined key="ellipsis" onClick={onToggleComment} />,
            <Popover
              key="more"
              content={(
                <Button.Group>
                  {id === postCreatedId ? (
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
          extra={id && <FollowButton post={post} />}
          title={post.RetweetId ? post.User.nickname : null}
        >
          {post.RetweetId && post.Retweet
                    ? (
                      <Card
                        cover={post.Retweet.Images[0] && <PostImage images={post.Retweet.Images} />}
                      >
                        <Card.Meta
                          avatar={<Avatar>{post.Retweet.User.nickname[0]}</Avatar>}
                          title={post.Retweet.User.nickname}
                          description={<PostCardContent postData={post.Retweet.content} />}
                        />
                      </Card>
                    )
                    : (
                      <Card.Meta
                        avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
                        title={post.User.nickname}
                        description={<PostCardContent postData={post.content} />}
                      />
                    )}
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
        UserId: PropTypes.number,
        content: PropTypes.string,
        createdAt: PropTypes.string,
        User: PropTypes.object,
        Comments: PropTypes.arrayOf(PropTypes.object),
        Images: PropTypes.arrayOf(PropTypes.object),
        Likers: PropTypes.arrayOf(PropTypes.object),
        Retweet: PropTypes.object,
        RetweetId: PropTypes.object,
    }).isRequired,
};

export default PostCard;
