import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ request, params }) => {
  const res = await apiRequest("/posts/" + params.id);
  return res.data;
};
export const listPageLoader = async ({ request, params }) => {
  const query = request.url.split("?")[1];
  const postPromise = apiRequest("/posts?" + query);
  return defer({
    postResponse: postPromise,
  });
};

export const profilePageLoader = async () => {
  const postPromise = apiRequest("/users/profilePosts").then(res => res.data);
  const chatPromise = apiRequest("/chats").then(res => res.data);
  return defer({
    postResponse: postPromise,
    chatResponse: chatPromise,
  });
};

// Helper: save a post for the current user.
// Tries to read a JWT from localStorage or cookies to extract a user id (if available),
// then POSTs { postId } (and userId when found) to /users/save using the shared apiRequest.
export async function savePost(postId) {
  if (!postId) throw new Error('postId is required');

  // try to obtain token from common locations
  let token = null;
  try {
    if (typeof window !== 'undefined') {
      token = window.localStorage?.getItem('token') || window.localStorage?.getItem('accessToken');
      if (!token && document.cookie) {
        const match = document.cookie.match(/(?:^|;)\s*(?:token|accessToken|jwt)=([^;]+)/);
        if (match) token = decodeURIComponent(match[1]);
      }
    }
  } catch {
    // ignore - could be server-side or blocked
    token = null;
  }

  let userId = null;
  if (token) {
    try {
      const parts = token.split('.');
      if (parts.length >= 2) {
        const payload = JSON.parse(atob(parts[1]));
        userId = payload.id || payload._id || payload.userId || payload.sub || null;
      }
    } catch {
      // ignore malformed token
      userId = null;
    }
  }

  const body = userId ? { postId, userId } : { postId };
  const res = await apiRequest.post('/users/save', body);
  return res.data;
}
