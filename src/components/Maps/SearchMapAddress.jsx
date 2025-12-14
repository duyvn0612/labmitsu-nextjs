"use client";
import React, { useState } from "react";
import { useMap } from "react-leaflet";
export default function SearchMapAddress() {
  const map = useMap();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const vietNamCoordinates = "21.028511,105.804817"; // Tọa độ trung tâm của Việt Nam (Hà Nội)

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      // Sử dụng Geocoding and Search API với giới hạn ở Việt Nam (countryCode: VNM)
      const url = `https://autosuggest.search.hereapi.com/v1/autosuggest?q=${encodeURIComponent(
        value
      )}&at=${vietNamCoordinates}&in=countryCode:VNM&apiKey=${
        process.env.NEXT_PUBLIC_MAPS_API
      }&limit=5`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        // Kiểm tra nếu items tồn tại trước khi sử dụng
        if (data.items && data.items.length > 0) {
          setSuggestions(data.items); // Cập nhật gợi ý
        } else {
          setSuggestions([]); // Nếu không có kết quả, trả về mảng trống
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        setSuggestions([]); // Trong trường hợp lỗi, không hiển thị gợi ý
      }
    } else {
      setSuggestions([]); // Không hiển thị gợi ý nếu chuỗi nhập quá ngắn
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setQuery(suggestion.title); // Gán địa chỉ được chọn vào ô input
    // console.log(suggestion.position);
    map.setView(suggestion.position, 16);
    setSuggestions([]); // Ẩn gợi ý sau khi chọn
  };
  const handleInputFocus = () => {
    map.dragging.disable();
  };
  const handleInputBlur = () => {
    // setSuggestions([]);
    map.dragging.enable();
  };
  return (
    <div className="z-[999] absolute top-5 left-5 p-2 rounded opacity-90 ">
      <div className="relative w-[300px]">
        <input
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Nhập địa chỉ"
          style={{ width: "100%", padding: "8px", borderRadius: "5px" }}
        />
        {suggestions.length > 0 && (
          <ul
            style={{
              listStyle: "none",
              padding: "0",
              margin: "0",
              // border: "1px solid #ccc",
              position: "absolute",
              width: "100%",
              backgroundColor: "#fff",
              zIndex: "1000",
            }}
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSelectSuggestion(suggestion)}
                style={{
                  padding: "5px",
                  cursor: "pointer",
                  borderBottom: "1px solid #ccc",
                }}
              >
                {suggestion.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
