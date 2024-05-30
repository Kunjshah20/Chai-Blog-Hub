import React, { useState, useEffect } from 'react'
import { Container, PostCard, Button, Loader } from '../components/index'
import appwriteService from '../appwrite/config'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function AllPosts() {
  const [posts, setPosts] = useState(JSON.parse(sessionStorage.getItem('posts')) || [])
  const [loading, setLoading] = useState(posts.length === 0)
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()

  useEffect(() => {
    if (posts.length === 0) {
      const delayLoading = setTimeout(() => {
        appwriteService.getPosts([]).then((posts) => {
          if (posts) {
            setPosts(posts.documents)
            sessionStorage.setItem('posts', JSON.stringify(posts.documents))
            setLoading(false)
          }
        })
      }, 2000)

      return () => clearTimeout(delayLoading)
    } else {
      setLoading(false)
    }
  }, [posts])

  const handleAddPostClick = () => {
    navigate('/add-post')
  }

  const handlePostAdded = (newPost) => {
    const updatedPosts = [...posts, newPost];
    setPosts(updatedPosts);
    sessionStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const handlePostUpdated = (updatedPost) => {
    const updatedPosts = posts.map(post => post.$id === updatedPost.$id ? updatedPost : post);
    setPosts(updatedPosts);
    sessionStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const handlePostDeleted = (deletedPostId) => {
    const updatedPosts = posts.filter(post => post.$id !== deletedPostId);
    setPosts(updatedPosts);
    sessionStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  return (
    <div className="w-full py-8">
      <div>
        <h1 className="text-[2rem] md:text-[2.5rem] text-center font-semibold">
          All Posts
        </h1>
      </div>
      <Container>
        {loading ? (
          <div className="flex items-center justify-center mt-40 mb-40">
            <Loader />
          </div>
        ) : posts.length > 0 ? (
          <div className="columns-1 md:columns-1 lg:columns-2 xl:columns-3 gap-4 p-4">
            {posts.map((post) => (
              <div key={post.$id} className="break-inside-avoid mb-4">
                <PostCard {...post} onUpdate={handlePostUpdated} onDelete={handlePostDeleted} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p>Nothing to Show</p>
            {authStatus ? (
              <Button
                onClick={handleAddPostClick}
                className="mt-4 bg-customPink text-white rounded-xl px-5 py-2 hover:bg-white hover:text-black hover:border hover:border-solid hover:border-grayBorder hover:cursor-pointer"
              >
                Add Post
              </Button>
            ) : (
              <Button
                to="/signup"
                className="mt-4 bg-customPink text-white rounded-xl px-5 py-2 hover:bg-white hover:text-black hover:border hover:border-solid hover:border-grayBorder hover:cursor-pointer"
              >
                Signup
              </Button>
            )}
          </div>
        )}
      </Container>
    </div>
  )
}

export default AllPosts
