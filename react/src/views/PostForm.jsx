import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axiosClient from "../axios-client"
import { useStateContext } from "../contexts/ContextsProvider"

export default function UserForm() {
    const { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null);
    const {setNotification} = useStateContext()
    const navigate = useNavigate();
    const [post, setPost] = useState({
        id: null,
        title: '',
        description: ''
    })
    if (id) {
        useEffect(() => {
            setLoading(true)
            axiosClient.get(`/posts/${id}`)
                .then(({ data }) => {
                    setLoading(false)
                    setPost(data)
                })
                .catch(() => {
                    setLoading(false)
                })
        }, [])
    }

    const onSubmit = (ev) => {
        ev.preventDefault()
        if (post.id) {
            axiosClient.put(`/posts/${post.id}`, post)
                .then(() => {
                    setNotification("Post was successfully updated")
                    navigate('/posts')
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        console.log(response.data.errors);
                        setErrors(response.data.errors);
                    }
                })
        } else {
            axiosClient.post('/posts', post)
                .then(() => {
                    setNotification("Post was successfully created")
                    navigate('/posts')
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        console.log(response.data.errors);
                        setErrors(response.data.errors);
                    }
                })
        }
    }
    return (
        <>
            {post.id && <h1>Update Post: {post.title}</h1>}
            {!post.id && <h1>New Post</h1>}
            <div className="card animated fadeInDown">
                {loading && (
                    <div className="text-center">Loading...</div>
                )}
                {errors && <div className="alert">
                    {Object.keys(errors).map(key => (
                        <p key={key}>{errors[key][0]}</p>
                    ))}
                </div>
                }
                {!loading &&
                    <form onSubmit={onSubmit}>
                        <input type="text" value={post.title} onChange={ev => setPost({ ...post, title: ev.target.value })} placeholder="Title" />
                        <input type="text" value={post.description} onChange={ev => setPost({ ...post, description: ev.target.value })} placeholder="Ddescription" />
                        <button className="btn">Save</button>
                    </form>
                }
            </div>
        </>
    )
}
