import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Alert = ({ showAlert }) => {
  return (
    <AnimatePresence>
      {showAlert && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.18 }}
          className={`max-w-xl mx-auto px-4 py-2 rounded-lg shadow-lg border ${
            showAlert.type === "success"
              ? "bg-white text-green-700 border-green-200"
              : "bg-white text-red-700 border-red-200"
          }`}
          style={{ pointerEvents: "auto" }}
        >
          <div className="text-center font-semibold text-sm sm:text-base">
            {showAlert.msg}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
