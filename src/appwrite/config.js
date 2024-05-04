import conf from "../conf/conf.js";
import { Client, ID, Databases, Storage, Query } from "appwrite";
import authService from "./auth.js";

export class Service {
  client = new Client();
  databases;
  bucket; // basically storage

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({title, slug, content, featuredImage, status, userId, author, likes = 0}){
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userId,
          author,
          likes,
          urlSlug : slug
        }
        // return await this.databases.createDocument( DatabaseId, collectionId, documentId, {content you want to store} )
        // instead of slug, we can use ID.unique()
      );
    } catch (error) {
      console.log("Appwrite serive :: createPost :: error", error);
    }
  }

  // since documentId is important, we can take it separately
  async updatePost(slug, { title, content, featuredImage, status, author, urlSlug }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          author,
          urlSlug,
        }
      );
    } catch (error) {
      console.log("Appwrite serive :: updatePost :: error", error);
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      return true;
    } catch (error) {
      console.log("Appwrite serive :: deletePost :: error", error);
      return false;
    }
  }

  async getPost(slug) {
    console.log("slug", slug);
    try {
      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.equal("urlSlug", slug)]
      );
      return response.documents[0];
    } catch (error) {
      console.log("Appwrite serive :: getPost :: error", error);
      return false;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
        // 100 - for pagination
      );
    } catch (error) {
      console.log("Appwrite serive :: getPosts :: error", error);
      return false;
    }
  }

  async createLike(postId, urlSlug) {
    const userId = await authService.getUserId();
    //taking last 5 characters of the userId and adding it to the postId to create a unique likeId
    const lastFiveChars = userId.slice(-5);
    const likeId = `${lastFiveChars}_${postId}`;
    try {
      // Check if the like already exists
      const likeExists = await this.getLikesByUserAndPost(userId, postId);
      if (likeExists) {
        return;
      } else {
        // Like doesn't exist, proceed to create it
        await this.databases.createDocument(
          conf.appwriteDatabaseId,
          conf.appwriteLikesCollectionId,
          likeId,
          {
            likeId,
            userId,
            postId,
          }
        );

        // Increment likes count in the blog post document
        const post = await this.getPost(urlSlug);
        const currentLikes = post?.likes || 0;
        const newLikesCount = currentLikes + 1;
        await this.databases.updateDocument(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionId,
          postId,
          { likes: newLikesCount }
        );
      }
    } catch (error) {
      console.log("Appwrite Service :: Create Like :: Error ::", error);
      throw error;
    }
  }

  async deleteLike(likeId) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteLikesCollectionId,
        likeId
      );
      const postId = likeId.split("_")[1];
      const post = await this.getPost(postId);
      const currentLikes = post?.likes || 0;

      // Decrement likes count by 1
      const newLikesCount = Math.max(currentLikes - 1, 0);

      // Update likes count in the blog post document
      await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        postId,
        { likes: newLikesCount }
      );
    } catch (error) {
      console.log("Appwrite Service :: Delete Like :: Error :: ", error);
      throw error;
    }
  }

  async displaylikes(postId) {
    console.log(postId);
    try {
      const query = [Query.equal("postId", postId)];

      const result = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteLikesCollectionId,
        query
      );

      return result.documents.map((user) => user.userId);

      if (result.documents.length > 1) {
        //+ one-two more
      }
    } catch (error) {
      console.log("Error showing usernames");
    }
  }

  async getLikesByUserAndPost(userId, postId) {
    try {
      const query = [
        Query.equal("userId", userId),
        Query.equal("postId", postId),
      ];
      const result = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteLikesCollectionId,
        query
      );
      

      // Check if any likes were found
      if (result.documents.length > 0) {
        return true; // Return true if likes exist for the given user and post
      } else {
        return false; // Return false if no likes were found
      }
    } catch (error) {
      console.log(
        "Appwrite Service :: Get Likes By User And Post :: Error :: ",
        error
      );
      throw error;
    }
  }

  // file upload service

  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.log("Appwrite serive :: uploadFile :: error", error);
      return false;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.log("Appwrite serive :: deleteFile :: error", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    return this.bucket.getFilePreview(conf.appwriteBucketId, fileId);
  }

  downloadFile(fileId) {
    return this.bucket.getFileDownload(conf.appwriteBucketId, fileId);
  }

  async getFile(fileId) {
    try {
      return await this.bucket.getFile(conf.appwriteBucketId, fileId);
    } catch (error) {
      console.log("Appwrite serive :: getfile :: error", error);
      return false;
    }
  }

  getFileView(fileId) {
    return this.bucket.getFileView(conf.appwriteBucketId, fileId);
  }
}

const service = new Service();
export default service;
