import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { POST_LOADING_REQUEST } from "../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";

function Home() {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, retweetError } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch({ type: LOAD_MY_INFO_REQUEST });
    dispatch({ type: POST_LOADING_REQUEST });
  }, []);

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  useEffect(() => {
    function onScroll() {
      // eslint-disable-next-line max-len
      if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 10) {
        if (hasMorePosts) {
          dispatch({ type: POST_LOADING_REQUEST });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => <PostCard key={post.id} post={post} />) }
    </AppLayout>
  );
}

export default Home;
