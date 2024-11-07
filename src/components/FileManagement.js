import React, { useState } from 'react';
import Swal from 'sweetalert2';
import styles from './FileManagement.module.css';

function FileManagement({ files, setFiles }) {
    const [sortOrder, setSortOrder] = useState('name');
    const [filterText, setFilterText] = useState('');

    const sortedFiles = [...files]
        .filter(file => file.status === 'Completed') // Only show completed files
        .sort((a, b) => {
            if (sortOrder === 'name') return a.name.localeCompare(b.name);
            if (sortOrder === 'size') return a.size - b.size;
            if (sortOrder === 'date') return a.id - b.id;
            return 0;
        })
        .filter((file) =>
            file.name.toLowerCase().includes(filterText.toLowerCase())
        );

    const handleDelete = (fileId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This file will be permanently deleted!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                setFiles(files.filter((file) => file.id !== fileId));
                Swal.fire('Deleted!', 'The file has been deleted.', 'success');
            }
        });
    };

    return (
        <div className={styles.filesContainer}>
            <h3>Your Files</h3>

            {/* Filter and Sort Options */}
            <div className="d-flex mb-3">
                <input
                    type="text"
                    placeholder="Filter by name"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="form-control me-2"
                />
                <select onChange={(e) => setSortOrder(e.target.value)} className="form-select">
                    <option value="name">Sort by Name</option>
                    <option value="size">Sort by Size</option>
                    <option value="date">Sort by Date</option>
                </select>
            </div>

            <ul className="list-group">
                {sortedFiles.map(file => (
                    <li key={file.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <h5>{file.name}</h5>
                            <p>Size: {(file.size / 1024).toFixed(2)} MB</p>
                            <p>Date Downloaded: {new Date(file.id).toLocaleString()}</p>
                            <p>Status: {file.status}</p>
                        </div>
                        <div>
                            <button onClick={() => handleDelete(file.id)} className="btn btn-danger">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FileManagement;
