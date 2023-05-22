import React, { useRef, useState } from "react";

const TextEditor = () => {
  const [content, setContent] = useState("");
  const uploadButtonRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLDivElement>) => {
    setContent(e.target.innerHTML);
  };

  const handleCommand = (command: string, value?: string) => {
    document.execCommand("styleWithCSS", false, "");
    document.execCommand(command, false, value);
  };

  const handleVideoAttachment = () => {
    const fileUrl = prompt("Enter the URL of the video:");
    if (fileUrl) {
      const videoTag = `<video src="${fileUrl}" controls></video>`;
      document.execCommand("insertHTML", false, videoTag);
    }
  };
  const handleUploadClick = () => {
    if (uploadButtonRef.current) {
      uploadButtonRef.current.click();
    }
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileUrl = event.target?.result;
        if (fileUrl) {
          const fileExtension = file.name.split(".").pop()?.toLowerCase();
          let mediaTag = "";

          if (fileExtension === "mp4") {
            mediaTag = `<video src="${fileUrl}" controls></video>`;
          } else {
            mediaTag = `<img src="${fileUrl}" className="max-h-[400px]" alt="Media" />`;
          }

          document.execCommand("insertHTML", false, mediaTag);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmbedUpload = () => {
    const embedCode = prompt("Enter the embed code:");
    if (embedCode) {
      const embedTag = `<div>${embedCode}</div>`;
      document.execCommand("insertHTML", false, embedTag);
    }
  };

  return (
    <>
      <div className="border h-full w-[900px] mt-10 mx-5">
        <div className="h-[40px] border-b"></div>
        <div className="flex justify-between">
          <button
            className="border rounded px-4 py-2 mr-2"
            onClick={() => handleCommand("formatBlock")}
          >
            Paragragh
          </button>
          <button
            className="border rounded px-4 py-2 mr-2"
            onClick={() => handleCommand("bold")}
          >
            Bold
          </button>
          <button
            className="border rounded px-4 py-2 mr-2"
            onClick={() => handleCommand("italic")}
          >
            Italic
          </button>
          <button
            className="border rounded px-4 py-2 mr-2"
            onClick={() => handleCommand("justifyLeft")}
          >
            Align Left
          </button>
          <button
            className="border rounded px-4 py-2 mr-2"
            onClick={() => handleCommand("justifyCenter")}
          >
            Align Center
          </button>
          <button
            className="border rounded px-4 py-2 mr-2"
            onClick={() => handleCommand("justifyRight")}
          >
            Align Right
          </button>
        </div>
        <div className="relative">
          <div
            className="w-full min-h-[400px] max-h-[400px] hover:border-blue-500 focus:border-blue-500 focus-within:border-blue-500 overflow-auto mb-[100px]"
            contentEditable
            dangerouslySetInnerHTML={{ __html: content }}
            onBlur={handleContentChange}
            ref={editorRef}
          ></div>

          <div className="relative flex gap-2">
            <div className="absolute left-5 bottom-2 flex gap-2">
              <button
                className="border rounded px-4 py-2"
                onClick={handleUploadClick}
              >
                Picture
              </button>
              <button
                className="border rounded px-4 py-2"
                onClick={handleVideoAttachment}
              >
                Video
              </button>
              <button
                className="block px-4 py-2 hover:bg-gray-200"
                onClick={handleEmbedUpload}
              >
                Embed URL
              </button>
              <input
                type="file"
                accept="image/*"
                ref={uploadButtonRef}
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TextEditor;
