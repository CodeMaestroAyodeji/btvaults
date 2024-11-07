import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import styles from "./TorrentManagement.module.css";

function TorrentManagement({ files, setFiles, currentPlan }) {
    const [torrentFile, setTorrentFile] = useState(null);
    const [magnetLink, setMagnetLink] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const downloadIntervalRef = useRef(null);

    // State to keep track of pending torrent files
    const [pendingDownloads, setPendingDownloads] = useState([]);

    const handleFileUpload = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile.size / 1024 > currentPlan.maxFileSize) {  // File size in MB
            Swal.fire("Error", `File size exceeds the ${currentPlan.maxFileSize}MB limit for your plan`, "error");
            setTorrentFile(null);
        } else {
            const newFile = { id: Date.now(), name: selectedFile.name, size: selectedFile.size, status: "Pending" };
            setPendingDownloads((prev) => [...prev, newFile]);
            setTorrentFile(null);
        }
    };

    const startDownload = (file) => {
        setIsDownloading(true);
        setDownloadProgress(0);
        setIsPaused(false);
    
        const downloadSpeed = currentPlan.downloadSpeed === "Full Speed" ? 20 : 10;
    
        downloadIntervalRef.current = setInterval(() => {
            setDownloadProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(downloadIntervalRef.current);
                    setIsDownloading(false);
    
                    // Check if the file already exists in the `files` array before adding
                    setFiles((prevFiles) => {
                        const fileExists = prevFiles.some((f) => f.id === file.id);
                        if (!fileExists) {
                            return [
                                ...prevFiles,
                                { id: file.id, name: file.name, size: file.size, status: "Completed" },
                            ];
                        }
                        return prevFiles;  // Return existing array if duplicate found
                    });
    
                    Swal.fire("Success", `${file.name} downloaded successfully!`, "success");
    
                    // Remove the file from pending downloads after it completes
                    setPendingDownloads((prev) => prev.filter((item) => item.id !== file.id));
                    return 100;
                }
                return prevProgress + downloadSpeed;
            });
        }, 300);
    };
    

    const handleDownloadPendingFile = (file) => {
        if (isDownloading) {
            Swal.fire("Warning", "A download is already in progress. Please wait for it to complete.", "warning");
            return;
        }
        startDownload(file);
    };

    const handleDeletePendingFile = (fileId) => {
        setPendingDownloads((prev) => prev.filter((file) => file.id !== fileId));
        Swal.fire("Deleted!", "The file has been removed from pending downloads.", "info");
    };

    const handleDownloadMagnet = () => {
        if (magnetLink.trim() === "") {
            Swal.fire("Warning", "Please enter a magnet link", "warning");
            return;
        }

        const newMagnetFile = { id: Date.now(), name: `Magnet_${Date.now()}`, size: 500, status: "Pending" };
        setPendingDownloads((prev) => [...prev, newMagnetFile]);
        setMagnetLink("");
    };

    return (
        <div className={styles.torrentManagement}>
            <h3>Add Torrent Link</h3>
            <div className="form-group">
                <label>Upload Torrent File</label>
                <input
                    type="file"
                    onChange={handleFileUpload}
                    className="form-control"
                    disabled={isDownloading}
                />
            </div>

            <div className="form-group mt-3">
                <label>Enter Magnet Link</label>
                <input
                    type="text"
                    value={magnetLink}
                    onChange={(e) => setMagnetLink(e.target.value)}
                    className="form-control"
                    placeholder="Paste magnet link here"
                    disabled={isDownloading}
                />
                <button
                    onClick={handleDownloadMagnet}
                    className="btn btn-primary mt-2"
                    disabled={isDownloading}
                >
                    Add Magnet Link
                </button>
            </div>

            {/* Pending Downloads List */}
            <div className="mt-4">
                <h4>Pending Downloads</h4>
                <ul className="list-group">
                    {pendingDownloads.map((file) => (
                        <li key={file.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h5>{file.name}</h5>
                                <p>Size: {(file.size / 1024).toFixed(2)} MB</p>
                                <p>Status: {file.status}</p>
                            </div>
                            <div>
                                <button
                                    onClick={() => handleDownloadPendingFile(file)}
                                    className="btn btn-primary me-2"
                                    disabled={isDownloading}
                                >
                                    Download
                                </button>
                                <button
                                    onClick={() => handleDeletePendingFile(file.id)}
                                    className="btn btn-danger"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {isDownloading && (
                <div className={`${styles.progressContainer} mt-3`}>
                    <label>Download Progress</label>
                    <div className="progress">
                        <div
                            className="progress-bar progress-bar-striped progress-bar-animated"
                            role="progressbar"
                            style={{ width: `${downloadProgress}%` }}
                            aria-valuenow={downloadProgress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        >
                            {downloadProgress}%
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TorrentManagement;
