import { useEffect, useState } from "react"
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextsProvider";

export default function Posts() {

    const [post, setPost] = useState([]);
    const [loading, setLoading] = useState(false);

    const {setNotification} = useStateContext()

    useEffect(() => {
        getPost();
    }, [])

    const onDelete = (p) => {
        if (!window.confirm("Are you sure you want to delete this post?")) {
            return
        }
        axiosClient.delete(`/posts/${p.id}`)
            .then(() => {
                setNotification("Post was successfully deleted")
                getPost()
            })
    }

    const getPost = () => {
        setLoading(true)
        axiosClient.get('/posts')
            .then(({ data }) => {
                setLoading(false)
                console.log(data);
                setPost(data.data)
            })
            .catch(() => {
                setLoading(false)
            })
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Posts</h1>
                <Link to="/posts/new" className="btn-add">Add new</Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Create Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading && <tbody>
                        <tr>
                            <td colSpan="5" className="text-center">
                                Loading...
                            </td>
                        </tr>
                    </tbody>
                    }
                    {!loading && <tbody>
                        {post.map(p => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.title}</td>
                                <td>{p.description}</td>
                                <td>{p.created_at}</td>
                                <td>
                                    <Link className="btn-edit" to={'/posts/' + p.id}>Edit</Link>
                                    <button onClick={ev => onDelete(p)} className="btn-delete">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    }
                </table>
            </div>
        </div>
    )
}
