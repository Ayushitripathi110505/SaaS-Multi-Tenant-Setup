import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "Medium",
    dueDate: "",
  });

  const fetchData = async () => {
    try {
      const projectRes = await API.get(`/projects/${id}`);
      const tasksRes = await API.get(`/tasks/project/${id}`);
      const usersRes = await API.get("/users/list");

      setProject(projectRes.data);
      setTasks(tasksRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/tasks", {
        title: form.title,
        description: form.description,
        assignedTo: form.assignedTo || null,
        projectId: id,
        status: "Pending",
        priority: form.priority,
        dueDate: form.dueDate || null,
      });

      setForm({
        title: "",
        description: "",
        assignedTo: "",
        priority: "Medium",
        dueDate: "",
      });

      fetchData();
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.error || "Task creation failed");
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await API.put(`/tasks/${taskId}`, { status });
      fetchData();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const updatePriority = async (taskId, priority) => {
    try {
      await API.put(`/tasks/${taskId}`, { priority });
      fetchData();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const fetchComments = async (taskId) => {
    try {
      const res = await API.get(`/comments/${taskId}`);

      setComments((prev) => ({
        ...prev,
        [taskId]: res.data,
      }));
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const addComment = async (taskId) => {
    try {
      if (!commentText[taskId]) {
        return;
      }

      await API.post(`/comments/${taskId}`, {
        text: commentText[taskId],
      });

      setCommentText((prev) => ({
        ...prev,
        [taskId]: "",
      }));

      fetchComments(taskId);
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.error || "Comment failed");
    }
  };

  const uploadFile = async (taskId) => {
    try {
      const file = selectedFiles[taskId];

      if (!file) {
        alert("Please select a file first");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      await API.post(`/upload/task/${taskId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSelectedFiles((prev) => ({
        ...prev,
        [taskId]: null,
      }));

      fetchData();
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.error || "File upload failed");
    }
  };

  if (!project) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>📁 {project.name}</h2>

      <p>{project.description}</p>
      <p>Status: {project.status}</p>

      <hr />

      <h3>Create Task</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <br />

        <select
          name="assignedTo"
          value={form.assignedTo}
          onChange={handleChange}
          required
        >
          <option value="">Select User</option>

          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.role})
            </option>
          ))}
        </select>

        <br />

        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
        >
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>

        <br />

        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
        />

        <br />

        <button type="submit">Create Task</button>
      </form>

      <hr />

      <h3>Tasks</h3>

      {tasks.length === 0 && <p>No tasks found</p>}

      {tasks.map((task) => (
        <div
          key={task._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h4>{task.title}</h4>

          <p>{task.description}</p>

          <p>Assigned To: {task.assignedTo?.name || "Unassigned"}</p>

          <p>Status: {task.status}</p>

          <select
            value={task.status}
            onChange={(e) => updateStatus(task._id, e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <p>Priority: {task.priority || "Medium"}</p>

          <select
            value={task.priority || "Medium"}
            onChange={(e) => updatePriority(task._id, e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <p>
            Due Date:{" "}
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString()
              : "No due date"}
          </p>

          <hr />

          <h4>📎 Attachments</h4>

          <input
            type="file"
            onChange={(e) =>
              setSelectedFiles({
                ...selectedFiles,
                [task._id]: e.target.files[0],
              })
            }
          />

          <button type="button" onClick={() => uploadFile(task._id)}>
            Upload File
          </button>

          {(!task.attachments || task.attachments.length === 0) && (
            <p>No files uploaded</p>
          )}

          {task.attachments?.map((file, index) => (
            <p key={index}>
              <a
                href={`http://localhost:5000${file.path}`}
                target="_blank"
                rel="noreferrer"
              >
                {file.originalName}
              </a>
            </p>
          ))}

          <hr />

          <h4>💬 Comments</h4>

          <button type="button" onClick={() => fetchComments(task._id)}>
            Show Comments
          </button>

          <br />

          <input
            placeholder="Write comment..."
            value={commentText[task._id] || ""}
            onChange={(e) =>
              setCommentText({
                ...commentText,
                [task._id]: e.target.value,
              })
            }
          />

          <button type="button" onClick={() => addComment(task._id)}>
            Add Comment
          </button>

          {comments[task._id]?.map((comment) => (
            <div
              key={comment._id}
              style={{
                border: "1px solid #ddd",
                padding: "5px",
                marginTop: "5px",
              }}
            >
              <p>
                <strong>{comment.userId?.name}</strong>: {comment.text}
              </p>

              <small>{new Date(comment.createdAt).toLocaleString()}</small>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ProjectDetails;