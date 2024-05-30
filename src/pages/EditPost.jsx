import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Container, PostForm } from '../components/index'
import appwriteService from "../appwrite/config"

function EditPost() {
    const [post, setPost] = useState(null)
    const { slug } = useParams()
    const navigate = useNavigate()
    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setPost(post)
                }
            })
        } else navigate('/')
    }, [slug, navigate])

    const handleUpdatePost = async (updatedPost) => {
        try {
            await appwriteService.updatePost(slug, updatedPost);
            navigate('/'); // Redirect to the posts list after updating
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    return post ? (
        <div className='py-8'>
            <div><h1 className=' text-[2rem] md:text-[2.5rem] text-center font-semibold' >Edit Post</h1></div>
            <Container>
                <PostForm post={post} onSubmit = {handleUpdatePost} />
            </Container>
        </div>
    ) : null
}

export default EditPost