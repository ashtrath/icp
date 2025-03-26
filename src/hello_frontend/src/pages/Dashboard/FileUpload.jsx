import { Check, FileUp, Plus, Upload, X } from "lucide-react";
import React, { useState } from "react";
import Layout from "../../pages/Dashboard/components/layout";
import { Actor, HttpAgent } from "@dfinity/agent";
import { canisterId, createActor } from "../../../../declarations/hello_backend";


// const agent = new HttpAgent.create();
// const backend = createActor(canisterId, { agent });

// const uploadFiles = async () => {
//   if (files.length === 0) return;

//   setUploading(true);

//   try {
//     for (const file of files) {
//       const arrayBuffer = await file.arrayBuffer();
//       const blob = new Uint8Array(arrayBuffer); // Konversi ke Uint8Array

//       await backend.uploadFile(file.id, blob); // Kirim ke backend
//     }

//     alert("Files uploaded successfully!");
//   } catch (error) {
//     console.error("Upload failed:", error);
//     alert("Failed to upload files.");
//   }

//   setUploading(false);
// };


const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        addFiles(selectedFiles);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        addFiles(droppedFiles);
    };

    const addFiles = (newFiles) => {
        const updatedFiles = [...files];

        newFiles.forEach((file) => {
            const fileWithPreview = Object.assign(file, {
                preview: URL.createObjectURL(file),
                id: Date.now() + Math.random().toString(36).substring(2, 10),
                progress: 0,
                status: "pending",
            });
            updatedFiles.push(fileWithPreview);
        });

        setFiles(updatedFiles);
    };

    const removeFile = (id) => {
        const updatedFiles = files.filter((file) => file.id !== id);
        setFiles(updatedFiles);
    };

    const uploadFiles = () => {
        if (files.length === 0) return;

        setUploading(true);

        const updatedFiles = [...files];

        const simulateProgress = () => {
            let allDone = true;

            updatedFiles.forEach((file, index) => {
                if (file.status === "pending") {
                    allDone = false;
                    file.progress += Math.floor(Math.random() * 15) + 5;

                    if (file.progress >= 100) {
                        file.progress = 100;
                        file.status = "complete";
                    }

                    updatedFiles[index] = file;
                }
            });

            setFiles([...updatedFiles]);

            if (!allDone) {
                setTimeout(simulateProgress, 300);
            } else {
                setUploading(false);
            }
        };

        simulateProgress();
    };

    return (
        <Layout>
            <div className="relative min-h-screen overflow-hidden text-white">
                {/* Background Animation */}
                <div className="absolute inset-0 animate-pulse" />

                <div className="flex min-h-screen flex-col items-center justify-center px-4">
                    <div className="glass-card rounded-2xl border border-[#8370ff] bg-black/50 p-8 shadow-xl backdrop-blur-md">
                        <h1 className="mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-extrabold text-4xl text-transparent drop-shadow-lg">
                            Secure File Upload
                        </h1>
                        <p className="mb-6 text-gray-400">
                            Drag & drop or select files to upload securely to the cloud.
                        </p>

                        <div
                            className={`flex h-64 flex-col items-center justify-center rounded-lg border-4 p-8 transition-all ${
                                isDragging
                                    ? "border-cyan-400/50 bg-cyan-900/20 shadow-cyan-500/20"
                                    : "border-gray-600 bg-[#0D131F]/60"
                            }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <Upload className="mb-4 h-16 w-16 animate-bounce text-cyan-400" />
                            <h3 className="mb-2 font-medium text-xl">Drag & Drop Files Here</h3>
                            <p className="mb-4 text-gray-400">Or click to browse files</p>
                            <label className="cursor-pointer rounded-lg bg-gradient-to-r from-cyan-400 to-purple-400 px-6 py-3 font-medium text-white shadow-lg transition-shadow hover:shadow-cyan-400/50">
                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <Plus className="mr-2 inline h-5 w-5" />
                                Select Files
                            </label>
                        </div>

                        {files.length > 0 && (
                            <div className="mt-6">
                                <h3 className="mb-3 font-semibold text-lg">
                                    Selected Files ({files.length})
                                </h3>
                                <div className="space-y-4">
                                    {files.map((file) => (
                                        <div
                                            key={file.id}
                                            className="flex items-center rounded-lg border border-gray-700 bg-[#0D131F]/80 p-4 shadow-md"
                                        >
                                            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded bg-gray-800">
                                                {file.type.startsWith("image/") ? (
                                                    <img
                                                        src={file.preview}
                                                        alt={file.name}
                                                        className="h-full w-full rounded object-cover"
                                                    />
                                                ) : (
                                                    <FileUp className="h-5 w-5 text-cyan-400" />
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <p className="truncate font-medium">{file.name}</p>
                                                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-800">
                                                    <div
                                                        className="h-2 bg-gradient-to-r from-cyan-400 to-purple-500"
                                                        style={{ width: `${file.progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                className="ml-4 text-red-400 hover:text-red-500"
                                                onClick={() => removeFile(file.id)}
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    className="mt-4 w-full rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 px-6 py-3 font-semibold text-white shadow-lg transition-shadow hover:shadow-purple-500/50"
                                    onClick={uploadFiles}
                                    disabled={uploading}
                                >
                                    {uploading ? "Uploading..." : "Upload All"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default FileUpload;
