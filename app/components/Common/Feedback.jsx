// import React, { useState } from "react";
// import { VscThumbsup } from "react-icons/vsc";
// import FeedbackModal from "./FeedbackModal";
// import { VscThumbsdown } from "react-icons/vsc";
// const Feedback = ({ section, entityName }) => {
//   const [open, setOpen] = useState(false);

//   const handleThumbClick = (type) => {
//     if (type === "down") {
//       setOpen(true);
//     } else {
//       sendFeedback("up");
//     }
//   };

//   const sendFeedback = (type, reasons = [], comment = "", email = "") => {
//     const payload = {
//       section,
//       entityName,
//       feedbackType: type,
//       reasons,
//       comment,
//       email, // ✅ added
//       timestamp: new Date(),
//     };

//     console.log("🔥 Payload:", payload);
//   };

//   return (
//     <>
//       <span
//         style={{ cursor: "pointer", marginRight: "8px" }}
//         onClick={() => handleThumbClick("up")}
//       >
//         <VscThumbsup />
//       </span>

//       <span
//         style={{ cursor: "pointer" }}
//         onClick={() => handleThumbClick("down")}
//       >
//         {/* 👎 */}
//         <VscThumbsdown />
//       </span>

//       <FeedbackModal
//         isOpen={open}
//         onClose={() => setOpen(false)}
//         onSubmit={(reasons, comment, email) => {
//           sendFeedback("down", reasons, comment, email);
//         }}
//       />
//     </>
//   );
// };

// export default Feedback;

import React, { useState } from "react";
import { VscThumbsup } from "react-icons/vsc";
import FeedbackModal from "./FeedbackModal";
import { VscThumbsdown } from "react-icons/vsc";

const Feedback = ({ section, entityName }) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(""); // "up" | "down"
  const [showToast, setShowToast] = useState(false);

  const handleThumbClick = (clickType) => {
    setType(clickType); // store up/down
    setOpen(true); // open modal ALWAYS
  };

  const sendFeedback = async (type, reasons = [], comment = "") => {
    const payload = {
      section,
      entityName,
      feedbackType: type, // "up" or "down"
      email: user.email, // ✅ auto from getUser
      comment,
      timestamp: new Date().toISOString(),
    };

    if (type === "down") {
      payload.reasons = reasons; // array of selected reasons
      payload.comment = comment; // additional comment
    }
    console.log("Sending", payload);

    try {
      const response = await fetch(
        "https://hpg-webapp-000448.azurewebsites.net/feedback/add-new",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();
      console.log("✅ Success:", data);

      setShowToast(true); // ✅ show popup

      setTimeout(() => {
        setShowToast(false);
      }, 3000); // auto hide
    } catch (error) {
      console.error("❌ Error sending feedback:", error);
    }
  };

  return (
    <>
      <span
        onClick={() => handleThumbClick("up")}
        className={`cursor-pointer text-bold ${
          setType === "up"
            ? "text-gray-400"
            : "text-gray-700 hover:text-green-500"
        }`}
      >
        <VscThumbsup size={17} />
      </span>

      <span
        onClick={() => handleThumbClick("down")}
        className={`cursor-pointer text-lg ${
          setType === "down"
            ? "text-gray-400"
            : "text-gray-700 hover:text-red-500"
        }`}
      >
        <VscThumbsdown size={17} />
      </span>

      <FeedbackModal
        isOpen={open}
        type={type}
        onClose={() => setOpen(false)}
        onSubmit={(reasons, comment) => {
          sendFeedback(type, reasons, comment, email);
          setOpen(false);
        }}
      />

      <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
        ✅ Feedback submitted successfully
      </div>
    </>
  );
};

export default Feedback;
