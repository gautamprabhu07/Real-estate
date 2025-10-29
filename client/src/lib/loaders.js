import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ request, params }) => {
  try {
    console.log("Loading post with ID:", params.id); // Debug log
    const res = await apiRequest("/posts/" + params.id);
    console.log("Post data received:", res.data); // Debug log
    return res.data;
  } catch (error) {
    console.error("Error loading post:", error);
    console.error("Error response:", error.response?.data);
    // Throw the error so React Router can handle it
    throw new Response("Post not found", { status: 404 });
  }
};

export const listPageLoader = async ({ request, params }) => {
  const query = request.url.split("?")[1];
  const postPromise = apiRequest("/posts?" + (query || ""));

  // fetch saved posts for current user (if authenticated). If the request fails
  // (user not signed in), resolve to an empty array so UI can render normally.
  const savedIdsPromise = apiRequest("/users/profilePosts")
    .then((res) => {
      const saved = res.data?.savedPosts || [];
      return saved.map((p) => p.id);
    })
    .catch(() => []);

  return defer({
    postResponse: postPromise,
    savedIds: savedIdsPromise,
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