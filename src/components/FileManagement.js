// src/components/FileManagement.js
import React from 'react';
import styles from './FileManagement.module.css';
import JSZip from 'jszip';


function FileManagement({ files, setFiles }) {
    const handleDownload = (fileId) => {
        const file = files.find(f => f.id === fileId);
        if (file) {
            const blob = new Blob([`Downloaded content of ${file.name}`], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const handleZipDownload = async (fileId) => {
        const file = files.find(f => f.id === fileId);
        if (file) {
            const zip = new JSZip();
            zip.file(file.name, `Zipped content of ${file.name}`);
            const blob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${file.name}.zip`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const handleDelete = (fileId) => {
        setFiles(files.filter(file => file.id !== fileId));
    };

    return (
        <div className={styles.filesContainer}>
            <h3>Your Files</h3>
            <ul>
                {files.map(file => (
                    <li key={file.id}>
                        <span>{file.name} ({file.size}MB)</span>
                        <button onClick={() => handleDownload(file.id)} className="btn btn-link">Download</button>
                        <button onClick={() => handleZipDownload(file.id)} className="btn btn-link">Zip & Download</button>
                        <button onClick={() => handleDelete(file.id)} className="btn btn-danger">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FileManagement;
