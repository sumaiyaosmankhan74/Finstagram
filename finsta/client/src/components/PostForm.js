import React from 'react';
import { Button, Form, TextArea } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: ''
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      });
      data.getPosts = [result.data.createPost, ...data.getPosts];
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      values.body = '';
    }
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      
      <Form onSubmit={onSubmit}>

    
         <div style={{display:'flex',justifyContent:'space-around'}}>
           <div style={{paddingRight:'40px',paddingTop:'40px',paddingLeft:'40px'}}>
           <i class="bullhorn icon"></i>    </div>
           <div style={{paddingRight:'30px'}}>
           <textarea
           rows={5}
           
           placeholder="Whats on Your Mind? "
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />

           </div>
         
         
        <div style={{paddingTop:'80px'}}>
        <Button  type="submit" color="teal">
        <i class="user icon"></i>
            Post
          </Button>
        </div>

         </div>
        
         
      
        
      </Form>
  
      
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
