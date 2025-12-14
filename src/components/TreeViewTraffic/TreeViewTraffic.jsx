import { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

export default function TreeViewTraffic({ data }) {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (key) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderTree = (node, parentKey = "") => {
    if (!node || typeof node !== "object") return null;

    return Object.keys(node).map((key) => {
      const currentKey = parentKey ? `${parentKey}.${key}` : key;
      const isExpanded = expanded[currentKey];

      return (
        <div key={currentKey} className="ml-4">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => toggleExpand(currentKey)}
          >
            {Object.keys(node[key]).length > 0 ? (
              isExpanded ? (
                <FaChevronDown />
              ) : (
                <FaChevronRight />
              )
            ) : null}
            <span className="ml-2">{key}</span>
          </div>

          {/* Thêm hiệu ứng cho các mục con */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              isExpanded ? "max-h-70 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {renderTree(node[key], currentKey)}
          </div>
        </div>
      );
    });
  };

  return <div>{renderTree(data)}</div>;
}
