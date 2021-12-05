import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ME, QUERY_FRIEND_POSTS } from '../utils/queries';
import { useProfileContext } from '../utils/GlobalState';
import {
  UPDATE_FRIEND_POSTS
} from '../utils/actions';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import StickyHeader from '../components/StickyHeader/index';
import Post from '../components/Post/index';

export default function Following() {
  const [validation, setValidation] = useState(true);
  const [state, dispatch] = useProfileContext();
  const { data: user } = useQuery(QUERY_ME);
  const userFriends = user?.me.friends;

  const { data: posts } = useQuery(QUERY_FRIEND_POSTS, {
    variables: { friends: userFriends },
    enabled: !!userFriends,
  });
  const dbFriendPosts = posts?.friendPosts;

  const { friendPosts } = state;

  useEffect(() => {
    if(dbFriendPosts) {
      dispatch({
        type: UPDATE_FRIEND_POSTS,
        friendPosts: dbFriendPosts
    })
    }
  }, [dbFriendPosts, dispatch])

  useEffect(() => {
    console.log(friendPosts)
    if (friendPosts !== []) {
      setValidation(false)
    }
  }, [friendPosts])

  return (
    <>
      <StickyHeader />
      <div className="page">
        <p>Posts from accounts you follow will appear here!</p>
        {validation ? (
          <div>Loading...</div>
        ) : (
          <Box sx={{ flexGrow: 1 }} style={{ width: 900 }}>
            <Grid container spacing={2}>
              {friendPosts ? (
                friendPosts.map((post) => (
                  <Grid key={post._id} item xs={4}>
                    <Post
                      key={post._id}
                      postId={post._id}
                      postAuthor={post.postAuthor}
                      postText={post.postText}
                      postImage={post.postImage}
                      friendPosts={friendPosts}
                    />
                  </Grid>
                ))
              ) : (
                <div>Loading...</div>
              )}
            </Grid>
          </Box>
        )}
      </div>
    </>
  );
}
