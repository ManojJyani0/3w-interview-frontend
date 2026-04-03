export interface PostComment {
  username: string;
  message: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  content: string;
  authorId: string;
  images: string[];
  likedBy: string[];
  comments: PostComment[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
  updatedAt: string;
}


export interface PostWithAuthor extends Post {
  author: {
    username: string,
    name: string;
    email: string;
    image: string
  }

}

