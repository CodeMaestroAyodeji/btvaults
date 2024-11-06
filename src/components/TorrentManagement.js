// src/components/TorrentManagement.js
import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import styles from "./TorrentManagement.module.css";

function TorrentManagement({ files, setFiles }) {
  const [torrentFile, setTorrentFile] = useState(null);
  const [magnetLink, setMagnetLink] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const downloadIntervalRef = useRef(null);
  const [sortOrder, setSortOrder] = useState("name");
  const [filterText, setFilterText] = useState("");

  const handleFileUpload = (e) => {
    setTorrentFile(e.target.files[0]);
  };

  const startDownload = (fileName) => {
    setIsDownloading(true);
    setDownloadProgress(0);
    setIsPaused(false);

    downloadIntervalRef.current = setInterval(() => {
      setDownloadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(downloadIntervalRef.current);
          setIsDownloading(false);
          setFiles((prevFiles) => [
            ...prevFiles,
            { id: Date.now(), name: fileName, size: 500, status: "Completed" },
          ]);
          Swal.fire("Success", `${fileName} downloaded successfully!`, "success");
          return 100;
        }
        return prevProgress + 10;
      });
    }, 300);
  };

  const pauseDownload = () => {
    if (downloadIntervalRef.current) {
      clearInterval(downloadIntervalRef.current);
      setIsPaused(true);
    }
  };

  const resumeDownload = () => {
    if (isPaused) {
      setIsPaused(false);
      startDownload(torrentFile ? torrentFile.name : `Magnet_${Date.now()}`);
    }
  };

  const cancelDownload = () => {
    if (downloadIntervalRef.current) {
      clearInterval(downloadIntervalRef.current);
    }
    setIsDownloading(false);
    setDownloadProgress(0);
    setTorrentFile(null);
    setMagnetLink("");
    Swal.fire("Info", "Download canceled", "info");
  };

  const handleDownloadFile = () => {
    if (torrentFile) {
      Swal.fire("Success", `Started downloading ${torrentFile.name}`, "success");
      startDownload(torrentFile.name);
      setTorrentFile(null);
    } else {
      Swal.fire("Warning", "Please select a torrent file to download", "warning");
    }
  };

  const handleDownloadMagnet = () => {
    if (magnetLink.trim() !== "") {
      Swal.fire("Success", "Started downloading via magnet link", "success");
      startDownload(`Magnet_${Date.now()}`);
      setMagnetLink("");
    } else {
      Swal.fire("Warning", "Please enter a magnet link", "warning");
    }
  };

  const sortedFiles = [...files]
    .sort((a, b) => {
      if (sortOrder === "name") return a.name.localeCompare(b.name);
      if (sortOrder === "size") return a.size - b.size;
      if (sortOrder === "date") return a.id - b.id;
      return 0;
    })
    .filter((file) =>
      file.name.toLowerCase().includes(filterText.toLowerCase())
    );

  const handleDelete = (fileId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This file will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setFiles(files.filter((file) => file.id !== fileId));
        Swal.fire("Deleted!", "The file has been deleted.", "success");
      }
    });
  };

  return (
    <div>
      <div className={styles.torrentManagement}>
        <h3>Add Torrent Link</h3>
        <div className="form-group">
          <label>Upload Torrent File</label>
          <input
            type="file"
            onChange={handleFileUpload}
            className="form-control"
          />
          <button
            onClick={handleDownloadFile}
            className="btn btn-primary mt-2"
            disabled={isDownloading}
          >
            Download File
          </button>
        </div>

        <div className="form-group mt-3">
          <label>Enter Magnet Link</label>
          <input
            type="text"
            value={magnetLink}
            onChange={(e) => setMagnetLink(e.target.value)}
            className="form-control"
            placeholder="Paste magnet link here"
          />
          <button
            onClick={handleDownloadMagnet}
            className="btn btn-primary mt-2"
            disabled={isDownloading}
          >
            Download via Magnet
          </button>
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
            <div className="d-flex justify-content-between mt-2">
              {!isPaused ? (
                <button onClick={pauseDownload} className="btn btn-warning">
                  Pause
                </button>
              ) : (
                <button onClick={resumeDownload} className="btn btn-success">
                  Resume
                </button>
              )}
              <button onClick={cancelDownload} className="btn btn-danger">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* File List Section */}
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
                <p>Size: {file.size}MB</p>
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
    </div>
  );
}

export default TorrentManagement;
