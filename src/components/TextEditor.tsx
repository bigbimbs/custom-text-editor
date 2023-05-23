import React, { useState, useRef, useEffect } from "react";

const TextEditor = () => {
  const [content, setContent] = useState("");
  const uploadButtonRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

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
      if (editorRef.current) {
        editorRef.current.focus();
      }
      const videoTag = `<video src="${fileUrl}" controls class="w-[300px] h-[300px]"></video>`;
      document.execCommand("insertHTML", false, videoTag);
      setContent(content + videoTag);
    }
  };

  const handleUploadClick = () => {
    if (uploadButtonRef.current) {
      uploadButtonRef.current.click();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileUrl = reader.result as string;
        const imgTag = `<img src="${fileUrl}" class="h-[300px] w-[300px]" alt="Uploaded Image" />`;
        insertAtCaret(imgTag);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmbedUpload = () => {
    const embedCode = prompt("Enter the embed code:");
    if (embedCode) {
      if (editorRef.current) {
        editorRef.current.focus();
      }
      const embedTag = `<div data-embed="true">${embedCode}</div>`;
      insertAtCaret(embedTag);
    }
  };

  const insertAtCaret = (html: string) => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const newNode = document.createElement("div");
        newNode.innerHTML = html;
        range.insertNode(newNode);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);

        setContent(editorRef.current.innerHTML);
      } else {
        setContent(content + html);
      }
      editorRef.current.focus();
    }
  };

  const handleHeader = () => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        if (selectedText) {
          const headerTag = `<h1 class="text-[40px]">${selectedText}</h1>`;
          range.deleteContents();
          const newNode = document.createElement("div");
          newNode.innerHTML = headerTag;
          range.insertNode(newNode);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }

      editor.focus();
      setContent(editor.innerHTML);
    }
  };

  const isDeletableNode = (node: Node): boolean => {
    return (
      node instanceof HTMLVideoElement ||
      (node instanceof HTMLDivElement &&
        node.getAttribute("data-embed") === "true")
    );
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Backspace") {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);
        const currentNode = range?.startContainer;

        if (currentNode) {
          const parentElement = currentNode.parentElement;

          if (
            (currentNode.nodeName === "VIDEO" ||
              (currentNode instanceof HTMLElement &&
                currentNode.getAttribute("data-embed") === "true")) &&
            parentElement
          ) {
            event.preventDefault();
            parentElement.removeChild(currentNode);

            if (editorRef.current) {
              setContent(editorRef.current.innerHTML);
            }
          }
        }
      }
    };

    if (editorRef.current) {
      editorRef.current.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, []);

  return (
    <>
      <div className="border h-full w-[900px] mt-10 mx-5">
        <div className="h-[40px] border-b"></div>
        <div className="flex justify-between">
          <button
            className="border rounded px-4 py-2 mr-2"
            onClick={() => handleHeader()}
          >
            Heading
          </button>
          <button
            className="border rounded px-4 py-2 mr-2"
            onClick={() => handleCommand("formatBlock", "p")}
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
                onChange={handleImageUpload}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TextEditor;
