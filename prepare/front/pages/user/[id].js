import React, { useEffect } from "react";
import Head from "next/head";
import axios from "axios";
import { END } from "redux-saga";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Card } from "antd";
import { useRouter } from "next/router";
import { LOAD_MY_INFO_REQUEST, LOAD_USER_REQUEST } from "../../reducers/user";
import wrapper from "../../store/configureStore";
import AppLayout from "../../components/AppLayout";
import PostCard from "../../components/PostCard";
import { LOAD_USER_POSTS_REQUEST } from "../../reducers/post";

function User() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { id } = router.query;
    const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);
    const { userInfo } = useSelector((state) => state.user);

    useEffect(() => {
        const onScroll = () => {
            // eslint-disable-next-line max-len
            if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 10) {
                if (hasMorePosts && !loadPostsLoading) {
                    const lastId = mainPosts[mainPosts.length - 1]?.id;
                    dispatch({
                        type: LOAD_USER_POSTS_REQUEST,
                        lastId,
                    });
                }
            }
        };
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [mainPosts.length, hasMorePosts, id]);

    return (
      <AppLayout>
        <Head>
          <title>{userInfo.nickname} 님의 글</title>
          <meta content={`${userInfo.nickname} 님의 게시글`} />
          <meta property="og:title" content={`${userInfo.nickname} 님의 게시글`} />
          <meta property="og:description" content={`${userInfo.nickname} 님의 게시글`} />
          <meta property="og:image" content={`${userInfo.nickname} 님의 게시글`} />
          <meta property="og:url" content={`${userInfo.nickname} 님의 게시글`} />
        </Head>

        {userInfo
                ? (
                  <Card
                    actions={[
                      <div key="twit">
                        짹짹
                        <br />
                        {userInfo.Posts.length}
                      </div>,
                      <div key="following">
                        팔로잉
                        <br />
                        {userInfo.Followings.length}
                      </div>,
                      <div key="follower">
                        팔로워
                        <br />
                        {userInfo.Followers.length}
                      </div>,
                        ]}
                  >
                    <Card.Meta
                      avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
                      title={userInfo.nickname}
                    />
                  </Card>
                )
                : null}
        {mainPosts.map((c) => (
          <PostCard key={c.id} post={c} />
            ))}
      </AppLayout>
    );
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, params }) => {
    const cookie = req ? req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if (req && cookie) {
        axios.defaults.headers.Cookie = cookie;
    }
    store.dispatch({
        type: LOAD_USER_POSTS_REQUEST,
        data: params.id,
    });
    store.dispatch({
        type: LOAD_MY_INFO_REQUEST,
    });
    store.dispatch({
        type: LOAD_USER_REQUEST,
        data: params.id,
    });
    store.dispatch(END);
    await store.sagaTask.toPromise();
});

export default User;
