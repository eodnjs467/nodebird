import React, { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import Router from "next/router";
// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import axios from "axios";
import AppLayout from "../components/AppLayout";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";

const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);

function Profile() {
    const { me } = useSelector((state) => state.user);
    const [followersLimit, setFollowersLimit] = useState(3);
    const [followingsLimit, setFollowingsLimit] = useState(3);

    const { data: followersData, error: followerError } = useSWR(`http://localhost:3065/user/followers?limit=${followersLimit}`, fetcher);
    const { data: followingsData, error: followingError } = useSWR(`http://localhost:3065/user/followings?limit=${followingsLimit}`, fetcher);

    const loadMoreFollowers = useCallback(() => {
        setFollowersLimit((prev) => prev + 3);
    }, []);

    const loadMoreFollowings = useCallback(() => {
        setFollowingsLimit((prev) => prev + 3);
    }, []);

    useEffect(() => {
        if (!(me && me.id)) {
            Router.push('/');
        }
    }, [me]);

    if (!me) return '내정보 로딩중...';

    if (followerError || followingError) {
        console.log(followerError || followingError);
        return <div> 팔로잉 / 팔로워 로딩 중 에러가 발생했습니다.</div>;
    }

    return (
      <>
        <Head>
          <meta charSet="utf-8" />
          <title>내 프로필 | NodeBird</title>
        </Head>
        <AppLayout>
          <NicknameEditForm />
          <FollowList header="팔로잉" data={followingsData} onLoadMore={loadMoreFollowings} loading={!followingsData && followingError} />
          <FollowList header="팔로워" data={followersData} onLoadMore={loadMoreFollowers} loading={!followersData && !followerError} />
        </AppLayout>
      </>
    );
}

export default Profile;
