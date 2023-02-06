import React, {useState} from "react";
import Head from "next/head";
import AppLayout from "../components/AppLayout";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";
const Profile = () => {
    const followerList = [{nickname: '원숭이'}, {nickname: '실버타운'}, {nickname: '큰 동그라미'}];
    const followingList = [{nickname: '원숭이'}, {nickname: '실버타운'}, {nickname: '큰 동그라미'}];

    return (
        <>
            <Head>
                <meta charSet="utf-8"/>
                <title>내 프로필 | NodeBird</title>
            </Head>
            <AppLayout>
                <NicknameEditForm />
                <FollowList header="팔로잉" data={followingList} />
                <FollowList header="팔로워" data={followerList} />
            </AppLayout>
        </>
    );
}

export default Profile;
