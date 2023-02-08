import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";

const PostCardContent = ({postData}) => {
    return (
        <div>
            {postData.split(/(#[^\s#]+)/g).map((v, i) => v.match(/(#[^\s#]+)/g)
                ? <Link key={i} href={`/hashtag/${v.slice(1)}` }><a>{v}</a></Link>
                : v
            )}
        </div>
    );
};

PostCardContent.propTypes={
    postData: PropTypes.string.isRequired,
}

export default PostCardContent;
