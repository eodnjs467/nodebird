import React, {useCallback} from "react";
import { Button, Card, List } from "antd";
import { StopOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { FOLLOWER_REMOVE_REQUEST, UNFOLLOW_REQUEST } from "../reducers/user";

function FollowList({ header, data }) {
    const dispatch = useDispatch();
    const onClick = useCallback((id) => {
        if (header === '팔로워') {
            dispatch({
                type: FOLLOWER_REMOVE_REQUEST,
                data: id,
            });
        } else {
            dispatch({
                type: UNFOLLOW_REQUEST,
                data: id,
            });
        }
    }, []);
    return (
      <List
        style={{ marginBottom: 20 }}
        grid={{ gutter: 4, xs: 2, md: 3 }}
        size="small"
        header={<div>{header}</div>}
        loadMore={<div style={{ textAlign: 'center', margin: '10px 0' }}><Button>더 보기</Button></div>}
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item style={{ marginTop: '20px' }}>
            <Card actions={[<StopOutlined key="stop" onClick={() => onClick(item.id)} />]}>
              <Card.Meta description={item.nickname} />
            </Card>
          </List.Item>
            )}
      />
    );
}

FollowList.propTypes = {
    header: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
};

export default FollowList;
