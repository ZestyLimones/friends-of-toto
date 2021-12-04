import { useReducer } from "react";
import {
  UPDATE_PROFILE_BIO,
  UPDATE_PROFILE_PIC,
  UPDATE_PROFILE,
  UPDATE_PERSONAL_POSTS,
} from "./actions";

export const reducer = (state, action) => {
  switch (action.type) {
    case UPDATE_PROFILE_BIO:
      return {
        ...state,
        bio: action.bio,
      };
    case UPDATE_PROFILE_PIC:
      return {
        ...state,
        profilePic: action.profilePic
      };  
    case UPDATE_PROFILE:
      return {
        ...state,
        ...action.payload
      };  
    case UPDATE_PERSONAL_POSTS:
      return {
        ...state,
        posts: [...action.posts],
      };
    default:
      return state;
  }
};

export function useProfileReducer(initialState) {
  return useReducer(reducer, initialState)
}