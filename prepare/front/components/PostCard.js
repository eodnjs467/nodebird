import React, {useCallback, useState} from "react";
import {Avatar, Button, Card, List, Popover} from "antd";
import {
    EllipsisOutlined,
    HeartOutlined, HeartTwoTone,
    MessageOutlined, MessageTwoTone,
    RetweetOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import PostImage from "./PostImage";
import CommentForm from './CommentForm';
import {useSelector} from "react-redux";
import PostCardContent from "./PostCardContent";

const PostCard = ({post}) => {
    const id = useSelector(state => state.user.me?.id); // 로그인하면 id, password 정보가 있음 그게 me에 객체로 담김
    const postCreatedId = post.id;// post 정보를 프랍스로 넘겨받고 있으니까 ㅇㅇㅇ
    const [liked, setLiked] = useState(false);
    const [commentFormOpened, setCommentFormOpened] = useState(false);

    const onToggleLike = useCallback(() => {
        setLiked(prevLike => !prevLike);
    }, []);

    const onToggleComment = useCallback(() => {
        setCommentFormOpened(prevState => !prevState);
    }, []);

    return (
        <div style={{marginBottom: 10}}>
            <Card
                cover={post.Images[0] && <PostImage images={post.Images}/>}
                actions={[
                    <RetweetOutlined key="setting"/>,
                    liked
                        ? <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onToggleLike}/>
                        : <HeartOutlined key="edit" onClick={onToggleLike}/>,
                    commentFormOpened
                        ? <MessageTwoTone twoToneColor="blue" key="comment" onClick={onToggleComment}/>
                        : <MessageOutlined key="ellipsis" onClick={onToggleComment}/>,
                    <Popover key="more" content={(
                        <Button.Group>
                            {(Number(id) === postCreatedId) ? (
                                <>
                                    <Button>수정</Button>
                                    <Button type="danger">삭제</Button>
                                </>
                            ) : (
                                <Button>신고</Button>
                            )}
                        </Button.Group>
                    )}>
                        <EllipsisOutlined/>
                    </Popover>
                ]}
            >
                <Card.Meta
                    avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
                    title={post.User.nickname}
                    description={<PostCardContent postData={post.content}/>}
                />
            </Card>
            {commentFormOpened && (
                <>
                    <CommentForm postId={post.id}/>
                    <List
                        style={{alignContent: 'center'}}
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
                    >
                    </List>
                </>
            )}
        </div>
    );
};

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
